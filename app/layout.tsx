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
        {/* Baseミニアプリ所有権確認用のメタタグを直接配置 */}
        <meta name="base:app_id" content="6971e49288e3bac59cf3d32e" />
      </head>
      <body>{children}</body>
    </html>
  );
}
