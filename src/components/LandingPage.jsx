import React from 'react';

const LandingPage = ({ onSignIn, onSignUp }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', background: 'var(--parchment)' }}>
    <div className="logo-portrait" style={{ marginTop: '3em' }}>
      <img
        src="/TLF-Logo.png"
        alt="The Legends Forge Logo"
        style={{ width: '200px', height: '200px', objectFit: 'contain', borderRadius: '50%' }}
      />
    </div>
    <h1 style={{ marginTop: '0.2em', marginBottom: '0.5em' }}>The Legends Forge</h1>
    <p style={{ maxWidth: 500, textAlign: 'center', fontSize: '1.2em', margin: '1.5em 0' }}>
      Build, test, and manage your D&D 5e characters with a modern, game-inspired web app. Create heroes, explore dungeons, and bring your adventures to life!
    </p>
    <div style={{ display: 'flex', gap: '1em' }}>
      <button onClick={onSignIn} style={{ fontSize: '1.1em', padding: '0.7em 2em', borderRadius: 8, background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px #7c5e2a44' }}>
        Sign In
      </button>
      <button onClick={onSignUp} style={{ fontSize: '1.1em', padding: '0.7em 2em', borderRadius: 8, background: 'var(--panel-border)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px #bfa76f44' }}>
        Sign Up
      </button>
    </div>
  </div>
);

export default LandingPage;
