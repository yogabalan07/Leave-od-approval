import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ==================== AUTH ====================
import Login from "../pages/auth/Login";

// ==================== STUDENT ====================
import StudentDashboard from "../pages/student/Dashboard";
import Profile from "../pages/student/Profile";
import ApplyOD from "../pages/student/ApplyOD";
import ApplyLeave from "../pages/student/ApplyLeave";
import MyApplications from "../pages/student/MyApplications";
import ODDetails from "../pages/student/ODDetails";
import UploadEvidence from "../pages/student/UploadEvidence";

// ==================== MENTOR ====================
import MentorDashboard from "../pages/mentor/Dashboard";
import MentorPendingApplications from "../pages/mentor/PendingApplications";
import MentorApplicationDetails from "../pages/mentor/ApplicationDetails";
import MentorApprovalHistory from "../pages/mentor/ApprovalHistory";

// ==================== HOD ====================
import HODDashboard from "../pages/hod/Dashboard";
import HODApplications from "../pages/hod/Applications";
import HODApplicationDetails from "../pages/hod/ApplicationDetails";
import HODAnalytics from "../pages/hod/Analytics";
import HODReports from "../pages/hod/Reports";

// ==================== VERIFIER ====================
import VerifierDashboard from "../pages/verifier/Dashboard";
import VerificationQueue from "../pages/verifier/VerificationQueue";
import VerificationDetails from "../pages/verifier/VerificationDetails";
import EvidenceViewer from "../pages/verifier/EvidenceViewer";
import GeoVerification from "../pages/verifier/GeoVerification";

// ==================== ADMIN ====================
import AdminDashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Students from "../pages/admin/Students";
import Faculty from "../pages/admin/Faculty";
import Departments from "../pages/admin/Departments";
import Settings from "../pages/admin/Settings";

// ==================== PUBLIC ====================
import VerifyDocument from "../pages/public/VerifyDocument";

// ==================== LAYOUT ====================
import AppLayout from "../components/layout/AppLayout";

// ==================== PROTECTED ROUTE ====================
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================================
            PUBLIC ROUTES
        ====================================================== */}

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/verify-document"
          element={<VerifyDocument />}
        />

        {/* =====================================================
            PROTECTED APPLICATION
        ====================================================== */}

        <Route element={<ProtectedRoute />}>

          <Route element={<AppLayout />}>

            {/* =================================================
                STUDENT ROUTES
            ================================================== */}

            <Route
              path="/student"
              element={<Navigate to="/student/dashboard" replace />}
            />

            <Route
              path="/student/dashboard"
              element={<StudentDashboard />}
            />

            <Route
              path="/student/profile"
              element={<Profile />}
            />

            <Route
              path="/student/apply-od"
              element={<ApplyOD />}
            />

            <Route
              path="/student/apply-leave"
              element={<ApplyLeave />}
            />

            <Route
              path="/student/applications"
              element={<MyApplications />}
            />

            <Route
              path="/student/od/:id"
              element={<ODDetails />}
            />

            <Route
              path="/student/upload-evidence/:id"
              element={<UploadEvidence />}
            />

            {/* =================================================
                MENTOR ROUTES
            ================================================== */}

            <Route
              path="/mentor"
              element={<Navigate to="/mentor/dashboard" replace />}
            />

            <Route
              path="/mentor/dashboard"
              element={<MentorDashboard />}
            />

            <Route
              path="/mentor/pending"
              element={<MentorPendingApplications />}
            />

            <Route
              path="/mentor/applications"
              element={<MentorPendingApplications />}
            />

            <Route
              path="/mentor/application/:id"
              element={<MentorApplicationDetails />}
            />

            <Route
              path="/mentor/history"
              element={<MentorApprovalHistory />}
            />

            {/* =================================================
                HOD ROUTES
            ================================================== */}

            <Route
              path="/hod"
              element={<Navigate to="/hod/dashboard" replace />}
            />

            <Route
              path="/hod/dashboard"
              element={<HODDashboard />}
            />

            <Route
              path="/hod/applications"
              element={<HODApplications />}
            />

            <Route
              path="/hod/application/:id"
              element={<HODApplicationDetails />}
            />

            <Route
              path="/hod/analytics"
              element={<HODAnalytics />}
            />

            <Route
              path="/hod/reports"
              element={<HODReports />}
            />

            {/* =================================================
                VERIFIER ROUTES
            ================================================== */}

            <Route
              path="/verifier"
              element={<Navigate to="/verifier/dashboard" replace />}
            />

            <Route
              path="/verifier/dashboard"
              element={<VerifierDashboard />}
            />

            <Route
              path="/verifier/queue"
              element={<VerificationQueue />}
            />

            <Route
              path="/verifier/verification/:id"
              element={<VerificationDetails />}
            />

            <Route
              path="/verifier/evidence/:id"
              element={<EvidenceViewer />}
            />

            <Route
              path="/verifier/geo/:id"
              element={<GeoVerification />}
            />

            {/* =================================================
                ADMIN ROUTES
            ================================================== */}

            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/users"
              element={<Users />}
            />

            <Route
              path="/admin/students"
              element={<Students />}
            />

            <Route
              path="/admin/faculty"
              element={<Faculty />}
            />

            <Route
              path="/admin/departments"
              element={<Departments />}
            />

            <Route
              path="/admin/settings"
              element={<Settings />}
            />

          </Route>

        </Route>

        {/* =====================================================
            404
        ====================================================== */}

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}
