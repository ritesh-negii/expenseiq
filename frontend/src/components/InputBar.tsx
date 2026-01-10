import { Send, Paperclip, X } from "lucide-react";
import { useRef } from "react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemoveFile?.();
  };
  return (
    <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-white">
      {fileName && (
        <div className="mb-2 sm:mb-3 flex items-center justify-between gap-2 text-xs bg-purple-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-purple-100">
          <div className="flex items-center gap-2 text-purple-700 min-w-0">
            <Paperclip className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span className="font-medium truncate text-[11px] sm:text-xs">{fileName}</span>
          </div>
          <button
            onClick={handleRemoveFile}
            className="text-purple-400 hover:text-purple-600 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}
      
      <div className="flex items-center gap-2 sm:gap-3">
        <label className="cursor-pointer flex-shrink-0">
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".csv,.xlsx,.xls"
            className="hidden" 
            onChange={onFileSelect} 
          />
          <div className="p-2 sm:p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
            <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </div>
        </label>

        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 min-w-0">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
            placeholder="Ask about your expenses..."
            className="flex-1 bg-transparent outline-none text-xs sm:text-sm min-w-0"
          />
        </div>

        <button
          onClick={onSend}
          disabled={!input.trim()}
          className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex-shrink-0"
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
