import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import BackgroundGrain from "@/components/animations/background-grain";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "The Nexus",
  description: "A premium digital culture ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
  className={`
    ${inter.variable}
    ${playfair.variable}
    bg-black
    text-white
    antialiased
  `}
>
  <BackgroundGrain />

  {children}
</body>
    </html>
  );
}