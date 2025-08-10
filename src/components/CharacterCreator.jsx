


// --- AbilityScoresStep with Dice Roller and Point Buy ---
const ABILITIES = ["str", "dex", "con", "int", "wis", "cha"];
const ABILITY_LABELS = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma"
};
const POINT_BUY_START = 27;
const POINT_BUY_COST = {8:0,9:1,10:2,11:3,12:4,13:5,14:7,15:9};

function roll4d6DropLowest() {
  const rolls = Array.from({ length: 4 }, () => Math.ceil(Math.random() * 6));
  rolls.sort((a, b) => a - b);
  return { rolls, total: rolls[1] + rolls[2] + rolls[3] };
}








// Google-style SVG D20 with bouncy/rotating animation and always-centered number
function AnimatedDie({ value, rolling, dropped }) {
  const [showValue, setShowValue] = React.useState(value);
  const [anim, setAnim] = React.useState(false);
  React.useEffect(() => {
    if (rolling) {
      setAnim(true);
      // Show random numbers during roll
      let frame = 0;
      const interval = setInterval(() => {
        setShowValue(Math.ceil(Math.random() * 20));
        frame++;
      }, 60);
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setShowValue(value);
        setAnim(false);
      }, 2180);
      return () => { clearInterval(interval); clearTimeout(timeout); };
    } else {
      setShowValue(value);
      setAnim(false);
    }
  }, [rolling, value]);

  // Animation class for the die group
  const dieClass = anim ? 'd20-rolling-force' : '';

  // Inject keyframes and animation class only once, with !important and unique name
  React.useEffect(() => {
    if (!document.getElementById('d20-spin-style-force')) {
      const style = document.createElement('style');
      style.id = 'd20-spin-style-force';
      style.innerHTML = `
        @keyframes d20-spin-roll-force {
          0% { transform: scale(1.1) rotate(0deg); }
          10% { transform: scale(1.18) rotate(90deg); }
          20% { transform: scale(0.98) rotate(180deg); }
          30% { transform: scale(1.13) rotate(270deg); }
          40% { transform: scale(1.05) rotate(360deg); }
          50% { transform: scale(1.15) rotate(540deg); }
          60% { transform: scale(1.02) rotate(630deg); }
          70% { transform: scale(1.09) rotate(720deg); }
          80% { transform: scale(1.01) rotate(740deg); }
          90% { transform: scale(1.06) rotate(760deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .d20-rolling-force {
          animation: d20-spin-roll-force 2.18s cubic-bezier(.4,2,.6,1) !important;
          transform-origin: 50% 50% !important;
          transform-box: fill-box !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const dieColor = dropped ? '#e7d3b1' : '#fffbe9';
  const edgeColor = dropped ? '#bfa76f' : '#7c5e2a';
  const textColor = dropped ? '#bfa76f' : '#7c5e2a';
  const dieSize = 120;
  return (
    <span
      style={{
        display: 'inline-block',
        margin: '0 18px',
        opacity: dropped ? 0.5 : 1,
        filter: dropped ? 'grayscale(0.7) brightness(1.1)' : 'none',
        verticalAlign: 'middle',
        width: dieSize,
        height: dieSize,
      }}
    >
      <svg
        width={dieSize}
        height={dieSize}
        viewBox="0 0 100 100"
        style={{
          display: 'block',
          margin: '0 auto',
          overflow: 'visible',
        }}
      >
        <g className={dieClass}>
          <polygon
            points="50,5 90,25 95,70 70,95 30,95 5,70 10,25"
            fill={dieColor}
            stroke={edgeColor}
            strokeWidth="3"
          />
          {/* Decorative lines for D20 look */}
          <polyline points="50,5 70,95" stroke={edgeColor} strokeWidth="2" fill="none" />
          <polyline points="50,5 30,95" stroke={edgeColor} strokeWidth="2" fill="none" />
          <polyline points="50,5 95,70" stroke={edgeColor} strokeWidth="2" fill="none" />
          <polyline points="50,5 5,70" stroke={edgeColor} strokeWidth="2" fill="none" />
          <polyline points="10,25 70,95" stroke={edgeColor} strokeWidth="1.5" fill="none" />
          <polyline points="90,25 30,95" stroke={edgeColor} strokeWidth="1.5" fill="none" />
          <polyline points="10,25 95,70" stroke={edgeColor} strokeWidth="1.5" fill="none" />
          <polyline points="90,25 5,70" stroke={edgeColor} strokeWidth="1.5" fill="none" />
          <text
            x="50"
            y="60"
            textAnchor="middle"
            fontSize="2.8em"
            fontWeight="bold"
            fill={textColor}
            style={{
              textShadow: '0 2px 8px #bfa76f88, 0 0px 2px #fffbe9',
              fontFamily: 'serif',
              userSelect: 'none',
              dominantBaseline: 'middle',
              pointerEvents: 'none',
            }}
          >
            {showValue}
          </text>
        </g>
      </svg>
    </span>
  );
}

// Add D20 spin animation to the page


function DiceRollDisplay({ rolls, total, rolling }) {
  // rolls: array of 4 numbers, sorted ascending (lowest first)
  return (
    <div style={{ fontSize: '1.1em', marginTop: 4 }}>
      {rolls.length > 0 && (
        <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          {rolls.map((r, i) => (
            <AnimatedDie key={i} value={r} rolling={rolling} dropped={i === 0} />
          ))}
        </div>
      )}
      <div style={{ fontWeight: 'bold', color: '#bfa76f', marginTop: 2 }}>Total: {total}</div>
    </div>
  );
}


function AbilityScoresStep({ character, setCharacter }) {
  const [mode, setMode] = useState('roller'); // 'roller' or 'pointbuy'
  // Dice roller state
  const [rolls, setRolls] = useState([]); // Array of {rolls, total}
  const [assigned, setAssigned] = useState({}); // ability: value
  const [rolling, setRolling] = useState(false);
  // Point buy state
  const [pbScores, setPbScores] = useState({ str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 });

  // Dice roll sound
  const diceAudioRef = React.useRef(null);
  // Unlock audio on first user gesture (required by some browsers)
  useEffect(() => {
    const unlock = () => {
      if (diceAudioRef.current) {
        diceAudioRef.current.play().catch(() => {});
        diceAudioRef.current.pause();
        diceAudioRef.current.currentTime = 0;
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  // --- Dice Roller Logic ---
  function handleRollAll() {
    // Play dice sound (with fallback for play() promise)
    if (diceAudioRef.current) {
      try {
        diceAudioRef.current.currentTime = 0;
        const playPromise = diceAudioRef.current.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.catch(() => {});
        }
      } catch {}
    }
    setRolling(true);
    setTimeout(() => {
      const newRolls = [];
      for (let i = 0; i < 6; i++) newRolls.push(roll4d6DropLowest());
      setRolls(newRolls);
      setAssigned({});
      setRolling(false);
    }, 2180);
  }
  function assignRollToAbility(rollIdx, ability) {
    if (assigned[ability] !== undefined) return;
    const used = Object.values(assigned);
    const value = rolls[rollIdx].total;
    if (used.includes(value)) return;
    setAssigned(a => {
      const next = { ...a, [ability]: value };
      if (Object.keys(next).length === 6) {
        setCharacter(c => ({ ...c, abilities: next }));
      }
      return next;
    });
  }
  function resetRolls() {
    setRolls([]);
    setAssigned({});
    setCharacter(c => ({ ...c, abilities: { str: '', dex: '', con: '', int: '', wis: '', cha: '' } }));
  }

  // --- Point Buy Logic ---
  function pbTotalCost(scores) {
    return Object.values(scores).reduce((sum, v) => sum + POINT_BUY_COST[v], 0);
  }
  function pbChange(ability, delta) {
    setPbScores(scores => {
      const next = { ...scores, [ability]: Math.max(8, Math.min(15, scores[ability] + delta)) };
      if (pbTotalCost(next) <= POINT_BUY_START) {
        setCharacter(c => ({ ...c, abilities: next }));
        return next;
      }
      return scores;
    });
  }
  function pbReset() {
    setPbScores({ str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 });
    setCharacter(c => ({ ...c, abilities: { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 } }));
  }

  // --- UI ---
  return (
    <div
      style={{
        background: '#f3e3c3',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        maxWidth: 900,
        minWidth: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        boxSizing: 'border-box',
        width: '100%',
        overflow: 'visible',
      }}
    >
      {/* Dice roll sound effect */}
      <audio ref={diceAudioRef} src="/dice-roll.mp3" preload="auto" />
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
        <button
          style={{ background: mode === 'roller' ? '#bfa76f' : '#fffbe9', color: '#7c5e2a', border: '1.5px solid #bfa76f', borderRadius: 6, padding: '4px 12px', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => setMode('roller')}
        >Roll Dice</button>
        <button
          style={{ background: mode === 'pointbuy' ? '#bfa76f' : '#fffbe9', color: '#7c5e2a', border: '1.5px solid #bfa76f', borderRadius: 6, padding: '4px 12px', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => setMode('pointbuy')}
        >Point Buy</button>
      </div>

      {mode === 'roller' && (
        <div>
          <div style={{ marginBottom: 8 }}>
            <button onClick={handleRollAll} disabled={rolling} style={{ background: '#7c5e2a', color: '#fffbe9', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 'bold', cursor: 'pointer' }}>Roll 4d6 (Drop Lowest) x6</button>
            <button onClick={resetRolls} style={{ marginLeft: 12, background: '#fffbe9', color: '#7c5e2a', border: '1.5px solid #bfa76f', borderRadius: 6, padding: '6px 12px', fontWeight: 'bold', cursor: 'pointer' }}>Reset</button>
          </div>
          {rolls.length === 6 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 12,
                width: '100%',
                maxWidth: 820,
                boxSizing: 'border-box',
              }}
            >
              {rolls.map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: '#fffbe9',
                    borderRadius: 8,
                    padding: 12,
                    width: '100%',
                    maxWidth: 700,
                    minWidth: 0,
                    textAlign: 'center',
                    border: '1.5px solid #bfa76f',
                    marginBottom: 8,
                    boxShadow: '0 2px 8px #bfa76f22',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ fontWeight: 'bold', color: '#7c5e2a', marginBottom: 6 }}>Roll {i + 1}</div>
                  <div
                    style={{
                      width: '100%',
                      minWidth: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 2,
                      maxWidth: '100%',
                    }}
                  >
                    <DiceRollDisplay rolls={r.rolls} total={r.total} rolling={rolling} />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <select
                      value={Object.entries(assigned).find(([k, v]) => v === r.total)?.[0] || ''}
                      onChange={e => assignRollToAbility(i, e.target.value)}
                      disabled={!!Object.entries(assigned).find(([k, v]) => v === r.total)}
                      style={{
                        background: '#fffbe9',
                        color: '#7c5e2a',
                        border: '1.5px solid #bfa76f',
                        borderRadius: 6,
                        padding: '6px 16px',
                        fontWeight: 'bold',
                        fontSize: '1.1em',
                        fontFamily: 'inherit',
                        boxShadow: '0 1px 8px #bfa76f22',
                        cursor: 'pointer',
                        outline: 'none',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        marginTop: 2,
                        marginBottom: 2,
                        minWidth: 120,
                        textAlign: 'center',
                        maxWidth: '100%',
                      }}
                    >
                      <option value="">Assign...</option>
                      {ABILITIES.filter(a => assigned[a] === undefined).map(a => (
                        <option key={a} value={a}>{ABILITY_LABELS[a]}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
            {ABILITIES.map(a => (
              <div key={a} style={{ background: '#fffbe9', borderRadius: 8, padding: 8, minWidth: 80, border: '1.5px solid #bfa76f', textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', color: '#7c5e2a' }}>{ABILITY_LABELS[a]}</div>
                <div style={{ fontSize: '1.2em', color: '#7c5e2a', margin: 4 }}>{assigned[a] !== undefined ? assigned[a] : '-'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === 'pointbuy' && (
        <div>
          <div style={{ marginBottom: 8, color: '#7c5e2a', fontWeight: 'bold' }}>Points Remaining: {POINT_BUY_START - pbTotalCost(pbScores)}</div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {ABILITIES.map(a => (
              <div key={a} style={{ background: '#fffbe9', borderRadius: 8, padding: 8, minWidth: 90, border: '1.5px solid #bfa76f', textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', color: '#7c5e2a' }}>{ABILITY_LABELS[a]}</div>
                <div style={{ fontSize: '1.2em', color: '#7c5e2a', margin: 4 }}>{pbScores[a]}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                  <button onClick={() => pbChange(a, -1)} disabled={pbScores[a] <= 8} style={{ width: 24, height: 24, borderRadius: 12, border: '1.5px solid #bfa76f', background: '#fffbe9', color: '#7c5e2a', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                  <button onClick={() => pbChange(a, 1)} disabled={pbScores[a] >= 15 || pbTotalCost({ ...pbScores, [a]: pbScores[a] + 1 }) > POINT_BUY_START} style={{ width: 24, height: 24, borderRadius: 12, border: '1.5px solid #bfa76f', background: '#fffbe9', color: '#7c5e2a', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                </div>
                <div style={{ fontSize: '0.8em', color: '#bfa76f', marginTop: 2 }}>Cost: {POINT_BUY_COST[pbScores[a]]}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <button onClick={pbReset} style={{ background: '#fffbe9', color: '#7c5e2a', border: '1.5px solid #bfa76f', borderRadius: 6, padding: '6px 16px', fontWeight: 'bold', cursor: 'pointer' }}>Reset</button>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';

const steps = [
  'Basic Info',
  'Race & Class',
  'Ability Scores',
  'Skills',
  'Equipment',
  'Summary',
];

const initialCharacter = {
  name: '',
  race: '',
  class: '',
  abilities: { str: '', dex: '', con: '', int: '', wis: '', cha: '' },
  skills: [],
  equipment: [],
};

const races = [
  { name: 'Human', img: 'https://www.dndbeyond.com/avatars/thumbnails/7/312/420/618/636284772385729422.jpeg', desc: 'Versatile and ambitious, humans are found everywhere.' },
  { name: 'Elf', img: 'https://www.dndbeyond.com/avatars/thumbnails/7/317/420/618/636284773025210584.jpeg', desc: 'Graceful, magical, and long-lived, elves are attuned to nature.' },
  { name: 'Dwarf', img: 'https://www.dndbeyond.com/avatars/thumbnails/7/314/420/618/636284772718409102.jpeg', desc: 'Stout and hardy, dwarves are known for their resilience and craftsmanship.' },
  { name: 'Halfling', img: 'https://www.dndbeyond.com/avatars/thumbnails/7/319/420/618/636284773447675043.jpeg', desc: 'Small, lucky, and cheerful, halflings love comfort and adventure.' },
  { name: 'Orc', img: 'https://www.dndbeyond.com/avatars/thumbnails/7/321/420/618/636284773789727553.jpeg', desc: 'Strong and fierce, orcs are driven by passion and power.' },
];
const classes = [
  { name: 'Fighter', img: 'https://www.dndbeyond.com/avatars/thumbnails/7/350/420/618/636284776447675043.jpeg', desc: 'Masters of martial combat, skilled with weapons and armor.' },
  { name: 'Wizard', img: 'https://www.dndbeyond.com/avatars/thumbnails/7/377/420/618/636284778109902135.jpeg', desc: 'Scholars of arcane magic, wielders of powerful spells.' },
  { name: 'Rogue', img: 'https://www.dndbeyond.com/avatars/thumbnails/7/372/420/618/636284777899318010.jpeg', desc: 'Stealthy and dexterous, experts in skills and trickery.' },
  { name: 'Cleric', img: 'https://www.dndbeyond.com/avatars/thumbnails/7/353/420/618/636284776721043909.jpeg', desc: 'Divine agents, healers, and warriors of faith.' },
  { name: 'Ranger', img: 'https://www.dndbeyond.com/avatars/thumbnails/7/370/420/618/636284777599916522.jpeg', desc: 'Warriors of the wild, skilled in tracking and archery.' },
];

function CharacterCreator() {
  const [step, setStep] = useState(0);
  const [character, setCharacter] = useState(() => {
    const saved = localStorage.getItem('tlf_character');
    return saved ? JSON.parse(saved) : initialCharacter;
  });

  const next = () => {
    if (step < steps.length - 1) setStep(s => s + 1);
    else {
      // Save character to localStorage
      const allChars = JSON.parse(localStorage.getItem('tlf_characters') || '[]');
      localStorage.setItem('tlf_characters', JSON.stringify([...allChars, character]));
      localStorage.removeItem('tlf_character');
      setStep(0);
      setCharacter(initialCharacter);
      alert('Character saved!');
    }
  };
  const prev = () => setStep(s => Math.max(0, s - 1));

  const handleChange = e => {
    const { name, value } = e.target;
    setCharacter(c => ({ ...c, [name]: value }));
    localStorage.setItem('tlf_character', JSON.stringify({ ...character, [name]: value }));
  };

  return (
    <div
      style={{
        maxWidth: 900,
        width: '100%',
        margin: '40px auto',
        background: '#f3e3c3',
        borderRadius: 18,
        boxShadow: '0 4px 32px #bfa76f33',
        padding: 36,
        boxSizing: 'border-box',
        minWidth: 0,
      }}
    >
      <>
        <h2 style={{ fontFamily: 'var(--fantasy-header, serif)', marginBottom: '0.7em', fontSize: '2.1em', letterSpacing: 1 }}>Character Creator</h2>
        <div style={{ marginBottom: '1.3em', fontSize: '1.1em' }}>
          {steps.map((s, i) => (
            <span key={s} style={{
              fontWeight: i === step ? 'bold' : 'normal',
              color: i === step ? '#7c5e2a' : '#bfa76f',
              marginRight: 16,
              fontSize: i === step ? '1.08em' : '1em',
              textShadow: i === step ? '0 1px 4px #bfa76f55' : 'none',
            }}>{s}{i < steps.length - 1 && ' > '}</span>
          ))}
        </div>
        {step === 0 && (
          <div style={{ margin: '36px 0 32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ fontSize: '1.2em', color: '#7c5e2a', fontWeight: 600, marginBottom: 12 }}>Name:</label>
            <input name="name" value={character.name} onChange={handleChange}
              style={{ fontSize: '1.25em', padding: '10px 18px', borderRadius: 8, border: '2px solid #bfa76f', background: '#fffbe9', color: '#7c5e2a', fontFamily: 'inherit', width: 220, marginBottom: 8, boxShadow: '0 1px 8px #bfa76f22' }}
            />
          </div>
        )}
        {step === 1 && (
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            <div>
              <h3 style={{ fontFamily: 'var(--fantasy-header, serif)', color: '#7c5e2a', marginBottom: 8 }}>Choose Race</h3>
              <div style={{ display: 'flex', gap: 16 }}>
                {races.map(r => (
                  <div
                    key={r.name}
                    onClick={() => setCharacter(c => ({ ...c, race: r.name }))}
                    style={{
                      border: character.race === r.name ? '3px solid #7c5e2a' : '2px solid #bfa76f',
                      borderRadius: 12,
                      background: character.race === r.name ? '#fffbe9' : '#f3e3c3',
                      boxShadow: character.race === r.name ? '0 2px 12px #bfa76f55' : '0 1px 4px #bfa76f22',
                      cursor: 'pointer',
                      width: 110,
                      textAlign: 'center',
                      padding: 8,
                      transition: 'all 0.2s',
                    }}
                  >
                    <img src={r.img} alt={r.name} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', marginBottom: 4 }} />
                    <div style={{ fontWeight: 'bold', color: '#7c5e2a' }}>{r.name}</div>
                    <div style={{ fontSize: '0.85em', color: '#7c5e2a', opacity: 0.8 }}>{r.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--fantasy-header, serif)', color: '#7c5e2a', marginBottom: 8 }}>Choose Class</h3>
              <div style={{ display: 'flex', gap: 16 }}>
                {classes.map(c => (
                  <div
                    key={c.name}
                    onClick={() => setCharacter(ch => ({ ...ch, class: c.name }))}
                    style={{
                      border: character.class === c.name ? '3px solid #7c5e2a' : '2px solid #bfa76f',
                      borderRadius: 12,
                      background: character.class === c.name ? '#fffbe9' : '#f3e3c3',
                      boxShadow: character.class === c.name ? '0 2px 12px #bfa76f55' : '0 1px 4px #bfa76f22',
                      cursor: 'pointer',
                      width: 110,
                      textAlign: 'center',
                      padding: 8,
                      transition: 'all 0.2s',
                    }}
                  >
                    <img src={c.img} alt={c.name} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', marginBottom: 4 }} />
                    <div style={{ fontWeight: 'bold', color: '#7c5e2a' }}>{c.name}</div>
                    <div style={{ fontSize: '0.85em', color: '#7c5e2a', opacity: 0.8 }}>{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            {/* AbilityScoresStep should be defined or imported above */}
            <AbilityScoresStep character={character} setCharacter={setCharacter} />
          </div>
        )}
        {step === 3 && (
          <div>
            <label>Skills (comma separated):<br />
              <input
                name="skills"
                value={character.skills.join(', ')}
                onChange={e => setCharacter(c => ({ ...c, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
              />
            </label>
          </div>
        )}
        {step === 4 && (
          <div>
            <label>Equipment (comma separated):<br />
              <input
                name="equipment"
                value={character.equipment.join(', ')}
                onChange={e => setCharacter(c => ({ ...c, equipment: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
              />
            </label>
          </div>
        )}
        {step === 5 && (
          <div style={{ background: '#fffbe9', borderRadius: 8, padding: 16, color: '#7c5e2a' }}>
            <h3>Summary</h3>
            <div><b>Name:</b> {character.name}</div>
            <div><b>Race:</b> {character.race}</div>
            <div><b>Class:</b> {character.class}</div>
            <div><b>Abilities:</b> {Object.entries(character.abilities).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join(', ')}</div>
            <div><b>Skills:</b> {character.skills.join(', ')}</div>
            <div><b>Equipment:</b> {character.equipment.join(', ')}</div>
          </div>
        )}
        <div style={{ marginTop: 32, display: 'flex', gap: 24, justifyContent: 'center' }}>
          <button
            onClick={prev}
            disabled={step === 0}
            style={{
              background: step === 0 ? '#e7d3b1' : '#bfa76f',
              color: '#7c5e2a',
              border: '2.5px solid #7c5e2a',
              borderRadius: 10,
              fontWeight: 'bold',
              fontSize: '1.1em',
              padding: '10px 28px',
              cursor: step === 0 ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 12px #bfa76f33',
              transition: 'background 0.2s, color 0.2s',
            }}
          >Back</button>
          <button
            onClick={next}
            style={{
              background: '#7c5e2a',
              color: '#fffbe9',
              border: '2.5px solid #bfa76f',
              borderRadius: 10,
              fontWeight: 'bold',
              fontSize: '1.1em',
              padding: '10px 28px',
              cursor: 'pointer',
              boxShadow: '0 2px 12px #bfa76f33',
              transition: 'background 0.2s, color 0.2s',
            }}
          >{step === steps.length - 1 ? 'Finish' : 'Next'}</button>
        </div>
      </>
    </div>
  );

}

export default CharacterCreator;


