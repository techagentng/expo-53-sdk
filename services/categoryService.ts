import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GET_CATEGORIES, GET_SUB_REPORTS } from '../Redux/URL';

// TypeScript interfaces for category data
export interface Category {
  name: string;
  display_name: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface SubReport {
  id: string;
  sub_report_type: string;
  description: string;
  ReportType: {
    category: string;
    name: string;
  };
}

export interface SubReportsResponse {
  data: SubReport[];
}

/**
 * Fetch all report categories from the backend
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.get<CategoriesResponse>(GET_CATEGORIES, { headers });
    return response.data.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Fetch sub-reports with optional filtering
 * @param category - Optional category filter (lowercase)
 * @param stateName - Optional state filter (proper state name)
 */
export const getSubReports = async (
  category?: string,
  stateName?: string
): Promise<SubReport[]> => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    const params: Record<string, string> = {};
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log('Using token for sub-reports API call');
    } else {
      console.log('No token found for sub-reports API call');
    }
    
    // Only add parameters if they have values (avoid undefined)
    if (category) {
      params.category = category;
    }
    if (stateName) {
      params.state_name = stateName;
    }

    console.log('Making sub-reports API call:', {
      url: GET_SUB_REPORTS,
      params,
      hasToken: !!token
    });

    const response = await axios.get<SubReportsResponse>(GET_SUB_REPORTS, {
      params,
      headers
    });
    
    console.log('Sub-reports API response:', {
      status: response.status,
      dataLength: response.data.data?.length || 0,
      data: response.data
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching sub-reports:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Error Details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }
    throw error;
  }
};

/**
 * Transform backend categories to frontend format
 */
export const transformCategoriesForFrontend = (categories: Category[]) => {
  const categoryIcons: Record<string, string> = {
    // Backend standardized categories (exactly 10)
    crime: '🚔',
    healthcare: '🏥',
    education: '📚',
    roads: '🛣️',
    fakeproduct: '📦',
    election: '🗳️',
    portablewater: '💧',
    power: '⚡',
    environment: '🌳',
    housing: '🏠',
  };

  const categoryColors: Record<string, string> = {
    crime: '#FF6B6B',
    healthcare: '#45B7D1',
    education: '#96CEB4',
    roads: '#4ECDC4',
    fakeproduct: '#FFEAA7',
    election: '#DDA0DD',
    portablewater: '#A3E4D7',
    power: '#F9E79F',
    environment: '#FFEAA7',
    housing: '#F7DC6F',
  };

  return categories.map((category, index) => ({
    id: index + 1,
    name: category.display_name,
    backendName: category.name, // Store backend name for API calls
    icon: categoryIcons[category.name.toLowerCase()] || '📋',
    color: categoryColors[category.name.toLowerCase()] || '#CCCCCC',
  }));
};
