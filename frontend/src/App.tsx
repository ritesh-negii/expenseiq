import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import InsightPanel from "./components/InsightPanel";
import InputBar from "./components/InputBar";
import type { Message } from "./types";
import type { Summary } from "./types";

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "👋 Hi! Upload your expense file (CSV or Excel)",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const [summary, setSummary] = useState<Summary | null>(null);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [showInsights, setShowInsights] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim().toLowerCase();

    // ---------- SMALL TALK HANDLING ----------
    const smallTalk = ["hi", "hello", "hey", "thanks", "thank you"];

    if (smallTalk.includes(userMessage)) {
      setMessages((p) => [
        ...p,
        { role: "user", text: userMessage },
        {
          role: "assistant",
          text: "You’re welcome. Ask me something about your expenses whenever you’re ready.",
        },
      ]);
      setInput("");
      return;
    }

    // ---------- REQUIRE FILE FOR EXPENSE QUESTIONS ----------
    if (!file) {
      setMessages((p) => [
        ...p,
        { role: "user", text: userMessage },
        {
          role: "assistant",
          text: "Please upload an expense file first so I can analyze your data.",
        },
      ]);
      setInput("");
      return;
    }

    // ---------- NORMAL FLOW ----------
    setMessages((p) => [...p, { role: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("question", userMessage);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

      const res = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Backend error: ${res.status}`);
      }

      const data = await res.json();

      setMessages((p) => [...p, { role: "assistant", text: data.answer }]);
      setChartData(data.chartData || []);
      setTableData(data.tableData || []);
      setSummary(data.summary || null);

      // Auto-show insights on mobile after first question
      if (window.innerWidth < 1024 && data.chartData?.length > 0) {
        setTimeout(() => setShowInsights(true), 500);
      }
    } catch (error) {
      setMessages((p) => [
        ...p,
        {
          role: "assistant",
          text: "⚠️ Oops! I couldn't analyze your file. Please check your connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-0 sm:p-4 overflow-hidden">
      <div className="bg-white w-full h-full sm:h-[95vh] sm:max-h-[900px] flex flex-col lg:flex-row sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Left: Chat Column */}
        <div
          className={`flex-1 flex flex-col min-w-0 h-full ${
            showInsights ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-purple-100 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                💰 ExpenseIQ
              </h1>
              <p className="text-xs sm:text-sm text-purple-100 mt-0.5">
                AI-powered expense analysis assistant
              </p>
            </div>
            {(chartData.length > 0 || tableData.length > 0) && (
              <button
                onClick={() => setShowInsights(!showInsights)}
                className="lg:hidden bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg"
              >
                📊 View Insights
              </button>
            )}
          </div>

          <div className="flex-1 min-h-0">
            <ChatWindow messages={messages} isLoading={isLoading} />
          </div>

          <InputBar
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            onFileSelect={(e) => {
              setFile(e.target.files?.[0] || null);
              // Show insights panel if it exists
              if (chartData.length > 0 && window.innerWidth < 1024) {
                setShowInsights(false);
              }
            }}
            fileName={file?.name}
            onRemoveFile={() => setFile(null)}
            disabled={isLoading}
          />
        </div>

        {/* Right: Insights Column */}
        <div
          className={`w-full lg:w-[38%] lg:min-w-[450px] lg:max-w-[550px] bg-gradient-to-br from-gray-50 to-purple-50/30 border-l border-gray-200 flex-shrink-0 h-full ${
            showInsights ? "flex" : "hidden lg:flex"
          } flex-col overflow-hidden`}
        >
          <div className="lg:hidden px-4 py-3 border-b border-gray-200 bg-white/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-10">
            <h2 className="text-lg font-bold text-gray-800">
              📊 Your Insights
            </h2>
            <button
              onClick={() => setShowInsights(false)}
              className="text-gray-500 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-lg transition-all"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <InsightPanel
            chartData={chartData}
            tableData={tableData}
            summary={summary}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
