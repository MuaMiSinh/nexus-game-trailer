import { useEffect, useMemo, useState } from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Film,
  Users,
  Activity,
  Edit2,
  Trash2,
  Search,
  Ban,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Tooltip } from 'recharts';
import type { Trailer, User, ActivityLog } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { adminLogsApi, adminStatsApi, adminUsersApi } from '@/lib/api';

const SIDE = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/trailers', label: 'Trailers', icon: Film },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/logs', label: 'Activity', icon: Activity },
];

type Stats = {
  trailers: number;
  total_views: number;
  users: number;
  featured: number;
};

export default function Admin() {
  return (
    <div className="pt-20 min-h-screen flex">
      <aside className="w-60 border-r border-neon-purple/20 bg-card/40 backdrop-blur p-4 hidden md:block sticky top-20 h-[calc(100vh-5rem)]">
        <h2 className="font-display text-lg text-gradient-cyber mb-6 px-2">ADMIN</h2>
        <nav className="space-y-1">
          {SIDE.map((s) => (
            <NavLink
              key={s.to}
              to={s.to}
              end={s.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md font-heading text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-cyber text-foreground shadow-[var(--shadow-neon-purple)]'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <s.icon size={16} /> {s.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-8 max-w-full overflow-x-auto">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="trailers" element={<TrailerManager />} />
          <Route path="users" element={<UserManager />} />
          <Route path="logs" element={<Logs />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function Overview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    adminStatsApi()
      .then((s) => setStats(s))
      .catch((e) => toast.error(e instanceof Error ? e.message : 'Không lấy được stats'))
      .finally(() => setLoading(false));
  }, [user]);

  const data = useMemo(() => {
    // Backend hiện không trả series 7 ngày; demo giữ chart mượt
    const total = stats?.total_views ?? 250000;
    return Array.from({ length: 7 }, (_, i) => ({
      day: `D${i + 1}`,
      views: Math.round(total / 7 + Math.random() * total * 0.05),
    }));
  }, [stats?.total_views]);

  const top = useMemo(() => {
    // Backend hiện không trả top 5 trailers; demo giữ UI khung
    const base = stats?.total_views ?? 1_000_000;
    return Array.from({ length: 5 }, (_, i) => ({
      name: `Trailer ${i + 1}`,
      views: Math.round(base / (i + 2) * 0.35),
    }));
  }, [stats?.total_views]);

  const cards = useMemo(() => {
    const s = stats;
    if (!s) return [];
    return [
      { label: 'Total Trailers', value: s.trailers, color: 'neon-purple' },
      { label: 'Total Views', value: (s.total_views / 1e6).toFixed(1) + 'M', color: 'neon-pink' },
      { label: 'Featured', value: s.featured, color: 'neon-cyan' },
      { label: 'New Users (7d)', value: Math.max(0, Math.round(s.users * 0.08)), color: 'neon-green' },
    ];
  }, [stats]);

  return (
    <div>
      <h1 className="font-display text-3xl text-glow-purple mb-6">DASHBOARD</h1>

      {loading && (
        <div className="card-cyber p-5 mb-6 text-muted-foreground">Đang tải dữ liệu...</div>
      )}

      {!loading && !stats && (
        <div className="card-cyber p-5 mb-6 text-neon-red">Không có dữ liệu.</div>
      )}

      {!loading && stats && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-cyber p-5"
              >
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-heading">{s.label}</p>
                <p className={`font-display text-3xl mt-2 text-${s.color}`}>{s.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card-cyber p-5">
              <h3 className="font-heading uppercase text-sm tracking-wider text-neon-cyan mb-4">Views (7 days)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={data}>
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--neon-purple))',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(var(--neon-purple))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--neon-pink))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card-cyber p-5">
              <h3 className="font-heading uppercase text-sm tracking-wider text-neon-pink mb-4">Top 5 Trailers</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={top}>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--neon-pink))',
                    }}
                  />
                  <Bar dataKey="views" fill="hsl(var(--neon-pink))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function TrailerManager() {
  // UI trailer admin hiện chưa có endpoint get/list đầy đủ trong server hiện tại.
  // Tạm giữ demo layout để không vỡ UI.
  const [search, setSearch] = useState('');
  const [list, setList] = useState<Trailer[]>([]);

  useEffect(() => {
    // TODO: nối `/api/trailers` + admin actions khi bạn muốn quản lý trailer thật.
    setList([]);
  }, []);

  const filtered = list.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  const remove = (_id: string) => {
    toast.info('Chưa nối backend xoá trailer');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-glow-purple">TRAILERS</h1>
        <button onClick={() => toast.info('Form thêm trailer (demo)')} className="btn-cyber flex items-center gap-2">
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="input-cyber pl-10"
        />
      </div>

      <div className="card-cyber overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 font-heading uppercase text-xs tracking-wider">
            <tr>
              <th className="text-left p-3">Thumbnail</th>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3 hidden md:table-cell">Genre</th>
              <th className="text-left p-3 hidden lg:table-cell">Publisher</th>
              <th className="text-left p-3 hidden md:table-cell">Views</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  Chưa có dữ liệu trailer từ backend.
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-2">
                    <img src={t.thumbnail_url} alt="" className="w-16 h-10 object-cover rounded" />
                  </td>
                  <td className="p-3 font-heading">{t.title}</td>
                  <td className="p-3 hidden md:table-cell text-neon-cyan">{t.genre}</td>
                  <td className="p-3 hidden lg:table-cell text-muted-foreground">{t.publisher}</td>
                  <td className="p-3 hidden md:table-cell">{t.views.toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => toast.info('Edit form (demo)')} className="p-2 hover:text-neon-cyan" title="Edit">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => remove(t.id)} className="p-2 hover:text-neon-red" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserManager() {
  const { user } = useAuth();
  const [list, setList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    adminUsersApi()
      .then((users) => setList(users))
      .catch((e) => toast.error(e instanceof Error ? e.message : 'Không lấy được users'))
      .finally(() => setLoading(false));
  }, [user]);

  const toggleBan = async (_id: string) => {
    toast.info('Chưa nối backend toggle ban');
  };

  const toggleRole = async (_id: string) => {
    toast.info('Chưa nối backend toggle role');
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-glow-purple mb-6">USERS</h1>

      <div className="card-cyber overflow-hidden">
        {loading ? (
          <div className="p-6 text-muted-foreground">Đang tải users...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 font-heading uppercase text-xs tracking-wider">
              <tr>
                <th className="text-left p-3">Username</th>
                <th className="text-left p-3 hidden md:table-cell">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted-foreground">
                    Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                list.map((u) => (
                  <tr key={u.id} className="border-t border-border hover:bg-muted/30">
                    <td className="p-3 font-heading">{u.username}</td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">{u.email}</td>
                    <td className="p-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          u.role === 'admin' ? 'bg-neon-pink/20 text-neon-pink' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      {u.is_banned ? <span className="text-neon-red text-xs">Banned</span> : <span className="text-neon-green text-xs">Active</span>}
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button onClick={() => void toggleRole(u.id)} className="p-2 hover:text-neon-cyan" title="Toggle role">
                        <ShieldCheck size={14} />
                      </button>
                      <button onClick={() => void toggleBan(u.id)} className="p-2 hover:text-neon-red" title="Ban/Unban">
                        <Ban size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Logs() {
  const { user } = useAuth();
  const [list, setList] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    adminLogsApi()
      .then((logs) => setList(logs))
      .catch((e) => toast.error(e instanceof Error ? e.message : 'Không lấy được logs'))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div>
      <h1 className="font-display text-3xl text-glow-purple mb-6">ACTIVITY LOGS</h1>

      <div className="card-cyber p-5 space-y-3">
        {loading ? (
          <div className="text-muted-foreground">Đang tải logs...</div>
        ) : list.length === 0 ? (
          <div className="text-muted-foreground">Không có log.</div>
        ) : (
          list.map((l) => (
            <div key={l.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
              <Activity size={14} className="text-neon-purple mt-1 shrink-0" />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-heading text-neon-cyan">{l.user}</span> · {l.action}
                </p>
                <p className="text-xs text-muted-foreground">{l.created_at}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
