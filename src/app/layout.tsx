import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "New SaiKeshav Enterprises - Roxy Road, Baripada | In-Store Reward Kiosk",
  description: "Official customer reward kiosk for New SaiKeshav Enterprises, Roxy Road, Baripada. Phones, Gadgets & Premium Accessories.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full antialiased text-[#040505] selection:bg-brand-yellow">
        {children}
      </body>
    </html>
  );
}
