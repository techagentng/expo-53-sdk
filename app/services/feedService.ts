// FeedItem interface
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  SIGNUP,
  LOGIN_WITH_GOOGLE,
  AUTH_FEEDS,
  PROFILE,
  USER_REWARD,
  SEARCH,
  BOOKMARK_FEED,
  VIEW_BOOKMARKS,
  CREATE_REPORT,
} from '../../Redux/URL';

export interface FeedItem {
  id: string | number;
  user: {
    id?: number;
    fullname: string;
    username: string;
    profileImage: any;
  };
  image?: string[];
  media?: string[];
  views?: number;
  createdAt: string;
  place: string;
  reportType: string;
  content: string;
  numOfLike?: number;
  numberOfView?: number;
  followUp?: any[] | any;
  // Additional fields for compatibility with existing code
  title?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  updatedAt?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  tags?: string[];
}

export class FeedService {
  private baseUrl = 'https://api.example.com'; // Replace with your actual API endpoint

  // Get authentication token from AsyncStorage
  async getAuthToken(): Promise<string | null> {
    try {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      return await AsyncStorage.getItem('access_token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  async fetchFeeds(page: number = 1, limit: number = 20): Promise<{ feeds: FeedItem[]; hasMore: boolean }> {
    try {
      // Mock implementation - replace with actual API call
      const mockFeeds: FeedItem[] = [
        {
          id: '1',
          user: {
            id: 1,
            fullname: 'John Doe',
            username: 'johndoe',
            profileImage: 'https://picsum.photos/40/40'
          },
          image: ['https://picsum.photos/400/200'],
          createdAt: new Date().toISOString(),
          place: 'Lagos, Nigeria',
          reportType: 'Incident',
          content: 'This is a sample feed item content',
          numOfLike: 15,
          numberOfView: 100,
          // Additional fields for compatibility
          title: 'Sample Feed Item 1',
          author: {
            id: '1',
            name: 'John Doe',
            avatar: 'https://picsum.photos/40/40'
          },
          likes: 15,
          comments: 3,
          shares: 2,
          isLiked: false,
          isBookmarked: false,
          tags: ['sample', 'feed']
        },
        {
          id: '2',
          user: {
            id: 2,
            fullname: 'Jane Smith',
            username: 'janesmith',
            profileImage: 'https://picsum.photos/41/41'
          },
          image: ['https://picsum.photos/400/201'],
          createdAt: new Date().toISOString(),
          place: 'Abuja, Nigeria',
          reportType: 'News',
          content: 'Another sample feed item with different content',
          numOfLike: 8,
          numberOfView: 50,
          // Additional fields for compatibility
          title: 'Sample Feed Item 2',
          author: {
            id: '2',
            name: 'Jane Smith',
            avatar: 'https://picsum.photos/41/41'
          },
          likes: 8,
          comments: 1,
          shares: 0,
          isLiked: true,
          isBookmarked: true,
          tags: ['sample', 'content']
        }
      ];

      // Simulate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedFeeds = mockFeeds.slice(startIndex, endIndex);

      return {
        feeds: paginatedFeeds,
        hasMore: endIndex < mockFeeds.length
      };
    } catch (error) {
      throw new Error('Failed to fetch feeds');
    }
  }

  async likeFeed(feedId: string): Promise<void> {
    try {
      // Mock implementation - replace with actual API call
      console.log(`Liking feed ${feedId}`);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      throw new Error('Failed to like feed');
    }
  }

  async unlikeFeed(feedId: string): Promise<void> {
    try {
      // Mock implementation - replace with actual API call
      console.log(`Unliking feed ${feedId}`);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      throw new Error('Failed to unlike feed');
    }
  }

  async bookmarkFeed(feedId: string): Promise<void> {
    try {
      // Mock implementation - replace with actual API call
      console.log(`Bookmarking feed ${feedId}`);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      throw new Error('Failed to bookmark feed');
    }
  }

  async shareFeed(feedId: string): Promise<string> {
    try {
      // Mock implementation - replace with actual API call
      console.log(`Sharing feed ${feedId}`);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return `https://example.com/feed/${feedId}`;
    } catch (error) {
      throw new Error('Failed to generate share link');
    }
  }
}

export const feedService = new FeedService();
export default FeedService;
