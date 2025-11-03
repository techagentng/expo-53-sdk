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

      const top = response.data || {};
      const nested = top.data || {};
      const accessToken = top.access_token || nested.access_token;
      const refreshToken = top.refresh_token || nested.refresh_token;

      if (accessToken) {
        await AsyncStorage.setItem("access_token", accessToken);
        if (refreshToken) await AsyncStorage.setItem("refresh_token", refreshToken);

        const profileResponse = await axios.get(PROFILE, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (profileResponse.data.data) {
          await AsyncStorage.setItem("user_details", JSON.stringify(profileResponse.data.data));

          return {
            access_token: accessToken,
            refresh_token: refreshToken,
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

      const top = response.data || {};
      const nested = top.data || {};
      const accessToken = top.access_token || nested.access_token;
      const refreshToken = top.refresh_token || nested.refresh_token;

      if (accessToken) {
        await AsyncStorage.setItem("access_token", accessToken);
        if (refreshToken) await AsyncStorage.setItem("refresh_token", refreshToken);

        const profileResponse = await axios.get(PROFILE, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (profileResponse.data.data) {
          await AsyncStorage.setItem("user_details", JSON.stringify(profileResponse.data.data));

          return {
            access_token: accessToken,
            refresh_token: refreshToken,
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
      const response = await axios.get(PROFILE, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

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

const createReport = createAsyncThunk(
  "auth/createReport",
  async ({ formData, token }: { formData: FormData, token: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(CREATE_REPORT, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => data, // Don't transform FormData
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const payload = error.response?.data || error.message || "Failed to create report";
        return rejectWithValue(payload);
      }
      const message = error instanceof Error ? error.message : "Failed to create report";
      return rejectWithValue(message);
    }
  }
);

const authFeed = createAsyncThunk(
  "auth/authFeed",
  async ({ access_token }: { access_token?: string }, { rejectWithValue }) => {
    try {
      const token = access_token || await AsyncStorage.getItem('access_token');
      if (!token) {
        return rejectWithValue('No access token available');
      }

      const response = await axios.get(AUTH_FEEDS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const payload = error.response?.data || error.message || 'Failed to fetch feeds';
        return rejectWithValue(payload);
      }
      const message = error instanceof Error ? error.message : 'Failed to fetch feeds';
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
        state.user = action.payload;
        state.error = null;
      })
      .addCase(profile_sec.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
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
      .addCase(createReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
        state.error = null;
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(authFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.auth_feed = action.payload;
        state.error = null;
      })
      .addCase(authFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Initialize authentication function
export const initializeAuth = () => async (dispatch: any) => {
  try {
    const accessToken = await AsyncStorage.getItem('access_token');
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    const userDetails = await AsyncStorage.getItem('user_details');

    if (accessToken && userDetails) {
      try {
        const userData = JSON.parse(userDetails);

        if (userData && (userData.name || userData.fullname || userData.username)) {
          try {
            await axios.get(PROFILE, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });

            dispatch(authSlice.actions.setUserFromStorage({
              user: userData,
              access_token: accessToken,
              refresh_token: refreshToken || "",
            }));

            dispatch(profile_sec({ access_token: accessToken })).catch((error: any) => {
              console.log('Failed to fetch fresh profile, using stored data');
            });

            return true;
          } catch (validationError: any) {
            // Only clear storage on definitive auth errors; otherwise, keep session and continue
            if (axios.isAxiosError(validationError) && validationError.response &&
                (validationError.response.status === 401 || validationError.response.status === 403)) {
              await AsyncStorage.removeItem('access_token');
              await AsyncStorage.removeItem('refresh_token');
              await AsyncStorage.removeItem('user_details');
              return false;
            }

            // Network or server error without auth failure: proceed with stored data
            dispatch(authSlice.actions.setUserFromStorage({
              user: userData,
              access_token: accessToken,
              refresh_token: refreshToken || "",
            }));
            return true;
          }
        }
      } catch (parseError) {
        console.log('Error parsing stored user data:', parseError);
      }
    }

    return false;
  } catch (error) {
    console.log('Error initializing auth:', error);
    return false;
  }
};

export const { logout, resetUserStatus, setUserFromStorage, initializeBookmarks } = authSlice.actions;
export { signup, login, googleLogin, profile_sec, rewardCount, createReport, authFeed };
export default authSlice.reducer;
