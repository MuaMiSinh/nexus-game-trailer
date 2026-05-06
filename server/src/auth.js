import jwt from 'jsonwebtoken';
import { pool } from './db.js';

const SECRET = process.env.JWT_SECRET || 'change-me';

export function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '30d' });
}

export async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
    const payload = jwt.verify(auth.slice(7), SECRET);
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [payload.id]);
    if (!rows.length) return res.status(401).json({ error: 'Unauthorized' });
    if (rows[0].is_banned) return res.status(403).json({ error: 'Account banned' });
    const [roles] = await pool.query('SELECT role FROM user_roles WHERE user_id = ?', [payload.id]);
    req.user = { ...rows[0], roles: roles.map(r => r.role) };
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function adminOnly(req, res, next) {
  if (!req.user?.roles?.includes('admin')) return res.status(403).json({ error: 'Admin only' });
  next();
}
