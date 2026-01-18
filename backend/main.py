from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import os
from dotenv import load_dotenv
import google.generativeai as genai


load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in environment variables")


genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")


app = FastAPI(title="ExpenseIQ API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://expenseiq-lyart.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def error_response(message: str):
    return JSONResponse(
        status_code=400,
        content={
            "answer": message,
            "chartData": [],
            "tableData": [],
            "summary": None,
        },
    )


@app.post("/analyze")
async def analyze_expenses(
    file: UploadFile = File(...),
    question: str = Form(...),
):
    # ---------- Validation ----------
    if not question.strip():
        return error_response("Question cannot be empty.")

    # ---------- Read file ----------
    try:
        if file.filename.lower().endswith(".csv"):
            df = pd.read_csv(file.file)
        elif file.filename.lower().endswith((".xls", ".xlsx")):
            df = pd.read_excel(file.file)
        else:
            return error_response("Only CSV or XLSX files are supported.")
    except Exception:
        return error_response("Unable to read the uploaded file.")

    if df.empty:
        return error_response("The uploaded file is empty.")

    # ---------- Normalize ----------
    df.columns = [c.lower() for c in df.columns]

    REQUIRED_COLUMNS = {"date", "description", "category", "amount"}
    if not REQUIRED_COLUMNS.issubset(df.columns):
        return error_response(
            "Invalid expense file. Required columns: date, description, category, amount."
        )

    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)

    if df["amount"].sum() <= 0:
        return error_response("Expense amounts look invalid.")

    # ---------- Calculations ----------
    total_spent = int(df["amount"].sum())
    transaction_count = len(df)

    category_totals_df = (
        df.groupby("category")["amount"]
        .sum()
        .reset_index()
        .sort_values(by="amount", ascending=False)
    )

    top_category = category_totals_df.iloc[0]["category"]
    chart_data = category_totals_df.to_dict(orient="records")
    table_data = df.head(10).to_dict(orient="records")

    # ---------- Small talk guard ----------
    SMALL_TALK = {"hi", "hello", "hey", "thanks", "thank you"}

    if question.strip().lower() in SMALL_TALK:
        return {
            "answer": "You’re welcome. Ask me something about your expenses whenever you’re ready.",
            "chartData": chart_data,
            "tableData": table_data,
            "summary": {
                "total": total_spent,
                "topCategory": top_category,
                "transactionCount": transaction_count,
            },
        }

    # ---------- AI Prompt ----------
    prompt = f"""
You are an AI-powered Expense Analysis Assistant.
You analyze ONLY the provided expense data.
You are NOT a financial advisor.

Available Data:
- Total Spend: ₹{total_spent}
- Transaction Count: {transaction_count}
- Category Breakdown: {chart_data}

Rules:
- Use exact numbers from data
- No advice, no predictions
- Reframe future questions using past spending only

User Question:
{question}
"""

    # ---------- Gemini Call ----------
    try:
        response = model.generate_content(prompt)
        answer = response.text.strip()
    except Exception as e:
        print("Gemini error:", e)
        answer = "I couldn't analyze your expenses right now."

    return {
        "answer": answer,
        "chartData": chart_data,
        "tableData": table_data,
        "summary": {
            "total": total_spent,
            "topCategory": top_category,
            "transactionCount": transaction_count,
        },
    }


