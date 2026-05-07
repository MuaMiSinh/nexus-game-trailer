import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from '@/types';
import { clearAuthToken, getAuthToken, meApi } from '@/lib/api';

interface AuthCtx {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAdmin: boolean;
  refreshMe: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const refreshMe = async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const { user } = await meApi();
      setUser(user);
      localStorage.setItem('nexus_user', JSON.stringify(user));
    } catch {
      clearAuthToken();
      setUser(null);
      localStorage.removeItem('nexus_user');
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem('nexus_user');
    if (raw) {
      try {
        setUser(JSON.parse(raw) as User);
      } catch {}
    }
    // nếu có token thì ưu tiên lấy user thật từ backend
    void refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (u: User) => {
    setUser(u);
    localStorage.setItem('nexus_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
    clearAuthToken();
  };

  return <Ctx.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin', refreshMe }}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be inside AuthProvider');
  return v;
};
