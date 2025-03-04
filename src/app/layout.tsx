import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import image from '../../public/images.png';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bug Bash IDE",
  description: "IDE for Bug Bash"    
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/images.png" type="image/x-icon" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}