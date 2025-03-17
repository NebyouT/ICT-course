import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import HeroSection from "./pages/student/HeroSection";
import MainLayout from "./layout/MainLayout";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/course/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetail from "./pages/student/CourseDetail";
import CourseProgress from "./pages/student/CourseProgress";
import CourseTest from "./pages/student/CourseTest";
import Certificate from "./pages/student/Certificate";
import SearchPage from "./pages/student/SearchPage";
import VerifyPayment from "./pages/student/VerifyPayment";
import Tests from "./pages/admin/test/Tests";
import {
  AdminRoute,
  AuthenticatedUser,
  ProtectedRoute,
} from "./components/ProtectedRoutes";
import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";
import { ThemeProvider } from "./components/theme-provider";
import AuthSuccess from "./pages/auth/AuthSuccess";
import AuthFailure from "./pages/auth/AuthFailure";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

// Create router with future flags enabled
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <NotFound />,
      children: [
        {
          path: "/",
          element: <HeroSection />,
        },
        {
          path: "login",
          element: (
            <AuthenticatedUser>
              <Login />
            </AuthenticatedUser>
          ),
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "forgot-password",
          element: (
            <AuthenticatedUser>
              <ForgotPassword />
            </AuthenticatedUser>
          ),
        },
        {
          path: "reset-password/:token",
          element: (
            <AuthenticatedUser>
              <ResetPassword />
            </AuthenticatedUser>
          ),
        },
        {
          path: "my-learning",
          element: (
            <ProtectedRoute>
              <MyLearning />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "course/search",
          element: (
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "course-detail/:courseId",
          element: (
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          ),
        },
        {
          path: "course-progress/:courseId",
          element: (
            <ProtectedRoute>
              <PurchaseCourseProtectedRoute>
                <CourseProgress />
              </PurchaseCourseProtectedRoute>
            </ProtectedRoute>
          ),
        },
        {
          path: "course-test/:courseId",
          element: (
            <ProtectedRoute>
              <CourseTest />
            </ProtectedRoute>
          ),
        },
        {
          path: "certificate/:courseId",
          element: (
            <ProtectedRoute>
              <Certificate />
            </ProtectedRoute>
          ),
        },
        {
          path: "verify-payment/:tx_ref",
          element: (
            <ProtectedRoute>
              <VerifyPayment />
            </ProtectedRoute>
          ),
        },

        // admin routes start from here
        {
          path: "admin",
          element: (
            <AdminRoute>
              <Sidebar />
            </AdminRoute>
          ),
          children: [
            {
              path: "dashboard",
              element: <Dashboard />,
            },
            {
              path: "course",
              element: <CourseTable />,
            },
            {
              path: "test",
              element: <Tests />,
            },
            {
              path: "course/add",
              element: <AddCourse />,
            },
            {
              path: "course/edit/:courseId",
              element: <EditCourse />,
            },
            {
              path: "course/:courseId/lectures",
              element: <CreateLecture />,
            },
            {
              path: "course/:courseId/lectures/:lectureId",
              element: <EditLecture />,
            },
            {
              path: "lecture/create/:courseId",
              element: <CreateLecture />,
            },
          ],
        },
      ],
    },
    // Auth routes outside MainLayout
    {
      path: "auth/success",
      element: <AuthSuccess />,
    },
    {
      path: "auth/failure",
      element: <AuthFailure />,
    },
    // Catch-all route for 404
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
    },
  }
);

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
