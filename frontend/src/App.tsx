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
      text: "Upload a file and ask me about your expenses.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const [summary, setSummary] = useState<Summary | null>(null);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  const sendMessage = async () => {
    if (!input || !file || isLoading) return;

    setMessages((p) => [...p, { role: "user", text: input }]);
    setInput("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("question", input);

    try {
      const res = await fetch("https://expenseiq-6h8f.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();

      setMessages((p) => [...p, { role: "assistant", text: data.answer }]);
      setChartData(data.chartData || []);
      setTableData(data.tableData || []);
      setSummary(data.summary || null);
    } catch (error) {
      setMessages((p) => [
        ...p,
        {
          role: "assistant",
          text: "Sorry, I couldn’t analyze your file. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full h-[95vh] flex rounded-2xl shadow-2xl overflow-hidden">
        {/* Left: Chat Column */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-6 py-5 border-b border-blue-100 bg-gradient-to-r from-blue-600 to-blue-500">
            <h1 className="text-xl font-bold text-white">ExpenseIQ</h1>
            <p className="text-sm text-blue-50">AI-powered expense analyst</p>
          </div>

          <ChatWindow messages={messages} isLoading={isLoading} />

          <InputBar
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            onFileSelect={(e) => setFile(e.target.files?.[0] || null)}
            fileName={file?.name}
            onRemoveFile={() => setFile(null)}
          />
        </div>

        {/* Right: Insights Column */}
        <div className="w-[35%] min-w-[420px] max-w-[520px] bg-gray-50 border-l border-gray-200 overflow-y-auto flex-shrink-0">
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
