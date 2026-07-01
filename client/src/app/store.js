import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import adminReducer from "../features/admin/admin.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    // add feature reducers here as you scale (admissions, leads, counselling…)
  },
});