import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { LogIn, ShieldCheck } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore(s => s.login);
  const [email, setEmail] = useState("student@college.edu");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault(); setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.token, data.user);
      const routes: Record<string,string> = { STUDENT:"/student/dashboard", MENTOR:"/mentor/dashboard", HOD:"/hod/dashboard", VERIFIER:"/verifier/dashboard", ADMIN:"/admin/dashboard" };
      navigate(routes[data.user.role] || "/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return <div className="auth-page">
    <div className="auth-visual">
      <div className="auth-logo">OD</div>
      <h1>Smart OD System</h1>
      <p>Digital leave, on-duty approval and participation verification for your department.</p>
      <div className="feature-list">
        <span><ShieldCheck/> Mentor → HOD approval</span>
        <span><ShieldCheck/> Geo-tagged participation</span>
        <span><ShieldCheck/> Verifier-controlled evidence</span>
      </div>
    </div>
    <form className="login-card" onSubmit={submit}>
      <span className="eyebrow">COLLEGE PORTAL</span>
      <h2>Welcome back</h2>
      <p>Sign in to continue to your dashboard.</p>
      {error && <div className="alert">{error}</div>}
      <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required/></label>
      <label>Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password" required/></label>
      <button className="primary full" type="submit"><LogIn size={18}/> Sign in</button>
      <small className="hint">Demo: student@college.edu / password123</small>
    </form>
  </div>
}
