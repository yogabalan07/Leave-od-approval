import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FilePlus2, ClipboardList, LogOut, ShieldCheck, UserCheck, Settings } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export default function Sidebar() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();

  const links =
    user?.role === "STUDENT"
      ? [
          ["/student", "Dashboard", LayoutDashboard],
          ["/student/apply-od", "Apply OD", FilePlus2],
          ["/student/apply-leave", "Apply Leave", FilePlus2],
          ["/student/applications", "My Applications", ClipboardList]
        ]
      : user?.role === "MENTOR"
      ? [["/mentor", "Mentor Queue", UserCheck]]
      : user?.role === "HOD"
      ? [["/hod", "HOD Queue", ShieldCheck]]
      : user?.role === "VERIFIER"
      ? [["/verifier", "Verification", ShieldCheck]]
      : [["/admin", "Admin Dashboard", Settings]];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">OD</div>
        <div><b>Smart OD</b><small>College Portal</small></div>
      </div>
      <nav>
        {links.map(([to, label, Icon]: any) => (
          <NavLink key={to} to={to} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <Icon size={18}/><span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="logout" onClick={() => { logout(); navigate("/login"); }}>
        <LogOut size={18}/> Sign out
      </button>
    </aside>
  );
}
