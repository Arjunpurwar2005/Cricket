import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { buildGeneralEnquiryUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Wicket & Willow on WhatsApp.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const url = buildGeneralEnquiryUrl(settings);

  return (
    <div className="max-w-[800px] mx-auto px-6 md:px-8 py-16 text-center">
      <h1 className="font-display text-3xl md:text-5xl uppercase tracking-wide">Contact Us</h1>
      <p className="mt-4 text-sm md:text-base text-text-secondary max-w-md mx-auto">
        For product enquiries, bulk orders or general questions, message us directly on WhatsApp — that&apos;s
        where we respond fastest.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 bg-whatsapp text-white px-8 py-4 text-[13px] uppercase tracking-wide hover:bg-whatsapp-dark transition-colors duration-150"
      >
        <WhatsAppIcon className="w-4 h-4" />
        Chat on WhatsApp
      </a>
    </div>
  );
}
