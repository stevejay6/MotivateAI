import type { Metadata } from "next";
import "./globals.css";
import SiteNavDropdown from "@/components/SiteNavDropdown";

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
      <body>
        <SiteNavDropdown />
        {children}
      </body>
    </html>
  );
}

