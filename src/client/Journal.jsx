import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/Journal.css';

const Journal = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entry, setEntry] = useState('');
  const [savedEntries, setSavedEntries] = useState({});
  const [mood, setMood] = useState('');
  const [track, setTrack] = useState(null);
  const audioRef = useRef(null);

  const location = useLocation();
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

  // Load entries and handle homepage mood on first load
  useEffect(() => {
    const stored = sessionStorage.getItem('journalEntries');
    const parsed = stored ? JSON.parse(stored) : {};
    setSavedEntries(parsed);

    const incomingMood = location.state?.mood?.toLowerCase?.();
    if (incomingMood && moodToSong[incomingMood]) {
      const today = formatDate(new Date());
      const updatedEntries = {
        ...parsed,
        [today]: {
          ...(parsed[today] || {}),
          text: parsed[today]?.text || '',
          mood: incomingMood,
        },
      };
      setMood(incomingMood);
      setTrack({ name: `${incomingMood} Vibes`, file: moodToSong[incomingMood] });
      setSavedEntries(updatedEntries);
      sessionStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    }
  }, [location.state]);

  // When date changes, load text and mood, but DO NOT change the song
  useEffect(() => {
    const key = formatDate(selectedDate);
    const saved = savedEntries[key] || { text: '', mood: '' };
    setEntry(saved.text);
    setMood(saved.mood || '');
    // Don't call setTrack — we don't want to interrupt the song
  }, [selectedDate, savedEntries]);

  // Play audio when track is changed
  useEffect(() => {
    if (audioRef.current && track?.file) {
      audioRef.current.load();
      audioRef.current.play().catch((err) => {
        console.warn('Autoplay blocked:', err);
      });
    }
  }, [track]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSave = () => {
    const key = formatDate(selectedDate);
    const newEntry = { text: entry, mood };
    const updatedEntries = { ...savedEntries, [key]: newEntry };
    setSavedEntries(updatedEntries);
    sessionStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    alert('Journal entry saved!');
  };

  const handleMoodChange = (selectedMood) => {
    setMood(selectedMood);
    const songPath = moodToSong[selectedMood.toLowerCase()];
    setTrack({ name: `${selectedMood} Vibes`, file: songPath });

    const key = formatDate(selectedDate);
    const updatedEntries = {
      ...savedEntries,
      [key]: {
        ...savedEntries[key],
        text: entry,
        mood: selectedMood,
      },
    };
    setSavedEntries(updatedEntries);
    sessionStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
  };

  return (
    <div className="journal-page">
      <div className="journal-entry">
        <textarea
          placeholder="Write about your day..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
      </div>

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

        <div className="track-list" style={{ marginTop: '20px' }}>
          <h4>
            {track?.name
              ? `Now playing: "${track.name}"`
              : 'No mood selected for this date'}
          </h4>

          <div className="track-bar">
            {track?.file ? (
              <audio
                ref={audioRef}
                controls
                style={{ width: '100%', marginTop: '10px' }}
              >
                <source src={track.file} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <div
                style={{
                  marginTop: '10px',
                  fontStyle: 'italic',
                  color: '#888',
                }}
              >
                No track loaded
              </div>
            )}
          </div>

          <div style={{ marginTop: '15px' }}>
            <label
              htmlFor="moodSelector"
              style={{ fontWeight: 'bold', color: '#4a148c' }}
            >
              Change Mood 🎧:
            </label>
            <select
              id="moodSelector"
              value={mood}
              onChange={(e) => handleMoodChange(e.target.value)}
              style={{
                marginLeft: '10px',
                padding: '8px 12px',
                borderRadius: '12px',
                border: '1px solid #ccc',
                fontSize: '1rem',
              }}
            >
              <option value="">-- Select Mood --</option>
              <option value="happy">😊 Happy</option>
              <option value="sad">😢 Sad</option>
              <option value="angry">😠 Angry</option>
              <option value="anxious">😰 Anxious</option>
              <option value="calm">😌 Calm</option>
              <option value="energetic">💥 Energetic</option>
              <option value="tired">🥱 Tired</option>
              <option value="romantic">😍 Romantic</option>
              <option value="confident">😎 Confident</option>
              <option value="bored">😐 Bored</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
