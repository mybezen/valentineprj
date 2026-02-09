import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import MusicPlayer from "../components/ui/MusicPlayer";

// Konfigurasi Poppins (pilih weight yang kamu butuhkan)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // sesuaikan kebutuhanmu
  variable: "--font-poppins", // optional, kalau mau pakai CSS variable
  display: "swap", // biar gak ada FOIT
});

const playlist = [
  {
    id: '1',
    title: 'Sailor Song',
    artist: 'Gigi Perez',
    audioSrc: '/audio/sailorsong.mp3',
    coverImage: "/cover/sailor.jpg",
    lyrics: [
      { time: 0, text: 'blah bleh bleh' },
    ]
  },
  {
    id: '2',
    title: 'You & I',
    artist: 'One Direction',
    audioSrc: '/audio/iyou.mp3',
    coverImage: '/cover/iyou.jpg',
    lyrics: [
      { time: 0, text: 'blah bleh bleh' },
    ]
  },
  {
    id: '3',
    title: 'Nobody But You',
    artist: 'Sonder ft Jorja Smith',
    audioSrc: '/audio/nobody.mp3',
    coverImage: '/cover/nobody.jpg',
    lyrics: [
      { time: 0, text: 'blah bleh bleh' },
    ]
  },
  {
    id: '4',
    title: 'Alexandra',
    artist: 'Reality Club',
    audioSrc: '/audio/reality.mp3',
    coverImage: '/cover/alexandra.jpg',
    lyrics: [
      { time: 0, text: 'Just like a certain motorbike gang from Charming' },
      { time: 9, text: 'Or you were looking for the old ultraviolence, you`re trouble' },
      { time: 19, text: 'yes I knew, right from the start' },
    ]
  }
  
  
]


export const metadata: Metadata = {
  title: "ValGift",
  description: "cr : Amri Ikhda",
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