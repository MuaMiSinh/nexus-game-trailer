import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { pool } from './db.js';
import { signToken, authMiddleware, adminOnly } from './auth.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date() }));

// =========== AUTH ===========
const registerSchema = z.object({
  username: z.string().min(5).max(20),
  email: z.string().email(),
  password: z.string().min(6).max(30),
  fullName: z.string().min(1),
  phone: z.string().length(10),
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const hash = await bcrypt.hash(data.password, 10);
    const id = randomUUID();
    await pool.query(
      'INSERT INTO users (id, username, email, password_hash, full_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [id, data.username, data.email, hash, data.fullName, data.phone]
    );
    await pool.query('INSERT INTO user_roles (user_id, role) VALUES (?, ?)', [id, 'user']);
    const user = { id, username: data.username, email: data.email, full_name: data.fullName, role: 'user' };
    res.json({ user, token: signToken(user) });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Username/email đã tồn tại' });
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Email chưa được đăng ký' });
    const u = rows[0];
    if (u.is_banned) return res.status(403).json({ error: 'Tài khoản đã bị khóa' });
    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) return res.status(401).json({ error: 'Mật khẩu không chính xác' });
    const [roles] = await pool.query('SELECT role FROM user_roles WHERE user_id = ?', [u.id]);
    const user = { id: u.id, username: u.username, email: u.email, full_name: u.full_name, role: roles[0]?.role || 'user' };
    res.json({ user, token: signToken(user) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const { password_hash, ...u } = req.user;
  res.json({ user: { ...u, role: req.user.roles[0] || 'user' } });
});

// =========== TRAILERS ===========
app.get('/api/trailers', async (req, res) => {
  const { genre, search, sort } = req.query;
  let sql = 'SELECT * FROM trailers WHERE 1=1';
  const params = [];
  if (genre && genre !== 'All') { sql += ' AND genre = ?'; params.push(genre); }
  if (search) { sql += ' AND title LIKE ?'; params.push(`%${search}%`); }
  if (sort === 'views') sql += ' ORDER BY views DESC';
  else if (sort === 'featured') sql += ' ORDER BY featured DESC, created_at DESC';
  else sql += ' ORDER BY created_at DESC';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

app.get('/api/trailers/:slug', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM trailers WHERE slug = ?', [req.params.slug]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  await pool.query('UPDATE trailers SET views = views + 1 WHERE id = ?', [rows[0].id]);
  res.json(rows[0]);
});

app.post('/api/trailers', authMiddleware, adminOnly, async (req, res) => {
  const t = req.body;
  const id = randomUUID();
  await pool.query(
    `INSERT INTO trailers (id, slug, title, publisher, description, genre, release_date, thumbnail_url, video_url, featured, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, t.slug, t.title, t.publisher, t.description, t.genre, t.release_date, t.thumbnail_url, t.video_url, !!t.featured, req.user.id]
  );
  res.json({ id });
});

app.put('/api/trailers/:id', authMiddleware, adminOnly, async (req, res) => {
  const t = req.body;
  await pool.query(
    `UPDATE trailers SET title=?, publisher=?, description=?, genre=?, thumbnail_url=?, video_url=?, featured=? WHERE id=?`,
    [t.title, t.publisher, t.description, t.genre, t.thumbnail_url, t.video_url, !!t.featured, req.params.id]
  );
  res.json({ ok: true });
});

app.delete('/api/trailers/:id', authMiddleware, adminOnly, async (req, res) => {
  await pool.query('DELETE FROM trailers WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

// =========== LIVESTREAMS ===========
app.get('/api/live', async (_req, res) => {
  const [rows] = await pool.query('SELECT id, title, description, thumbnail_url, playback_url, status, viewer_count, created_at FROM livestreams ORDER BY status DESC, created_at DESC');
  res.json(rows);
});

app.post('/api/live', authMiddleware, async (req, res) => {
  const id = randomUUID();
  const stream_key = 'sk_live_' + Math.random().toString(36).slice(2, 14);
  await pool.query(
    'INSERT INTO livestreams (id, title, description, thumbnail_url, stream_key, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, req.body.title, req.body.description || '', req.body.thumbnail_url || '', stream_key, 'offline', req.user.id]
  );
  res.json({ id, stream_key, rtmp_url: 'rtmp://your-server.com/live' });
});

app.get('/api/live/:id/messages', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT m.id, m.message, m.created_at, u.username
     FROM live_messages m JOIN users u ON u.id = m.user_id
     WHERE m.livestream_id = ? ORDER BY m.created_at DESC LIMIT 50`,
    [req.params.id]
  );
  res.json(rows.reverse());
});

app.post('/api/live/:id/messages', authMiddleware, async (req, res) => {
  await pool.query(
    'INSERT INTO live_messages (id, livestream_id, user_id, message) VALUES (?, ?, ?, ?)',
    [randomUUID(), req.params.id, req.user.id, req.body.message]
  );
  res.json({ ok: true });
});

// =========== ADMIN: USERS ===========
app.get('/api/admin/users', authMiddleware, adminOnly, async (_req, res) => {
  const [rows] = await pool.query(`
    SELECT u.id, u.username, u.email, u.full_name, u.phone, u.avatar_url, u.is_banned, u.created_at,
           COALESCE(r.role, 'user') AS role
    FROM users u LEFT JOIN user_roles r ON r.user_id = u.id
    ORDER BY u.created_at DESC
  `);
  res.json(rows);
});

app.patch('/api/admin/users/:id/ban', authMiddleware, adminOnly, async (req, res) => {
  await pool.query('UPDATE users SET is_banned = NOT is_banned WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

app.patch('/api/admin/users/:id/role', authMiddleware, adminOnly, async (req, res) => {
  const { role } = req.body; // 'user' | 'admin'
  await pool.query('DELETE FROM user_roles WHERE user_id = ?', [req.params.id]);
  await pool.query('INSERT INTO user_roles (user_id, role) VALUES (?, ?)', [req.params.id, role]);
  res.json({ ok: true });
});

app.delete('/api/admin/users/:id', authMiddleware, adminOnly, async (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ error: 'Không thể xóa chính mình' });
  await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

// =========== ADMIN: ANALYTICS & LOGS ===========
app.get('/api/admin/stats', authMiddleware, adminOnly, async (_req, res) => {
  const [[t]] = await pool.query('SELECT COUNT(*) AS n, COALESCE(SUM(views),0) AS views FROM trailers');
  const [[u]] = await pool.query('SELECT COUNT(*) AS n FROM users');
  const [[f]] = await pool.query('SELECT COUNT(*) AS n FROM trailers WHERE featured = 1');
  res.json({ trailers: t.n, total_views: t.views, users: u.n, featured: f.n });
});

app.get('/api/admin/logs', authMiddleware, adminOnly, async (_req, res) => {
  const [rows] = await pool.query(`
    SELECT l.id, l.action, l.created_at, u.username
    FROM activity_logs l LEFT JOIN users u ON u.id = l.user_id
    ORDER BY l.created_at DESC LIMIT 100
  `);
  res.json(rows);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 NEXUS API listening on http://localhost:${PORT}`));
