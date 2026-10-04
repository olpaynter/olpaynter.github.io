import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { HistoryTransitions } from "@/components/HistoryTransitions";
import { IslandBackdrop } from "@/components/IslandBackdrop";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oliver Paynter-Jones",
  description: "Software Development Engineer at Amazon, based in Edinburgh.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <HistoryTransitions />
        <div className="relative min-h-full">
          <IslandBackdrop />
          {children}
        </div>
        <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-10 h-16 bg-linear-to-b from-background to-transparent" />
        <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-10 h-24 bg-linear-to-t from-background to-transparent" />
      </body>
    </html>
  );
}
