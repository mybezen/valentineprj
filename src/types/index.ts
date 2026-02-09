export type Phase = 'intro' | 'game' | 'transition' | 'gallery' | 'gift';

export interface PhotoItem {
  id: string;
  src: string;
  alt: string;
}

export const playlist = [
  {
    id: '1',
    title: 'Sailor Song',
    artist: 'Gigi Perez',
    audioSrc: '/audio/sailorsong.mp3',
    coverImage: "/cover/sailor.jpg"
  },
  {
    id: '2',
    title: 'Jatuh Suka',
    artist: 'Tulus',
    audioSrc: '/audio/suka.mp3',
    coverImage: "/Images/cover/suka.png",
    lyrics: [
      { time: 11, text: 'Sungguh ku tidak memiliki daya' },
      { time: 20, text: 'Di depan harummu' },
      { time: 22, text: 'Sungguh terkunci kata yang tertata' },
      { time: 31, text: 'Di depan ragamu' },
      { time: 34, text: 'Hu' },
      { time: 43, text: 'Bila kau lihat ku tanpa sengaja' },
      { time: 52, text: 'Beginikah surga' },
      { time: 54, text: 'Bayangkan bila kau ajakku bicara' },
      { time: 64, text: 'Ini semua bukan salahmu' },
      { time: 70, text: 'Punya magis perekat yang sekuat itu' },
      { time: 76, text: 'Dari lahir sudah begitu' },
      { time: 79, text: 'Maafkan' },
      { time: 84, text: 'Aku jatuh suka' },
      { time: 96, text: 'Bila kau lihat ku tanpa sengaja' },
      { time: 106, text: 'Beginikah surga' },
      { time: 107, text: 'Bayangkan bila kau ajakku bicara' },
      { time: 118, text: 'Ini semua bukan salahmu' },
      { time: 123, text: 'Punya magis perekat yang sekuat itu' },
      { time: 128, text: 'Dari lahir sudah begitu' },
      { time: 133, text: 'Maafkan' },
      { time: 137, text: 'Aku jatuh suka' },
      { time: 149, text: 'Bila kau berkenan biarkanku di sampingmu' },
      { time: 160, text: 'Berkuranglah satu jiwa yang sepi' },
      { time: 170, text: 'Ini semua bukan salahmu' },
      { time: 175, text: 'Punya magis perekat yang sekuat itu' },
      { time: 181, text: 'Dari lahir sudah begitu' },
      { time: 186, text: 'Maafkan oh uh' },
      { time: 192, text: 'Ini semua bukan salahmu' },
      { time: 197, text: 'Punya magis perekat yang sekuat itu' },
      { time: 202, text: 'Dari lahir sudah begitu' },
      { time: 207, text: 'Maafkan' },
      { time: 212, text: 'Aku jatuh suka hm' },
      { time: 222, text: 'Aku jatuh suka' },
      { time: 223, text: 'ENJOY THIS WEBSITE TIK ^^ -bin' },
    ]
  },
  {
    id: '3',
    title: 'Cinta dan Rahasia',
    artist: 'Yura Yunita ft. Glenn Fredly',
    audioSrc: '/audio/cinta.mp3',
    coverImage: "/Images/cover/cinta.jpg"
  },
  {
    id: '4',
    title: 'Pelangi',
    artist: 'HIVI',
    audioSrc: '/audio/pelangi.mp3',
    coverImage: "/Images/cover/pelangi.jpg"
  },
  {
    id: '5',
    title: 'Indahnya Dirimu',
    artist: 'HIVI',
    audioSrc: '/audio/indahnya.mp3',
    coverImage: "/Images/cover/indah.jpg"
  },
  {
    id: '6',
    title: 'Remaja',
    artist: 'HIVI',
    audioSrc: '/audio/remaja.mp3',
    coverImage: "/Images/cover/pelangi.jpg"
  },
  {
    id: '7',
    title: 'Dan',
    artist: 'Sheila On 7',
    audioSrc: '/audio/dan.mp3',
    coverImage: "/Images/cover/dan.jpg"
  },
  {
    id: '8',
    title: 'I Love U But Im Letting Go',
    artist: 'Pamungkas',
    audioSrc: '/audio/love-pam.mp3',
    coverImage: "/Images/cover/love-pam.jpg"
  },
  {
    id: '9',
    title: 'Risalah Hati',
    artist: 'Pamungkas',
    audioSrc: '/audio/risalah.mp3',
    coverImage: "/Images/cover/risalah.jpg"
  },
  {
    id: '10',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    audioSrc: '/audio/perfect.mp3',
    coverImage: "/Images/cover/perfect.jpg"
  },
]
