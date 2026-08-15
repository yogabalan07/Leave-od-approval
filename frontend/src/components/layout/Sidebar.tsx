import React from "react";
import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  registerNo?: string;
}

interface MenuItem {
  label: string;
  path: string;
  icon: string;
}

const menus: Record<string, MenuItem[]> = {
  STUDENT: [
    {
      label: "Dashboard",
      path: "/student/dashboard",
      icon: "⌂",
    },
    {
      label: "Apply OD",
      path: "/student/apply-od",
      icon: "📝",
    },
    {
      label: "Apply Leave",
      path: "/student/apply-leave",
      icon: "📅",
    },
    {
      label: "My Applications",
      path: "/student/applications",
      icon: "📋",
    },
    {
      label: "Profile",
      path: "/student/profile",
      icon: "👤",
    },
  ],

  MENTOR: [
    {
      label: "Dashboard",
      path: "/mentor/dashboard",
      icon: "⌂",
    },
    {
      label: "Pending Applications",
      path: "/mentor/pending",
      icon: "⏳",
    },
    {
      label: "Approval History",
      path: "/mentor/history",
      icon: "✓",
    },
  ],

  HOD: [
    {
      label: "Dashboard",
      path: "/hod/dashboard",
      icon: "⌂",
    },
    {
      label: "Applications",
      path: "/hod/applications",
      icon: "📋",
    },
    {
      label: "Analytics",
      path: "/hod/analytics",
      icon: "📊",
    },
    {
      label: "Reports",
      path: "/hod/reports",
      icon: "📈",
    },
  ],

  VERIFIER: [
    {
      label: "Dashboard",
      path: "/verifier/dashboard",
      icon: "⌂",
    },
    {
      label: "Verification Queue",
      path: "/verifier/queue",
      icon: "🔍",
    },
  ],

  ADMIN: [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: "⌂",
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: "👥",
    },
    {
      label: "Students",
      path: "/admin/students",
      icon: "🎓",
    },
    {
      label: "Faculty",
      path: "/admin/faculty",
      icon: "👨‍🏫",
    },
    {
      label: "Departments",
      path: "/admin/departments",
      icon: "🏢",
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: "⚙",
    },
  ],
};

function getUser(): User | null {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = getUser();

  const role = user?.role?.toUpperCase() || "STUDENT";

  const menuItems = menus[role] || menus.STUDENT;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  const getInitial = () => {
    if (!user?.name) {
      return "U";
    }

    return user.name.charAt(0).toUpperCase();
  };

  return (
    <aside className="sidebar">

      {/* ================= LOGO ================= */}

      <div className="sidebar-logo">

        <div className="sidebar-logo-icon">
          🎓
        </div>

        <div className="sidebar-logo-text">
          <h2>Smart OD</h2>
          <span>Approval System</span>
        </div>

      </div>

      {/* ================= USER ================= */}

      <div className="sidebar-user">

        <div className="sidebar-avatar">
          {getInitial()}
        </div>

        <div className="sidebar-user-info">

          <strong>
            {user?.name || "User"}
          </strong>

          <span>
            {role}
          </span>

        </div>

      </div>

      {/* ================= NAVIGATION ================= */}

      <div className="sidebar-section-title">
        MAIN MENU
      </div>

      <nav className="sidebar-navigation">

        {menuItems.map((item) => {

          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(
              item.path + "/"
            );

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >

              <span className="sidebar-link-icon">
                {item.icon}
              </span>

              <span className="sidebar-link-text">
                {item.label}
              </span>

              {isActive && (
                <span className="sidebar-active-indicator" />
              )}

            </NavLink>
          );
        })}

      </nav>

      {/* ================= BOTTOM ================= */}

      <div className="sidebar-bottom">

        <div className="sidebar-role-card">

          <div className="role-card-icon">
            🛡️
          </div>

          <div>
            <strong>
              {role}
            </strong>

            <span>
              Account
            </span>
          </div>

        </div>

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >

          <span>
            ⇥
          </span>

          Logout

        </button>

      </div>

    </aside>
  );
};

export default Sidebar;