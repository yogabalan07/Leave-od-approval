import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

// Authentication
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";

// Student
import StudentDashboard from "../pages/student/Dashboard";
import StudentProfile from "../pages/student/Profile";
import ApplyOD from "../pages/student/ApplyOD";
import ApplyLeave from "../pages/student/ApplyLeave";
import MyApplications from "../pages/student/MyApplications";
import ODDetails from "../pages/student/ODDetails";
import UploadEvidence from "../pages/student/UploadEvidence";
import CaptureEvidence from "../pages/student/CaptureEvidence";
import Documents from "../pages/student/Documents";

// Mentor
import MentorDashboard from "../pages/mentor/Dashboard";
import MentorPendingApplications from "../pages/mentor/PendingApplications";
import MentorApplicationDetails from "../pages/mentor/ApplicationDetails";
import MentorApprovalHistory from "../pages/mentor/ApprovalHistory";

// HOD
import HODDashboard from "../pages/hod/Dashboard";
import HODApplications from "../pages/hod/Applications";
import HODApplicationDetails from "../pages/hod/ApplicationDetails";
import HODAnalytics from "../pages/hod/Analytics";
import HODReports from "../pages/hod/Reports";

// Verifier
import VerifierDashboard from "../pages/verifier/Dashboard";
import VerificationQueue from "../pages/verifier/VerificationQueue";
import VerificationDetails from "../pages/verifier/VerificationDetails";
import EvidenceViewer from "../pages/verifier/EvidenceViewer";
import GeoVerification from "../pages/verifier/GeoVerification";

// Admin
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminStudents from "../pages/admin/Students";
import AdminFaculty from "../pages/admin/Faculty";
import AdminDepartments from "../pages/admin/Departments";
import AdminSettings from "../pages/admin/Settings";

// Public
import VerifyDocument from "../pages/public/VerifyDocument";


// ======================================================
// AUTH TYPES
// ======================================================

type Role =
  | "STUDENT"
  | "MENTOR"
  | "HOD"
  | "VERIFIER"
  | "ADMIN";


// ======================================================
// AUTH HELPERS
// ======================================================

function getToken(): string | null {
  return localStorage.getItem("token");
}

function getUser(): any | null {
  try {
    const user = localStorage.getItem("user");

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  } catch (error) {
    console.error("Unable to read user:", error);
    return null;
  }
}


// ======================================================
// PROTECTED ROUTE
// ======================================================

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Role[];
}

function ProtectedRoute({
  children,
  roles,
}: ProtectedRouteProps) {
  const token = getToken();
  const user = getUser();

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role restriction
  if (
    roles &&
    roles.length > 0 &&
    !roles.includes(user.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}


// ======================================================
// DEFAULT DASHBOARD
// ======================================================

function DashboardRedirect() {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "STUDENT":
      return <Navigate to="/student" replace />;

    case "MENTOR":
      return <Navigate to="/mentor" replace />;

    case "HOD":
      return <Navigate to="/hod" replace />;

    case "VERIFIER":
      return <Navigate to="/verifier" replace />;

    case "ADMIN":
      return <Navigate to="/admin" replace />;

    default:
      return <Navigate to="/login" replace />;
  }
}


// ======================================================
// NOT FOUND
// ======================================================

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-slate-800">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold text-slate-900">
          Page Not Found
        </h2>

        <p className="mt-2 text-slate-500">
          The page you are looking for does not exist.
        </p>

        <a
          href="/"
          className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}


// ======================================================
// UNAUTHORIZED
// ======================================================

function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">

        <div className="mb-4 text-5xl">
          🔒
        </div>

        <h1 className="text-2xl font-bold text-slate-900">
          Access Denied
        </h1>

        <p className="mt-3 text-slate-500">
          You don't have permission to access this page.
        </p>

        <a
          href="/"
          className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Go to Dashboard
        </a>

      </div>
    </div>
  );
}


// ======================================================
// APP ROUTES
// ======================================================

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            PUBLIC ROUTES
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/verify-document"
          element={<VerifyDocument />}
        />


        {/* =================================================
            ROOT
        ================================================= */}

        <Route
          path="/"
          element={<DashboardRedirect />}
        />


        {/* =================================================
            STUDENT ROUTES
        ================================================= */}

        <Route
          path="/student"
          element={
            <ProtectedRoute roles={["STUDENT"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/profile"
          element={
            <ProtectedRoute roles={["STUDENT"]}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/apply-od"
          element={
            <ProtectedRoute roles={["STUDENT"]}>
              <ApplyOD />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/apply-leave"
          element={
            <ProtectedRoute roles={["STUDENT"]}>
              <ApplyLeave />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/applications"
          element={
            <ProtectedRoute roles={["STUDENT"]}>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/od/:id"
          element={
            <ProtectedRoute roles={["STUDENT"]}>
              <ODDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/upload-evidence/:id"
          element={
            <ProtectedRoute roles={["STUDENT"]}>
              <UploadEvidence />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/capture-evidence/:id"
          element={
            <ProtectedRoute roles={["STUDENT"]}>
              <CaptureEvidence />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/documents"
          element={
            <ProtectedRoute roles={["STUDENT"]}>
              <Documents />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            MENTOR ROUTES
        ================================================= */}

        <Route
          path="/mentor"
          element={
            <ProtectedRoute roles={["MENTOR"]}>
              <MentorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor/pending"
          element={
            <ProtectedRoute roles={["MENTOR"]}>
              <MentorPendingApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor/application/:id"
          element={
            <ProtectedRoute roles={["MENTOR"]}>
              <MentorApplicationDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor/history"
          element={
            <ProtectedRoute roles={["MENTOR"]}>
              <MentorApprovalHistory />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            HOD ROUTES
        ================================================= */}

        <Route
          path="/hod"
          element={
            <ProtectedRoute roles={["HOD"]}>
              <HODDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hod/applications"
          element={
            <ProtectedRoute roles={["HOD"]}>
              <HODApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hod/application/:id"
          element={
            <ProtectedRoute roles={["HOD"]}>
              <HODApplicationDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hod/analytics"
          element={
            <ProtectedRoute roles={["HOD"]}>
              <HODAnalytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hod/reports"
          element={
            <ProtectedRoute roles={["HOD"]}>
              <HODReports />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            VERIFIER ROUTES
        ================================================= */}

        <Route
          path="/verifier"
          element={
            <ProtectedRoute roles={["VERIFIER"]}>
              <VerifierDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/verifier/queue"
          element={
            <ProtectedRoute roles={["VERIFIER"]}>
              <VerificationQueue />
            </ProtectedRoute>
          }
        />

        <Route
          path="/verifier/details/:id"
          element={
            <ProtectedRoute roles={["VERIFIER"]}>
              <VerificationDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/verifier/evidence/:id"
          element={
            <ProtectedRoute roles={["VERIFIER"]}>
              <EvidenceViewer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/verifier/geo/:id"
          element={
            <ProtectedRoute roles={["VERIFIER"]}>
              <GeoVerification />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            ADMIN ROUTES
        ================================================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminStudents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/faculty"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminFaculty />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/departments"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminDepartments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminSettings />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            ERROR ROUTES
        ================================================= */}

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;