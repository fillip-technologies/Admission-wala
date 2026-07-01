import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminApi } from "./admin.api";

const getError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

// Async Thunk
export const getAllStudents = createAsyncThunk(
  "admin/getAllStudents",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminApi.getAllStudents();

      // Adjust this if your backend response is different
      return res.data.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

const initialState = {
  students: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending
      .addCase(getAllStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // Fulfilled
      .addCase(getAllStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })

      // Rejected
      .addCase(getAllStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;

// Selectors
export const selectStudents = (state) => state.admin.students;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;

export default adminSlice.reducer;