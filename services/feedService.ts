import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_FEEDS } from '@/Redux/URL';

// TypeScript interfaces for feed data
export interface User {
  id: string;
  fullname: string;
  username: string;
  profileImage: string;
  isVerified?: boolean;
}

export interface Location {
  state: string;
  lga: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
}

export interface FeedItem {
  id: string;
  user: User;
  createdAt: string;
  content: string;
  reportType: string;
  location?: Location;
  media: MediaItem[];
  likes: number;
  views: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  followUp?: FeedItem[];
}

export interface FeedResponse {
  incident_reports: FeedItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

class FeedService {
  private api = axios.create({
    baseURL: AUTH_FEEDS,
    timeout: 10000,
  });

  // Get authentication token
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('access_token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Fetch feed data
  async fetchFeed(page: number = 1, limit: number = 20, filter: string = ""): Promise<FeedResponse> {
    try {
      const token = await this.getAuthToken();
      const headers: Record<string, string> = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await this.api.get('', {
        params: { page, limit, filter },
        headers,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching feed:', error);
      throw this.handleError(error);
    }
  }

  // Like a feed item
  async likeFeed(feedId: string): Promise<void> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      await axios.post(
        'https://citizenx-9hk2.onrender.com/api/v1/report/upvote',
        { reportId: feedId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error liking feed:', error);
      throw this.handleError(error);
    }
  }

  // Unlike a feed item
  async unlikeFeed(feedId: string): Promise<void> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      await axios.post(
        'https://citizenx-9hk2.onrender.com/api/v1/report/downvote',
        { reportId: feedId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error unliking feed:', error);
      throw this.handleError(error);
    }
  }

  // Bookmark a feed item
  async bookmarkFeed(feedId: string): Promise<void> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      await axios.post(
        'https://citizenx-9hk2.onrender.com/api/v1/user/bookmark',
        { reportId: feedId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error bookmarking feed:', error);
      throw this.handleError(error);
    }
  }

  // Get top states with report count
  async getTopStates(): Promise<any> {
    try {
      const token = await this.getAuthToken();
      const headers: Record<string, string> = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get('https://citizenx-9hk2.onrender.com/api/v1/reports/top-states', {
        headers,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching top states:', error);
      throw this.handleError(error);
    }
  }

  // Get reports by state
  async getReportsByState(state: string): Promise<FeedResponse> {
    try {
      const token = await this.getAuthToken();
      const headers: Record<string, string> = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get(`https://citizenx-9hk2.onrender.com/api/v1/reports/by-state`, {
        params: { state },
        headers,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching reports by state:', error);
      throw this.handleError(error);
    }
  }

  // Handle API errors
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      return new Error(message);
    }
    return new Error('An unexpected error occurred');
  }

  // Transform API response to match FeedItem interface
  static transformFeedData(apiData: any): FeedItem {
    return {
      id: apiData.id?.toString() || '',
      user: {
        id: apiData.user?.id?.toString() || '',
        fullname: apiData.user?.fullname || '',
        username: apiData.user?.username || '',
        profileImage: apiData.user?.profileImage || '',
        isVerified: apiData.user?.isVerified || false,
      },
      createdAt: apiData.createdAt || '',
      content: apiData.content || '',
      reportType: apiData.reportType || '',
      location: apiData.location ? {
        state: apiData.location.state || '',
        lga: apiData.location.lga || '',
      } : undefined,
      media: Array.isArray(apiData.media) ? apiData.media.map((media: any) => ({
        id: media.id?.toString() || '',
        type: media.type || 'image',
        url: media.url || '',
      })) : [],
      likes: apiData.numOfLike || apiData.likes || 0,
      views: apiData.numberOfView || apiData.views || 0,
      comments: apiData.comments || 0,
      isLiked: apiData.isLiked || false,
      isBookmarked: apiData.isBookmarked || false,
      followUp: Array.isArray(apiData.followUp) ? apiData.followUp.map((item: any) => FeedService.transformFeedData(item)) : [],
    };
  }
}

export default new FeedService();
