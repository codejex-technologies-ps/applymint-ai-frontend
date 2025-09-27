import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";

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
      <body className="antialiased"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
