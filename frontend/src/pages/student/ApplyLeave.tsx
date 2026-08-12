import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { api } from "../../services/api";

export default function ApplyLeave() {
  const navigate = useNavigate();
  const [form,setForm]=useState({leaveType:"Personal",fromDate:"",toDate:"",reason:""});
  const set=(k:string,v:string)=>setForm(f=>({...f,[k]:v}));
  async function submit(e:FormEvent){e.preventDefault();await api.post("/leave",form);alert("Leave submitted.");navigate("/student/applications");}
  return <AppLayout><header className="page-head"><div><span className="eyebrow">NEW APPLICATION</span><h1>Apply for Leave</h1><p>Submit a leave request for mentor and HOD approval.</p></div></header>
  <form className="card form-grid" onSubmit={submit}>
    <label>Leave type<select value={form.leaveType} onChange={e=>set("leaveType",e.target.value)}><option>Personal</option><option>Medical</option><option>Family</option><option>Other</option></select></label>
    <div></div><label>From<input type="date" required value={form.fromDate} onChange={e=>set("fromDate",e.target.value)}/></label><label>To<input type="date" required value={form.toDate} onChange={e=>set("toDate",e.target.value)}/></label>
    <label className="span-2">Reason<textarea rows={5} required value={form.reason} onChange={e=>set("reason",e.target.value)}/></label>
    <div className="span-2 actions"><button className="secondary" type="button" onClick={()=>navigate("/student")}>Cancel</button><button className="primary">Submit Leave</button></div>
  </form></AppLayout>
}
