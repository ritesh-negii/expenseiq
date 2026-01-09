import type { Message } from "../types";

import MessageBubble from "./MessageBubble";

type Props = {
  messages: Message[];
};

export default function ChatWindow({ messages }: Props) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} />
      ))}
    </div>
  );
}
