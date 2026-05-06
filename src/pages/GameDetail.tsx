import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Star, Calendar, Share2, Play } from 'lucide-react';
import { TRAILERS } from '@/lib/mock-data';
import { TrailerCard } from '@/components/trailer/TrailerCard';

export default function GameDetail() {
  const { id } = useParams();
  const trailer = TRAILERS.find(t => t.slug === id);
  if (!trailer) return <Navigate to="/404" replace/>;

  const related = TRAILERS.filter(t => t.id !== trailer.id && t.genre === trailer.genre).slice(0, 4);

  return (
    <div className="pt-24 pb-20">
      {/* ambient bg */}
      <div className="absolute inset-x-0 top-0 h-[60vh] -z-10 overflow-hidden">
        <img src={trailer.thumbnail_url} alt="" className="w-full h-full object-cover opacity-30 blur-3xl scale-110"/>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"/>
      </div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="relative aspect-video rounded-lg overflow-hidden border-neon">
          <iframe src={trailer.video_url} className="w-full h-full" allow="autoplay; encrypted-media; fullscreen" allowFullScreen/>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mt-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <span className="inline-block text-xs font-heading uppercase tracking-wider px-3 py-1 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/50">
              {trailer.genre}
            </span>
            <h1 className="font-display font-black text-4xl md:text-6xl mt-3 text-glow-purple">{trailer.title}</h1>
            <p className="font-heading text-neon-cyan mt-2">{trailer.publisher}</p>
            <p className="mt-6 text-foreground/80 leading-relaxed">{trailer.description}</p>

            <div className="flex flex-wrap items-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-sm"><Eye size={16} className="text-neon-purple"/> {trailer.views.toLocaleString()} views</div>
              <div className="flex items-center gap-2 text-sm"><Star size={16} className="text-neon-pink"/> {trailer.rating}/5</div>
              <div className="flex items-center gap-2 text-sm"><Calendar size={16} className="text-neon-cyan"/> {trailer.release_date}</div>
              <button className="btn-ghost-cyber !py-2 !px-4 !text-xs flex items-center gap-2"><Share2 size={14}/> Share</button>
            </div>
          </div>

          <aside className="card-cyber p-6">
            <h3 className="font-heading uppercase tracking-widest text-sm text-neon-cyan mb-4">Game Info</h3>
            <dl className="space-y-3 text-sm">
              <div><dt className="text-muted-foreground">Publisher</dt><dd className="font-heading">{trailer.publisher}</dd></div>
              <div><dt className="text-muted-foreground">Genre</dt><dd className="font-heading">{trailer.genre}</dd></div>
              <div><dt className="text-muted-foreground">Release</dt><dd className="font-heading">{trailer.release_date}</dd></div>
              <div><dt className="text-muted-foreground">Rating</dt><dd className="font-heading text-neon-pink">{trailer.rating} / 5.0</dd></div>
            </dl>
          </aside>
        </motion.div>

        <section className="mt-16">
          <h2 className="font-display text-3xl text-glow-cyan mb-6">RELATED TRAILERS</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(t => <TrailerCard key={t.id} trailer={t}/>)}
          </div>
        </section>
      </div>
    </div>
  );
}
