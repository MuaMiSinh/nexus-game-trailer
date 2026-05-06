import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from '@/types';

interface AuthCtx {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAdmin: boolean;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('nexus_user');
    if (raw) try { setUser(JSON.parse(raw)); } catch {}
  }, []);

  const login = (u: User) => { setUser(u); localStorage.setItem('nexus_user', JSON.stringify(u)); };
  const logout = () => { setUser(null); localStorage.removeItem('nexus_user'); };

  return <Ctx.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be inside AuthProvider');
  return v;
};
