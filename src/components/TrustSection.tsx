const POINTS = [
  { title: "Authentic Products", body: "Sourced from established cricket equipment brands." },
  { title: "WhatsApp Support", body: "Talk directly to us about sizing, stock and pricing." },
  { title: "Quality Cricket Gear", body: "Bats, protective gear and kits for every level of play." },
  { title: "Fast Response", body: "Enquiries are answered directly on WhatsApp." },
];

export function TrustSection() {
  return (
    <section className="bg-bg-section-alt border-y border-border">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        {POINTS.map((point) => (
          <div key={point.title} className="text-center">
            <h3 className="text-xs md:text-sm uppercase tracking-wide font-body">{point.title}</h3>
            <p className="mt-2 text-xs text-text-secondary leading-relaxed">{point.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
