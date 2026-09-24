export function AnnouncementBar({ text, color }: { text: string; color?: string }) {
  return (
    <div
      className="bg-accent-dark text-white overflow-hidden py-2"
      style={color ? { backgroundColor: color } : undefined}
    >
      <div className="marquee-track">
        {[0, 1].map((i) => (
          <span key={i} className="flex items-center shrink-0 px-4 text-[10px] md:text-[11px] uppercase tracking-widest">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
