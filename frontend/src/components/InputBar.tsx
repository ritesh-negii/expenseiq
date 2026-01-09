import { Send, Paperclip } from "lucide-react";

type Props = {
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputBar({
  input,
  setInput,
  onSend,
  onFileSelect,
}: Props) {
  return (
    <div className="px-6 py-4 border-t flex gap-3">
      <label>
        <input type="file" className="hidden" onChange={onFileSelect} />
        <Paperclip className="cursor-pointer text-gray-600" />
      </label>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about your expenses..."
        className="flex-1 border rounded px-3 py-2 text-sm"
      />

      <button
        onClick={onSend}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
