import React from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";

import Login from "../pages/auth/Login";

import StudentDashboard from "../pages/student/Dashboard";
import ApplyOD from "../pages/student/ApplyOD";
import ApplyLeave from "../pages/student/ApplyLeave";
import MyApplications from "../pages/student/MyApplications";
import Profile from "../pages/student/Profile";
import ODDetails from "../pages/student/ODDetails";
import UploadEvidence from "../pages/student/UploadEvidence";

import MentorDashboard from "../pages/mentor/Dashboard";
import MentorPending from "../pages/mentor/PendingApplications";
import MentorHistory from "../pages/mentor/ApprovalHistory";

import HODDashboard from "../pages/hod/Dashboard";
import HODApplications from "../pages/hod/Applications";
import HODAnalytics from "../pages/hod/Analytics";
import HODReports from "../pages/hod/Reports";

import VerifierDashboard from "../pages/verifier/Dashboard";
import VerificationQueue from "../pages/verifier/VerificationQueue";

import AdminDashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Students from "../pages/admin/Students";
import Faculty from "../pages/admin/Faculty";
import Departments from "../pages/admin/Departments";
import Settings from "../pages/admin/Settings";

const AppRoutes: React.FC = () => {
  return (
    <Routes>

      {/* ================= AUTH ================= */}

      <Route
        path="/login"
        element={<Login />}
      />


      {/* ================= APPLICATION ================= */}

      <Route element={<AppLayout />}>

        {/* ---------- STUDENT ---------- */}

        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
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

        <Route
          path="/student/profile"
          element={<Profile />}
        />


        {/* ---------- MENTOR ---------- */}

        <Route
          path="/mentor/dashboard"
          element={<MentorDashboard />}
        />

        <Route
          path="/mentor/pending"
          element={<MentorPending />}
        />

        <Route
          path="/mentor/history"
          element={<MentorHistory />}
        />


        {/* ---------- HOD ---------- */}

        <Route
          path="/hod/dashboard"
          element={<HODDashboard />}
        />

        <Route
          path="/hod/applications"
          element={<HODApplications />}
        />

        <Route
          path="/hod/analytics"
          element={<HODAnalytics />}
        />

        <Route
          path="/hod/reports"
          element={<HODReports />}
        />


        {/* ---------- VERIFIER ---------- */}

        <Route
          path="/verifier/dashboard"
          element={<VerifierDashboard />}
        />

        <Route
          path="/verifier/queue"
          element={<VerificationQueue />}
        />


        {/* ---------- ADMIN ---------- */}

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


      {/* ================= DEFAULT ================= */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
};

export default AppRoutes;