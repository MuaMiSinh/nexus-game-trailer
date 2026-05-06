import { Link } from 'react-router-dom';
import { Eye, Star, Play } from 'lucide-react';
import type { Trailer } from '@/types';
import { TiltCard } from '@/components/animations/TiltCard';

const fmtViews = (n: number) => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `${(n/1e3).toFixed(0)}K` : `${n}`;

export function TrailerCard({ trailer }: { trailer: Trailer }) {
  return (
    <TiltCard>
      <Link to={`/game/${trailer.slug}`} className="block card-cyber group overflow-hidden h-full">
        <div className="relative aspect-video overflow-hidden">
          <img src={trailer.thumbnail_url} alt={trailer.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"/>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 rounded-full bg-neon-purple/80 flex items-center justify-center animate-glow-pulse">
              <Play size={24} className="ml-1 text-foreground"/>
            </div>
          </div>
          <span className="absolute top-2 left-2 text-[10px] font-heading uppercase tracking-wider px-2 py-1 rounded bg-neon-purple/80 text-foreground">
            {trailer.genre}
          </span>
          {trailer.featured && (
            <span className="absolute top-2 right-2 text-[10px] font-heading uppercase tracking-wider px-2 py-1 rounded bg-neon-pink/80 text-foreground animate-glow-pulse">
              Featured
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-heading font-bold text-lg leading-tight line-clamp-2 group-hover:text-neon-purple transition-colors">
            {trailer.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{trailer.publisher}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Eye size={12}/>{fmtViews(trailer.views)}</span>
            <span className="flex items-center gap-1 text-neon-cyan"><Star size={12}/>{trailer.rating}</span>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
