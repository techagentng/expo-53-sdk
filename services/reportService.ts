import axios from 'axios';
import { HOST } from '../Redux/URL';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const upvoteReport = async (reportId: string): Promise<{ success: boolean; message: string; reportID: string }> => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    const response = await axios.put(`${HOST}/api/v1/report/upvote/${reportId}`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error upvoting report:', error);
    throw error;
  }
};

export const downvoteReport = async (reportId: string): Promise<{ success: boolean; message: string; reportID: string }> => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    const response = await axios.put(`${HOST}/api/v1/report/downvote/${reportId}`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error downvoting report:', error);
    throw error;
  }
};
