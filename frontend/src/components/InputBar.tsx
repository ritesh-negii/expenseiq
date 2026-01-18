import { Send, Paperclip, X } from "lucide-react";
import { useRef } from "react";

type Props = {
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileName?: string;
  onRemoveFile?: () => void;
  disabled?: boolean;
};

export default function InputBar({
  input,
  setInput,
  onSend,
  onFileSelect,
  fileName,
  onRemoveFile,
  disabled = false,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemoveFile?.();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-white">
      {fileName && (
        <div className="mb-2 sm:mb-3 flex items-center justify-between gap-2 text-xs bg-gradient-to-r from-purple-50 to-indigo-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-purple-200 shadow-sm">
          <div className="flex items-center gap-2 text-purple-700 min-w-0">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Paperclip className="w-4 h-4 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate text-xs sm:text-sm">{fileName}</p>
              <p className="text-[10px] sm:text-xs text-purple-500">Ready to analyze</p>
            </div>
          </div>
          <button
            onClick={handleRemoveFile}
            className="text-purple-400 hover:text-purple-600 hover:bg-purple-100 p-1.5 rounded-lg transition-all flex-shrink-0"
            disabled={disabled}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      )}
      
      <div className="flex items-center gap-2 sm:gap-3">
        <label className={`cursor-pointer flex-shrink-0 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".csv,.xlsx,.xls"
            className="hidden" 
            onChange={onFileSelect}
            disabled={disabled}
          />
          <div className={`p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 hover:from-purple-200 hover:to-indigo-200 transition-all shadow-sm ${disabled ? 'hover:from-purple-100 hover:to-indigo-100' : ''}`}>
            <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
          </div>
        </label>

        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 min-w-0 focus-within:ring-2 focus-within:ring-purple-500/50 transition-all">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={fileName ? "Ask about your expenses..." : "Upload a file first..."}
            className="flex-1 bg-transparent outline-none text-xs sm:text-sm placeholder:text-gray-400 min-w-0"
            disabled={disabled || !fileName}
          />
        </div>

        <button
          onClick={onSend}
          disabled={!input.trim() || !fileName || disabled}
          className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:shadow-sm flex-shrink-0"
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
