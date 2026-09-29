import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "W E L C O M E   I T Z F I Z Z | Scroll-Driven Hero",
  description:
    "Scroll-driven hero section inspired by high-performance automotive engineering.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-white selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
