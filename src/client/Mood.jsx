import React from 'react';
import '../styles/Mood.css';
import { FaStar, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // use Link for proper routing

const Mood = () => {
  return (
    <header className="top-bar">
      <div className="left-section">
        <h1 className="logo">MoodMUSIC</h1>
        <div className="balls">
          <div className="ball"></div>
          <div className="ball"></div>
          <div className="ball"></div>
        </div>
      </div>

      <div className="center-links">
        {/* Add the Journal link here */}
        <Link to="/journal" className="journal-link">Journal</Link>
      </div>

      <div className="right-icons">
        <a href="#" className="icon-link" title="Star">
          <FaStar />
        </a>
        <a href="#" className="icon-link" title="Home">
          <FaHome />
        </a>
      </div>
    </header>
  );
};

export default Mood;
