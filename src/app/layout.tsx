import type { Metadata } from "next";
import { Bebas_Neue, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Wicket & Willow — Premium Cricket Equipment",
    template: "%s | Wicket & Willow",
  },
  description:
    "Premium cricket bats, gloves, helmets, shoes and kits. Browse the catalogue and enquire directly on WhatsApp.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-page text-text-primary font-body">
        {children}
      </body>
    </html>
  );
}
