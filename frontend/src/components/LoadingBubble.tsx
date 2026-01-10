export default function LoadingBubble() {
  return (
    <div className="flex justify-start">
      <div className="px-4 py-3 rounded-2xl bg-white border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
          <span
            className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          />
          <span
            className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
          <span className="text-xs text-gray-500 ml-2">
            Analyzing expenses…
          </span>
        </div>
      </div>
    </div>
  );
}
