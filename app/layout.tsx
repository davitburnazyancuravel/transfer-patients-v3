import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";

import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/chrome.css";
import "@/styles/sections/hero.css";
import "@/styles/sections/statement.css";
import "@/styles/sections/about.css";
import "@/styles/sections/services.css";
import "@/styles/sections/cases.css";
import "@/styles/sections/crew.css";
import "@/styles/sections/ticker.css";
import "@/styles/sections/partners.css";
import "@/styles/sections/calculator.css";
import "@/styles/sections/faq.css";
import "@/styles/sections/contact.css";
import "@/styles/sections/footer.css";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SiteEffects } from "@/components/SiteEffects";
import { SITE } from "@/lib/content";

const onest = Onest({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-onest",
});

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.ogDescription,
  },
};

export const viewport: Viewport = {
  /* The plate's surround, so the browser chrome matches the page edge. */
  themeColor: "#f1f2f7",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={onest.variable}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>

        <div className="plate">
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </div>

        <SiteEffects />
      </body>
    </html>
  );
}
