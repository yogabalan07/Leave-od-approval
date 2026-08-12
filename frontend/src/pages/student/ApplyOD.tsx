import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { api } from "../../services/api";

export default function ApplyOD() {
  const navigate = useNavigate();
  const [form, setForm] = useState({eventName:"",eventType:"Competition",eventLocation:"",fromDate:"",toDate:"",reason:"",eventLatitude:"",eventLongitude:""});
  const set = (k:string,v:string) => setForm(f=>({...f,[k]:v}));

  async function submit(e: FormEvent) {
    e.preventDefault();
    await api.post("/od", form);
    alert("OD application submitted.");
    navigate("/student/applications");
  }

  return <AppLayout><header className="page-head"><div><span className="eyebrow">NEW APPLICATION</span><h1>Apply for OD</h1><p>Submit event, competition, internship or workshop details.</p></div></header>
    <form className="card form-grid" onSubmit={submit}>
      <label>Event name<input required value={form.eventName} onChange={e=>set("eventName",e.target.value)} placeholder="Smart India Hackathon"/></label>
      <label>Event type<select value={form.eventType} onChange={e=>set("eventType",e.target.value)}><option>Competition</option><option>Internship</option><option>Workshop</option><option>Symposium</option><option>Other</option></select></label>
      <label className="span-2">Event location<input required value={form.eventLocation} onChange={e=>set("eventLocation",e.target.value)} placeholder="Coimbatore"/></label>
      <label>From<input type="date" required value={form.fromDate} onChange={e=>set("fromDate",e.target.value)}/></label>
      <label>To<input type="date" required value={form.toDate} onChange={e=>set("toDate",e.target.value)}/></label>
      <label>Event latitude<input value={form.eventLatitude} onChange={e=>set("eventLatitude",e.target.value)} placeholder="Optional"/></label>
      <label>Event longitude<input value={form.eventLongitude} onChange={e=>set("eventLongitude",e.target.value)} placeholder="Optional"/></label>
      <label className="span-2">Reason<textarea required value={form.reason} onChange={e=>set("reason",e.target.value)} rows={5} placeholder="Explain why you need OD..."/></label>
      <div className="span-2 actions"><button className="secondary" type="button" onClick={()=>navigate("/student")}>Cancel</button><button className="primary" type="submit">Submit OD</button></div>
    </form>
  </AppLayout>
}
