import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Wicket & Willow",
  description: "Wicket & Willow is a small business started by two brothers, Karan Purwar and Arjun Purwar, with a simple love for cricket.",
};

export default function AboutPage() {
  return (
    <div className="max-w-[800px] mx-auto px-6 md:px-8 py-16">
      <h1 className="font-display text-3xl md:text-5xl uppercase tracking-wide mb-8">About Wicket &amp; Willow</h1>

      <div className="space-y-6 text-base md:text-lg leading-relaxed text-text-primary">
        <p className="text-lg md:text-xl font-medium leading-relaxed">
          Wicket &amp; Willow is a small business started by two brothers,{" "}
          <strong className="font-semibold text-accent-dark font-display">Karan Purwar and Arjun Purwar</strong>, with a
          simple love for cricket.
        </p>

        <p>
          Growing up, we loved playing cricket, but getting proper cricket gear wasn’t always easy. A ₹5,000–₹6,000 kit
          felt expensive, and we didn’t even know that you could buy individual equipment based on your needs.
        </p>

        <p>
          As we grew older, we realised that many young cricketers might still face the same problem. That’s what
          inspired us to start <strong>Wicket &amp; Willow</strong> — a simple place to discover reliable cricket gear
          from established brands without making the buying process complicated.
        </p>

        <p className="pt-2 font-medium">
          We’re starting small, but our goal is simple:{" "}
          <strong className="font-semibold text-accent-dark">
            make cricket equipment easier to find, understand, and buy.
          </strong>
        </p>

        <div className="mt-10 pt-8 border-t border-border">
          <p className="font-display text-lg md:text-xl uppercase tracking-wider text-text-primary font-bold">
            Built by two brothers. Inspired by the game we’ve always loved.
          </p>
        </div>
      </div>
    </div>
  );
}
