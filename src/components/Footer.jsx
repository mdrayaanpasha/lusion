import React, { useEffect, useRef, useState } from 'react'
import './Footer.css'

const HEADING = ['Let’s', 'build', 'something', 'unforgettable.']

const Footer = () => {
  const rootRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.18 }
    )
    root.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <footer className="foot" ref={rootRef}>
      <div className="foot__glow" />

      <div className="foot__top">
        <div className="foot__lead">
          <p className="foot__eyebrow reveal">● CONTACT US</p>
          <h2 className="foot__title">
            {HEADING.map((w, i) => (
              <span className="foot__word-wrap" key={i}>
                <span
                  className="foot__word reveal"
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  {w}
                </span>
              </span>
            ))}
          </h2>
          <p className="foot__sub reveal" style={{ transitionDelay: '120ms' }}>
            Tell us about your project. We reply within one working day.
          </p>
        </div>

        {/* contact form */}
        <form className="foot__form" onSubmit={onSubmit}>
          {sent ? (
            <div className="foot__thanks reveal in">
              <span className="foot__thanks-mark">✦</span>
              <h3>Message sent.</h3>
              <p>Thanks{form.name ? `, ${form.name}` : ''} — we’ll be in touch shortly.</p>
            </div>
          ) : (
            <>
              <div className="field reveal" style={{ transitionDelay: '60ms' }}>
                <input
                  id="f-name"
                  name="name"
                  type="text"
                  placeholder=" "
                  value={form.name}
                  onChange={onChange}
                  required
                />
                <label htmlFor="f-name">Your name</label>
                <span className="field__line" />
              </div>

              <div className="field reveal" style={{ transitionDelay: '130ms' }}>
                <input
                  id="f-email"
                  name="email"
                  type="email"
                  placeholder=" "
                  value={form.email}
                  onChange={onChange}
                  required
                />
                <label htmlFor="f-email">Email address</label>
                <span className="field__line" />
              </div>

              <div className="field reveal" style={{ transitionDelay: '200ms' }}>
                <textarea
                  id="f-message"
                  name="message"
                  rows={3}
                  placeholder=" "
                  value={form.message}
                  onChange={onChange}
                  required
                />
                <label htmlFor="f-message">Project details</label>
                <span className="field__line" />
              </div>

              <button className="foot__submit reveal" style={{ transitionDelay: '260ms' }} type="submit">
                <span>Send message</span>
                <span className="foot__submit-arrow">→</span>
              </button>
            </>
          )}
        </form>
      </div>

      <div className="foot__bottom">
        <div className="foot__brand reveal">LUSION</div>
        <nav className="foot__links">
          {['Work', 'Studio', 'Careers', 'Contact'].map((l, i) => (
            <a
              className="foot__link reveal"
              style={{ transitionDelay: `${i * 70}ms` }}
              href="#"
              key={l}
            >
              {l}
            </a>
          ))}
        </nav>
        <div className="foot__socials">
          {['Ig', 'X', 'In', 'Be'].map((s, i) => (
            <a
              className="foot__social reveal"
              style={{ transitionDelay: `${i * 70}ms` }}
              href="#"
              key={s}
            >
              {s}
            </a>
          ))}
        </div>
      </div>

      <div className="foot__legal reveal">
        <span>© {`${2026}`} Lusion Studio. All rights reserved.</span>
        <span>Realise your creative ideas.</span>
      </div>
    </footer>
  )
}

export default Footer
