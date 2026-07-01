import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import RootBoot        from "./RootBoot";
import RoleRoute       from "./RoleRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import RouteError      from "./RouteError";

import PublicLayout    from "../layouts/PublicLayout";
import AuthLayout      from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import { ROLES } from "../config/roles";

// Public
const Home    = lazy(() => import("../pages/public/Home"));
const NotFound = lazy(() => import("../pages/public/NotFound"));

// Auth
const Login  = lazy(() => import("../pages/auth/Login"));
const Signup = lazy(() => import("../pages/auth/Signup"));

// Student
const StudentDashboard = lazy(() => import("../pages/student/StudentDashboard"));
const Admission        = lazy(() => import("../pages/student/Admission"));
const Profile          = lazy(() => import("../pages/student/Profile"));

// Admin
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const Students       = lazy(() => import("../pages/admin/Students"));
const Enquiry        = lazy(() => import("../pages/admin/Enquiry"));
const Counsellers    = lazy(() => import("../pages/admin/Counsellers"));

export const router = createBrowserRouter([
  {
    element: <RootBoot />,
    errorElement: <RouteError />,
    children: [

      // ── public ──────────────────────────────────────────────────────────
      {
        element: <PublicLayout />,
        children: [{ index: true, element: <Home /> }],
      },

      // ── auth (blocked for logged-in users) ──────────────────────────────
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: "login",  element: <Login />  },
              { path: "signup", element: <Signup /> },
            ],
          },
        ],
      },

      // ── student ─────────────────────────────────────────────────────────
      {
        path: "student",
        element: <RoleRoute allow={[ROLES.STUDENT]} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { index: true,       element: <StudentDashboard /> },
              { path: "admission", element: <Admission />        },
              { path: "profile",   element: <Profile />          },
            ],
          },
        ],
      },

      // ── admin ────────────────────────────────────────────────────────────
      {
        path: "admin",
        element: <RoleRoute allow={[ROLES.ADMIN]} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { index: true,         element: <AdminDashboard /> },
              { path: "students",    element: <Students />       },
              { path: "enquiry",     element: <Enquiry />        },
              { path: "counsellers", element: <Counsellers />    },
            ],
          },
        ],
      },

      // ── 404 ─────────────────────────────────────────────────────────────
      { path: "*", element: <NotFound /> },
    ],
  },
]);