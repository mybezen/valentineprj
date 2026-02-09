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
  const audioRef = useRef<HTMLAudioElement>(null)
  const lyricsContainerRef = useRef<HTMLDivElement>(null)

  const currentSong = playlist[currentSongIndex]
  const hasLyrics = !!currentSong.lyrics && currentSong.lyrics.length > 0

  // Autoplay saat komponen mount - wait for audio to load first
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleCanPlay = () => {
      audio.play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch((error) => {
          console.error("Autoplay failed:", error)
        })
    }

    // Listen for when audio is ready
    audio.addEventListener('canplay', handleCanPlay)
    
    // Also try to load
    audio.load()

    return () => {
      audio.removeEventListener('canplay', handleCanPlay)
    }
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handlePrevSong = () => {
    setShowLyrics(false)
    setCurrentTime(0)
    setCurrentLyricIndex(0)
    const prevIndex = currentSongIndex === 0 ? playlist.length - 1 : currentSongIndex - 1
    setCurrentSongIndex(prevIndex)

    setTimeout(() => {
      if (audioRef.current && isPlaying) {
        audioRef.current.play()
      }
    }, 100)
  }

  const handleNextSong = () => {
    setShowLyrics(false)
    setCurrentTime(0)
    setCurrentLyricIndex(0)
    const nextIndex = (currentSongIndex + 1) % playlist.length
    setCurrentSongIndex(nextIndex)

    setTimeout(() => {
      if (audioRef.current && isPlaying) {
        audioRef.current.play()
      }
    }, 100)
  }

  const handleSongSelect = (index: number) => {
    setShowLyrics(false)
    setCurrentTime(0)
    setCurrentLyricIndex(0)
    setCurrentSongIndex(index)
    setShowPlaylist(false)

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }, 100)
  }

  // Auto show lyrics when expanded and has lyrics
  useEffect(() => {
    if (hasLyrics && isExpanded && isPlaying) {
      setShowLyrics(true)
    }
  }, [currentSongIndex, isExpanded])

  // Hide lyrics when collapsed
  useEffect(() => {
    if (!isExpanded) {
      setShowLyrics(false)
      setShowPlaylist(false)
    }
  }, [isExpanded])

  // Update current time
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
    }

    audio.addEventListener('timeupdate', updateTime)
    return () => audio.removeEventListener('timeupdate', updateTime)
  }, [])

  // Update current lyric index
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
  }, [currentTime, hasLyrics, currentSong.lyrics, currentLyricIndex])

  // Auto scroll lyrics
  useEffect(() => {
    if (!showLyrics || !lyricsContainerRef.current) return

    const container = lyricsContainerRef.current
    const activeLine = container.querySelector(`[data-index="${currentLyricIndex}"]`)

    if (activeLine) {
      activeLine.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [currentLyricIndex, showLyrics])

  // Auto next song when ended
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      handleNextSong()
    }

    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [currentSongIndex, isPlaying])

  // Reset audio when song changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load()
      setCurrentTime(0)
      setCurrentLyricIndex(0)
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentSongIndex])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentSong.audioSrc}
        preload="auto"
      />

      {/* Vertical Music Player - Right Side Center */}
      <m.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed top-1/2 -translate-y-1/2 right-4 z-50"
      >
        <m.div
          animate={{
            width: isExpanded ? 'min(280px, calc(100vw - 2rem))' : '56px',
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
        >
          {/* Collapsed State - Only Cover & Title */}
          {!isExpanded && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-1.5"
            >
              <button
                onClick={() => setIsExpanded(true)}
                className="w-full flex flex-col items-center gap-2 group"
              >
                {/* Cover Image - Rounded Full */}
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-zinc-900 flex-shrink-0 ring-2 ring-white/10 group-hover:ring-white/30 transition-all">
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
                  
                  {/* Playing indicator on cover */}
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="flex gap-0.5">
                        {[0, 1, 2].map((i) => (
                          <m.div
                            key={i}
                            className="w-0.5 bg-white rounded-full"
                            animate={{
                              height: ["3px", "10px", "3px"],
                            }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.15,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Vertical Title */}
                <div className="writing-mode-vertical text-white/60 text-[10px] font-medium max-h-28 overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-white/90 transition-colors">
                  {currentSong.title}
                </div>
              </button>
            </m.div>
          )}

          {/* Expanded State - Full Player */}
          <AnimatePresence>
            {isExpanded && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-3"
              >
                {/* Header with Close Button */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                    <span className="text-white/70 text-xs font-medium">Now Playing</span>
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
                    aria-label="Collapse player"
                  >
                    <svg className="w-3.5 h-3.5 text-white/50 group-hover:text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Album Cover - Large */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-900 mb-3">
                  {currentSong.coverImage ? (
                    <img
                      src={currentSong.coverImage}
                      alt={currentSong.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-white/20" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                      </svg>
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Song counter badge */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm">
                    <span className="text-white text-[10px] font-medium">
                      {currentSongIndex + 1}/{playlist.length}
                    </span>
                  </div>
                </div>

                {/* Song Info */}
                <div className="mb-3">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <h3 className="text-white font-semibold text-sm leading-tight flex-1">
                      {currentSong.title}
                    </h3>
                    {hasLyrics && (
                      <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-medium bg-white/10 text-white/70 border border-white/20">
                        L
                      </span>
                    )}
                  </div>
                  <p className="text-white/50 text-xs">{currentSong.artist}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-1.5">
                    <m.div
                      className="h-full bg-white rounded-full"
                      style={{
                        width: audioRef.current?.duration
                          ? `${(currentTime / audioRef.current.duration) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-white/40">
                    <span>{formatTime(currentTime)}</span>
                    <span>{audioRef.current?.duration ? formatTime(audioRef.current.duration) : '0:00'}</span>
                  </div>
                </div>

                {/* Main Controls */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  {/* Previous */}
                  <button
                    onClick={handlePrevSong}
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
                    aria-label="Previous song"
                  >
                    <svg className="w-4 h-4 text-white/60 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                    </svg>
                  </button>

                  {/* Play/Pause - Large */}
                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-white hover:bg-white/90 flex items-center justify-center transition-all shadow-lg"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>

                  {/* Next */}
                  <button
                    onClick={handleNextSong}
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
                    aria-label="Next song"
                  >
                    <svg className="w-4 h-4 text-white/60 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                    </svg>
                  </button>
                </div>

                {/* Secondary Controls */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  {/* Playlist Button */}
                  <button
                    onClick={() => {
                      setShowPlaylist(!showPlaylist)
                      if (!showPlaylist) setShowLyrics(false)
                    }}
                    className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs ${
                      showPlaylist 
                        ? 'bg-white/20 text-white border border-white/30' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
                    }`}
                    aria-label="Toggle playlist"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">List</span>
                  </button>

                  {/* Lyrics Button */}
                  {hasLyrics && (
                    <button
                      onClick={() => {
                        setShowLyrics(!showLyrics)
                        if (!showLyrics) setShowPlaylist(false)
                      }}
                      className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs ${
                        showLyrics 
                          ? 'bg-white/20 text-white border border-white/30' 
                          : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
                      }`}
                      aria-label="Toggle lyrics"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-medium">Lyrics</span>
                    </button>
                  )}
                </div>

                {/* Playlist View */}
                <AnimatePresence>
                  {showPlaylist && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/10 pt-2">
                        <div className="max-h-56 overflow-y-auto custom-scrollbar space-y-1">
                          {playlist.map((song, index) => (
                            <button
                              key={song.id}
                              onClick={() => handleSongSelect(index)}
                              className={`w-full p-2 rounded-lg flex items-center gap-2 transition-colors ${
                                index === currentSongIndex 
                                  ? 'bg-white/10' 
                                  : 'hover:bg-white/5'
                              }`}
                            >
                              {/* Mini Cover */}
                              <div className="w-9 h-9 rounded-md bg-zinc-900 overflow-hidden flex-shrink-0">
                                {song.coverImage ? (
                                  <img src={song.coverImage} alt={song.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-3.5 h-3.5 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                    </svg>
                                  </div>
                                )}
                              </div>

                              {/* Song Info */}
                              <div className="flex-1 text-left min-w-0">
                                <p className={`text-xs font-medium truncate ${
                                  index === currentSongIndex ? 'text-white' : 'text-white/70'
                                }`}>
                                  {song.title}
                                </p>
                                <p className="text-[10px] text-white/40 truncate">{song.artist}</p>
                              </div>

                              {/* Playing Indicator */}
                              {index === currentSongIndex && isPlaying && (
                                <div className="flex gap-0.5 items-end h-3">
                                  {[0, 1, 2].map((i) => (
                                    <m.div
                                      key={i}
                                      className="w-0.5 bg-white rounded-full"
                                      animate={{ height: ["3px", "10px", "3px"] }}
                                      transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: i * 0.15,
                                        ease: "easeInOut"
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>

                {/* Lyrics View */}
                <AnimatePresence>
                  {showLyrics && hasLyrics && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/10 pt-2">
                        <div
                          ref={lyricsContainerRef}
                          className="max-h-56 overflow-y-auto custom-scrollbar"
                        >
                          <div className="space-y-2 px-1">
                            {currentSong.lyrics?.map((line, index) => (
                              <m.div
                                key={index}
                                data-index={index}
                                initial={{ opacity: 0.4 }}
                                animate={{
                                  opacity: index === currentLyricIndex ? 1 : 0.4,
                                  scale: index === currentLyricIndex ? 1.02 : 1,
                                }}
                                transition={{ duration: 0.3 }}
                                className={`text-center transition-all duration-300 ${
                                  index === currentLyricIndex
                                    ? 'text-white text-sm font-semibold'
                                    : 'text-white/40 text-xs'
                                }`}
                              >
                                {line.text}
                              </m.div>
                            ))}
                          </div>
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

      {/* Custom Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </>
  )
}