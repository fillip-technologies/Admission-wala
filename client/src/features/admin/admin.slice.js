import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminApi } from "./admin.api";

const getError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

// ─── Thunks ────────────────────────────────────────────────────────────────

export const getAllStudents = createAsyncThunk(
  "admin/getAllStudents",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminApi.getAllStudents();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  },
);

export const getAllEnquiry = createAsyncThunk(
  "admin/getAllEnquiry",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminApi.getAllEnquiry();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  },
);

// ─── Slice ─────────────────────────────────────────────────────────────────

const initialState = {
  students: [],
  studentsLoading: false,
  studentsError: null,

  enquiries: [],
  enquiriesLoading: false,
  enquiriesError: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.studentsError = null;
      state.enquiriesError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllStudents
      .addCase(getAllStudents.pending, (s) => {
        s.studentsLoading = true;
        s.studentsError = null;
      })
      .addCase(getAllStudents.fulfilled, (s, a) => {
        s.studentsLoading = false;
        s.students = a.payload ?? [];
      })
      .addCase(getAllStudents.rejected, (s, a) => {
        s.studentsLoading = false;
        s.studentsError = a.payload;
      })

      // getAllEnquiry
      .addCase(getAllEnquiry.pending, (s) => {
        s.enquiriesLoading = true;
        s.enquiriesError = null;
      })
      .addCase(getAllEnquiry.fulfilled, (s, a) => {
        s.enquiriesLoading = false;
        s.enquiries = a.payload ?? [];
      })
      .addCase(getAllEnquiry.rejected, (s, a) => {
        s.enquiriesLoading = false;
        s.enquiriesError = a.payload;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────

export const selectStudents = (s) => s.admin.students;
export const selectStudentsLoading = (s) => s.admin.studentsLoading;
export const selectStudentsError = (s) => s.admin.studentsError;

export const selectEnquiries = (s) => s.admin.enquiries;
export const selectEnquiriesLoading = (s) => s.admin.enquiriesLoading;
export const selectEnquiriesError = (s) => s.admin.enquiriesError;

export default adminSlice.reducer;