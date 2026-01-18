from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
from dotenv import load_dotenv
from google import genai


load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

client = genai.Client(api_key=GEMINI_API_KEY)


app = FastAPI()

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


@app.post("/analyze")
async def analyze_expenses(
    file: UploadFile = File(...),
    question: str = Form(...)
):
    #Read file 
    try:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(file.file)
        else:
            df = pd.read_excel(file.file)
    except Exception:
        return {"answer": "❌ Unable to read file.", "chartData": [], "tableData": []}

    # Validate 
    REQUIRED_COLUMNS = {"date", "description", "category", "amount"}
    if not REQUIRED_COLUMNS.issubset(df.columns) or df.empty:
        return {"answer": "❌ Invalid or empty expense file.", "chartData": [], "tableData": []}

    
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)

    # Calculations 
    total_spent = int(df["amount"].sum())
    transaction_count = len(df)

    category_totals_df = (
        df.groupby("category")["amount"]
        .sum()
        .reset_index()
        .sort_values(by="amount", ascending=False)
    )

    chart_data = category_totals_df.to_dict(orient="records")
    table_data = df.head(10).to_dict(orient="records")

    top_category = (
        category_totals_df.iloc[0]["category"]
        if not category_totals_df.empty
        else "None"
    )


    q = question.lower()

    # Greetings
    GREETING_KEYWORDS = ["hello", "hi", "hey", "good morning", "good evening", "what's up", "wassup"]
    
    if any(q.strip() == word or q.strip() == word + "!" for word in GREETING_KEYWORDS):
        return {
            "answer": "👋 Hello! I'm your expense analyst. Ask me anything about your spending - like 'How much did I spend on food?' or 'How can I save money?'",
            "chartData": chart_data,
            "tableData": table_data,
            "summary": {
                "total": total_spent,
                "topCategory": top_category,
                "transactionCount": transaction_count,
            },
        }

    # Unrelated questions
    UNRELATED_KEYWORDS = [
        "joke", "story", "weather", "cricket", "football", "movie", "film", "song", "music",
        "virat", "kohli", "messi", "ronaldo", "actor", "actress", "game", "play",
        "politics", "election", "president", "minister", "news", "recipe"
    ]

    if any(word in q for word in UNRELATED_KEYWORDS):
        return {
            "answer": "I specialize in expense analysis only. Try asking 'How can I reduce my spending?' or 'What's my biggest expense?'",
            "chartData": chart_data,
            "tableData": table_data,
            "summary": {
                "total": total_spent,
                "topCategory": top_category,
                "transactionCount": transaction_count,
            },
        }


    top_3_spending = sum([cat['amount'] for cat in chart_data[:3]]) if len(chart_data) >= 3 else total_spent
    potential_savings = int(top_3_spending * 0.25)
    
    data_context = f"""
EXPENSE DATA:
- Total spending: ₹{total_spent}
- Number of transactions: {transaction_count}
- Top spending category: {top_category}

Detailed breakdown by category:
{chr(10).join([f"  • {cat['category']}: ₹{cat['amount']}" for cat in chart_data])}

Recent transactions (sample):
{chr(10).join([f"  • {row.get('date', 'N/A')} - {row.get('description', 'N/A')} ({row.get('category', 'N/A')}): ₹{row.get('amount', 0)}" for row in table_data[:5]])}
"""

    prompt = f"""
You are a helpful personal finance assistant analyzing someone's expense data.

{data_context}

USER'S QUESTION: "{question}"

INSTRUCTIONS:
1. If asking for FACTS (amounts, totals, categories):
   - Give direct, accurate answer
   - Be precise with numbers
   - Keep it short (1-2 sentences)

2. If asking for ADVICE (save, reduce, manage, tips):
   - Identify highest spending categories
   - Give 2-3 SPECIFIC actionable suggestions
   - Mention realistic savings (around ₹{potential_savings})
   - Be conversational (3-4 sentences)

3. If asking about data not present:
   - Say data doesn't contain that info
   - Suggest what you CAN help with

Keep responses concise and friendly.
"""


    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )

        answer = response.text.replace("**", "").replace("*", "").strip()

    except Exception as e:
        print(f"Gemini error: {e}")
        answer = "⚠️ AI analysis failed. Please try again later."

  
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