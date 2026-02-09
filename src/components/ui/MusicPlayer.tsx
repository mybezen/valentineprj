"use client"

import { useState, useEffect, useRef } from 'react'
import { m, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion'

interface LyricLine {
  time: number
  text: string
}

interface Song {
  id: string
  title: string
  artist: string
  audioSrc: string
  coverImage?: string
  lyrics?: LyricLine[]
}

interface MusicPlayerProps {
  playlist: Song[]
}

export default function MusicPlayer({ playlist }: MusicPlayerProps) {
  return (
    <LazyMotion features={domAnimation}>
      <MusicPlayerContent playlist={playlist} />
    </LazyMotion>
  )
}

function MusicPlayerContent({ playlist }: MusicPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showLyrics, setShowLyrics] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0)
  const [showWelcomeModal, setShowWelcomeModal] = useState(true) // Modal awal
  const [playerPosition, setPlayerPosition] = useState<'center' | 'top' | 'bottom'>('center') // State baru untuk posisi player
  const audioRef = useRef<HTMLAudioElement>(null)
  const lyricsContainerRef = useRef<HTMLDivElement>(null)

  const currentSong = playlist[currentSongIndex]
  const hasLyrics = !!currentSong.lyrics && currentSong.lyrics.length > 0

  // Reset audio source when song changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSong.audioSrc
      audioRef.current.load()
      setCurrentTime(0)
      setCurrentLyricIndex(0)

      // Auto play only if already playing (after user interaction)
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Play failed:", e))
      }
    }
  }, [currentSongIndex, currentSong.audioSrc, isPlaying])

  // Time update & lyric sync
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    audio.addEventListener('timeupdate', updateTime)

    return () => audio.removeEventListener('timeupdate', updateTime)
  }, [])

  // Lyric index update
  useEffect(() => {
    if (!hasLyrics || !currentSong.lyrics) return

    const lyrics = currentSong.lyrics
    let newIndex = 0

    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        newIndex = i
      } else {
        break
      }
    }

    if (newIndex !== currentLyricIndex) {
      setCurrentLyricIndex(newIndex)
    }
  }, [currentTime, hasLyrics, currentSong.lyrics])

  // Auto scroll lyrics
  useEffect(() => {
    if (!showLyrics || !lyricsContainerRef.current) return

    const activeLine = lyricsContainerRef.current.querySelector(`[data-index="${currentLyricIndex}"]`)
    if (activeLine) {
      activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentLyricIndex, showLyrics])

  // Auto next song
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      handleNextSong()
    }

    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [currentSongIndex, isPlaying])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(e => console.log("Play failed:", e))
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handlePrevSong = () => {
    setShowLyrics(false)
    const prevIndex = currentSongIndex === 0 ? playlist.length - 1 : currentSongIndex - 1
    setCurrentSongIndex(prevIndex)
    setIsPlaying(true) // auto play when changing song
  }

  const handleNextSong = () => {
    setShowLyrics(false)
    const nextIndex = (currentSongIndex + 1) % playlist.length
    setCurrentSongIndex(nextIndex)
    setIsPlaying(true)
  }

  const handleSongSelect = (index: number) => {
    setShowLyrics(false)
    setCurrentSongIndex(index)
    setShowPlaylist(false)
    setIsPlaying(true)
  }

  // Auto show lyrics when expanded & playing
  useEffect(() => {
    if (hasLyrics && isExpanded && isPlaying) {
      setShowLyrics(true)
    }
  }, [currentSongIndex, isExpanded, isPlaying, hasLyrics])

  // Hide lyrics/playlist when collapsed
  useEffect(() => {
    if (!isExpanded) {
      setShowLyrics(false)
      setShowPlaylist(false)
    }
  }, [isExpanded])

  // =================== USER INTERACTION HANDLERS ===================
  const handleAcceptMusic = () => {
    setShowWelcomeModal(false)
    setIsExpanded(true)
    setShowPlaylist(true) // langsung buka playlist biar keren
    setIsPlaying(true)
    // Audio akan di-play di useEffect song change
  }

  const handleDeclineMusic = () => {
    setShowWelcomeModal(false)
    setIsExpanded(false)
    setIsPlaying(false)
    // Tidak play sama sekali sampai user klik manual
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Fungsi untuk pindah posisi
  const moveToTop = () => setPlayerPosition('top')
  const moveToBottom = () => setPlayerPosition('bottom')
  const resetPosition = () => setPlayerPosition('center')

  // Variants untuk animasi posisi
  const positionVariants = {
    center: { top: '50%', bottom: 'auto', y: '-50%' },
    top: { top: '1rem', bottom: 'auto', y: '0%' },
    bottom: { top: 'auto', bottom: '1rem', y: '0%' },
  }

  return (
    <>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* =================== WELCOME MODAL =================== */}
      <AnimatePresence>
        {showWelcomeModal && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <m.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-zinc-900/95 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-zinc-800 ring-4 ring-white/10">
                  {currentSong.coverImage ? (
                    <img src={currentSong.coverImage} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                      </svg>
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Haii! 👋
                </h2>
                <p className="text-white/70 text-lg">
                  Aku ada lagu nih buat nemenin kamu buka websitenya...
                </p>
                <p className="text-white/50 mt-1">
                  Mau disetel ga? 🎶
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAcceptMusic}
                  className="bg-white text-black font-semibold py-3 px-6 rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  Mau dong, sekalian liat playlist!
                </button>

                <button
                  onClick={handleDeclineMusic}
                  className="bg-white/10 text-white font-medium py-3 px-6 rounded-xl hover:bg-white/20 transition-all border border-white/20"
                >
                  Nanti aja deh 😌
                </button>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      {/* =================== VERTICAL MUSIC PLAYER =================== */}
      <m.div
        initial={{ x: 100, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
          ...positionVariants[playerPosition], // Animasi posisi dengan variants
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }} // Animasi smooth saat pindah posisi
        className="fixed right-4 z-50"
      >
        <m.div
          animate={{
            width: isExpanded ? 'min(280px, calc(100vw - 2rem))' : '56px',
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
        >
          {/* Collapsed: Only cover + vertical title */}
          {!isExpanded && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-1.5"
            >
              <button
                onClick={() => {
                  setIsExpanded(true)
                  if (!isPlaying) togglePlay() // kalau belum play, mulai main
                }}
                className="w-full flex flex-col items-center gap-2 group"
              >
                {/* Cover */}
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-zinc-900 ring-2 ring-white/10 group-hover:ring-white/40 transition-all">
                  {currentSong.coverImage ? (
                    <img
                      src={currentSong.coverImage}
                      alt={currentSong.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                      </svg>
                    </div>
                  )}

                  {/* Playing animation */}
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="flex gap-0.5">
                        {[0, 1, 2].map(i => (
                          <m.div
                            key={i}
                            className="w-0.5 bg-white rounded-full"
                            animate={{ height: ["4px", "12px", "4px"] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Vertical song title */}
                <div className="writing-mode-vertical text-white/70 text-[10px] font-medium max-h-28 overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-white transition-colors">
                  {currentSong.title}
                </div>
              </button>
            </m.div>
          )}

          {/* Expanded Player */}
          <AnimatePresence>
            {isExpanded && (
              <m.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                    <span className="text-white/80 text-sm font-medium">Now Playing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Tombol pindah posisi (hanya di expanded) */}
                    <button
                      onClick={moveToTop}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      title="Pindah ke kanan atas"
                    >
                      <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={moveToBottom}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      title="Pindah ke kanan bawah"
                    >
                      <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={resetPosition}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      title="Reset ke posisi tengah"
                    >
                      <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16M12 4v16" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Large Cover */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-800 mb-4 shadow-inner">
                  {currentSong.coverImage ? (
                    <img src={currentSong.coverImage} alt={currentSong.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-white/20" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>

                {/* Song Info */}
                <div className="mb-4">
                  <h3 className="text-white font-semibold text-base truncate">
                    {currentSong.title}
                  </h3>
                  <p className="text-white/60 text-sm">{currentSong.artist}</p>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <m.div
                      className="h-full bg-gradient-to-r from-gray-600 to-gray-900"
                      animate={{ width: audioRef.current?.duration ? `${(currentTime / audioRef.current.duration) * 100}%` : '0%' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/50 mt-1.5">
                    <span>{formatTime(currentTime)}</span>
                    <span>{audioRef.current?.duration ? formatTime(audioRef.current.duration) : '--:--'}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button onClick={handlePrevSong} className="text-white/70 hover:text-white transition-colors">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h2v12H6zM16 6h2v12h-2z" />
                      <path d="M9 5v14l11-7z" />
                    </svg>
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-600 to-gray-900 flex items-center justify-center shadow-lg hover:scale-105 transition-all"
                  >
                    {isPlaying ? (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  <button onClick={handleNextSong} className="text-white/70 hover:text-white transition-colors">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h2v12H6zM16 6h2v12h-2z" />
                      <path d="M9 5v14l11-7z" />
                    </svg>
                  </button>
                </div>

                {/* Secondary buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowPlaylist(!showPlaylist)
                      setShowLyrics(false)
                    }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      showPlaylist
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    Playlist
                  </button>

                  {hasLyrics && (
                    <button
                      onClick={() => {
                        setShowLyrics(!showLyrics)
                        setShowPlaylist(false)
                      }}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        showLyrics
                          ? 'bg-white/20 text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      Lyrics
                    </button>
                  )}
                </div>

                {/* Playlist */}
                <AnimatePresence>
                  {showPlaylist && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                        {playlist.map((song, idx) => (
                          <button
                            key={song.id}
                            onClick={() => handleSongSelect(idx)}
                            className={`w-full p-2 rounded-lg flex items-center gap-3 transition-all ${
                              idx === currentSongIndex
                                ? 'bg-white/15'
                                : 'hover:bg-white/5'
                            }`}
                          >
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
                              {song.coverImage ? (
                                <img src={song.coverImage} alt={song.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <p className={`text-sm font-medium truncate ${
                                idx === currentSongIndex ? 'text-white' : 'text-white/80'
                              }`}>
                                {song.title}
                              </p>
                              <p className="text-xs text-white/50 truncate">{song.artist}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>

                {/* Lyrics */}
                <AnimatePresence>
                  {showLyrics && hasLyrics && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div
                        ref={lyricsContainerRef}
                        className="max-h-60 overflow-y-auto custom-scrollbar px-1"
                      >
                        <div className="space-y-4">
                          {currentSong.lyrics?.map((line, idx) => (
                            <m.p
                              key={idx}
                              data-index={idx}
                              animate={{
                                opacity: idx === currentLyricIndex ? 1 : 0.5,
                                scale: idx === currentLyricIndex ? 1.03 : 1,
                                color: idx === currentLyricIndex ? '#ffffff' : '#ffffff80',
                              }}
                              className="text-center text-sm transition-all duration-300"
                            >
                              {line.text}
                            </m.p>
                          ))}
                        </div>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      </m.div>

      {/* Custom Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.4);
        }
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </>
  )
}