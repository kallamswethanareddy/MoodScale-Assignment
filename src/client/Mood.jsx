import React from 'react';
import '../styles/Mood.css';
import { Link } from 'react-router-dom';


const Mood = () => {
  return (
    <header className="top-bar">
      <div className="left-section">
        <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
  <h1 className="logo">MoodMUSIC</h1>
</Link>

        <div className="balls">
          <div className="ball"></div>
          <div className="ball"></div>
          <div className="ball"></div>
        </div>
      </div>
    </header>
  );
};

export default Mood;
