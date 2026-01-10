from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
from dotenv import load_dotenv
from google import genai

# -------------------------------------------------
# Load environment variables
# -------------------------------------------------
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=GEMINI_API_KEY)

# -------------------------------------------------
# App setup
# -------------------------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# Analyze endpoint
# -------------------------------------------------
@app.post("/analyze")
async def analyze_expenses(
    file: UploadFile = File(...),
    question: str = Form(...)
):
    # ---------- Read file ----------
    try:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(file.file)
        else:
            df = pd.read_excel(file.file)
    except Exception:
        return {
            "answer": "❌ Unable to read the uploaded file.",
            "chartData": [],
            "tableData": [],
        }

    # ---------- Validate structure ----------
    REQUIRED_COLUMNS = {"date", "description", "category", "amount"}
    if not REQUIRED_COLUMNS.issubset(df.columns):
        return {
            "answer": (
                "❌ This file does not look like an expense statement. "
                "Required columns: date, description, category, amount."
            ),
            "chartData": [],
            "tableData": [],
        }

    if df.empty:
        return {
            "answer": "❌ The uploaded file contains no expense records.",
            "chartData": [],
            "tableData": [],
        }

    # ---------- Clean data ----------
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)

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

    # ---------- AI Prompt ----------
    prompt = f"""
You are an AI assistant that analyzes expense data.

YOUR ROLE:
- Answer questions ONLY if they are related to the provided expense data
- Use numbers strictly from the data
- You MAY describe patterns, comparisons, and observations
- You MAY explain what categories are high or low
- You MAY explain what the data suggests

RESTRICTIONS:
- Do NOT give personal finance advice
- Do NOT suggest actions like saving, investing, budgeting
- Do NOT invent data
- If a question is unrelated to expenses, politely refuse

IMPORTANT CLARIFICATION:
- Questions like "how can I manage expenses" mean:
  → explain which categories are high or dominant
  → NOT giving advice on how to save money

Expense data:
Total spent: ₹{total_spent}
Top category: {top_category}
Transactions: {transaction_count}
Category totals: {chart_data}

User question:
{question}

Answer clearly in short, plain text sentences.
"""


    # ---------- Gemini call ----------
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        answer = (
            response.text
            .replace("**", "")
            .replace("*", "")
            .strip()
        )

    except Exception as e:
        print("Gemini error:", e)
        answer = "⚠️ AI analysis failed. Please try again."

    # ---------- Final response ----------
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



