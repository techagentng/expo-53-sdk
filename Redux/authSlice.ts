import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
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
} from "./URL";

interface AuthState {
  user: any;
  loading: boolean;
  bookmarkLoading: boolean;
  bookmarkError: any;
  error: any;
  access_token: string | null;
  refresh_token: string | null;
  status: string;
  report: any;
  auth_feed: any;
  availableCoins: any;
  auth_UserFeed: any;
  search_feed: any;
  bookmark_feed: any;
  bookmarkedPosts: Record<string, boolean>;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  bookmarkLoading: false,
  bookmarkError: null,
  error: null,
  access_token: null,
  refresh_token: null,
  status: "",
  report: null,
  auth_feed: null,
  availableCoins: null,
  auth_UserFeed: null,
  search_feed: null,
  bookmark_feed: null,
  bookmarkedPosts: {},
};

// Add this function to load bookmarks from AsyncStorage
const loadBookmarks = async () => {
  try {
    const bookmarks = await AsyncStorage.getItem('bookmarkedPosts');
    return bookmarks ? JSON.parse(bookmarks) : {};
  } catch (error) {
    console.log('Error loading bookmarks:', error);
    return {};
  }
};

// Add this function to save bookmarks to AsyncStorage
const saveBookmarks = async (bookmarks: any) => {
  try {
    await AsyncStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarks));
  } catch (error) {
    console.log('Error saving bookmarks:', error);
  }
};

// Add this function to fetch bookmarks from the server
const fetchBookmarks = async () => {
  try {
    const access_token = await AsyncStorage.getItem("access_token");
    if (!access_token) return {};
    
    const response = await axios.get(VIEW_BOOKMARKS, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    
    // Create a map of bookmarked posts
    const bookmarkedPosts: Record<string | number, boolean> = {};
    response.data.bookmarked_reports.forEach((post: any) => {
      bookmarkedPosts[post.id] = true;
    });
    
    return bookmarkedPosts;
  } catch (error) {
    console.log('Error fetching bookmarks:', error);
    return {};
  }
};

export const signup = createAsyncThunk(
  "auth/signup",
  async (
    { fullname, username, phoneNumber, email, password, profileImage }: any,
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("fullname", fullname);
      formData.append("telephone", phoneNumber);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (profileImage) {
        const fileType = profileImage.substring(
          profileImage.lastIndexOf(".") + 1
        );
        formData.append("profile_image", {
          uri: profileImage,
          type: `image/${fileType}`,
          name: `profile_image.${fileType}`,
        } as any);
      }

      console.log("Form Data before sending to server:", formData);
      const response = await axios.post(SIGNUP, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const userDetails = {
        fullname,
        username,
        phoneNumber,
        email,
        profileImage,
      };
      console.log("Signup response data:", response.data);
      await AsyncStorage.setItem("user_details", JSON.stringify(userDetails));
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Signup error response data:", error.response?.data);
        const payload = error.response?.data || error.message || "Unknown error";
        return rejectWithValue(payload);
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      return rejectWithValue(message);
    }
  }
);

export const authFeed = createAsyncThunk(
  "auth/authFeed",
  async ({ access_token }: { access_token?: string }, { rejectWithValue }) => {
    try {
      if (access_token) {
        const response = await axios.get(AUTH_FEEDS, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        return response.data.incident_reports;
      } else {
        // If no token, treat as guest feed (if allowed by backend)
        const response = await axios.get(AUTH_FEEDS);
        return response.data.incident_reports;
      }
    } catch (error) {
      console.log("Error fetching feed", error);
      if (axios.isAxiosError(error)) {
        const payload = error.response?.data || error.message || "Unknown error";
        return rejectWithValue(payload);
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      return rejectWithValue(message);
    }
  }
);

export const authSearchFeed = createAsyncThunk(
  "auth/authSearchFeed",
  async (
    { access_token, reportType, selectedState, selectedLocalGov }: { access_token?: string, reportType?: string, selectedState?: string, selectedLocalGov?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${SEARCH}/category=${reportType}&state=${selectedState}&lga=${selectedLocalGov}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      // console.log(
      //   "Auth Feeds successfully gotten:",
      //   response.data.incident_reports
      // );
      return response.data.reports;
    } catch (error) {
      console.log("Error fetching feed", error);
      if (axios.isAxiosError(error)) {
        const payload = error.response?.data || error.message || "Unknown error";
        return rejectWithValue(payload);
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      return rejectWithValue(message);
    }
  }
);

export const bookmarkPost = createAsyncThunk(
  "auth/bookmarkPost",
  async ({ postId }: { postId: string }, { rejectWithValue }) => {
    try {
      const access_token = await AsyncStorage.getItem("access_token");
      const response = await axios.get(`${BOOKMARK_FEED}/${postId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      // Determine if post is bookmarked based on response
      const isBookmarked = response.data?.is_bookmarked || false;
      return { postId, isBookmarked, message: response.data.message };
    } catch (error) {
      console.log("Error bookmarking post", error);
      if (axios.isAxiosError(error)) {
        const payload = error.response?.data || error.message || "Unknown error";
        return rejectWithValue(payload);
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      return rejectWithValue(message);
    }
  }
);

export const profile_sec = createAsyncThunk(
  "auth/profile_sec",
  async ({ access_token }: { access_token?: string }, { rejectWithValue }) => {
    try {
      console.log('Fetching profile with token:', access_token);
      const response = await axios.get(PROFILE, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      
      console.log('Profile response:', response.data);
      
      if (response.data.data) {
        // Store user data in AsyncStorage
        await AsyncStorage.setItem("user_details", JSON.stringify(response.data.data));
        console.log('Stored user details:', response.data.data);
        return response.data.data;
      } else {
        console.log('No user data in profile response');
        return rejectWithValue("No user data found");
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log("Error response:", error.response.data);
        }
        const payload = error.response?.data || error.message || "Failed to fetch profile";
        return rejectWithValue(payload);
      }
      const message = error instanceof Error ? error.message : "Failed to fetch profile";
      return rejectWithValue(message);
    }
  }
);

export const createReport = createAsyncThunk(
  "auth/createReport",
  async ({ formData, token }: { formData: any, token: string }, { rejectWithValue }) => {
    try {
      console.log('Starting report creation...');
      console.log('Report FormData:', formData);
      console.log('Access Token:', token);

      const response = await axios.post(CREATE_REPORT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Report creation successful:', response.data);
      return response.data;
    } catch (error) {
      console.log('Report creation error:', error);
      if (axios.isAxiosError(error)) {
        console.log('Error response:', error.response?.data);
        const payload = error.response?.data || error.message || { message: 'Failed to create report' };
        return rejectWithValue(payload);
      }
      const message = error instanceof Error ? error.message : 'Failed to create report';
      return rejectWithValue({ message });
    }
  }
);

export const rewardCount = createAsyncThunk(
  "auth/rewardCount",
  async ({ access_token }: { access_token: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(USER_REWARD, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      console.log("user reward count:", response.data);
      return response.data;
    } catch (error) {
      console.log("Error fetching feed", error);
      if (axios.isAxiosError(error)) {
        const payload = error.response?.data || error.message || "Unknown error";
        return rejectWithValue(payload);
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      return rejectWithValue(message);
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async ({ email, name, phone, expo_push_token }: { email: string, name: string, phone: string, expo_push_token: string }, { rejectWithValue, dispatch }) => {
    try {
      console.log('Starting Google login with:', { email, name, phone, expo_push_token });
      
      const response = await axios.post(LOGIN_WITH_GOOGLE, {
        email,
        name,
        phone,
        expo_push_token
      });
      
      console.log('Google login response:', response.data);
      
      if (response.data.access_token) {
        // Store tokens
        await AsyncStorage.setItem("access_token", response.data.access_token);
        await AsyncStorage.setItem("refresh_token", response.data.refresh_token);
        
        // Fetch user profile
        const profileResponse = await axios.get(PROFILE, {
          headers: {
            Authorization: `Bearer ${response.data.access_token}`,
          },
        });
        
        console.log('Profile response:', profileResponse.data);
        
        if (profileResponse.data.data) {
          // Store user data in AsyncStorage
          await AsyncStorage.setItem("user_details", JSON.stringify(profileResponse.data.data));
          
          // Return structured data
          return {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            user: profileResponse.data.data
          };
        } else {
          throw new Error('No user data in profile response');
        }
      }
      return rejectWithValue("Failed to authenticate with Google");
    } catch (error) {
      console.log('Google login error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log('Error response:', error.response.data);
          return rejectWithValue(error.response.data);
        }
        const payload = error.message || "Google authentication failed";
        return rejectWithValue(payload);
      }
      const message = error instanceof Error ? error.message : "Google authentication failed";
      return rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      AsyncStorage.removeItem("access_token");
      AsyncStorage.removeItem("refresh_token");
      AsyncStorage.removeItem("fullname");
      AsyncStorage.removeItem("username");
      AsyncStorage.removeItem("user_details");
      AsyncStorage.removeItem("bookmarkedPosts");
      state.bookmarkedPosts = {};
    },
    resetUserStatus: (state) => {
      state.user = null;
      state.status = "";
    },
    // Add a new reducer to initialize bookmarks
    initializeBookmarks: (state, action) => {
      state.bookmarkedPosts = action.payload;
    },
    // Add reducer to restore user from storage
    setUserFromStorage: (state, action) => {
      state.user = action.payload.user;
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        // Set tokens if present in signup response
        if (action.payload.access_token) state.access_token = action.payload.access_token;
        if (action.payload.refresh_token) state.refresh_token = action.payload.refresh_token;
        state.status = action.payload.status;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Setting user in Redux:', action.payload.user);
        state.user = action.payload.user;
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.error = null;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // If rejected due to Unauthorized, force logout
        if (action.payload === 'Unauthorized' || (typeof action.payload === 'object' && action.payload !== null && 'status' in action.payload && action.payload.status === 'Unauthorized')) {
          state.user = null;
          state.access_token = null;
          state.refresh_token = null;
          AsyncStorage.removeItem('access_token');
          AsyncStorage.removeItem('refresh_token');
          AsyncStorage.removeItem('user_details');
        } else {
          state.user = null;
          state.access_token = null;
          state.refresh_token = null;
        }
      })
      .addCase(authFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.auth_feed = action.payload;
      })
      .addCase(authFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(authSearchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authSearchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.search_feed = action.payload;
      })
      .addCase(authSearchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(profile_sec.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(profile_sec.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Setting user in Redux from profile:', action.payload);
        state.user = action.payload;
        state.error = null;
      })
      .addCase(profile_sec.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        console.log('Profile fetch failed:', action.payload);
      })
      .addCase(rewardCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rewardCount.fulfilled, (state, action) => {
        state.loading = false;
        state.availableCoins = action.payload;
      })
      .addCase(rewardCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(bookmarkPost.pending, (state) => {
        state.bookmarkLoading = true;
        state.bookmarkError = null;
      })
      .addCase(bookmarkPost.fulfilled, (state, action) => {
        state.bookmarkLoading = false;
        const { postId, isBookmarked } = action.payload;
        state.bookmarkedPosts[postId] = isBookmarked;
        // Save bookmarks to AsyncStorage after each update
        saveBookmarks(state.bookmarkedPosts);
      })
      .addCase(bookmarkPost.rejected, (state, action) => {
        state.bookmarkLoading = false;
        state.bookmarkError = action.payload;
      });
  },
});

// Add this function to initialize authentication when the app starts
export const initializeAuth = () => async (dispatch: any) => {
  try {
    // Check if user has a valid session
    const accessToken = await AsyncStorage.getItem('access_token');
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    const userDetails = await AsyncStorage.getItem('user_details');

    if (accessToken && userDetails) {
      // Restore Redux state with existing session
      const userData = JSON.parse(userDetails);
      dispatch(authSlice.actions.setUserFromStorage({
        user: userData,
        access_token: accessToken,
        refresh_token: refreshToken,
      }));

      // Fetch fresh profile data to ensure it's up to date (don't block on this)
      dispatch(profile_sec({ access_token: accessToken })).catch((error: any) => {
        console.log('Failed to fetch fresh profile, using stored data');
      });

      console.log('Authentication state restored from storage');
    } else {
      console.log('No valid session found');
    }
  } catch (error) {
    console.log('Error initializing auth:', error);
  }
};

export const { logout, resetUserStatus, setUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
