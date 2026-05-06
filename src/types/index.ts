export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  is_banned?: boolean;
  created_at: string;
}

export interface Trailer {
  id: string;
  slug: string;
  title: string;
  publisher: string;
  description: string;
  genre: string;
  release_date: string;
  thumbnail_url: string;
  video_url: string; // YouTube embed URL
  featured: boolean;
  views: number;
  rating: number;
  created_at: string;
}

export interface Livestream {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  playback_url: string;
  status: 'live' | 'offline';
  viewer_count: number;
  streamer: string;
  created_at: string;
}

export interface LiveMessage {
  id: string;
  user: string;
  message: string;
  color: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  created_at: string;
}
