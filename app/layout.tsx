import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "QR Code Generator - Create Custom QR Codes",
  description: "Generate high-quality, customizable QR codes with custom colors, logos, and designs. Free online QR code generator with instant download.",
  keywords: ["QR code", "QR generator", "custom QR code", "QR code maker", "free QR code"],
  authors: [{ name: "QR Generator" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
