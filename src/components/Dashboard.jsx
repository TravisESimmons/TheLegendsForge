import React, { useState } from 'react';
import CharacterSheet from './CharacterSheet';
import CharacterCreator from './CharacterCreator';
import DungeonTest from './DungeonTest';
import Profile from './Profile';
import DownloadSheet from './DownloadSheet';
import DustBG from './DustBG';
import './Dashboard.css';

const Dashboard = () => {
  const [tab, setTab] = useState('character');

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
        <div className="dashboard-tabs">
          <button className={tab === 'character' ? 'dashboard-tab active-tab' : 'dashboard-tab'} onClick={() => setTab('character')}>Character Creation</button>
          <button className={tab === 'dungeon' ? 'dashboard-tab active-tab' : 'dashboard-tab'} onClick={() => setTab('dungeon')}>Dungeon</button>
          <button className={tab === 'manage' ? 'dashboard-tab active-tab' : 'dashboard-tab'} onClick={() => setTab('manage')}>Management</button>
        </div>
        <div style={{ width: '100%', maxWidth: 900, minHeight: 400, background: 'rgba(255,255,255,0.04)', borderRadius: 16, boxShadow: '0 2px 16px #bfa76f22', padding: '2em 1em', marginBottom: '2em' }}>
          {tab === 'character' && (
            <>
              <CharacterCreator />
              <CharacterSheet />
            </>
          )}
          {tab === 'dungeon' && <DungeonTest />}
          {tab === 'manage' && (
            <>
              <Profile />
              <DownloadSheet />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;