import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "./auth.api";
import { TOKEN_KEY } from "../../api/axiosInstance";


const extractUser = (res) => {
  const payload = res?.data?.data ?? res?.data;
  return payload?.user ?? payload ?? null;
};
const getError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (form, { rejectWithValue }) => {
    try {
      return extractUser(await authApi.register(form));
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (form, { rejectWithValue }) => {
    try {
      const res = await authApi.login(form);
      // Persist the token so the axios interceptor can send it as a Bearer
      // header (survives cross-site cookie blocking).
      const token = res?.data?.data?.accessToken;
      if (token) localStorage.setItem(TOKEN_KEY, token);
      return extractUser(res);
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  },
);

export const fetchMe = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      return extractUser(await authApi.me());
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return null;
    } catch (err) {
      return rejectWithValue(getError(err));
    } finally {
      localStorage.removeItem(TOKEN_KEY);
    }
  },
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false, // login / register in flight
  bootstrapping: true, // first /me on app load
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(registerUser.fulfilled, (s) => {
        s.loading = false;
        // Signup returns no cookie — user logs in next. Do NOT authenticate.
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(loginUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload;
        s.isAuthenticated = !!a.payload;
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(fetchMe.pending, (s) => {
        s.bootstrapping = true;
      })
      .addCase(fetchMe.fulfilled, (s, a) => {
        s.bootstrapping = false;
        s.user = a.payload;
        s.isAuthenticated = !!a.payload;
      })
      .addCase(fetchMe.rejected, (s) => {
        s.bootstrapping = false;
        s.user = null;
        s.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (s) => {
        s.user = null;
        s.isAuthenticated = false;
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export const selectAuth = (s) => s.auth;
export const selectUser = (s) => s.auth.user;
export const selectRole = (s) => s.auth.user?.role ?? null;
export const selectIsAuthenticated = (s) => s.auth.isAuthenticated;

export default authSlice.reducer;
