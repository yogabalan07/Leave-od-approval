import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import StatusBadge from "../../components/common/StatusBadge";
import { api } from "../../services/api";
import { Link } from "react-router-dom";

export default function MyApplications() {
  const [ods,setOds]=useState<any[]>([]); const [leaves,setLeaves]=useState<any[]>([]);
  useEffect(()=>{Promise.all([api.get("/od/my"),api.get("/leave/my")]).then(([a,b])=>{setOds(a.data.data);setLeaves(b.data.data);})},[]);
  return <AppLayout><header className="page-head"><div><span className="eyebrow">TRACKING</span><h1>My Applications</h1><p>Monitor every request and approval stage.</p></div></header>
    <section className="card"><h2>OD Applications</h2><div className="table-wrap"><table><thead><tr><th>Number</th><th>Event</th><th>Dates</th><th>Status</th><th></th></tr></thead><tbody>{ods.map(a=><tr key={a.id}><td>{a.applicationNumber}</td><td>{a.eventName}</td><td>{new Date(a.fromDate).toLocaleDateString()} – {new Date(a.toDate).toLocaleDateString()}</td><td><StatusBadge status={a.status}/></td><td><Link to={`/student/od/${a.id}`}>Open</Link></td></tr>)}</tbody></table></div></section>
    <section className="card"><h2>Leave Applications</h2><div className="table-wrap"><table><thead><tr><th>Number</th><th>Type</th><th>Dates</th><th>Status</th></tr></thead><tbody>{leaves.map(a=><tr key={a.id}><td>{a.applicationNumber}</td><td>{a.leaveType}</td><td>{new Date(a.fromDate).toLocaleDateString()} – {new Date(a.toDate).toLocaleDateString()}</td><td><StatusBadge status={a.status}/></td></tr>)}</tbody></table></div></section>
  </AppLayout>
}
