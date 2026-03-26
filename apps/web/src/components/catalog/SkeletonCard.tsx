export default function SkeletonCard() {
  return (
    <div
      className="rounded-[1.75rem] overflow-hidden shadow-[0_16px_44px_rgba(23,32,51,0.06)]"
      style={{ background: "white", border: "1px solid var(--border)" }}
    >
      <div className="aspect-square animate-pulse" style={{ background: "var(--surface-muted)" }} />
      <div className="p-4 space-y-2.5">
        <div className="h-4 rounded-full animate-pulse w-4/5" style={{ background: "rgba(23,32,51,0.08)" }} />
        <div className="h-4 rounded-full animate-pulse w-3/5" style={{ background: "rgba(23,32,51,0.08)" }} />
        <div className="h-5 rounded-full animate-pulse w-2/5" style={{ background: "rgba(23,32,51,0.08)" }} />
      </div>
    </div>
  );
}
