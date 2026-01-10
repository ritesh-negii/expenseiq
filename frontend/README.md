# ExpenseIQ 💸🤖

ExpenseIQ is an **AI-powered expense analysis web application** that allows users to upload expense files (CSV / Excel), ask natural-language questions, and receive **data-backed insights** with charts and tables.

This project is designed with **clean architecture, AI guardrails, and a modern UI**, making it suitable for real-world use and interviews.

---

## 🚀 Features

* 📂 Upload expense files (`.csv`, `.xlsx`)
* 💬 Ask questions in natural language
* 🤖 AI-powered answers using **Google Gemini**
* 📊 Automatic insights panel with:

  * Total spending
  * Top category
  * Transaction count
  * Category-wise bar chart
  * Recent transactions table
* 🛡️ AI guardrails:

  * Answers **only expense-related questions**
  * Refuses irrelevant queries politely
  * Never invents numbers
* 🎨 Clean, responsive UI with Tailwind CSS

---

## 🧱 Tech Stack

### Frontend

* React + TypeScript
* Vite
* Tailwind CSS
* Recharts
* Lucide Icons

### Backend

* FastAPI
* Pandas
* Google Gemini (`google.genai`)
* Python-dotenv

---

## 📁 Project Structure

```
expenseiq/
├── backend/
│   ├── main.py
│   ├── .env
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── InputBar.tsx
│   │   │   ├── InsightPanel.tsx
│   │   │   ├── ExpenseChart.tsx
│   │   │   └── ExpenseTable.tsx
│   │   ├── types.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── README.md
```

---

## 📄 Expected Expense File Format

The uploaded file **must contain these columns**:

| Column Name   | Description      |
| ------------- | ---------------- |
| `date`        | Transaction date |
| `description` | Merchant / note  |
| `category`    | Expense category |
| `amount`      | Amount spent     |

Example:

```
date,description,category,amount
2024-06-01,Zomato Order,Food,450
2024-06-02,Uber Ride,Travel,320
```

---

## ⚙️ Setup Instructions

### 1️⃣ Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

Create `.env` file:

```
GEMINI_API_KEY=your_api_key_here
```

Run server:

```bash
uvicorn main:app --reload
```

Server runs at: `http://localhost:8000`

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🧠 AI Behavior (Important)

The AI is **strictly constrained**:

* ✅ Answers only based on uploaded expense data
* ❌ Refuses unrelated questions
* ❌ Does not give financial advice
* ❌ Does not invent numbers

Example:

> ❓ "What did I spend the most on?"

✅ Answered

> ❓ "How can I invest better?"

❌ Politely refused

---

## 🧪 Example Questions to Try

* What category did I spend the most on?
* Is there any unusually high spending?
* Show my recent transactions
* What is my total expense?

---

## 📌 Future Improvements (Optional)

* User authentication
* Monthly comparison
* Export insights as PDF/CSV
* Multiple file uploads
* Deployment (Vercel + Render)

---

## 👨‍💻 Author

Built by **Ritesh Negi** 🚀
For learning, interviews, and real-world experimentation.

---

## 📜 License

This project is open-source and free to use for educational purposes.

