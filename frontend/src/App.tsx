import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import InsightPanel from "./components/InsightPanel";
import InputBar from "./components/InputBar";
import type { Message } from "./types";


function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Upload a file and ask me about your expenses." },
  ]);

  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  const sendMessage = async () => {
    if (!input || !file) return;

    setMessages((p) => [...p, { role: "user", text: input }]);
    setInput("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("question", input);

    const res = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setMessages((p) => [...p, { role: "assistant", text: data.answer }]);
    setChartData(data.chartData || []);
    setTableData(data.tableData || []);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">
      <div className="bg-white w-full max-w-3xl h-[90vh] flex flex-col rounded-xl shadow">
        <ChatWindow messages={messages} />
        <InsightPanel chartData={chartData} tableData={tableData} />
        <InputBar
          input={input}
          setInput={setInput}
          onSend={sendMessage}
          onFileSelect={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>
    </div>
  );
}

export default App;

