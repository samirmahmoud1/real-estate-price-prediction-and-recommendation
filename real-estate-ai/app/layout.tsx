import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Real Estate AI",
  description: "AI powered real estate investment advisor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black">
        <nav className="fixed top-0 left-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-black/40 px-6 py-4 backdrop-blur-lg">
          <h1 className="text-xl font-bold text-white">🏠 RealEstate AI</h1>

          <div className="flex gap-6 font-medium text-white/80">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <Link href="/predict" className="transition hover:text-white">
              Prediction
            </Link>
            <Link href="/invest" className="transition hover:text-white">
              Investment
            </Link>
            <Link href="/dashboard" className="transition hover:text-white">
              Dashboard
            </Link>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}