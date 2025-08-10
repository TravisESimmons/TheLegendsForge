import React from 'react';
import CharacterSheet from './CharacterSheet';
import DustBG from './DustBG';

const Dashboard = () => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
      <DustBG />
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        justifyContent: 'flex-start',
        background: 'transparent',
      }}>
        <div className="logo-portrait" style={{ marginTop: '2em' }}>
          <img
            src="/TLF-Logo.png"
            alt="The Legends Forge Logo"
            style={{ width: '240px', height: '240px', objectFit: 'contain', borderRadius: '50%' }}
          />
        </div>
        <h1 style={{ marginTop: '0.2em', marginBottom: '0.5em', textAlign: 'center' }}>The Legends Forge</h1>
        <div className="character-sheet-container">
          <CharacterSheet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;