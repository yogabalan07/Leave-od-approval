import { useEffect, useState } from "react";
import { FileText, Clock3, CheckCircle2, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import { api } from "../../services/api";

export default function Dashboard() {
  const [apps, setApps] = useState<any[]>([]);
  useEffect(() => { api.get("/od/my").then(r => setApps(r.data.data)).catch(()=>{}); }, []);
  const counts = {
    total: apps.length,
    pending: apps.filter(a => a.status.includes("PENDING")).length,
    approved: apps.filter(a => ["APPROVED","VERIFIED","EVIDENCE_PENDING","VERIFICATION_PENDING"].includes(a.status)).length
  };

  return <AppLayout>
    <header className="page-head"><div><span className="eyebrow">STUDENT</span><h1>Dashboard</h1><p>Track your OD applications and participation verification.</p></div><Link className="primary" to="/student/apply-od">Apply OD <ArrowRight size={17}/></Link></header>
    <div className="stats-grid">
      <StatCard label="Total OD" value={counts.total} icon={<FileText/>}/>
      <StatCard label="Pending" value={counts.pending} icon={<Clock3/>}/>
      <StatCard label="Progressed" value={counts.approved} icon={<CheckCircle2/>}/>
    </div>
    <section className="card">
      <div className="section-head"><h2>Recent OD applications</h2><Link to="/student/applications">View all</Link></div>
      {apps.length === 0 ? <div className="empty">No OD applications yet.</div> :
      <div className="table-wrap"><table><thead><tr><th>Application</th><th>Event</th><th>Dates</th><th>Status</th></tr></thead><tbody>
        {apps.slice(0,8).map(a=><tr key={a.id}><td>{a.applicationNumber}</td><td><b>{a.eventName}</b><small>{a.eventLocation}</small></td><td>{new Date(a.fromDate).toLocaleDateString()} – {new Date(a.toDate).toLocaleDateString()}</td><td><StatusBadge status={a.status}/></td></tr>)}
      </tbody></table></div>}
    </section>
    <section className="info-banner"><MapPin/><div><b>Participation evidence</b><p>After HOD approval, capture a photo with GPS coordinates and timestamp. A verifier will review it.</p></div></section>
  </AppLayout>
}
