export const ChatStatusBar = () => {
  return (
    <div className="px-4 py-2 border-b border-border bg-background-secondary">
      <div className="flex items-center gap-2 text-text-secondary">
        <span className="h-2 w-2 rounded-full bg-primary" />
        <span>Connected to OptimalAI</span>
      </div>
    </div>
  );
};
