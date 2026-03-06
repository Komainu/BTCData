import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BTC Macro Dashboard",
  description: "Macroeconomic dashboard for Bitcoin",
  // 公式の指示通り、<head> 内に base:app_id のメタタグを追加します
  other: {
    "base:app_id": "6971e49288e3bac59cf3d32e",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
