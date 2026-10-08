import React, { useEffect, useRef } from 'react'
import './FluidTrail.css'

/**
 * A soft, iridescent "liquid" that trails the cursor on a <canvas>.
 * Spawns colour-shifting metaball particles that grow, drift and fade,
 * drawn with heavy blur + screen blending for a magical fluid look.
 */
const FluidTrail = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const parent = canvas.parentElement

    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = []
    let hue = 210            // start in the blue range
    const palette = [
      [90, 80, 255],   // blue/indigo
      [150, 120, 255], // violet
      [255, 150, 120], // warm orange
      [120, 200, 255], // cyan
    ]

    let last = { x: w / 2, y: h / 2, set: false }

    const spawn = (x, y, vx, vy) => {
      hue = (hue + 4) % 360
      // pick a colour that slides along the palette over time
      const idx = Math.floor((hue / 360) * palette.length) % palette.length
      const c = palette[idx]
      particles.push({
        x,
        y,
        vx: vx * 0.15 + (Math.sin(hue) * 0.3),
        vy: vy * 0.15 - 0.2,
        r: 30 + Math.random() * 30,
        maxR: 120 + Math.random() * 120,
        life: 0,
        ttl: 90 + Math.random() * 60,
        color: c,
      })
      if (particles.length > 70) particles.shift()
    }

    const onMove = (e) => {
      const rect = parent.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (x < 0 || y < 0 || x > w || y > h) return
      const vx = last.set ? x - last.x : 0
      const vy = last.set ? y - last.y : 0
      last = { x, y, set: true }
      const speed = Math.hypot(vx, vy)
      // more droplets the faster you move
      const count = 1 + Math.min(Math.floor(speed / 18), 3)
      for (let i = 0; i < count; i++) spawn(x, y, vx, vy)
    }
    window.addEventListener('mousemove', onMove)

    let raf
    const render = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'screen'
      ctx.filter = 'blur(28px)'

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        const t = p.life / p.ttl
        if (t >= 1) {
          particles.splice(i, 1)
          continue
        }
        p.x += p.vx
        p.y += p.vy
        p.vy -= 0.01 // slight upward drift like smoke
        p.r += (p.maxR - p.r) * 0.04

        // ease in then out
        const alpha = Math.sin(t * Math.PI) * 0.5
        const [r, g, b] = p.color
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`)
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.filter = 'none'
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className="fluid-trail" aria-hidden="true" />
}

export default FluidTrail
