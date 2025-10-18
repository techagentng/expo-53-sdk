import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  SIGNUP,
  SIGNIN,
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

// Helper functions for AsyncStorage
const loadBookmarks = async () => {
  try {
    const bookmarks = await AsyncStorage.getItem('bookmarkedPosts');
    return bookmarks ? JSON.parse(bookmarks) : {};
  } catch (error) {
    console.log('Error loading bookmarks:', error);
    return {};
  }
};

const saveBookmarks = async (bookmarks: any) => {
  try {
    await AsyncStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarks));
  } catch (error) {
    console.log('Error saving bookmarks:', error);
  }
};

const fetchBookmarks = async () => {
  try {
    const access_token = await AsyncStorage.getItem("access_token");
    if (!access_token) return {};

    const response = await axios.get(VIEW_BOOKMARKS, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

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

const signup = createAsyncThunk(
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
      await AsyncStorage.setItem("user_details", JSON.stringify(userDetails));
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const payload = error.response?.data || error.message || "Unknown error";
        return rejectWithValue(payload);
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      return rejectWithValue(message);
    }
  }
);

const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string, password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(SIGNIN, {
        email,
        password,
      });

      if (response.data.access_token) {
        await AsyncStorage.setItem("access_token", response.data.access_token);
        await AsyncStorage.setItem("refresh_token", response.data.refresh_token);

        const profileResponse = await axios.get(PROFILE, {
          headers: {
            Authorization: `Bearer ${response.data.access_token}`,
          },
        });

        if (profileResponse.data.data) {
          await AsyncStorage.setItem("user_details", JSON.stringify(profileResponse.data.data));

          return {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            user: profileResponse.data.data
          };
        } else {
          throw new Error('No user data in profile response');
        }
      }
      return rejectWithValue("Failed to authenticate");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return rejectWithValue(error.response.data);
        }
        const payload = error.message || "Login failed";
        return rejectWithValue(payload);
      }
      const message = error instanceof Error ? error.message : "Login failed";
      return rejectWithValue(message);
    }
  }
);

const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async ({ email, name, phone, expo_push_token }: { email: string, name: string, phone: string, expo_push_token: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(LOGIN_WITH_GOOGLE, {
        email,
        name,
        phone,
        expo_push_token
      });

      if (response.data.access_token) {
        await AsyncStorage.setItem("access_token", response.data.access_token);
        await AsyncStorage.setItem("refresh_token", response.data.refresh_token);

        const profileResponse = await axios.get(PROFILE, {
          headers: {
            Authorization: `Bearer ${response.data.access_token}`,
          },
        });

        if (profileResponse.data.data) {
          await AsyncStorage.setItem("user_details", JSON.stringify(profileResponse.data.data));

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
      if (axios.isAxiosError(error)) {
        if (error.response) {
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

const profile_sec = createAsyncThunk(
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
        await AsyncStorage.setItem("user_details", JSON.stringify(response.data.data));
        return response.data.data;
      } else {
        return rejectWithValue("No user data found");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const payload = error.response?.data || error.message || "Failed to fetch profile";
        return rejectWithValue(payload);
      }
      const message = error instanceof Error ? error.message : "Failed to fetch profile";
      return rejectWithValue(message);
    }
  }
);

const rewardCount = createAsyncThunk(
  "auth/rewardCount",
  async ({ access_token }: { access_token: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(USER_REWARD, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const payload = error.response?.data || error.message || "Unknown error";
        return rejectWithValue(payload);
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      return rejectWithValue(message);
    }
  }
);

// Main auth slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: { payload: boolean }) => {
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
    initializeBookmarks: (state, action: { payload: Record<string, boolean> }) => {
      state.bookmarkedPosts = action.payload;
    },
    setUserFromStorage: (state, action: { payload: { user: any; access_token: string; refresh_token: string } }) => {
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
        if (action.payload.access_token) state.access_token = action.payload.access_token;
        if (action.payload.refresh_token) state.refresh_token = action.payload.refresh_token;
        state.status = action.payload.status;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.error = null;
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
  },
});

// Initialize authentication function
export const initializeAuth = () => async (dispatch: any) => {
  try {
    console.log('🔄 Initializing authentication...');

    // Check if user has a valid session
    const accessToken = await AsyncStorage.getItem('access_token');
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    const userDetails = await AsyncStorage.getItem('user_details');

    console.log('📱 Stored data check:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasUserDetails: !!userDetails
    });

    if (accessToken && userDetails) {
      try {
        // Parse user data
        const userData = JSON.parse(userDetails);

        // Validate user data structure
        if (userData && (userData.name || userData.fullname || userData.username)) {
          // Restore Redux state with existing session
          dispatch(authSlice.actions.setUserFromStorage({
            user: userData,
            access_token: accessToken,
            refresh_token: refreshToken || "",
          }));

          console.log('✅ Authentication state restored successfully');
          console.log('User data restored:', userData);

          // Fetch fresh profile data to ensure it's up to date (don't block on this)
          dispatch(profile_sec({ access_token: accessToken })).catch((error: any) => {
            console.log('⚠️ Failed to fetch fresh profile, using stored data');
          });

          return true;
        } else {
          console.log('⚠️ Invalid user data structure');
        }
      } catch (parseError) {
        console.log('❌ Error parsing stored user data:', parseError);
      }
    }

    console.log('❌ No valid session found or invalid data');
    return false;
  } catch (error) {
    console.log('❌ Error initializing auth:', error);
    return false;
  }
};

export const { logout, resetUserStatus, setUserFromStorage, initializeBookmarks } = authSlice.actions;
export { signup, login, googleLogin, profile_sec, rewardCount };
export default authSlice.reducer;
