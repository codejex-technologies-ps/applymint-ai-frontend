import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ApplyMint AI - Transform Your Job Search with AI-Powered Precision",
  description:
    "Discover your dream job with AI-powered matching, automated applications, and intelligent career insights. Join thousands of professionals who've accelerated their careers with ApplyMint AI.",
  keywords:
    "AI job search, job matching, career platform, resume optimization, job applications, AI recruiter",
  authors: [{ name: "ApplyMint AI Team" }],
  openGraph: {
    title: "ApplyMint AI - Transform Your Job Search with AI-Powered Precision",
    description:
      "Discover your dream job with AI-powered matching, automated applications, and intelligent career insights.",
    type: "website",
    siteName: "ApplyMint AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApplyMint AI - Transform Your Job Search with AI-Powered Precision",
    description:
      "Discover your dream job with AI-powered matching, automated applications, and intelligent career insights.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
