import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export function ParticleBackground() {
  const [ready, setReady] = useState(false);
  useEffect(() => { initParticlesEngine(async (e) => { await loadSlim(e); }).then(() => setReady(true)); }, []);
  if (!ready) return null;
  return (
    <Particles
      id="tsparticles"
      className="fixed inset-0 -z-10 pointer-events-none"
      options={{
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        particles: {
          number: { value: 60, density: { enable: true } },
          color: { value: ['#a855f7', '#ec4899', '#06b6d4'] },
          shape: { type: 'circle' },
          opacity: { value: { min: 0.1, max: 0.5 } },
          size: { value: { min: 1, max: 3 } },
          move: { enable: true, direction: 'top', speed: 0.6, outModes: { default: 'out' } },
        },
        interactivity: {
          events: { onHover: { enable: true, mode: 'repulse' }, onClick: { enable: true, mode: 'push' } },
          modes: { repulse: { distance: 80, duration: 0.4 }, push: { quantity: 4 } },
        },
        detectRetina: true,
      }}
    />
  );
}
