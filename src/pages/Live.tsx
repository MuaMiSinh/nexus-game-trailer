import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radio, Eye, Send } from 'lucide-react';
import { LIVESTREAMS, MOCK_CHAT } from '@/lib/mock-data';
import { useAuth } from '@/context/AuthContext';
import type { LiveMessage } from '@/types';

export default function Live() {
  const { id } = useParams();
  const { user } = useAuth();

  if (id) return <LivePlayer id={id}/>;

  return (
    <div className="pt-24 pb-20 container">
      <div className="flex items-center gap-3 mb-8">
        <Radio className="text-neon-red animate-pulse"/>
        <h1 className="font-display text-4xl text-glow-pink">LIVE NOW</h1>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {LIVESTREAMS.map((s, i) => (
          <motion.div key={s.id}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <Link to={`/live/${s.id}`} className="card-cyber block overflow-hidden group">
              <div className="relative aspect-video">
                <img src={s.thumbnail_url} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded bg-neon-red text-foreground text-[10px] font-heading uppercase tracking-wider relative live-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse"/> LIVE
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded bg-background/70 text-xs">
                  <Eye size={12}/> {s.viewer_count.toLocaleString()}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-heading font-bold line-clamp-2">{s.title}</h3>
                <p className="text-xs text-neon-cyan mt-1">{s.streamer}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {user && (
        <div className="mt-12 card-cyber p-6 text-center">
          <h3 className="font-display text-xl text-gradient-cyber mb-2">Bạn muốn livestream?</h3>
          <p className="text-sm text-muted-foreground mb-4">Tạo stream và lấy stream key cho OBS</p>
          <Link to="/creator/live" className="btn-cyber inline-block">Mở Streamer Dashboard</Link>
        </div>
      )}
    </div>
  );
}

function LivePlayer({ id }: { id: string }) {
  const stream = LIVESTREAMS.find(s => s.id === id);
  const [chat, setChat] = useState<LiveMessage[]>(MOCK_CHAT);
  const [msg, setMsg] = useState('');
  const { user } = useAuth();
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [chat]);

  // Simulated incoming chat
  useEffect(() => {
    const samples = ['🔥', 'GG', 'POG', 'Hay quá!', 'Combo đỉnh', 'LFG', 'Wp wp'];
    const users = ['NeonFan', 'PixelLord', 'CyberKid', 'NinjaX', 'StreamWatcher'];
    const colors = ['hsl(271 91% 65%)', 'hsl(322 84% 60%)', 'hsl(189 94% 43%)', 'hsl(142 71% 45%)'];
    const t = setInterval(() => {
      setChat(c => [...c, {
        id: crypto.randomUUID(),
        user: users[Math.floor(Math.random() * users.length)],
        message: samples[Math.floor(Math.random() * samples.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        created_at: '',
      }].slice(-50));
    }, 3500);
    return () => clearInterval(t);
  }, []);

  if (!stream) return <div className="pt-32 container text-center text-muted-foreground">Stream không tồn tại.</div>;

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim() || !user) return;
    setChat(c => [...c, { id: crypto.randomUUID(), user: user.username, message: msg, color: 'hsl(271 91% 65%)', created_at: '' }]);
    setMsg('');
  };

  return (
    <div className="pt-20 pb-10 container">
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div>
          <div className="relative aspect-video rounded-lg overflow-hidden border-neon">
            <iframe src={stream.playback_url} className="w-full h-full" allow="autoplay; fullscreen" allowFullScreen/>
            <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded bg-neon-red font-heading uppercase text-xs tracking-wider relative live-pulse">
              <span className="w-2 h-2 rounded-full bg-foreground animate-pulse"/> Live
            </div>
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded bg-background/80 text-xs flex items-center gap-1">
              <Eye size={14}/> {stream.viewer_count.toLocaleString()} watching
            </div>
          </div>
          <h1 className="font-display text-3xl mt-4 text-glow-purple">{stream.title}</h1>
          <p className="font-heading text-neon-cyan">{stream.streamer}</p>
          <p className="text-sm text-muted-foreground mt-2">{stream.description}</p>
        </div>

        <aside className="card-cyber flex flex-col h-[600px]">
          <div className="p-3 border-b border-border font-heading uppercase text-sm tracking-wider text-neon-cyan">
            Live Chat
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {chat.map(m => (
              <div key={m.id} className="animate-fade-in-up">
                <span className="font-heading font-bold mr-2" style={{color: m.color}}>{m.user}:</span>
                <span className="text-foreground/90">{m.message}</span>
              </div>
            ))}
          </div>
          <form onSubmit={send} className="p-3 border-t border-border flex gap-2">
            <input value={msg} onChange={e=>setMsg(e.target.value)}
              placeholder={user ? 'Nhập tin nhắn...' : 'Đăng nhập để chat'}
              disabled={!user}
              className="input-cyber flex-1 !py-2 !text-sm"/>
            <button disabled={!user} className="btn-cyber !py-2 !px-3"><Send size={16}/></button>
          </form>
        </aside>
      </div>
    </div>
  );
}
