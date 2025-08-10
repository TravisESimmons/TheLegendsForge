import React from 'react';
import CharacterSheet from './components/CharacterSheet';


function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', background: 'var(--parchment)' }}>
      <h1 style={{ marginTop: '1.5em', marginBottom: '0.5em' }}>The Legends Forge</h1>
      <div className="character-sheet-container">
        <CharacterSheet />
      </div>
    </div>
  );
}

export default App;
