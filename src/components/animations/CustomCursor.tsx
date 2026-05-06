import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(!!t.closest('a, button, [role="button"], input, textarea, .cursor-target'));
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, []);

  // lerp ring
  useEffect(() => {
    let raf: number;
    const tick = () => {
      setRingPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.18,
        y: prev.y + (pos.y - prev.y) * 0.18,
      }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pos]);

  return (
    <>
      <div
        className="pointer-events-none fixed z-[9999] rounded-full transition-[width,height,background] duration-150"
        style={{
          left: pos.x, top: pos.y,
          width: hovering ? 14 : 8, height: hovering ? 14 : 8,
          transform: 'translate(-50%, -50%)',
          background: hovering ? 'hsl(var(--neon-pink))' : 'hsl(var(--neon-purple))',
          boxShadow: '0 0 12px currentColor',
          mixBlendMode: 'screen',
        }}
      />
      <div
        className="pointer-events-none fixed z-[9998] rounded-full border transition-[width,height,border-color] duration-200"
        style={{
          left: ringPos.x, top: ringPos.y,
          width: hovering ? 56 : 32, height: hovering ? 56 : 32,
          transform: 'translate(-50%, -50%)',
          borderColor: hovering ? 'hsl(var(--neon-pink) / 0.7)' : 'hsl(var(--neon-purple) / 0.6)',
          boxShadow: '0 0 16px hsl(var(--neon-purple) / 0.4)',
        }}
      />
    </>
  );
}
