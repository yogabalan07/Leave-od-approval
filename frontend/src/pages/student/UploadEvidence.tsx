import { FormEvent, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { api } from "../../services/api";

export default function UploadEvidence() {
  const {id}=useParams(); const navigate=useNavigate();
  const [file,setFile]=useState<File|null>(null); const [loading,setLoading]=useState(false);
  async function submit(e:FormEvent){
    e.preventDefault(); if(!file||!id)return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async pos=>{
      try{
        const fd=new FormData(); fd.append("image",file); fd.append("latitude",String(pos.coords.latitude)); fd.append("longitude",String(pos.coords.longitude)); fd.append("capturedAt",new Date().toISOString());
        await api.post(`/evidence/od/${id}`,fd,{headers:{"Content-Type":"multipart/form-data"}});
        alert("Evidence uploaded for verification."); navigate(`/student/od/${id}`);
      }catch(err:any){alert(err.response?.data?.message||"Upload failed");}finally{setLoading(false);}
    },()=>{setLoading(false);alert("Location permission is required.");});
  }
  return <AppLayout><header className="page-head"><div><span className="eyebrow">PARTICIPATION</span><h1>Upload Evidence</h1><p>Your browser will attach the current GPS coordinates and timestamp.</p></div></header>
    <form className="card evidence-card" onSubmit={submit}>
      <div className="upload-zone"><h2>📸 Participation photo</h2><p>Take a clear photo showing your participation.</p><input type="file" accept="image/jpeg,image/png,image/webp" required onChange={e=>setFile(e.target.files?.[0]||null)}/></div>
      <div className="geo-note">📍 GPS verification is captured from your browser. Do not fake or manually enter the location.</div>
      <button className="primary" disabled={loading}>{loading?"Uploading...":"Upload & Send for Verification"}</button>
    </form>
  </AppLayout>
}
