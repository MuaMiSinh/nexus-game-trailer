import { Github, Twitter, Youtube, Twitch } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-neon-purple/20 mt-20 py-10 bg-card/30 backdrop-blur">
      <div className="container grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display font-black text-2xl text-gradient-cyber">NEXUS</h3>
          <p className="text-sm text-muted-foreground mt-2">Cinematic game trailer hub. Discover. Watch. Experience.</p>
        </div>
        <div>
          <h4 className="font-heading uppercase tracking-wider text-sm text-neon-cyan mb-3">Explore</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>Home</li><li>Trending</li><li>Live</li><li>Coming Soon</li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading uppercase tracking-wider text-sm text-neon-cyan mb-3">Community</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>Discord</li><li>Forum</li><li>Streamers</li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading uppercase tracking-wider text-sm text-neon-cyan mb-3">Follow</h4>
          <div className="flex gap-3 text-foreground/70">
            <Twitter size={20}/><Youtube size={20}/><Twitch size={20}/><Github size={20}/>
          </div>
        </div>
      </div>
      <div className="container mt-8 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground font-heading uppercase tracking-widest">
        © 2026 NEXUS · Built with Neon
      </div>
    </footer>
  );
}
