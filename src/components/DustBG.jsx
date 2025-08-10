import React from 'react';
import './DustBG.css';

const NUM_PARTICLES = 60;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

const DustBG = () => {
  const particles = Array.from({ length: NUM_PARTICLES }).map((_, i) => {
    const size = random(6, 14);
    const left = random(0, 100);
    const duration = random(8, 18);
    const delay = random(0, 10);
    const opacity = random(0.25, 0.55);
    return (
      <div
        key={i}
        className="dust-particle"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          opacity,
        }}
      />
    );
  });

  return (
    <div className="dust-bg">
      {particles}
    </div>
  );
};

export default DustBG;
