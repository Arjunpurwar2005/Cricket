import type { Settings } from "@/lib/settings";
import { buildGeneralEnquiryUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function HomeWhatsAppCta({ settings }: { settings: Settings }) {
  const url = buildGeneralEnquiryUrl(settings);

  return (
    <section className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 text-center">
      <h2 className="font-display text-2xl md:text-4xl uppercase tracking-wide">Have a Question?</h2>
      <p className="mt-3 text-sm text-text-secondary max-w-md mx-auto">
        Chat with us directly on WhatsApp for bulk enquiries, sizing help or product availability.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 bg-whatsapp text-white px-8 py-4 text-[13px] uppercase tracking-wide hover:bg-whatsapp-dark transition-colors duration-150"
      >
        <WhatsAppIcon className="w-4 h-4" />
        Chat on WhatsApp
      </a>
    </section>
  );
}
