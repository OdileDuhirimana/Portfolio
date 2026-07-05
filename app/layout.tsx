import type { Metadata } from "next";
import { Space_Grotesk, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import ThemeGlow from "@/components/ThemeGlow";
import { buildPageMetadata } from "@/lib/seo";

const heading = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400","500","600","700"],
});

const body = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400","500","600"],
});

export const metadata: Metadata = buildPageMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${heading.variable} ${body.variable} antialiased`} suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-(--gold) focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
        >
          Skip to main content
        </a>
        <ThemeGlow />
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
