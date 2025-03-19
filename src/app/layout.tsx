import type { Metadata } from "next";
import "./globals.css";
import LayoutContent from "@/components/LayoutContent";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Le Luxe Clinic",
  description: "Beauty Treatment Laser Clinic, Whitening Drip, Slimming, Skin Tightening, Nails & Eyelash Extensions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body className="force-light">
        <LayoutContent>
          <Toaster position="top-center" />
          {children}
        </LayoutContent>
      </body>
    </html>
  );
}
