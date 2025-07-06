import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from 'react-router-dom';

import '../styles/App.css';
import Mood from './Mood';
import Journal from './Journal';

// Mood list
const moods = [
  { mood: "Happy", emoji: "😄" },
  { mood: "Sad", emoji: "😢" },
  { mood: "Angry", emoji: "😠" },
  { mood: "Anxious", emoji: "😰" },
  { mood: "Calm", emoji: "😌" },
  { mood: "Energetic", emoji: "⚡" },
  { mood: "Tired", emoji: "😴" },
  { mood: "Romantic", emoji: "❤️" },
  { mood: "Confident", emoji: "😎" },
  { mood: "Bored", emoji: "😐" },
];

// Home component
const Home = () => {
  const navigate = useNavigate();

  const handleMoodClick = (mood) => {
    const fileName = mood.toLowerCase();
    navigate('/journal', {
      state: {
        mood,
        song: `/songs/${fileName}.mp3`, // Ensure files exist in /public/songs
      },
    });
  };

  return (
    <div className="home-section">
      <div className="floating-notes">
        {[...Array(10)].map((_, i) => (
          <span key={i} className={`note note-${i % 5}`}>
            {['🎵', '🎶', '🎧', '🎼', '🎹'][i % 5]}
          </span>
        ))}
      </div>

      <h2 className="home-greeting">How’s your day?</h2>
      <p className="home-subtext">Tap your mood and jump into journaling with music 🎶</p>

      <div className="mood-grid">
        {moods.map((item, index) => (
          <div
            key={index}
            className="mood-box"
            onClick={() => handleMoodClick(item.mood)}
          >
            <span className="emoji">{item.emoji}</span>
            <span className="mood-label">{item.mood}</span>
          </div>
        ))}
      </div>
      <div className="journal-button-wrapper">
  <Link to="/journal" className="journal-big-button">
    ✍️ Go to Journal without Music
  </Link>
</div>

    </div>
  );
};

// Main App
function App() {
  return (
    <Router>
      <div className="App">
        <Mood />

        {/* Navigation Bar without icons */}
        <nav style={{ textAlign: 'center', marginBottom: '10px' }}>
          <Link to="/" style={{ margin: '0 15px' }}>Home</Link>
          <Link to="/journal" style={{ margin: '0 15px' }}>Journal</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/journal" element={<Journal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
