from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import os
from dotenv import load_dotenv
from google import genai

# -------------------------------------------------
# Load environment variables
# -------------------------------------------------
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in environment variables")

client = genai.Client(api_key=GEMINI_API_KEY)

# -------------------------------------------------
# App setup
# -------------------------------------------------
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

# -------------------------------------------------
# Helper functions
# -------------------------------------------------
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

    # ---------- SMALL TALK GUARD ----------
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
SYSTEM ROLE:
You are an AI-powered Expense Analysis Assistant.

Your responsibility is to analyze and explain user-uploaded expense data in a clear, factual, and conversational manner.
You are NOT a financial advisor.

DATA SCOPE:
You may ONLY use information derived from the provided expense dataset.
Do NOT assume, predict, or invent any data beyond what is provided.

AVAILABLE EXPENSE DATA:
- Total Spend: ₹{total_spent}
- Transaction Count: {transaction_count}
- Category Breakdown: {chart_data}
- Recent Transactions (sample): {table_data}

ALLOWED BEHAVIOR:
- Summarize expenses using exact numbers from the dataset.
- Compare categories and highlight dominant spending areas.
- Explain spending patterns based on historical data.
- Reframe future-oriented questions using past spending insights.
- Answer clearly and concisely in natural language.

RESTRICTED BEHAVIOR:
- Do NOT give financial advice or recommendations.
- Do NOT suggest budgets, savings plans, investments, or predictions.
- Do NOT answer questions unrelated to expense analysis.

REFRAMING RULE:
If the user asks about managing future expenses or saving money:
- Do NOT refuse the question.
- Reframe the response using historical spending patterns only.
- Highlight high-spending categories and spending concentration.
- Avoid commands, instructions, or predictions.

RESPONSE STYLE:
- Short paragraphs
- Neutral, analytical tone
- Plain text only
- No emojis or markdown

USER QUESTION:
{question}

Provide the best possible answer strictly based on the expense data above.
"""



    # ---------- Gemini Call ----------
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        answer = response.text.strip()

    except Exception as e:
        print("Gemini error:", e)
        answer = "⚠️ I couldn't analyze your expenses right now."

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
