import React, { useEffect, useRef } from 'react'
import Globe from './Globe.jsx'
import './FeaturedWork.css'

const TAGS = 'CONCEPT • WEB • DESIGN • DEVELOPMENT • 3D • ANIMATION'
const TITLE = 'Featured Work'

const PROJECTS = [
  { title: 'Oryzo AI', img: '/work/oryzo.jpg' },
  { title: 'Atlas Motion', img: '/work/atlas.jpg' },
  { title: 'Nova Studio', img: '/work/nova.jpg' },
  { title: 'Lumen Labs', img: '/work/lumen.jpg' },
  { title: 'Drift Collective', img: '/work/drift.jpg' },
  { title: 'Pulse Interactive', img: '/work/pulse.jpg' },
  { title: 'Verge Reality', img: '/work/verge.jpg' },
  { title: 'Halo Systems', img: '/work/halo.jpg' },
]

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const smooth = (t) => t * t * (3 - 2 * t)

const FeaturedWork = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const title = section.querySelector('.work__title')
    const intro = section.querySelector('.work__intro')
    const cards = Array.from(section.querySelectorAll('.card'))

    let raf

    const update = () => {
      const vh = window.innerHeight

      // --- heading: scroll-driven typewriter ---
      if (title) {
        const r = title.getBoundingClientRect()
        const chars = title.querySelectorAll('.tw')
        const caret = title.querySelector('.work__caret')
        const p = clamp((vh - r.top) / (vh * 0.55), 0, 1)
        const shown = Math.round(p * chars.length)
        chars.forEach((c, idx) => {
          c.style.display = idx < shown ? 'inline' : 'none'
        })
        // caret shows while still typing, fades once fully typed
        if (caret) caret.style.opacity = shown >= chars.length ? '0' : '1'
      }

      if (intro) {
        const r = intro.getBoundingClientRect()
        const p = clamp((vh - r.top) / (vh * 0.85), 0, 1)
        const e = smooth(p)
        intro.style.opacity = e
        intro.style.transform = `translateY(${(1 - e) * 50}px)`
      }

      // --- cards: scrubbed reveal (fade + rise), image wipe + parallax ---
      cards.forEach((card, i) => {
        const r = card.getBoundingClientRect()
        // reveal progress — staggered a touch per column
        const offset = (i % 2) * 0.06
        const pIn = clamp((vh - r.top) / (vh * 0.75) - offset, 0, 1)
        const e = smooth(pIn)

        card.style.opacity = e
        card.style.transform = `translateY(${(1 - e) * 80}px)`

        const media = card.querySelector('.card__media')
        const img = card.querySelector('.card__img')
        const meta = card.querySelector('.card__meta')

        if (media) {
          // wipe-up reveal that tracks scroll
          media.style.clipPath = `inset(${(1 - e) * 100}% 0 0 0 round 18px)`
        }
        if (img) {
          // continuous parallax: the image drifts as the card travels,
          // plus a cursor-driven drift blended in via CSS vars
          const pTravel = clamp((vh - r.top) / (vh + r.height), 0, 1)
          const shift = (pTravel - 0.5) * 60
          img.style.setProperty('--scrollY', `${shift}px`)
        }
        if (meta) {
          meta.style.opacity = e
          meta.style.transform = `translateY(${(1 - e) * 24}px)`
        }
      })

      raf = requestAnimationFrame(update)
    }

    raf = requestAnimationFrame(update)
    window.addEventListener('resize', update)

    // --- premium cursor-driven hover: 3D tilt + spotlight + depth drift ---
    const detachers = cards.map((card) => {
      const media = card.querySelector('.card__media')
      if (!media) return () => {}

      let hoverRaf = 0
      // targets vs current values → spring-smoothed follow
      const t = { rx: 0, ry: 0, mx: 50, my: 50, dx: 0, dy: 0 }
      const c = { rx: 0, ry: 0, mx: 50, my: 50, dx: 0, dy: 0 }

      const render = () => {
        // ease current toward target (critically-damped feel)
        const k = 0.16
        c.rx += (t.rx - c.rx) * k
        c.ry += (t.ry - c.ry) * k
        c.mx += (t.mx - c.mx) * k
        c.my += (t.my - c.my) * k
        c.dx += (t.dx - c.dx) * k
        c.dy += (t.dy - c.dy) * k

        card.style.setProperty('--rx', `${c.rx.toFixed(2)}deg`)
        card.style.setProperty('--ry', `${c.ry.toFixed(2)}deg`)
        card.style.setProperty('--mx', `${c.mx.toFixed(2)}%`)
        card.style.setProperty('--my', `${c.my.toFixed(2)}%`)
        card.style.setProperty('--dx', `${c.dx.toFixed(2)}px`)
        card.style.setProperty('--dy', `${c.dy.toFixed(2)}px`)

        const settled =
          Math.abs(t.rx - c.rx) < 0.01 &&
          Math.abs(t.ry - c.ry) < 0.01 &&
          Math.abs(t.mx - c.mx) < 0.05 &&
          Math.abs(t.my - c.my) < 0.05
        if (!settled) {
          hoverRaf = requestAnimationFrame(render)
        } else {
          hoverRaf = 0
        }
      }
      const kick = () => {
        if (!hoverRaf) hoverRaf = requestAnimationFrame(render)
      }

      const onEnter = () => card.classList.add('is-hover')
      const onMove = (ev) => {
        const r = media.getBoundingClientRect()
        const px = (ev.clientX - r.left) / r.width // 0..1
        const py = (ev.clientY - r.top) / r.height // 0..1
        const nx = clamp(px, 0, 1) - 0.5 // -0.5..0.5
        const ny = clamp(py, 0, 1) - 0.5
        t.ry = nx * 16 // tilt left/right
        t.rx = -ny * 12 // tilt up/down
        t.mx = clamp(px, 0, 1) * 100
        t.my = clamp(py, 0, 1) * 100
        t.dx = nx * -26 // image drifts opposite → depth
        t.dy = ny * -26
        kick()
      }
      const onLeave = () => {
        card.classList.remove('is-hover')
        t.rx = 0
        t.ry = 0
        t.mx = 50
        t.my = 50
        t.dx = 0
        t.dy = 0
        kick()
      }

      media.addEventListener('pointerenter', onEnter)
      media.addEventListener('pointermove', onMove)
      media.addEventListener('pointerleave', onLeave)
      return () => {
        media.removeEventListener('pointerenter', onEnter)
        media.removeEventListener('pointermove', onMove)
        media.removeEventListener('pointerleave', onLeave)
        if (hoverRaf) cancelAnimationFrame(hoverRaf)
      }
    })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', update)
      detachers.forEach((d) => d())
    }
  }, [])

  return (
    <section className="work" ref={sectionRef}>
      <div className="work__head">
        <h2 className="work__title">
          {TITLE.split('').map((ch, i) => (
            <span className="tw" key={i}>
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
          <span className="work__caret" />
        </h2>
        <div className="work__aside">
          <Globe />
          <p className="work__intro">
            A SELECTION OF IMMERSIVE DIGITAL EXPERIENCES CREATED FOR AMBITIOUS
            BRANDS AND FORWARD THINKING TEAMS.
          </p>
        </div>
      </div>

      <div className="work__grid">
        {PROJECTS.map((proj) => (
          <a className="card" href="#project" key={proj.title}>
            <div className="card__media">
              <div
                className="card__img"
                style={{
                  backgroundImage: `url(${import.meta.env.BASE_URL}${proj.img.replace(/^\//, '')})`,
                }}
              />
              <div className="card__grain" />
              <div className="card__glow" />
              <div className="card__shine" />
              <div className="card__ring" />
              <div className="card__cursor">
                <span className="card__cursor-arrow" aria-hidden="true">↗</span>
                View
              </div>
            </div>
            <div className="card__meta">
              <div className="card__tags">{TAGS}</div>
              <div className="card__name">
                <span className="card__arrow" aria-hidden="true">→</span>
                <span className="card__label">{proj.title}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

export default FeaturedWork
