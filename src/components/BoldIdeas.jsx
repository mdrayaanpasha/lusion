import React, { useEffect, useRef, useState } from 'react'
import FluidTrail from './FluidTrail.jsx'
import './BoldIdeas.css'

const lerp = (a, b, t) => a + (b - a) * t

const BoldIdeas = () => {
  const pinRef = useRef(null)
  const pathRef = useRef(null)
  const [p, setP] = useState(0)       // scroll progress through the pin (0 → 1)
  const [len, setLen] = useState(1)

  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength())
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const el = pinRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight // the scrollable pin distance
      const prog = total > 0 ? -rect.top / total : 0
      setP(Math.max(0, Math.min(1, prog)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // smoothstep for nicer easing
  const ease = p * p * (3 - 2 * p)

  // The arc draws over the first ~45% of the scroll.
  const arcP = Math.min(1, p / 0.45)
  const arcEase = arcP * arcP * (3 - 2 * arcP)
  const dashoffset = len * (1 - arcEase)

  // The video expands over the full 100vh of pinned scroll.
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900

  const showW = lerp(380, vw * 0.9, ease)
  const showH = lerp(260, vh * 0.78, ease)
  const showLeft = lerp(vw <= 1000 ? 24 : 64, vw * 0.05, ease)
  const showBottom = lerp(vw <= 1000 ? 24 : 56, vh * 0.11, ease)
  const showRadius = lerp(22, 16, ease)

  // Fade the heading + copy out as the video takes over the screen.
  const contentOpacity = Math.max(0, 1 - p * 1.6)

  return (
    <section className="bold-pin" ref={pinRef}>
      <div className="bold-sticky">
        {/* magical iridescent liquid that trails the cursor */}
        <FluidTrail />

        <div className="bold__content" style={{ opacity: contentOpacity }}>
          {/* scribble arc that draws itself as you scroll */}
          <svg
            className="bold__arc"
            viewBox="0 0 640 640"
            fill="none"
            preserveAspectRatio="xMinYMin meet"
          >
            <path
              ref={pathRef}
              d="M -40 660 C 60 320, 230 180, 620 150"
              stroke="#3a37ff"
              strokeWidth="34"
              strokeLinecap="round"
              style={{ strokeDasharray: len, strokeDashoffset: dashoffset }}
            />
          </svg>

          <h2 className="bold__title">
            Bold Ideas,
            <br />
            Brought to Life
          </h2>

          <div className="bold__copy">
            <p className="bold__text">
              We combine design, motion, 3D, and development to create digital
              experiences that feel visually striking and technically seamless.
              From campaign launches to immersive brand worlds, we build work
              that captures attention and invites interaction.
            </p>
            <a className="bold__approach" href="#approach">
              <span className="bold__dot bold__dot--dark" /> OUR APPROACH
            </a>
          </div>
        </div>

        {/* the expanding video panel */}
        <div
          className="bold__media"
          style={{
            width: `${showW}px`,
            height: `${showH}px`,
            left: `${showLeft}px`,
            bottom: `${showBottom}px`,
            borderRadius: `${showRadius}px`,
          }}
        >
          <video
            className="bold__video"
            src="/approach.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="bold__media-inner" />
        </div>
      </div>
    </section>
  )
}

export default BoldIdeas
