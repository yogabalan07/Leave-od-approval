import React from "react";
import { useLocation } from "react-router-dom";

interface User {
  name?: string;
  email?: string;
  role?: string;
}

const getUser = (): User | null => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

const getPageTitle = (pathname: string) => {

  if (pathname.includes("/dashboard")) {
    return "Dashboard";
  }

  if (pathname.includes("apply-od")) {
    return "Apply OD";
  }

  if (pathname.includes("apply-leave")) {
    return "Apply Leave";
  }

  if (pathname.includes("applications")) {
    return "Applications";
  }

  if (pathname.includes("profile")) {
    return "Profile";
  }

  if (pathname.includes("pending")) {
    return "Pending Applications";
  }

  if (pathname.includes("history")) {
    return "Approval History";
  }

  if (pathname.includes("analytics")) {
    return "Analytics";
  }

  if (pathname.includes("reports")) {
    return "Reports";
  }

  if (pathname.includes("queue")) {
    return "Verification Queue";
  }

  if (pathname.includes("users")) {
    return "Users";
  }

  if (pathname.includes("students")) {
    return "Students";
  }

  if (pathname.includes("faculty")) {
    return "Faculty";
  }

  if (pathname.includes("departments")) {
    return "Departments";
  }

  if (pathname.includes("settings")) {
    return "Settings";
  }

  return "Smart OD";
};

const Topbar: React.FC = () => {

  const location = useLocation();

  const user = getUser();

  const title = getPageTitle(
    location.pathname
  );

  const initial =
    user?.name
      ?.charAt(0)
      .toUpperCase() || "U";

  return (
    <header className="topbar">

      <div className="topbar-left">

        <div>
          <h1>
            {title}
          </h1>

          <p>
            Smart OD & Leave Management System
          </p>
        </div>

      </div>

      <div className="topbar-right">

        {/* Notification */}

        <button
          type="button"
          className="topbar-icon-button"
          title="Notifications"
        >
          🔔

          <span className="notification-dot" />
        </button>

        {/* Divider */}

        <div className="topbar-divider" />

        {/* User */}

        <div className="topbar-user">

          <div className="topbar-avatar">
            {initial}
          </div>

          <div className="topbar-user-info">

            <strong>
              {user?.name || "User"}
            </strong>

            <span>
              {user?.role || "STUDENT"}
            </span>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Topbar;