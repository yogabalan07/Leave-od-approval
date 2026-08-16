import {
  NavLink,
  useNavigate,
} from "react-router-dom";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface User {
  name?: string;
  role?: string;
  email?: string;
  registerNo?: string;
}

export default function Sidebar({
  isOpen = false,
  onClose,
}: SidebarProps) {
  const navigate = useNavigate();

  let user: User | null = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch {
    user = null;
  }

  const role = user?.role?.toUpperCase();

  const getDashboardPath = () => {
    switch (role) {
      case "STUDENT":
        return "/student/dashboard";

      case "MENTOR":
        return "/mentor/dashboard";

      case "HOD":
        return "/hod/dashboard";

      case "VERIFIER":
        return "/verifier/dashboard";

      case "ADMIN":
        return "/admin/dashboard";

      default:
        return "/login";
    }
  };

  const closeMobileMenu = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={`sidebar ${
        isOpen ? "sidebar-open" : ""
      }`}
    >

      {/* =================================================
          LOGO
      ================================================== */}

      <div className="sidebar-header">

        <div
          className="college-logo"
          onClick={() => {
            navigate(getDashboardPath());
            closeMobileMenu();
          }}
        >
          🎓
        </div>

        <div className="brand">

          <h2>
            Smart OD
          </h2>

          <span>
            Approval System
          </span>

        </div>

        {/* Mobile close */}

        <button
          className="sidebar-close"
          onClick={closeMobileMenu}
        >
          ×
        </button>

      </div>

      {/* =================================================
          USER CARD
      ================================================== */}

      <div className="sidebar-user">

        <div className="sidebar-avatar">
          {user?.name
            ? user.name.charAt(0).toUpperCase()
            : "U"}
        </div>

        <div>

          <strong>
            {user?.name || "User"}
          </strong>

          <span>
            {role || "USER"}
          </span>

        </div>

      </div>

      {/* =================================================
          NAVIGATION
      ================================================== */}

      <nav className="sidebar-nav">

        {/* ================= STUDENT ================= */}

        {role === "STUDENT" && (
          <>
            <NavItem
              to="/student/dashboard"
              icon="🏠"
              label="Dashboard"
              onClick={closeMobileMenu}
            />

            <NavItem
              to="/student/apply-od"
              icon="📝"
              label="Apply OD"
              onClick={closeMobileMenu}
            />

            <NavItem
              to="/student/apply-leave"
              icon="📅"
              label="Apply Leave"
              onClick={closeMobileMenu}
            />

            <NavItem
              to="/student/applications"
              icon="📋"
              label="My Applications"
              onClick={closeMobileMenu}
            />

            <NavItem
              to="/student/profile"
              icon="👤"
              label="Profile"
              onClick={closeMobileMenu}
            />
          </>
        )}

        {/* ================= MENTOR ================= */}

        {role === "MENTOR" && (
          <>
            <NavItem
              to="/mentor/dashboard"
              icon="🏠"
              label="Dashboard"
              onClick={closeMobileMenu}
            />

            <NavItem
              to="/mentor/pending"
              icon="⏳"
              label="Pending Applications"
              onClick={closeMobileMenu}
            />

            <NavItem
              to="/mentor/history"
              icon="📜"
              label="Approval History"
              onClick={closeMobileMenu}
            />
          </>
        )}

        {/* ================= HOD ================= */}

        {role === "HOD" && (
          <>
            <NavItem
              to="/hod/dashboard"
              icon="🏠"
              label="Dashboard"
              onClick={closeMobileMenu}
            />

            <NavItem
              to="/hod/applications"
              icon="📋"
              label="Applications"
              onClick={closeMobileMenu}
            />

            <NavItem
              to="/hod/analytics"
              icon="📊"
              label="Analytics"
              onClick={closeMobileMenu}
            />

            <NavItem
              to="/hod/reports"
              icon="📈"
              label="Reports"
              onClick={closeMobileMenu}
            />
          </>
        )}

        {/* ================= VERIFIER ================= */}

        {role === "VERIFIER" && (
          <>
            <NavItem
              to="/verifier/dashboard"
              icon="🏠"
              label="Dashboard"
              onClick={closeMobileMenu}
            />

            <NavItem
              to="/verifier/queue"
              icon="🔍"
              label="Verification Queue"
              onClick={closeMobileMenu}
            />
          </>
        )}

        {/* ================= ADMIN ================= */}

        {role === "ADMIN" && (
          <>
            <NavItem
              to="/admin/dashboard"
              icon="🏠"
              label="Dashboard"
              onClick={closeMobileMenu}
            />

            <NavItem
              to="/admin/users"
              icon="👥"
              label="Users"
              onClick={closeMobileMenu}
            />

            <NavItem
              to="/admin/students"
              icon="🎓"
              label="Students"
              onClick={closeMobileMenu}
            />

            <NavItem
              to="/admin/faculty"
              icon="👨‍🏫"
              label="Faculty"
              onClick={closeMobileMenu}
            />

            <NavItem
              to="/admin/departments"
              icon="🏢"
              label="Departments"
              onClick={closeMobileMenu}
            />

            <NavItem
              to="/admin/settings"
              icon="⚙️"
              label="Settings"
              onClick={closeMobileMenu}
            />
          </>
        )}

      </nav>

      {/* =================================================
          SIDEBAR FOOTER
      ================================================== */}

      <div className="sidebar-footer">

        <div className="system-status">

          <span className="status-dot" />

          <span>
            System Online
          </span>

        </div>

        <small>
          Smart OD System
        </small>

      </div>

    </aside>
  );
}


/* =========================================================
   NAV ITEM
========================================================= */

interface NavItemProps {
  to: string;
  icon: string;
  label: string;
  onClick?: () => void;
}

function NavItem({
  to,
  icon,
  label,
  onClick,
}: NavItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `sidebar-nav-item ${
          isActive ? "active" : ""
        }`
      }
    >

      <span className="nav-icon">
        {icon}
      </span>

      <span className="nav-label">
        {label}
      </span>

    </NavLink>
  );
}
