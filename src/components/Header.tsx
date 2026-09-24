import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { buildGeneralEnquiryUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { MobileMenu } from "@/components/MobileMenu";
import { AnnouncementBar } from "@/components/AnnouncementBar";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export async function Header() {
  const settings = await getSettings();
  const whatsappUrl = buildGeneralEnquiryUrl(settings);

  return (
    <div className="sticky top-0 z-40">
      <AnnouncementBar text={settings.announcementText} color={(settings as { announcementColor?: string }).announcementColor} />
      <header className="bg-bg-page border-b border-border">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 h-14 md:h-[68px] flex items-center justify-between">
          <Link href="/" className="font-display text-xl md:text-2xl tracking-wide">
            WICKET &amp; WILLOW
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] uppercase tracking-wider text-text-primary hover:text-accent-dark transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {settings.headerWhatsappEnabled && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-2 bg-whatsapp text-white px-4 py-2.5 text-[12px] uppercase tracking-wide hover:bg-whatsapp-dark transition-colors duration-150"
              >
                <WhatsAppIcon className="w-4 h-4" />
                WhatsApp Us
              </a>
            )}
            {settings.headerWhatsappEnabled && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp us"
                className="md:hidden w-8 h-8 flex items-center justify-center rounded-full bg-whatsapp text-white"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            )}
            <MobileMenu />
          </div>
        </div>
      </header>
    </div>
  );
}
