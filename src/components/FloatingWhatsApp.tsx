import { getSettings } from "@/lib/settings";
import { buildGeneralEnquiryUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export async function FloatingWhatsApp() {
  const settings = await getSettings();
  if (!settings.floatingWhatsappEnabled) return null;
  const url = buildGeneralEnquiryUrl(settings);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Enquire on WhatsApp"
      className="fixed bottom-5 right-5 z-30 w-12 h-12 rounded-full bg-whatsapp text-white flex items-center justify-center shadow-lg hover:bg-whatsapp-dark transition-colors duration-150"
    >
      <WhatsAppIcon className="w-6 h-6" />
    </a>
  );
}
