import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import StatCard from "../../components/common/StatCard";
import { Users, FileText, ShieldCheck } from "lucide-react";
import { api } from "../../services/api";

export default function AdminDashboard(){
 const [d,setD]=useState<any>({});
 const [users,setUsers]=useState<any[]>([]);
 useEffect(()=>{api.get("/admin/dashboard").then(r=>setD(r.data.data));api.get("/admin/users").then(r=>setUsers(r.data.data));},[]);
 return <AppLayout><header className="page-head"><div><span className="eyebrow">ADMIN</span><h1>System Overview</h1><p>Department-level monitoring and user management.</p></div></header>
 <div className="stats-grid"><StatCard label="Students" value={d.students||0} icon={<Users/>}/><StatCard label="OD applications" value={d.ods||0} icon={<FileText/>}/><StatCard label="Verification queue" value={d.pendingVerification||0} icon={<ShieldCheck/>}/></div>
 <section className="card"><h2>Users</h2><div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Register ID</th><th>Role</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.registerNo}</td><td>{u.role}</td></tr>)}</tbody></table></div></section>
 </AppLayout>
}
