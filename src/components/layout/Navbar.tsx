import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X, User as UserIcon, LogOut, Shield, Radio } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/trailers', label: 'Trailers' },
  { to: '/live', label: 'Live' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass border-b border-neon-purple/30' : 'bg-transparent'
    }`}>
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-display font-black text-2xl text-gradient-cyber text-glow-purple">
          NEXUS
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) =>
              `font-heading uppercase tracking-wider text-sm relative py-2 transition-colors ${
                isActive ? 'text-neon-purple text-glow-purple' : 'text-foreground/70 hover:text-foreground'
              }`}>
              {n.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) =>
              `font-heading uppercase tracking-wider text-sm flex items-center gap-1 ${
                isActive ? 'text-neon-pink text-glow-pink' : 'text-neon-pink/70 hover:text-neon-pink'
              }`}>
              <Shield size={14}/> Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm font-heading text-foreground/70">{user.username}</span>
              <button onClick={() => { logout(); nav('/'); }} className="btn-ghost-cyber !py-2 !px-4 !text-xs flex items-center gap-1">
                <LogOut size={14}/> Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn-cyber !py-2 !px-4 !text-xs flex items-center gap-1">
              <UserIcon size={14}/> Login
            </Link>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X/> : <Menu/>}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-neon-purple/30 animate-fade-in-up">
          <div className="container flex flex-col gap-3 py-4">
            {NAV.map(n => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} onClick={() => setOpen(false)}
                className="font-heading uppercase py-2 text-foreground/80">{n.label}</NavLink>
            ))}
            {isAdmin && <NavLink to="/admin" onClick={() => setOpen(false)} className="font-heading uppercase py-2 text-neon-pink">Admin</NavLink>}
            {user ? (
              <button onClick={() => { logout(); setOpen(false); nav('/'); }} className="btn-ghost-cyber">Logout</button>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="btn-cyber text-center">Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
