'use client'

import { useEffect, useRef, useState } from 'react'

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

const MutedIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <path d="m23 9-6 6M17 9l6 6" />
  </svg>
)
const SoundIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
  </svg>
)

/**
 * YouTube video — sam se pušta (muted) kad uđe u vidno polje, sa dugmetom za zvuk.
 * `cover`: 16:9 iframe se meri JS-om i skalira da PREKRIJE okvir bilo kog oblika
 *          (edge-to-edge, crop) — kao full-bleed slika u Brand Story bloku.
 */
export default function AboutVideo({ url, cover = true, buttonSide = 'right' }) {
  const id = videoId(url)
  const rootRef = useRef(null)
  const wrapRef = useRef(null)
  const hostRef = useRef(null)
  const playerRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const [ready, setReady] = useState(false)

  // Cover: izračunaj veličinu 16:9 wrapper-a da prekrije okvir (bilo koji aspect).
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
        wrap.style.width = `${w}px`
        wrap.style.height = `${w / vid}px`
      } else {
        wrap.style.height = `${h}px`
        wrap.style.width = `${h * vid}px`
      }
    }
    fit()
    const ro = new ResizeObserver(fit)
    if (rootRef.current) ro.observe(rootRef.current)
    return () => ro.disconnect()
  }, [cover, ready, id])

  useEffect(() => {
    if (!id || !hostRef.current) return
    let cancelled = false
    let io

    loadYT().then((YT) => {
      if (cancelled || !YT || !hostRef.current) return
      playerRef.current = new YT.Player(hostRef.current, {
        width: '100%',
        height: '100%',
        videoId: id,
        playerVars: {
          autoplay: 0, mute: 1, controls: 0, loop: 1, playlist: id,
          modestbranding: 1, rel: 0, playsinline: 1, disablekb: 1, fs: 0, iv_load_policy: 3,
        },
        events: {
          onReady: (e) => {
            e.target.mute()
            const f = e.target.getIframe?.()
            if (f) {
              f.style.position = 'absolute'
              f.style.inset = '0'
              f.style.width = '100%'
              f.style.height = '100%'
              f.style.border = '0'
            }
            setReady(true)
            io = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting) e.target.playVideo()
                else e.target.pauseVideo()
              },
              { threshold: 0.35 },
            )
            if (rootRef.current) io.observe(rootRef.current)
          },
        },
      })
    })

    return () => {
      cancelled = true
      io?.disconnect()
      try {
        playerRef.current?.destroy()
      } catch {
        /* noop */
      }
    }
  }, [id])

  const toggleSound = () => {
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

  if (!id) return null

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden">
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

      {ready && (
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? 'Uključi zvuk' : 'Isključi zvuk'}
          title={muted ? 'Uključi zvuk' : 'Isključi zvuk'}
          className={`absolute bottom-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-gray-950/55 text-white ring-1 ring-white/20 backdrop-blur-md transition-colors duration-200 hover:bg-brand ${buttonSide === 'left' ? 'left-4' : 'right-4'}`}
        >
          {muted ? <MutedIcon /> : <SoundIcon />}
        </button>
      )}
    </div>
  )
}
