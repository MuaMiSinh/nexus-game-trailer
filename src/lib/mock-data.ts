import type { Trailer, Livestream, User, LiveMessage, ActivityLog } from '@/types';

export const GENRES = ['All', 'Action', 'RPG', 'FPS', 'MOBA', 'Horror', 'Sports', 'Adventure', 'Strategy'] as const;

export const TRAILERS: Trailer[] = [
  {
    id: '1', slug: 'cyberpunk-2077-phantom-liberty', title: 'Cyberpunk 2077: Phantom Liberty',
    publisher: 'CD Projekt Red', description: 'Bước vào Dogtown - khu vực bí ẩn nhất Night City với spy-thriller cốt truyện hấp dẫn cùng Idris Elba.',
    genre: 'RPG', release_date: '2023-09-26',
    thumbnail_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    video_url: 'https://www.youtube.com/embed/k82RwXqZHY8',
    featured: true, views: 1240000, rating: 4.8, created_at: '2024-01-01',
  },
  {
    id: '2', slug: 'valorant-episode-9', title: 'VALORANT Episode 9',
    publisher: 'Riot Games', description: 'Agent mới và bản đồ mới đang chờ đón. Tham gia cuộc chiến chiến thuật 5v5 đầy kịch tính.',
    genre: 'FPS', release_date: '2024-06-12',
    thumbnail_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
    video_url: 'https://www.youtube.com/embed/e_E9W2vsRbQ',
    featured: true, views: 890000, rating: 4.6, created_at: '2024-02-15',
  },
  {
    id: '3', slug: 'elden-ring-shadow-erdtree', title: 'Elden Ring: Shadow of the Erdtree',
    publisher: 'FromSoftware', description: 'DLC sử thi mở rộng thế giới Lands Between với những thử thách khắc nghiệt mới.',
    genre: 'RPG', release_date: '2024-06-21',
    thumbnail_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
    video_url: 'https://www.youtube.com/embed/Ej3zGOakIvk',
    featured: true, views: 2100000, rating: 4.9, created_at: '2024-03-10',
  },
  {
    id: '4', slug: 'gta-vi', title: 'Grand Theft Auto VI',
    publisher: 'Rockstar Games', description: 'Trở lại Vice City với bom tấn được mong đợi nhất thập kỷ.',
    genre: 'Action', release_date: '2025-12-01',
    thumbnail_url: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800',
    video_url: 'https://www.youtube.com/embed/QdBZY2fkU-0',
    featured: true, views: 5800000, rating: 5.0, created_at: '2024-04-01',
  },
  {
    id: '5', slug: 'league-of-legends-season-2025', title: 'League of Legends: Season 2025',
    publisher: 'Riot Games', description: 'Mùa giải mới với champion mới và rework hệ thống xếp hạng.',
    genre: 'MOBA', release_date: '2025-01-09',
    thumbnail_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800',
    video_url: 'https://www.youtube.com/embed/RaFG3VjP5Nk',
    featured: false, views: 670000, rating: 4.5, created_at: '2024-05-20',
  },
  {
    id: '6', slug: 'resident-evil-9', title: 'Resident Evil 9',
    publisher: 'Capcom', description: 'Cơn ác mộng kinh dị mới nhất từ Capcom - sống sót hay chết.',
    genre: 'Horror', release_date: '2025-02-14',
    thumbnail_url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800',
    video_url: 'https://www.youtube.com/embed/rOl0qbAJK2Q',
    featured: false, views: 450000, rating: 4.7, created_at: '2024-06-15',
  },
  {
    id: '7', slug: 'fifa-25', title: 'EA Sports FC 25',
    publisher: 'EA Sports', description: 'Trải nghiệm bóng đá chân thực nhất với công nghệ HyperMotionV mới.',
    genre: 'Sports', release_date: '2024-09-27',
    thumbnail_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    video_url: 'https://www.youtube.com/embed/o-dMxIEsOfI',
    featured: false, views: 380000, rating: 4.3, created_at: '2024-07-10',
  },
  {
    id: '8', slug: 'starfield-shattered-space', title: 'Starfield: Shattered Space',
    publisher: 'Bethesda', description: 'DLC đầu tiên của Starfield - khám phá vùng không gian bí ẩn.',
    genre: 'RPG', release_date: '2024-09-30',
    thumbnail_url: 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=800',
    video_url: 'https://www.youtube.com/embed/MUbR6mF9fEs',
    featured: false, views: 290000, rating: 4.2, created_at: '2024-08-05',
  },
  {
    id: '9', slug: 'black-myth-wukong', title: 'Black Myth: Wukong',
    publisher: 'Game Science', description: 'Action RPG dựa trên Tây Du Ký với đồ họa next-gen tuyệt đẹp.',
    genre: 'Action', release_date: '2024-08-20',
    thumbnail_url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800',
    video_url: 'https://www.youtube.com/embed/p7UnBPSXVR4',
    featured: true, views: 3200000, rating: 4.9, created_at: '2024-08-20',
  },
  {
    id: '10', slug: 'helldivers-2', title: 'Helldivers 2',
    publisher: 'Arrowhead', description: 'Co-op shooter điên rồ - bảo vệ Super Earth khỏi quái vật ngoài hành tinh.',
    genre: 'FPS', release_date: '2024-02-08',
    thumbnail_url: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=800',
    video_url: 'https://www.youtube.com/embed/u7VkmvZMfDA',
    featured: false, views: 1500000, rating: 4.7, created_at: '2024-02-08',
  },
  {
    id: '11', slug: 'dota-2-crownfall', title: 'Dota 2: Crownfall',
    publisher: 'Valve', description: 'Bản cập nhật cốt truyện lớn nhất của Dota 2 từ trước đến nay.',
    genre: 'MOBA', release_date: '2024-04-22',
    thumbnail_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    video_url: 'https://www.youtube.com/embed/UM3JdiNeR68',
    featured: false, views: 220000, rating: 4.4, created_at: '2024-04-22',
  },
  {
    id: '12', slug: 'silent-hill-2-remake', title: 'Silent Hill 2 Remake',
    publisher: 'Konami', description: 'Làm lại huyền thoại kinh dị - James Sunderland trở lại thị trấn ma quái.',
    genre: 'Horror', release_date: '2024-10-08',
    thumbnail_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
    video_url: 'https://www.youtube.com/embed/SD18Zz1-xX4',
    featured: false, views: 980000, rating: 4.8, created_at: '2024-10-08',
  },
];

export const LIVESTREAMS: Livestream[] = [
  {
    id: 'l1', title: 'Ranked Grind to Radiant - Day 47',
    description: 'Cố gắng leo rank cuối cùng trước khi season kết thúc!',
    thumbnail_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    playback_url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    status: 'live', viewer_count: 12453, streamer: 'NeonSlayer', created_at: new Date().toISOString(),
  },
  {
    id: 'l2', title: 'World First Raid Attempt',
    description: 'Cùng guild chinh phục raid mới nhất.',
    thumbnail_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
    playback_url: 'https://www.twitch.tv/riotgames',
    status: 'live', viewer_count: 8721, streamer: 'CyberWitch', created_at: new Date().toISOString(),
  },
  {
    id: 'l3', title: 'Speedrun Marathon - Elden Ring Any%',
    description: 'Phá kỷ lục speedrun cá nhân.',
    thumbnail_url: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800',
    playback_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    status: 'live', viewer_count: 3210, streamer: 'GhostRunner', created_at: new Date().toISOString(),
  },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', username: 'admin', email: 'admin@nexus.gg', full_name: 'System Admin', role: 'admin', created_at: '2024-01-01' },
  { id: 'u2', username: 'neonslayer', email: 'slayer@nexus.gg', full_name: 'Nguyễn Văn A', role: 'user', created_at: '2024-02-15' },
  { id: 'u3', username: 'cyberwitch', email: 'witch@nexus.gg', full_name: 'Trần Thị B', role: 'user', created_at: '2024-03-20' },
  { id: 'u4', username: 'ghostrunner', email: 'ghost@nexus.gg', full_name: 'Lê Văn C', role: 'user', is_banned: true, created_at: '2024-04-10' },
  { id: 'u5', username: 'pixelqueen', email: 'queen@nexus.gg', full_name: 'Phạm Thị D', role: 'user', created_at: '2024-05-05' },
];

export const MOCK_CHAT: LiveMessage[] = [
  { id: 'c1', user: 'NeonFan23', message: 'Stream chất lượng quá!', color: 'hsl(271 91% 65%)', created_at: '' },
  { id: 'c2', user: 'PixelLord', message: 'GG WP 🔥', color: 'hsl(322 84% 60%)', created_at: '' },
  { id: 'c3', user: 'CyberKid', message: 'Combo siêu đỉnh', color: 'hsl(189 94% 43%)', created_at: '' },
  { id: 'c4', user: 'GameMaster', message: 'Đăng ký kênh nha mọi người', color: 'hsl(142 71% 45%)', created_at: '' },
  { id: 'c5', user: 'NinjaX', message: 'Stream mượt!!', color: 'hsl(271 91% 65%)', created_at: '' },
];

export const MOCK_LOGS: ActivityLog[] = [
  { id: 'log1', user: 'admin', action: 'Banned user "ghostrunner"', created_at: '2024-06-12 10:35' },
  { id: 'log2', user: 'cyberwitch', action: 'Started livestream "World First Raid"', created_at: '2024-06-12 10:32' },
  { id: 'log3', user: 'neonslayer', action: 'Logged in', created_at: '2024-06-12 10:30' },
  { id: 'log4', user: 'admin', action: 'Created trailer "Cyberpunk 2077: Phantom Liberty"', created_at: '2024-06-12 09:15' },
  { id: 'log5', user: 'pixelqueen', action: 'Updated profile', created_at: '2024-06-12 08:42' },
];
