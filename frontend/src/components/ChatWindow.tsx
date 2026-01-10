import type { Message } from "../types";
import MessageBubble from "./MessageBubble";
import LoadingBubble from "./LoadingBubble";

type Props = {
  messages: Message[];
    isLoading: boolean;
};

export default function ChatWindow({ messages, isLoading }: Props) {

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {isLoading && <LoadingBubble />}

      </div>
    </div>
  );
}
