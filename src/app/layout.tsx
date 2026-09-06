import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PollForge",
  description: "PollForge — Secure, transparent, and accessible online voting",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch session server-side to avoid navbar flash/spawn
  let initialAuthenticated = false;
  let initialIsAdmin = false;
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    initialAuthenticated = !!session?.user;
    initialIsAdmin = (session?.user as { role?: string })?.role === "admin";
    // Fallback DB role check if needed is handled client-side, but server gives fast initial paint
  } catch {}

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800">
        <Header initialAuthenticated={initialAuthenticated} initialIsAdmin={initialIsAdmin} />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
