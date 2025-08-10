import React, { useCallback } from 'react';
import { Particles } from '@tsparticles/react';
import { loadFull } from '@tsparticles/engine';

const ParticlesBG = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tlf-particles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: 0 },
        background: { color: { value: '#000' } },
        particles: {
          number: { value: 80, density: { enable: true, area: 800 } },
          color: { value: '#fff' },
          opacity: { value: 1, random: false },
          size: { value: 8, random: false },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            outModes: { default: 'out' },
          },
          shape: { type: 'circle' },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'repulse' },
            resize: true,
          },
          modes: {
            repulse: { distance: 100, duration: 0.6 },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticlesBG;
