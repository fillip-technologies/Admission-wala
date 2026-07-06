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
const Blogs    = lazy(() => import("../pages/public/Blogs"));
const BlogPost = lazy(() => import("../pages/public/BlogPost"));
const NotFound = lazy(() => import("../pages/public/NotFound"));

// Auth
const Login          = lazy(() => import("../pages/auth/Login"));
const Signup         = lazy(() => import("../pages/auth/Signup"));
const VerifyEmail    = lazy(() => import("../pages/auth/VerifyEmail"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));

// Student
const StudentDashboard = lazy(() => import("../pages/student/StudentDashboard"));
const Admission        = lazy(() => import("../pages/student/Admission"));
const Counselling      = lazy(() => import("../pages/student/Counselling"));
const StudentTickets   = lazy(() => import("../pages/student/Tickets"));
const Profile          = lazy(() => import("../pages/student/Profile"));

// Counseller
const CounsellerDashboard = lazy(() => import("../pages/counseller/CounsellerDashboard"));
const CounsellerTickets   = lazy(() => import("../pages/counseller/Tickets"));

// Admin
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const Students       = lazy(() => import("../pages/admin/Students"));
const Enquiry        = lazy(() => import("../pages/admin/Enquiry"));
const Counsellers    = lazy(() => import("../pages/admin/Counsellers"));
const Announcements  = lazy(() => import("../pages/admin/Announcements"));
const Promos         = lazy(() => import("../pages/admin/Promos"));
const Reports        = lazy(() => import("../pages/admin/Reports"));

export const router = createBrowserRouter([
  {
    element: <RootBoot />,
    errorElement: <RouteError />,
    children: [

      // ── public ──────────────────────────────────────────────────────────
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "blogs", element: <Blogs /> },
          { path: "blogs/:slug", element: <BlogPost /> },
        ],
      },

      // ── auth (blocked for logged-in users) ──────────────────────────────
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: "login",           element: <Login />          },
              { path: "signup",          element: <Signup />         },
              { path: "verify-email",    element: <VerifyEmail />    },
              { path: "forgot-password", element: <ForgotPassword /> },
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
              { index: true,        element: <StudentDashboard /> },
              { path: "admission",  element: <Admission />        },
              { path: "counselling", element: <Counselling />     },
              { path: "tickets",    element: <StudentTickets />   },
              { path: "profile",    element: <Profile />          },
            ],
          },
        ],
      },

      // ── counseller ──────────────────────────────────────────────────────
      {
        path: "counseller",
        element: <RoleRoute allow={[ROLES.COUNSELLER]} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { index: true, element: <CounsellerDashboard /> },
              { path: "tickets", element: <CounsellerTickets /> },
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
              { path: "announcements", element: <Announcements /> },
              { path: "promos",      element: <Promos />         },
              { path: "reports",     element: <Reports />        },
            ],
          },
        ],
      },

      // ── 404 ─────────────────────────────────────────────────────────────
      { path: "*", element: <NotFound /> },
    ],
  },
]);