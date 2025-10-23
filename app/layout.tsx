import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Structural Design & Simulation",
  description: "Professional structural analysis and design tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
