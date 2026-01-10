import type { Message } from "../types";

type Props = {
  message: Message;
};

export default function MessageBubble({ message }: Props) {
  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`px-4 py-3 rounded-2xl max-w-[75%] text-sm leading-relaxed ${
          message.role === "user"
            ? "bg-purple-600 text-white rounded-br-sm"
            : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
