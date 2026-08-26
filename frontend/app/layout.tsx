import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KelanaAI — AI-Powered Travel Planner",
  description:
    "Plan your perfect trip with KelanaAI. Get personalized AI-generated itineraries, budget breakdowns, and travel recommendations in seconds.",
  keywords: ["travel planner", "AI travel", "itinerary generator", "trip planning", "kelana AI"],
  openGraph: {
    title: "KelanaAI — AI-Powered Travel Planner",
    description: "Plan your perfect trip with AI in seconds.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-inter), var(--font-jakarta), sans-serif" }} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
