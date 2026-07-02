import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../api/authApi";

/**
 * Your controllers use the ApiResponse utility, so a typical body looks like:
 *   { statusCode, success, message, data: { user } }   OR   { ..., data: user }
 * This helper handles both shapes. If your /me or /login returns the user under
 * a different key, tweak ONLY this function.
 */
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
      return extractUser(await authApi.login(form));
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  },
);

// Runs once on app load to rehydrate the session from the httpOnly cookie.
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
    }
  },
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false, // login / register in flight
  bootstrapping: true, // first /me check on page load
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
      // register + login share the same pending/fulfilled/rejected behaviour
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        // Intentionally NOT setting user / isAuthenticated here.
        // Signup does not return auth cookies — the user logs in afterwards.
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // me — silent, just hydrates or clears
      .addCase(fetchMe.pending, (state) => {
        state.bootstrapping = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.bootstrapping = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.bootstrapping = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthError } = authSlice.actions;

// selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;