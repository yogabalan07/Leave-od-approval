import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

const navItems: Record<string, NavItem[]> = {
  STUDENT: [
    {
      name: "Dashboard",
      path: "/student/dashboard",
      icon: "🏠",
    },
    {
      name: "Apply OD",
      path: "/student/apply-od",
      icon: "📝",
    },
    {
      name: "Apply Leave",
      path: "/student/apply-leave",
      icon: "📅",
    },
    {
      name: "My Applications",
      path: "/student/applications",
      icon: "📋",
    },
    {
      name: "Profile",
      path: "/student/profile",
      icon: "👤",
    },
  ],

  MENTOR: [
    {
      name: "Dashboard",
      path: "/mentor/dashboard",
      icon: "🏠",
    },
    {
      name: "Pending Applications",
      path: "/mentor/pending",
      icon: "⏳",
    },
    {
      name: "Approval History",
      path: "/mentor/history",
      icon: "✅",
    },
  ],

  HOD: [
    {
      name: "Dashboard",
      path: "/hod/dashboard",
      icon: "🏠",
    },
    {
      name: "Applications",
      path: "/hod/applications",
      icon: "📋",
    },
    {
      name: "Analytics",
      path: "/hod/analytics",
      icon: "📊",
    },
    {
      name: "Reports",
      path: "/hod/reports",
      icon: "📈",
    },
  ],

  VERIFIER: [
    {
      name: "Dashboard",
      path: "/verifier/dashboard",
      icon: "🏠",
    },
    {
      name: "Verification Queue",
      path: "/verifier/queue",
      icon: "🔍",
    },
  ],

  ADMIN: [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: "🏠",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "👥",
    },
    {
      name: "Students",
      path: "/admin/students",
      icon: "🎓",
    },
    {
      name: "Faculty",
      path: "/admin/faculty",
      icon: "👨‍🏫",
    },
    {
      name: "Departments",
      path: "/admin/departments",
      icon: "🏢",
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: "⚙️",
    },
  ],
};

export default function Navbar() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");

  let user: any = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    user = null;
  }

  const role = user?.role || "STUDENT";

  const items = navItems[role] || [];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside className="app-sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          🎓
        </div>

        <div>
          <h2>Smart OD</h2>
          <span>Approval System</span>
        </div>
      </div>

      {/* User */}
      <div className="sidebar-user">

        <div className="user-avatar">
          {user?.name
            ? user.name
                .charAt(0)
                .toUpperCase()
            : "U"}
        </div>

        <div className="user-info">
          <strong>
            {user?.name || "User"}
          </strong>

          <span>
            {role}
          </span>
        </div>

      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <div className="nav-title">
          MAIN MENU
        </div>

        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${
                isActive
                  ? "sidebar-link-active"
                  : ""
              }`
            }
          >
            <span className="nav-icon">
              {item.icon}
            </span>

            <span>
              {item.name}
            </span>
          </NavLink>
        ))}

      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}