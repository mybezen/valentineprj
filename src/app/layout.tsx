import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Heart } from "lucide-react"; // ← import heart icon dari lucide-react
import "./globals.css";
import MusicPlayer from "../components/ui/MusicPlayer";
import { playlist } from "../types";

// Konfigurasi Poppins (pilih weight yang kamu butuhkan)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // sesuaikan kebutuhanmu
  variable: "--font-poppins", // optional, kalau mau pakai CSS variable
  display: "swap", // biar gak ada FOIT
});

export const metadata: Metadata = {
  title: "ValGift",
  description: "cr : Amri Ikhda",
  // Optional: bisa tambah icon heart di tab browser
  icons: {
    icon: "/favicon.ico", // kalau mau ganti favicon jadi heart nanti buat sendiri ya
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // Ganti className ke Poppins
        className={`${poppins.variable} ${poppins.className} antialiased`}
      >

        {/* Konten utama */}
        {children}
        <MusicPlayer playlist={playlist} />
      </body>
    </html>
  );
}