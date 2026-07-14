export function ChatBubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={
          isUser
            ? "max-w-[82%] rounded-2xl rounded-br-md bg-(--accent) px-3 py-2 text-sm text-white"
            : "max-w-[82%] rounded-2xl rounded-bl-md border border-line bg-card px-3 py-2 text-sm text-ink"
        }
      >
        {children}
      </div>
    </div>
  );
}
