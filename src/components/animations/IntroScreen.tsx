import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function IntroScreen() {
  const [show, setShow] = useState(() => !sessionStorage.getItem('introPlayed'));

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      sessionStorage.setItem('introPlayed', '1');
      setShow(false);
    }, 3200);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[10000] bg-background flex items-center justify-center overflow-hidden"
        >
          {/* scan line */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: '100%' }}
            transition={{ duration: 1.4, ease: 'linear' }}
            className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-neon-purple to-transparent"
          />

          {/* glitch logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
            className="text-center"
          >
            <motion.h1
              animate={{ textShadow: [
                '0 0 20px hsl(271 91% 65% / 0.8)',
                '0 0 40px hsl(271 91% 65% / 1)',
                '0 0 20px hsl(271 91% 65% / 0.8)',
              ]}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="font-display font-black text-7xl md:text-9xl text-gradient-cyber glitch"
              data-text="NEXUS"
            >
              NEXUS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="font-heading uppercase tracking-[0.5em] text-neon-cyan mt-4 text-sm"
            >
              Game Trailer Hub
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
