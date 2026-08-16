import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  registerNo?: string;
}

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // ---------------------------------------------------------
  // LOAD USER
  // ---------------------------------------------------------

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      localStorage.removeItem("user");
    }
  }, []);

  // ---------------------------------------------------------
  // PAGE TITLE
  // ---------------------------------------------------------

  const getPageTitle = () => {
    const path = location.pathname;

    if (path.includes("/student/dashboard")) {
      return "Student Dashboard";
    }

    if (path.includes("/student/apply-od")) {
      return "Apply OD";
    }

    if (path.includes("/student/apply-leave")) {
      return "Apply Leave";
    }

    if (path.includes("/student/applications")) {
      return "My Applications";
    }

    if (path.includes("/student/profile")) {
      return "My Profile";
    }

    if (path.includes("/student/od/")) {
      return "OD Details";
    }

    if (path.includes("/student/upload-evidence")) {
      return "Upload Evidence";
    }

    if (path.includes("/mentor/dashboard")) {
      return "Mentor Dashboard";
    }

    if (path.includes("/mentor/pending")) {
      return "Pending Applications";
    }

    if (path.includes("/mentor/applications")) {
      return "Applications";
    }

    if (path.includes("/mentor/application/")) {
      return "Application Details";
    }

    if (path.includes("/mentor/history")) {
      return "Approval History";
    }

    if (path.includes("/hod/dashboard")) {
      return "HOD Dashboard";
    }

    if (path.includes("/hod/applications")) {
      return "Applications";
    }

    if (path.includes("/hod/application/")) {
      return "Application Details";
    }

    if (path.includes("/hod/analytics")) {
      return "Analytics";
    }

    if (path.includes("/hod/reports")) {
      return "Reports";
    }

    if (path.includes("/verifier/dashboard")) {
      return "Verifier Dashboard";
    }

    if (path.includes("/verifier/queue")) {
      return "Verification Queue";
    }

    if (path.includes("/verifier/verification/")) {
      return "Verification Details";
    }

    if (path.includes("/verifier/evidence/")) {
      return "Evidence Viewer";
    }

    if (path.includes("/verifier/geo/")) {
      return "Geo Verification";
    }

    if (path.includes("/admin/dashboard")) {
      return "Admin Dashboard";
    }

    if (path.includes("/admin/users")) {
      return "Users";
    }

    if (path.includes("/admin/students")) {
      return "Students";
    }

    if (path.includes("/admin/faculty")) {
      return "Faculty";
    }

    if (path.includes("/admin/departments")) {
      return "Departments";
    }

    if (path.includes("/admin/settings")) {
      return "Settings";
    }

    return "Smart OD System";
  };

  // ---------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  // ---------------------------------------------------------
  // USER INITIAL
  // ---------------------------------------------------------

  const getInitial = () => {
    if (!user?.name) {
      return "U";
    }

    return user.name.charAt(0).toUpperCase();
  };

  // ---------------------------------------------------------
  // ROLE LABEL
  // ---------------------------------------------------------

  const getRoleName = () => {
    if (!user?.role) {
      return "User";
    }

    switch (user.role.toUpperCase()) {
      case "STUDENT":
        return "Student";

      case "MENTOR":
        return "Mentor";

      case "HOD":
        return "Head of Department";

      case "VERIFIER":
        return "Verifier";

      case "ADMIN":
        return "Administrator";

      default:
        return user.role;
    }
  };

  return (
    <div className="app-layout">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile overlay */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <div className="app-main">

        {/* =================================================
            TOP NAVBAR
        ================================================== */}

        <header className="top-navbar">

          {/* Mobile Menu Button */}

          <button
            className="mobile-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>

          {/* Page title */}

          <div className="page-heading">
            <h1>{getPageTitle()}</h1>

            <p>
              Smart OD & Leave Approval System
            </p>
          </div>

          {/* Right side */}

          <div className="navbar-right">

            {/* Notification */}

            <button
              className="notification-button"
              onClick={() => {
                // Notification page can be added later
              }}
              title="Notifications"
            >
              🔔

              <span className="notification-dot" />
            </button>

            {/* User */}

            <div className="navbar-user">

              <div className="user-avatar">
                {getInitial()}
              </div>

              <div className="user-info">
                <strong>
                  {user?.name || "User"}
                </strong>

                <span>
                  {getRoleName()}
                </span>
              </div>

            </div>

            {/* Logout */}

            <button
              className="logout-button"
              onClick={handleLogout}
              title="Logout"
            >
              ↪
              <span>Logout</span>
            </button>

          </div>

        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================== */}

        <main className="page-content">

          <Outlet />

        </main>

      </div>

    </div>
  );
}
