import React, { useEffect, useRef, useState } from 'react'
import { useProgress } from '@react-three/drei'
import './Loader.css'

const Loader = ({ onComplete }) => {
  const { progress, active } = useProgress()
  const [display, setDisplay] = useState(0)
  const [done, setDone] = useState(false)
  const targetRef = useRef(0)

  targetRef.current = progress

  // Smooth progress animation
  useEffect(() => {
    let raf

    const tick = () => {
      setDisplay((prev) => {
        const target = targetRef.current
        const next = prev + (target - prev) * 0.08

        return Math.abs(target - next) < 0.3 ? target : next
      })

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [])

  // Complete loader once real loading is finished
  // and displayed progress has caught up.
  useEffect(() => {
    if (!active && progress >= 100 && display >= 99.5) {
      const t1 = setTimeout(() => setDone(true), 400)
      const t2 = setTimeout(() => {
        onComplete && onComplete()
      }, 1100)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
  }, [active, progress, display, onComplete])

  const value = Math.min(100, Math.round(display))
  const label = String(value).padStart(3, '0')

  return (
    <div className={`loader ${done ? 'loader--hidden' : ''}`}>
      {/* Center spinner */}
      <div className="loader__spinner">
        <div className="loader__spinner-rotate">
          <span className="loader__bar loader__bar--a" />
          <span className="loader__bar loader__bar--b" />
        </div>
      </div>

      {/* Bottom-left progress meter */}
      <div className="loader__meter">
        <div className="loader__count">
          {label}
        </div>

        <div className="loader__pipe">
          <div
            className="loader__pipe-fill"
            style={{
              transform: `scaleX(${value / 100})`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Loader