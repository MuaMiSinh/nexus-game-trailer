import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, Search, TrendingUp, Sparkles } from 'lucide-react';
import { TRAILERS, GENRES } from '@/lib/mock-data';
import { TrailerCard } from '@/components/trailer/TrailerCard';
import { SmartVideoPlayer } from '@/components/media/SmartVideoPlayer';

export default function Home() {
  const featured = TRAILERS.filter(t => t.featured);
  const [slide, setSlide] = useState(0);
  const [genre, setGenre] = useState<string>('All');
  const [sort, setSort] = useState<'newest' | 'views' | 'featured'>('newest');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % featured.length), 5000);
    return () => clearInterval(t);
  }, [featured.length]);

  const list = useMemo(() => {
    let arr = [...TRAILERS];
    if (genre !== 'All') arr = arr.filter(t => t.genre === genre);
    if (search) arr = arr.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'views') arr.sort((a,b) => b.views - a.views);
    else if (sort === 'featured') arr.sort((a,b) => Number(b.featured) - Number(a.featured));
    else arr.sort((a,b) => +new Date(b.created_at) - +new Date(a.created_at));
    return arr;
  }, [genre, sort, search]);

  const hero = featured[slide];

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <motion.div
          key={hero.id}
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img src={hero.thumbnail_url} alt={hero.title} className="w-full h-full object-cover" style={{filter:'brightness(0.5) blur(1px)'}}/>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20"/>
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent"/>
        </motion.div>

        <div className="container relative z-10 pt-20">
          <motion.div key={hero.id + 'text'}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-pink/20 border border-neon-pink/50 mb-6 animate-glow-pulse">
              <span className="w-2 h-2 rounded-full bg-neon-pink animate-pulse"/>
              <span className="font-heading uppercase tracking-widest text-xs text-neon-pink">New Release</span>
            </div>
            <p className="font-heading uppercase tracking-[0.3em] text-neon-cyan text-sm mb-4">Nexus Presents</p>
            <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-none text-foreground text-glow-purple max-w-4xl">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-foreground/70 text-lg">{hero.description}</p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to={`/game/${hero.slug}`} className="btn-cyber flex items-center gap-2">
                <Play size={18}/> Watch Trailer
              </Link>
              <a href="#trailers" className="btn-ghost-cyber">Explore More</a>
            </div>
          </motion.div>

          {/* slide controls */}
          <div className="flex items-center gap-4 mt-12">
            <button onClick={() => setSlide(s => (s - 1 + featured.length) % featured.length)}
              className="w-10 h-10 rounded-full glass flex items-center justify-center"><ChevronLeft size={18}/></button>
            <div className="flex gap-2">
              {featured.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)}
                  className={`h-1 transition-all rounded-full ${i === slide ? 'w-12 bg-neon-purple' : 'w-6 bg-foreground/30'}`}/>
              ))}
            </div>
            <button onClick={() => setSlide(s => (s + 1) % featured.length)}
              className="w-10 h-10 rounded-full glass flex items-center justify-center"><ChevronRight size={18}/></button>
          </div>
        </div>
      </section>

      {/* FEATURED VIDEO */}
      <section className="container -mt-16 relative z-20">
        <div className="card-cyber p-4 md:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="font-display text-2xl md:text-3xl text-glow-cyan">WATCH FEATURED TRAILER</h2>
            <Link to={`/game/${hero.slug}`} className="btn-ghost-cyber !py-2 !px-4 !text-xs">
              Open Detail
            </Link>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden border border-neon-cyan/30">
            <SmartVideoPlayer
              url={hero.video_url}
              title={hero.title}
              className="w-full h-full"
              autoPlay
              muted
            />
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <section className="container py-20">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="text-neon-pink"/>
          <h2 className="font-display text-3xl md:text-4xl text-glow-pink">TRENDING NOW</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.slice(0,3).map((t, i) => (
            <motion.div key={t.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <TrailerCard trailer={t}/>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TRAILER LIST */}
      <section id="trailers" className="container py-20">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="text-neon-cyan"/>
          <h2 className="font-display text-3xl md:text-4xl text-glow-cyan">ALL TRAILERS</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search trailers..." className="input-cyber pl-10"/>
          </div>
          <select value={sort} onChange={e=>setSort(e.target.value as any)} className="input-cyber md:w-48">
            <option value="newest">Newest</option>
            <option value="views">Most Viewed</option>
            <option value="featured">Featured</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {GENRES.map(g => (
            <button key={g} onClick={()=>setGenre(g)}
              className={`px-4 py-1.5 rounded-full text-xs font-heading uppercase tracking-wider transition-all ${
                genre === g ? 'bg-gradient-cyber text-foreground shadow-[var(--shadow-neon-purple)]'
                : 'bg-muted text-muted-foreground hover:bg-neon-purple/20 hover:text-foreground'
              }`}>{g}</button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {list.map((t, i) => (
            <motion.div key={t.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: Math.min(i, 6) * 0.05 }}>
              <TrailerCard trailer={t}/>
            </motion.div>
          ))}
        </div>
        {list.length === 0 && (
          <p className="text-center text-muted-foreground py-12 font-heading">No trailers found.</p>
        )}
      </section>
    </div>
  );
}
