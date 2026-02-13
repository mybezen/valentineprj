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
      { time: 0, text: '....' },
      { time: 25, text: 'I saw her in the rightest way\nLooking like Anne Hathaway' },
      { time: 35, text: 'Laughing while she hit her' },
      { time: 39, text: 'Pen And coughed,\n and coughed' },
      { time: 44, text: 'And then, she came up to my knees' },
      { time: 50, text: 'Begging, "Baby, would you please?"' },
      { time: 56, text: 'Do the things you said you`d do to me, to me?"' },
      { time: 64, text: 'Oh, won`t you kiss me on the' },
      { time: 67, text: 'Mouth and love me like a sailor?' },
      { time: 70, text: 'And when you get a taste' },
      { time: 72, text: 'Can you tell me what`s my flavor?' },
      { time: 75, text: 'I don`t believe in God' },
      { time: 77, text: 'but I believe that you`re my savior' },
      { time: 80, text: 'capek ah liriknya panjang banget jujur' },
      { time: 85, text: '....' },
    ]
  },
  {
    id: '2',
    title: 'Perfect',
    artist: 'One Direction',
    audioSrc: '/audio/perfek.mp3',
    coverImage: '/cover/perfek.png',
    lyrics: [
      { time: 0, text: '....' },
    ]
  },
  {
    id: '3',
    title: 'Nobody But You',
    artist: 'Sonder ft Jorja Smith',
    audioSrc: '/audio/nobody.mp3',
    coverImage: '/cover/nobody.jpg',
    lyrics: [
      { time: 0, text: '....' },
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