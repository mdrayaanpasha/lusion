import React, { useEffect, useRef } from 'react'
import './ImmersiveSection.css'

const LINES = [
  ['Where', 'Creative', 'Ideas'],
  ['Become', 'Immersive'],
  ['Experiences'],
]

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const smooth = (t) => t * t * (3 - 2 * t)

const ImmersiveSection = () => {
  const sectionRef = useRef(null)
  const pathRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const path = pathRef.current
    if (!section || !path) return

    const len = path.getTotalLength()
    path.style.strokeDasharray = `${len}`
    path.style.strokeDashoffset = `${len}`

    const words = Array.from(section.querySelectorAll('.imm__word'))
    let raf

    const update = () => {
      const vh = window.innerHeight
      const r = section.getBoundingClientRect()

      // overall scroll progress through the section
      const p = clamp((vh * 0.85 - r.top) / (vh * 0.9), 0, 1)

      // scribble draws in sync with scroll
      path.style.strokeDashoffset = `${len * (1 - smooth(p))}`

      // words rise + unclip, staggered
      words.forEach((w, i) => {
        const delay = i * 0.06
        const wp = smooth(clamp((p - delay) / (1 - delay), 0, 1))
        w.style.transform = `translateY(${(1 - wp) * 110}%) rotate(${(1 - wp) * 4}deg)`
        w.style.opacity = wp < 0.02 ? 0 : 1
      })

      raf = requestAnimationFrame(update)
    }

    raf = requestAnimationFrame(update)
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', update)
    }
  }, [])

  let wordIdx = 0

  return (
    <section className="imm" ref={sectionRef}>
      <svg
        className="imm__scribble"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="immStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8ef0e6" />
            <stop offset="100%" stopColor="#58d7e6" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          d="M1180 20 C 760 40, 300 60, 330 230 C 350 340, 560 360, 620 300 C 700 220, 560 120, 430 190 C 300 260, 340 480, 560 560"
          fill="none"
          stroke="url(#immStroke)"
          strokeWidth="26"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <h2 className="imm__title">
        {LINES.map((line, li) => (
          <span className="imm__line" key={li}>
            {line.map((word) => {
              const delayIndex = wordIdx++
              return (
                <span className="imm__word-wrap" key={word + delayIndex}>
                  <span className="imm__word" style={{ '--i': delayIndex }}>
                    {word}
                  </span>
                </span>
              )
            })}
          </span>
        ))}
      </h2>
    </section>
  )
}

export default ImmersiveSection
