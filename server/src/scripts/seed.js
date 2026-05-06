import { pool } from '../db.js';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const TRAILERS = [
  ['cyberpunk-2077-phantom-liberty','Cyberpunk 2077: Phantom Liberty','CD Projekt Red','Bước vào Dogtown - khu vực bí ẩn nhất Night City.','RPG','2023-09-26','https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800','https://www.youtube.com/embed/k82RwXqZHY8',1,1240000,4.8],
  ['valorant-episode-9','VALORANT Episode 9','Riot Games','Agent mới và bản đồ mới đang chờ đón.','FPS','2024-06-12','https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800','https://www.youtube.com/embed/e_E9W2vsRbQ',1,890000,4.6],
  ['elden-ring-shadow-erdtree','Elden Ring: Shadow of the Erdtree','FromSoftware','DLC sử thi mở rộng thế giới Lands Between.','RPG','2024-06-21','https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800','https://www.youtube.com/embed/Ej3zGOakIvk',1,2100000,4.9],
  ['gta-vi','Grand Theft Auto VI','Rockstar Games','Trở lại Vice City với bom tấn được mong đợi nhất.','Action','2025-12-01','https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800','https://www.youtube.com/embed/QdBZY2fkU-0',1,5800000,5.0],
  ['black-myth-wukong','Black Myth: Wukong','Game Science','Action RPG dựa trên Tây Du Ký.','Action','2024-08-20','https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800','https://www.youtube.com/embed/p7UnBPSXVR4',1,3200000,4.9],
  ['helldivers-2','Helldivers 2','Arrowhead','Co-op shooter điên rồ - bảo vệ Super Earth.','FPS','2024-02-08','https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=800','https://www.youtube.com/embed/u7VkmvZMfDA',0,1500000,4.7],
];

console.log('🌱 Seeding...');

// Admin user
const adminId = randomUUID();
const adminHash = await bcrypt.hash('Admin@123', 10);
await pool.query(
  'INSERT IGNORE INTO users (id, username, email, password_hash, full_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
  [adminId, 'admin', 'admin@nexus.gg', adminHash, 'System Admin', '0900000000']
);
await pool.query('INSERT IGNORE INTO user_roles (user_id, role) VALUES (?, ?)', [adminId, 'admin']);

// Demo user
const userId = randomUUID();
const userHash = await bcrypt.hash('User@123', 10);
await pool.query(
  'INSERT IGNORE INTO users (id, username, email, password_hash, full_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
  [userId, 'demouser', 'demo@gmail.com', userHash, 'Demo User', '0911111111']
);
await pool.query('INSERT IGNORE INTO user_roles (user_id, role) VALUES (?, ?)', [userId, 'user']);

// Trailers
for (const t of TRAILERS) {
  await pool.query(
    `INSERT IGNORE INTO trailers (id, slug, title, publisher, description, genre, release_date, thumbnail_url, video_url, featured, views, rating, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [randomUUID(), ...t, adminId]
  );
}

console.log('✅ Seed done.');
console.log('   Admin: admin@nexus.gg / Admin@123');
console.log('   User:  demo@gmail.com / User@123');
process.exit(0);
