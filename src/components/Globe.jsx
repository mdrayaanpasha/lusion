import React, { useEffect, useRef } from 'react'
import './Globe.css'

const R = 90
const CX = 100
const CY = 100
const N_MERIDIANS = 7

// latitude rings (parallels) — flattened ellipses for a tilted-globe look
const LATS = [-60, -30, 0, 30, 60].map((deg) => {
  const rad = (deg * Math.PI) / 180
  return {
    cy: CY - R * Math.sin(rad) * 0.55,
    rx: R * Math.cos(rad),
    ry: R * Math.cos(rad) * 0.22,
  }
})

const Globe = () => {
  const svgRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const meridians = Array.from(svg.querySelectorAll('.globe__meridian'))
    let raf

    const update = () => {
      const phase = window.scrollY * 0.005
      meridians.forEach((el, i) => {
        const ang = phase + (i * Math.PI) / meridians.length
        const rx = Math.abs(Math.cos(ang)) * R
        el.setAttribute('rx', Math.max(0.4, rx).toFixed(2))
        el.style.opacity = (0.22 + 0.6 * Math.abs(Math.cos(ang))).toFixed(3)
      })
      // gentle wobble of the whole globe as you scroll
      svg.style.transform = `rotate(${-12 + Math.sin(phase) * 5}deg)`
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <svg
      ref={svgRef}
      className="globe"
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
    >
      <circle className="globe__outline" cx={CX} cy={CY} r={R} />
      {LATS.map((l, i) => (
        <ellipse
          key={`lat-${i}`}
          className="globe__lat"
          cx={CX}
          cy={l.cy}
          rx={l.rx}
          ry={l.ry}
        />
      ))}
      {Array.from({ length: N_MERIDIANS }).map((_, i) => (
        <ellipse
          key={`mer-${i}`}
          className="globe__meridian"
          cx={CX}
          cy={CY}
          rx={R}
          ry={R}
        />
      ))}
    </svg>
  )
}

export default Globe
