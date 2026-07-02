import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminApi } from "./admin.api";

const getError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

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

export const getAllCounsellers = createAsyncThunk(
  "admin/getAllCounsellers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminApi.getAllCounsellers();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  },
);

export const createCounseller = createAsyncThunk(
  "admin/createCounseller",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await adminApi.createCounseller(payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  },
);

const initialState = {
  students: [],
  studentsLoading: false,
  studentsError: null,

  enquiries: [],
  enquiriesLoading: false,
  enquiriesError: null,

  counsellers: [],
  counsellersLoading: false,
  counsellersError: null,

  createCounsellerLoading: false,
  createCounsellerError: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.studentsError = null;
      state.enquiriesError = null;
      state.counsellersError = null;
      state.createCounsellerError = null;
    },
    clearCreateCounsellerError: (state) => {
      state.createCounsellerError = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      })

      .addCase(getAllCounsellers.pending, (s) => {
        s.counsellersLoading = true;
        s.counsellersError = null;
      })
      .addCase(getAllCounsellers.fulfilled, (s, a) => {
        s.counsellersLoading = false;
        s.counsellers = a.payload ?? [];
      })
      .addCase(getAllCounsellers.rejected, (s, a) => {
        s.counsellersLoading = false;
        s.counsellersError = a.payload;
      })

      .addCase(createCounseller.pending, (s) => {
        s.createCounsellerLoading = true;
        s.createCounsellerError = null;
      })
      .addCase(createCounseller.fulfilled, (s, a) => {
        s.createCounsellerLoading = false;
        if (a.payload?._id) {
          s.counsellers = [
            a.payload,
            ...s.counsellers.filter((c) => c._id !== a.payload._id),
          ];
        }
      })
      .addCase(createCounseller.rejected, (s, a) => {
        s.createCounsellerLoading = false;
        s.createCounsellerError = a.payload;
      });
  },
});

export const { clearAdminError, clearCreateCounsellerError } =
  adminSlice.actions;

export const selectStudents = (s) => s.admin.students;
export const selectStudentsLoading = (s) => s.admin.studentsLoading;
export const selectStudentsError = (s) => s.admin.studentsError;

export const selectEnquiries = (s) => s.admin.enquiries;
export const selectEnquiriesLoading = (s) => s.admin.enquiriesLoading;
export const selectEnquiriesError = (s) => s.admin.enquiriesError;

export const selectCounsellers = (s) => s.admin.counsellers;
export const selectCounsellersLoading = (s) => s.admin.counsellersLoading;
export const selectCounsellersError = (s) => s.admin.counsellersError;
export const selectCreateCounsellerLoading = (s) =>
  s.admin.createCounsellerLoading;
export const selectCreateCounsellerError = (s) =>
  s.admin.createCounsellerError;

export default adminSlice.reducer;
