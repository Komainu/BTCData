import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BTC Macro Dashboard",
  description: "Macroeconomic dashboard for Bitcoin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* Baseミニアプリ所有権確認用のメタタグ（新しいID） */}
        <meta name="base:app_id" content="69ab406449645da9eb55ad7e" />
      </head>
      <body>{children}</body>
    </html>
  );
}
