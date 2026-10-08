import * as THREE from 'three'
import React, { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Stars, Sparkles, Float } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import astronautUrl from '../assets/3d/astronaut.glb'
import './SpaceSection.css'

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const smooth = (t) => t * t * (3 - 2 * t)
const lerp = THREE.MathUtils.lerp

/* ---------- procedural accretion-disk texture (radial glow + streaks) ---------- */
function makeDiskTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 1024
  const ctx = c.getContext('2d')
  const R = 512
  const g = ctx.createRadialGradient(R, R, 150, R, R, R)
  g.addColorStop(0.0, 'rgba(0,0,0,0)')
  g.addColorStop(0.32, 'rgba(0,0,0,0)')
  g.addColorStop(0.46, 'rgba(150,220,255,0.95)')
  g.addColorStop(0.62, 'rgba(150,130,255,0.85)')
  g.addColorStop(0.80, 'rgba(255,150,90,0.6)')
  g.addColorStop(1.0, 'rgba(255,120,60,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 2 * R, 2 * R)

  // bright swirling streaks so rotation reads
  ctx.globalCompositeOperation = 'lighter'
  for (let i = 0; i < 220; i++) {
    const a = (i / 220) * Math.PI * 2 + Math.sin(i) * 0.4
    const r0 = 170 + Math.random() * 40
    const r1 = 360 + Math.random() * 150
    ctx.strokeStyle = `rgba(255,255,255,${0.02 + Math.random() * 0.06})`
    ctx.lineWidth = 1 + Math.random() * 1.5
    ctx.beginPath()
    ctx.moveTo(R + Math.cos(a) * r0, R + Math.sin(a) * r0)
    ctx.lineTo(R + Math.cos(a) * r1, R + Math.sin(a) * r1)
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.anisotropy = 4
  return tex
}

/* ---------- black hole ---------- */
function BlackHole({ progress }) {
  const diskRef = useRef()
  const glowRef = useRef()
  const groupRef = useRef()
  const diskTex = useMemo(() => makeDiskTexture(), [])

  useFrame((_, dt) => {
    const p = progress.current
    if (diskRef.current) diskRef.current.rotation.z += dt * 0.6
    const flare = smooth(clamp((p - 0.6) / 0.4, 0, 1))
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.12 + flare * 0.5
    }
    if (groupRef.current) {
      const s = 1 + flare * 0.5
      groupRef.current.scale.setScalar(s)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* event horizon */}
      <mesh>
        <sphereGeometry args={[1.05, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* photon glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.25, 48, 48]} />
        <meshBasicMaterial
          color="#8fc6ff"
          transparent
          opacity={0.14}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      {/* accretion disk */}
      <mesh ref={diskRef} rotation={[-1.22, 0, 0]}>
        <circleGeometry args={[4.2, 96]} />
        <meshBasicMaterial
          map={diskTex}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

/* ---------- Astronaut ---------- */
function Astronaut({ progress }) {
  const { scene } = useGLTF(astronautUrl)
  const ref = useRef()

  const model = useMemo(() => {
    const s = scene.clone(true)
    s.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.material = o.material.clone()
        o.material.envMapIntensity = 0.8
      }
    })
    return s
  }, [scene])

  useFrame((state, dt) => {
    const p = progress.current
    const g = ref.current
    if (!g) return

    const t = state.clock.elapsedTime
    // spiral toward the black hole: radius shrinks as you scroll
    const spiral = smooth(clamp((p - 0.15) / 0.75, 0, 1))
    const rad = lerp(7.5, 0.15, spiral)
    const angle = p * Math.PI * 4.5 + 0.6
    const x = Math.cos(angle) * rad
    const z = Math.sin(angle) * rad
    const y = Math.sin(t * 0.8) * 0.5 * (1 - spiral) + lerp(1.2, 0, spiral)

    g.position.set(x, y, z)
    // tumble through space, faster as it's pulled in
    g.rotation.y += dt * (0.3 + spiral * 4)
    g.rotation.x += dt * (0.15 + spiral * 2)
    g.rotation.z = Math.sin(t * 0.5) * 0.3

    // spaghettify / vanish into the horizon
    const suck = smooth(clamp((p - 0.86) / 0.14, 0, 1))
    const scale = lerp(1, 0.02, suck)
    g.scale.setScalar(scale)
  })

  return <primitive ref={ref} object={model} scale={1} />
}

/* ---------- camera rig ---------- */
function Rig({ progress }) {
  const { camera } = useThree()
  useFrame(() => {
    const p = progress.current
    const e = smooth(p)
    camera.position.x = Math.sin(p * Math.PI * 1.2) * 3
    camera.position.y = lerp(1.6, 0.4, e)
    camera.position.z = lerp(17, 3.4, e)
    camera.lookAt(0, 0, 0)
  })
  return null
}

/* ---------- full scene ---------- */
function Scene({ progress }) {
  // damp the raw scroll value for buttery motion
  const target = progress
  const damped = useRef({ current: 0 })
  useFrame(() => {
    damped.current.current += (target.current - damped.current.current) * 0.08
  })
  return (
    <>
      <color attach="background" args={['#04050a']} />
      <fog attach="fog" args={['#04050a', 12, 42]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[8, 6, 10]} intensity={2.2} color="#dCE7ff" />
      <pointLight position={[0, 0, 0]} intensity={6} distance={14} color="#8fb6ff" />

      {/* layered starfields for depth */}
      <Stars radius={160} depth={90} count={14000} factor={5} saturation={0} fade speed={0.5} />
      <Stars radius={60} depth={40} count={4000} factor={3} saturation={0} fade speed={1.2} />
      <Sparkles count={120} scale={[26, 16, 26]} size={2.5} speed={0.3} color="#bcd4ff" opacity={0.7} />

      <BlackHole progress={damped.current} />
      <Float speed={1.4} rotationIntensity={0} floatIntensity={0.6}>
        <Astronaut progress={damped.current} />
      </Float>

      <EffectComposer disableNormalPass>
        <Bloom
          intensity={1.15}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.3}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.25} darkness={0.9} />
      </EffectComposer>
    </>
  )
}

/* ---------- section wrapper (500vh pinned scroll) ---------- */
const SpaceSection = () => {
  const pinRef = useRef(null)
  const progress = useRef(0)

  useEffect(() => {
    const pin = pinRef.current
    if (!pin) return
    const paras = Array.from(pin.querySelectorAll('.space__para'))
    const hint = pin.querySelector('.space__hint')

    let raf
    const update = () => {
      const vh = window.innerHeight
      const rect = pin.getBoundingClientRect()
      const total = rect.height - vh
      const p = total > 0 ? clamp(-rect.top / total, 0, 1) : 0
      progress.current = p

      // copy sits beside the scene — reveals progressively through the scroll
      paras.forEach((el, i) => {
        const start = 0.22 + i * 0.12
        const e = smooth(clamp((p - start) / 0.2, 0, 1))
        el.style.opacity = e
        el.style.transform = `translateY(${(1 - e) * 44}px)`
      })
      if (hint) hint.style.opacity = `${clamp(1 - p * 6, 0, 1)}`

      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <section className="space-pin" ref={pinRef}>
      <div className="space-sticky">
        <Canvas
          className="space__canvas"
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          camera={{ position: [0, 1.6, 17], fov: 42, near: 0.1, far: 100 }}
        >
          <Suspense fallback={null}>
            <Scene progress={progress} />
          </Suspense>
        </Canvas>

        <div className="space__overlay">
          <div className="space__hint">
            <span className="space__hint-dot" /> KEEP SCROLLING
          </div>
          <div className="space__copy">
            <p className="space__para">
              We do not chase trends or produce work that looks like everyone
              else. We focus on creating visually distinctive digital
              experiences that reflect your brand, engage your audience, and
              make people remember what they saw.
            </p>
            <p className="space__para">
              Our process blends creative direction, 3D craft, and interactive
              development to build tailored digital journeys that feel original,
              polished, and built for impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

useGLTF.preload(astronautUrl)

export default SpaceSection
