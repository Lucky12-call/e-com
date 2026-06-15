import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/shared/SessionProvider";
import { QueryProvider } from "@/components/shared/QueryProvider";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Silk & Grace — Premium Indian Sarees",
    template: "%s | Silk & Grace",
  },
  description:
    "Discover India's finest handwoven sarees — Kanjivaram, Banarasi, Silk, Cotton and more. Shop premium Indian sarees for weddings, festivals and daily wear.",
  keywords: ["Indian sarees", "Kanjivaram", "Banarasi", "silk sarees", "wedding sarees", "buy sarees online"],
  openGraph: {
    title: "Silk & Grace — Premium Indian Sarees",
    description: "Premium handwoven Indian sarees for every occasion",
    siteName: "Silk & Grace",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Silk & Grace — Premium Indian Sarees",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-white font-sans antialiased">
        <SessionProvider>
          <QueryProvider>
            {children}
            <Toaster position="top-right" richColors />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
