import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import StatusBadge from "../../components/common/StatusBadge";
import { api } from "../../services/api";

export default function ODDetails(){
  const {id}=useParams(); const [a,setA]=useState<any>(null);
  useEffect(()=>{api.get(`/od/${id}`).then(r=>setA(r.data.data))},[id]);
  if(!a)return <AppLayout><div className="card">Loading...</div></AppLayout>;
  return <AppLayout><header className="page-head"><div><span className="eyebrow">{a.applicationNumber}</span><h1>{a.eventName}</h1><p>{a.eventLocation}</p></div><StatusBadge status={a.status}/></header>
    <div className="details-grid"><section className="card"><h2>Application details</h2><div className="detail-list"><span>Type<b>{a.eventType}</b></span><span>From<b>{new Date(a.fromDate).toLocaleDateString()}</b></span><span>To<b>{new Date(a.toDate).toLocaleDateString()}</b></span><span>Reason<b>{a.reason}</b></span></div></section>
    <section className="card"><h2>Approval timeline</h2>{a.approvals.map((x:any)=><div className="timeline" key={x.id}><b>{x.approver.role}</b><span>{x.action} · {x.remarks||"No remarks"}</span><small>{new Date(x.createdAt).toLocaleString()}</small></div>)}{a.status==="EVIDENCE_PENDING"&&<Link className="primary full" to={`/student/od/${id}/evidence`}>Upload Participation Evidence</Link>}</section></div>
  </AppLayout>
}
