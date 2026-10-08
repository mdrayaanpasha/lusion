import React, { useEffect, useState } from 'react'
import './Nav.css'

const Nav = () => {
  const [light, setLight] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      // switch to the light theme once we scroll past the dark 3D hero
      setLight(window.scrollY > window.innerHeight * 0.75)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <header className={`nav-bar ${light ? 'nav-bar--light' : 'nav-bar--dark'}`}>
      <div className="nav-bar__logo">LUSION</div>

      <div className="nav-bar__center">
        <span className="nav-bar__plus">+</span>
        SCROLL TO EXPLORE
        <span className="nav-bar__plus">+</span>
      </div>

      <nav className="nav-bar__actions">
        <button className="nav-bar__icon" aria-label="sound">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M2 12 L6 12 L9 5 L15 19 L18 12 L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <a className="nav-bar__pill nav-bar__pill--primary" href="https://lusion.co/">
          LET&apos;S TALK <span className="nav-bar__dot" />
        </a>
        <button className="nav-bar__pill nav-bar__pill--secondary">
          MENU <span className="nav-bar__dots" />
        </button>
      </nav>
    </header>
  )
}

export default Nav
