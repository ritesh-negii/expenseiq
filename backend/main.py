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
    allow_origins=["http://localhost:5173",
    "https://expenseiq-lyart.vercel.app",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# Analyze endpoint
# -------------------------------------------------
# ... (imports and setup are fine) ...

@app.post("/analyze")
async def analyze_expenses(
    file: UploadFile = File(...),
    question: str = Form(...)
):
    # ---------- Read file & Validation (Keep your existing code here) ----------
    try:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(file.file)
        else:
            df = pd.read_excel(file.file)
    except Exception:
        return {"answer": "❌ Unable to read file.", "chartData": [], "tableData": []}

    REQUIRED_COLUMNS = {"date", "description", "category", "amount"}
    if not REQUIRED_COLUMNS.issubset(df.columns) or df.empty:
        return {"answer": "❌ Invalid or empty file.", "chartData": [], "tableData": []}

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

    if category_totals_df.empty:
        top_category = "None"
    else:
        top_category = category_totals_df.iloc[0]["category"]

    chart_data = category_totals_df.to_dict(orient="records")
    table_data = df.head(10).to_dict(orient="records")

    # FIX 1: Indentation (Move this prompt INSIDE the function)
    # ---------- AI Prompt ----------
    prompt = f"""
### SYSTEM ROLE
You are a strict Expense Data Analyst. Your goal is to report facts based ONLY on the provided dataset.

### DATA CONTEXT
- Total Spend: ₹{total_spent}
- Top Category: {top_category}
- Transaction Count: {transaction_count}
- Category Breakdown: {chart_data}

### OPERATIONAL RULES
1. **Data Strictness:** Use numbers strictly from the 'DATA CONTEXT'.
2. **No Financial Advice:** Prohibited.
3. **Reframing Strategy:** If user asks "How to save?", list dominant categories.
4. **Scope:** Decline unrelated questions.

### USER QUESTION
{question}

### RESPONSE GUIDELINES
- Answer in short, objective sentences.
"""

    # FIX 2: Indentation & Syntax (Remove semicolon)
    # ---------- Gemini call ----------
    try:
        # Note: "gemini-2.5-flash-lite" likely doesn't exist yet. 
        # Use "gemini-1.5-flash" or "gemini-2.0-flash-exp"
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite", 
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