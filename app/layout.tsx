import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const display = localFont({
  src: "./fonts/space-grotesk-latin-wght-normal.woff2",
  variable: "--font-space-grotesk",
  weight: "300 700",
  display: "swap",
});
const body = localFont({
  src: "./fonts/dm-sans-latin-wght-normal.woff2",
  variable: "--font-dm-sans",
  weight: "100 1000",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Kalulu Vision — Engineering Intelligence. Building Possibilities.",
    template: "%s | Kalulu Vision",
  },
  description:
    "Kalulu Vision is an African technology and innovation company building AI, software, data and IoT solutions for real-world challenges, and teaching practical digital skills.",
  applicationName: "Kalulu Vision",
  openGraph: {
    type: "website",
    siteName: "Kalulu Vision",
    title: "Kalulu Vision — Engineering Intelligence. Building Possibilities.",
    description: "AI, software, data and IoT solutions for real-world challenges. See Beyond. Build the Future.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Kalulu Vision logo and slogan" }],
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#212121" },
  ],
};

/** Applies the saved theme before first paint (light is the default). */
const THEME_SCRIPT = `(function(){try{var p=localStorage.getItem("kv-theme");if(p!=="dark"&&p!=="system")p="light";var d=p==="dark"||(p==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.dataset.theme=d?"dark":"light";r.dataset.themePref=p;}catch(e){document.documentElement.dataset.theme="light";}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" data-theme="light" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
