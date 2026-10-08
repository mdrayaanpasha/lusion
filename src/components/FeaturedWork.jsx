import React from 'react'
import './FeaturedWork.css'

const TAGS = 'CONCEPT • WEB • DESIGN • DEVELOPMENT • 3D • ANIMATION'

const PROJECTS = [
  { title: 'Oryzo AI', bg: 'linear-gradient(135deg, #3a4a3f 0%, #1d241f 100%)' },
  { title: 'Atlas Motion', bg: 'linear-gradient(135deg, #8aa4c8 0%, #d8b48c 100%)' },
  { title: 'Nova Studio', bg: 'linear-gradient(135deg, #5b4bff 0%, #9b6bff 100%)' },
  { title: 'Lumen Labs', bg: 'linear-gradient(135deg, #ff8a5c 0%, #ffcf5c 100%)' },
  { title: 'Drift Collective', bg: 'linear-gradient(135deg, #1f2937 0%, #4b5bd4 100%)' },
  { title: 'Pulse Interactive', bg: 'linear-gradient(135deg, #ff4d6d 0%, #ff9a8b 100%)' },
  { title: 'Verge Reality', bg: 'linear-gradient(135deg, #2bb3a3 0%, #0f5c63 100%)' },
  { title: 'Halo Systems', bg: 'linear-gradient(135deg, #6b7cff 0%, #c6d4ff 100%)' },
]

const FeaturedWork = () => {
  return (
    <section className="work">
      <div className="work__head">
        <h2 className="work__title">Featured Work</h2>
        <p className="work__intro">
          A SELECTION OF IMMERSIVE DIGITAL EXPERIENCES CREATED FOR AMBITIOUS
          BRANDS AND FORWARD THINKING TEAMS.
        </p>
      </div>

      <div className="work__grid">
        {PROJECTS.map((proj) => (
          <a className="card" href="#project" key={proj.title}>
            <div className="card__media" style={{ background: proj.bg }}>
              <div className="card__grain" />
            </div>
            <div className="card__tags">{TAGS}</div>
            <div className="card__name">
              <span className="card__arrow" aria-hidden="true">→</span>
              <span className="card__label">{proj.title}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

export default FeaturedWork
