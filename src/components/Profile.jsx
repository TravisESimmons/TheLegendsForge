
import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tlf_characters') || '[]');
    setCharacters(saved);
  }, []);

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--fantasy-header, serif)' }}>Profile</h2>
      <h3>Saved Characters</h3>
      {characters.length === 0 && <div>No characters saved yet.</div>}
      <ul style={{ paddingLeft: 0 }}>
        {characters.map((char, idx) => (
          <li key={idx} style={{ background: '#fffbe9', margin: '0.5em 0', borderRadius: 8, padding: 12, color: '#7c5e2a', listStyle: 'none' }}>
            <b>{char.name}</b> ({char.race} {char.class})<br />
            <span style={{ fontSize: '0.95em' }}>
              Abilities: {Object.entries(char.abilities).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join(', ')}<br />
              Skills: {char.skills.join(', ')}<br />
              Equipment: {char.equipment.join(', ')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
