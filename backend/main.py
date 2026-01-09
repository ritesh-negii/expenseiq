from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load env variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_expenses(
    file: UploadFile = File(...),
    question: str = Form(...)
):
    # ---------- Read file ----------
    if file.filename.endswith(".csv"):
        df = pd.read_csv(file.file)
    else:
        df = pd.read_excel(file.file)

    # ---------- Validate columns ----------
    REQUIRED_COLUMNS = {"date", "description", "category", "amount"}
    if not REQUIRED_COLUMNS.issubset(df.columns):
        return {
            "answer": "❌ This file does not look like an expense statement. Required columns: date, description, category, amount.",
            "chartData": [],
            "tableData": [],
        }

    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)

    # ---------- Prepare structured data ----------
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

    # ---------- AI PROMPT (very important) ----------
    prompt = f"""
You are an AI expense analysis assistant.

RULES:
- You can ONLY answer questions related to the expense data.
- If the question is unrelated, politely refuse.
- Do NOT invent numbers.
- Use ONLY the data provided.

Expense Summary:
- Total spent: ₹{total_spent}
- Top category: {top_category}
- Transactions: {transaction_count}

Category totals:
{chart_data}

User question:
{question}

Answer clearly in simple language.
"""

    # ---------- Gemini call ----------
    try:
        ai_response = model.generate_content(prompt)
        answer = ai_response.text
    except Exception:
        answer = "⚠️ AI analysis failed. Please try again."

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
