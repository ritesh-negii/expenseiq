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
        className={`px-4 py-2 rounded-lg max-w-[70%] text-sm ${
          message.role === "user"
            ? "bg-purple-600 text-white"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
