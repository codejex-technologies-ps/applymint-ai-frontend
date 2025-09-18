import type { Metadata } from "next";
// Temporarily commenting out Google Fonts due to network issues
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

// Temporarily using fallback fonts
const geistSans = {
  variable: "--font-geist-sans",
};

const geistMono = {
  variable: "--font-geist-mono",
};

export const metadata: Metadata = {
  title: "ApplyMint AI - Transform Your Job Search with AI-Powered Precision",
  description: "Discover your dream job with AI-powered matching, automated applications, and intelligent career insights. Join thousands of professionals who've accelerated their careers with ApplyMint AI.",
  keywords: "AI job search, job matching, career platform, resume optimization, job applications, AI recruiter",
  authors: [{ name: "ApplyMint AI Team" }],
  openGraph: {
    title: "ApplyMint AI - Transform Your Job Search with AI-Powered Precision",
    description: "Discover your dream job with AI-powered matching, automated applications, and intelligent career insights.",
    type: "website",
    siteName: "ApplyMint AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApplyMint AI - Transform Your Job Search with AI-Powered Precision",
    description: "Discover your dream job with AI-powered matching, automated applications, and intelligent career insights.",
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
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
