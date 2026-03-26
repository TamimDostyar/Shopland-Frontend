export default function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="aspect-square animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
      <div className="p-3 space-y-2">
        <div className="h-4 rounded-lg animate-pulse w-4/5" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="h-4 rounded-lg animate-pulse w-3/5" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="h-5 rounded-lg animate-pulse w-2/5" style={{ background: "rgba(255,255,255,0.07)" }} />
      </div>
    </div>
  );
}
