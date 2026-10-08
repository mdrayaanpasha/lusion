import React from 'react'
import ConnectPage from '../models/connectors.jsx';
import BoldIdeas from '../components/BoldIdeas.jsx';
import FeaturedWork from '../components/FeaturedWork.jsx';

const Home = () => {
  return (
    <>
      <div className="hero-3d">
        <ConnectPage />
        <div className="hero-scroll">
          <span className="hero-scroll__plus">+</span>
          <span className="hero-scroll__text">SCROLL TO EXPLORE</span>
          <span className="hero-scroll__plus">+</span>
        </div>
      </div>
      <BoldIdeas />
      <FeaturedWork />
    </>
  )
}

export default Home;