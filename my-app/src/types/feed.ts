// src/types/feed.ts
export interface User {
    id: string;
    fullname: string;
    username: string;
    profileImage: string;
    isVerified: boolean;
  }
  
  export interface MediaItem {
    id: string;
    type: 'image' | 'video' | 'audio';
    url: string;
    thumbnail?: string;
  }
  
  export interface FeedItem {
    id: string;
    user: User;
    content: string;
    media: MediaItem[];
    createdAt: string;
    likes: number;
    isLiked: boolean;
    views: number;
    comments: number;
    isBookmarked: boolean;
    location?: {
      state: string;
      lga: string;
    };
  }