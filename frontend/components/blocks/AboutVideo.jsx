'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// YouTube IFrame API — učitaj jednom (singleton).
let ytPromise
function loadYT() {
  if (typeof window === 'undefined') return Promise.resolve(null)
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (!ytPromise) {
    ytPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        prev?.()
        resolve(window.YT)
      }
      const s = document.createElement('script')
      s.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(s)
    })
  }
  return ytPromise
}

function videoId(url) {
  return url?.match(/(?:youtu\.be\/|v=|embed\/)([\w-]+)/)?.[1] || null
}

const I = (d, w = 2) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
)
const PlayIcon = () => <span className="h-5 w-5 [&>svg]:h-5 [&>svg]:w-5">{I(<path d="M6 4l14 8-14 8V4z" fill="currentColor" stroke="none" />)}</span>
const PauseIcon = () => <span className="h-5 w-5 [&>svg]:h-5 [&>svg]:w-5">{I(<><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" /><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" /></>)}</span>
const MuteIcon = () => <span className="h-5 w-5 [&>svg]:h-5 [&>svg]:w-5">{I(<><path d="M11 5 6 9H2v6h4l5 4V5z" /><path d="m23 9-6 6M17 9l6 6" /></>)}</span>
const SoundIcon = () => <span className="h-5 w-5 [&>svg]:h-5 [&>svg]:w-5">{I(<><path d="M11 5 6 9H2v6h4l5 4V5z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" /></>)}</span>
const ExpandIcon = () => <span className="h-5 w-5 [&>svg]:h-5 [&>svg]:w-5">{I(<path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3m13 5h3a2 2 0 0 0 2-2v-3" />)}</span>

const COVER_SCALE = 1.18

export default function AboutVideo({ url, cover = true, buttonSide = 'right' }) {
  const id = videoId(url)
  const rootRef = useRef(null)
  const wrapRef = useRef(null)
  const hostRef = useRef(null)
  const playerRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  // Cover: skaliraj 16:9 plejer da prekrije okvir + iseče YouTube ivice (chrome).
  useEffect(() => {
    if (!cover) return
    const fit = () => {
      const box = rootRef.current
      const wrap = wrapRef.current
      if (!box || !wrap) return
      const w = box.clientWidth
      const h = box.clientHeight
      if (!w || !h) return
      const vid = 16 / 9
      if (w / h > vid) {
        wrap.style.width = `${w * COVER_SCALE}px`
        wrap.style.height = `${(w / vid) * COVER_SCALE}px`
      } else {
        wrap.style.height = `${h * COVER_SCALE}px`
        wrap.style.width = `${h * vid * COVER_SCALE}px`
      }
    }
    fit()
    const ro = new ResizeObserver(fit)
    if (rootRef.current) ro.observe(rootRef.current)
    return () => ro.disconnect()
  }, [cover, ready, id])

  // Inline plejer — autoplay muted loop, BEZ YouTube kontrola (svoje crtamo).
  useEffect(() => {
    if (!id || !hostRef.current) return
    let cancelled = false

    loadYT().then((YT) => {
      if (cancelled || !YT || !hostRef.current) return
      playerRef.current = new YT.Player(hostRef.current, {
        width: '100%',
        height: '100%',
        videoId: id,
        playerVars: {
          autoplay: 1, mute: 1, controls: 0, loop: 1, playlist: id,
          modestbranding: 1, rel: 0, playsinline: 1, disablekb: 1, fs: 0, iv_load_policy: 3,
        },
        events: {
          onReady: (e) => {
            e.target.mute()
            e.target.playVideo()
            const f = e.target.getIframe?.()
            if (f) {
              f.style.position = 'absolute'
              f.style.inset = '0'
              f.style.width = '100%'
              f.style.height = '100%'
              f.style.border = '0'
            }
            setReady(true)
          },
          onStateChange: (e) => {
            if (e.data === 1) setPlaying(true)
            else if (e.data === 2) setPlaying(false)
            else if (e.data === 0) e.target.playVideo() // loop bez end-screen-a
          },
        },
      })
    })

    return () => {
      cancelled = true
      try {
        playerRef.current?.destroy()
      } catch {
        /* noop */
      }
    }
  }, [id])

  // Progres za seek traku.
  useEffect(() => {
    if (!ready) return
    const iv = setInterval(() => {
      const p = playerRef.current
      if (p?.getDuration) {
        const d = p.getDuration()
        if (d > 0) setProgress(Math.min(1, p.getCurrentTime() / d))
      }
    }, 300)
    return () => clearInterval(iv)
  }, [ready])

  // Lightbox: pauziraj inline + zaključaj scroll.
  useEffect(() => {
    if (!lightbox) return
    try {
      playerRef.current?.pauseVideo()
    } catch {
      /* noop */
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
      try {
        playerRef.current?.playVideo()
      } catch {
        /* noop */
      }
    }
  }, [lightbox])

  const togglePlay = () => {
    const p = playerRef.current
    if (!p) return
    if (playing) p.pauseVideo()
    else p.playVideo()
  }
  const toggleMute = () => {
    const p = playerRef.current
    if (!p) return
    if (muted) {
      p.unMute()
      p.setVolume(80)
      setMuted(false)
    } else {
      p.mute()
      setMuted(true)
    }
  }
  const onSeek = (e) => {
    const p = playerRef.current
    if (!p?.getDuration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    p.seekTo(frac * p.getDuration(), true)
    setProgress(frac)
  }

  if (!id) return null

  const ctrlBtn =
    'pointer-events-auto flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-brand'

  return (
    <div ref={rootRef} className="group/v absolute inset-0 overflow-hidden">
      {/* cover wrapper + host */}
      <div
        ref={wrapRef}
        className={
          cover
            ? 'pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
            : 'pointer-events-none absolute inset-x-0 top-1/2 aspect-video -translate-y-1/2'
        }
      >
        <div ref={hostRef} className="h-full w-full" />
      </div>

      {/* Poster — transparentna bela podloga dok video ne krene */}
      <div
        className={`pointer-events-none absolute inset-0 z-[3] bg-white/85 backdrop-blur-sm transition-opacity duration-500 ${playing ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden={playing}
      />

      {/* Hover/klik površina — hover prikazuje kontrole (iframe ih inače „proguta"),
          klik = play/pauza. Desktop: iznad tekst-containera (z-10), ispod trake (z-20);
          mobilni: ispod teksta (z-5) jer je traka tamo ionako uvek vidljiva. */}
      <div onClick={togglePlay} className="absolute inset-0 z-[5] cursor-pointer lg:z-[15]" aria-hidden="true" />

      {/* Kontrolna traka — samo desktop, na hover */}
      {ready && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden items-center gap-3 bg-gradient-to-t from-gray-950/75 via-gray-950/30 to-transparent px-4 pb-3 pt-10 opacity-0 transition-opacity duration-200 group-hover/v:opacity-100 lg:flex">
          <button type="button" onClick={togglePlay} aria-label={playing ? 'Pauza' : 'Pusti'} className={ctrlBtn}>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>

          {/* Seek traka */}
          <div
            onClick={onSeek}
            className="pointer-events-auto group/seek relative h-2 flex-1 cursor-pointer rounded-full bg-white/25"
            role="slider"
            aria-label="Premotavanje"
            aria-valuenow={Math.round(progress * 100)}
          >
            <div className="absolute inset-y-0 left-0 rounded-full bg-brand" style={{ width: `${progress * 100}%` }} />
            <div
              className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover/seek:opacity-100"
              style={{ left: `${progress * 100}%` }}
            />
          </div>

          <button type="button" onClick={toggleMute} aria-label={muted ? 'Uključi zvuk' : 'Isključi zvuk'} className={ctrlBtn}>
            {muted ? <MuteIcon /> : <SoundIcon />}
          </button>
          <button type="button" onClick={() => setLightbox(true)} aria-label="Ceo ekran / pogledaj ceo video" className={ctrlBtn}>
            <ExpandIcon />
          </button>
        </div>
      )}

      {/* Lightbox — pun video sa native YouTube kontrolama (desktop + mobilni) */}
      {lightbox &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(false)}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setLightbox(false)}
              aria-label="Zatvori"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors hover:bg-white/20"
            >
              <span className="h-5 w-5 [&>svg]:h-5 [&>svg]:w-5">{I(<path d="M6 6l12 12M18 6L6 18" />)}</span>
            </button>
            <div className="relative aspect-video w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <iframe
                src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title="Palisada video"
                className="absolute inset-0 h-full w-full rounded-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
