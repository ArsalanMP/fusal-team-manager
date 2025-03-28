import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Components
import Navbar from "@/components/Navbar";
import ModalProvider from "@/components/ModalProvider";
// Font Declaration
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata Setup
export const metadata = {
  title: "Futsal Team Manager",
  description:
    "Created to defuse the chaos of managing friends and family in a futsal team",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`App ${geistSans.variable} ${geistMono.variable}`}>
        <Navbar />
        <main className="main-container">{children}</main>
        <ModalProvider />
      </body>
    </html>
  );
}
