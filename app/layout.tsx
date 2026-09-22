import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Kalulu Vision — Technology Training Platform",
  description:
    "Practical technology training in programming, AI, web development, data analytics, automation, and IoT. Enroll today.",
  keywords:
    "technology training, programming courses, AI courses, web development, Zambia, online learning",
  openGraph: {
    title: "Kalulu Vision — Technology Training Platform",
    description:
      "Practical technology training designed to help you develop real-world digital skills.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col antialiased"
        style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
      >
        {children}
      </body>
    </html>
  );
}
