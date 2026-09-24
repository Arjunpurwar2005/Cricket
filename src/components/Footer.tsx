import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { buildGeneralEnquiryUrl } from "@/lib/whatsapp";

export async function Footer() {
  const settings = await getSettings();
  const whatsappUrl = buildGeneralEnquiryUrl(settings);

  return (
    <footer className="bg-accent-dark text-white mt-16">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="font-display text-2xl tracking-wide">WICKET &amp; WILLOW</p>
          <p className="mt-4 text-sm text-white/70 max-w-xs">
            A curated catalogue of cricket bats, protective gear and kits. Browse online, enquire directly on
            WhatsApp.
          </p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest text-white/50 mb-4">Quick Links</p>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/shop" className="hover:underline">Shop</Link>
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest text-white/50 mb-4">Connect</p>
          <div className="flex flex-col gap-2 text-sm">
            {settings.footerWhatsappEnabled && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="text-center text-[11px] text-white/50 tracking-wide">
          © {new Date().getFullYear()} Wicket &amp; Willow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
