import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/Journal.css';

const Journal = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entry, setEntry] = useState('');
  const [savedEntries, setSavedEntries] = useState({});
  const [mood, setMood] = useState(null);
  const [track, setTrack] = useState(null);

  const location = useLocation();
  const userId = localStorage.getItem('userId');
  const formatDate = (date) => date.toISOString().split('T')[0];

  const moodToSong = {
    happy: '/songs/happy.mp3',
    sad: '/songs/sad.mp3',
    angry: '/songs/angry.mp3',
    anxious: '/songs/anxious.mp3',
    calm: '/songs/calm.mp3',
    energetic: '/songs/energetic.mp3',
    tired: '/songs/tired.mp3',
    romantic: '/songs/love.mp3',
    confident: '/songs/cool.mp3',
    bored: '/songs/thoughtful.mp3',
  };

  // Load saved entries on mount
  useEffect(() => {
    if (!userId) return;
    const stored = localStorage.getItem(`journalEntries_${userId}`);
    if (stored) {
      setSavedEntries(JSON.parse(stored));
    }
  }, [userId]);

  // Sync mood & track when navigation state or selected date changes
  useEffect(() => {
    const key = formatDate(selectedDate);
    const fallbackEntry = savedEntries[key] || {};
    const navMood = location.state?.mood;

    const currentMood = navMood || fallbackEntry.mood || null;
    const currentText = fallbackEntry.text || '';

    setMood(currentMood);
    setEntry(currentText);

    if (currentMood) {
      const moodLower = currentMood.toLowerCase();
      const songPath = moodToSong[moodLower];
      setTrack({ name: `${currentMood} Vibes`, file: songPath });
    } else {
      setTrack(null);
    }
  }, [location.state, savedEntries, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const key = formatDate(date);
    const saved = savedEntries[key] || { text: '', mood: null };
    setEntry(saved.text);
    setMood(saved.mood);

    if (saved.mood) {
      const moodLower = saved.mood.toLowerCase();
      setTrack({ name: `${saved.mood} Vibes`, file: moodToSong[moodLower] });
    } else {
      setTrack(null);
    }
  };

  const handleSave = () => {
    if (!userId) {
      alert('Please log in to save your journal entries.');
      return;
    }

    const key = formatDate(selectedDate);
    const newEntry = {
      text: entry,
      mood,
    };

    const updatedEntries = {
      ...savedEntries,
      [key]: newEntry,
    };

    setSavedEntries(updatedEntries);
    localStorage.setItem(`journalEntries_${userId}`, JSON.stringify(updatedEntries));
    alert('Journal entry saved!');
  };

  return (
    <div className="journal-page">
      {/* Text Area */}
      <div className="journal-entry">
        <textarea
          placeholder="Write about your day..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
      </div>

      {/* Calendar & Save Button */}
      <div className="journal-calendar">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileClassName={({ date }) => {
            const key = formatDate(date);
            return savedEntries[key] ? 'has-entry' : null;
          }}
        />

        <button onClick={handleSave} className="save-button">
          Save Entry
        </button>

        {/* Audio Player */}
        {track?.file && (
          <div className="track-list" style={{ marginTop: '20px' }}>
            <h4>Now playing for: "{mood?.charAt(0).toUpperCase() + mood?.slice(1)}"</h4>
            <div className="track-bar">
              <span className="track-text">{track.name}</span>
              <audio controls style={{ width: '100%', marginTop: '10px' }}>
                <source src={track.file} type="audio/mpeg" />
                Your browser does not support the audio tag.
              </audio>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
