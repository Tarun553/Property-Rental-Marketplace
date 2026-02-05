import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/lib/providers";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RentHub - Find Your Perfect Rental Home",
    template: "%s | RentHub",
  },
  description:
    "Discover your ideal rental property with RentHub. Browse thousands of listings, connect directly with landlords, and find your next home with ease.",
  keywords: [
    "rental",
    "property",
    "apartment",
    "house",
    "rent",
    "landlord",
    "tenant",
    "real estate",
  ],
  authors: [{ name: "RentHub" }],
  creator: "RentHub",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "RentHub",
    title: "RentHub - Find Your Perfect Rental Home",
    description:
      "Discover your ideal rental property with RentHub. Browse thousands of listings, connect directly with landlords, and find your next home with ease.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RentHub - Find Your Perfect Rental Home",
    description:
      "Discover your ideal rental property with RentHub. Browse thousands of listings, connect directly with landlords.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            {children}
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "hsl(var(--card))",
                color: "hsl(var(--card-foreground))",
                border: "1px solid hsl(var(--border))",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
