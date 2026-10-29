import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource/lato/300.css";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import "@fontsource/oswald/400.css";
import "@fontsource/oswald/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "CVMaker AI — Sun'iy intellekt bilan professional CV",
  description:
    "O'zingiz haqingizda oddiy matn yozing — AI uni bir necha soniyada professional, ATS-friendly CV'ga aylantiradi.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
