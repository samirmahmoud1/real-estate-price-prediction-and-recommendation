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
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-[#020617] text-white">

        {/* 🔥 Navbar */}
        <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

            {/* Logo */}
            <Link href="/" className="text-xl font-black">
              🏠 RealEstate AI
            </Link>

            {/* Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
              <Link href="/predict" className="hover:text-cyan-300 transition">
                Prediction
              </Link>
              <Link href="/invest" className="hover:text-purple-300 transition">
                Investment
              </Link>
              <Link href="/dashboard" className="hover:text-emerald-300 transition">
                Dashboard
              </Link>
            </div>

            {/* CTA */}
            <Link
              href="/predict"
              className="rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-6 py-2 font-bold text-black shadow-lg shadow-cyan-500/20 hover:scale-105 transition"
            >
              Get Started
            </Link>

          </div>
        </nav>

        {/* محتوى الصفحات */}
        <div className="pt-24">{children}</div>

      </body>
    </html>
  );
}