import { useState } from "react";
import { Send, Paperclip, X } from "lucide-react";

/**
 * Each chat message structure
 */
type Message = {
  role: "user" | "assistant";
  content: string;
};

function App() {
  /**
   * Stores entire chat history
   */
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm ExpenseIQ, your AI expense assistant. Upload a file and ask me anything about your expenses!",
    },
  ]);

  /**
   * Text currently typed by user
   */
  const [input, setInput] = useState("");

  /**
   * Uploaded file (required before asking)
   */
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  /**
   * Send user question to backend
   */
  const handleSend = async () => {
    // 1️⃣ Block empty message
    if (!input.trim()) return;

    // 2️⃣ Block if no file uploaded
    if (!selectedFile) {
      alert("Please upload a file first");
      return;
    }

    const userMessage = input;

    // 3️⃣ Show user message instantly
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    setInput("");

    try {
      // 4️⃣ Call backend API
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessage }),
      });

      const data = await response.json();

      // 5️⃣ Show assistant response
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong while analyzing your expenses.",
        },
      ]);
    }
  };

  /**
   * Handle file selection
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  /**
   * Remove uploaded file
   */
  const removeFile = () => setSelectedFile(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">ExpenseIQ</h1>
          <p className="text-sm text-purple-100">
            Your AI-powered expense analyst
          </p>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FILE PREVIEW */}
        {selectedFile && (
          <div className="px-6 py-2 bg-purple-50 border-t border-purple-100">
            <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-purple-200">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-700 truncate">
                  {selectedFile.name}
                </span>
              </div>
              <button onClick={removeFile}>
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        )}

        {/* INPUT AREA */}
        <div className="border-t px-6 py-4 bg-white">
          <div className="flex items-end gap-3">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="p-3 rounded-full bg-gray-100">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </div>
            </label>

            <div className="flex-1 flex items-end gap-2 bg-gray-100 rounded-3xl px-4 py-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your expenses..."
                className="flex-1 bg-transparent outline-none text-sm h-10 px-1"
              />

              <button
                onClick={handleSend}
                disabled={!input.trim() || !selectedFile}
                className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
