import type { Metadata, Viewport } from "next";
import "./globals.css";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#10182B",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body
        className="min-h-full flex flex-col antialiased"
        style={{
          background: "#FFFFFF",
          color: "#10182B",
          fontFamily: '"Times New Roman", Times, Georgia, serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
