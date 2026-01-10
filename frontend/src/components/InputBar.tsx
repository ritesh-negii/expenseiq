import { Send, Paperclip, X } from "lucide-react";

type Props = {
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileName?: string;
  onRemoveFile?: () => void;
};

export default function InputBar({
  input,
  setInput,
  onSend,
  onFileSelect,
  fileName,
  onRemoveFile,
}: Props) {
  return (
    <div className="px-6 py-4 border-t border-gray-100 bg-white">
      {fileName && (
        <div className="mb-3 flex items-center justify-between gap-2 text-xs bg-purple-50 px-3 py-2 rounded-lg border border-purple-100">
          <div className="flex items-center gap-2 text-purple-700">
            <Paperclip className="w-3.5 h-3.5" />
            <span className="font-medium truncate">{fileName}</span>
          </div>
          <button
            onClick={onRemoveFile}
            className="text-purple-400 hover:text-purple-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <label className="cursor-pointer">
          <input 
            type="file" 
            accept=".csv,.xlsx,.xls"
            className="hidden" 
            onChange={onFileSelect} 
          />
          <div className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </div>
        </label>

        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
            placeholder="Ask about your expenses..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>

        <button
          onClick={onSend}
          disabled={!input.trim()}
          className="p-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
