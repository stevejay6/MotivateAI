import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quotes Discovery",
  description: "Discover inspiring quotes across various categories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

