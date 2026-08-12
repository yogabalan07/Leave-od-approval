import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/auth/Login";
import StudentDashboard from "./pages/student/Dashboard";
import ApplyOD from "./pages/student/ApplyOD";
import ApplyLeave from "./pages/student/ApplyLeave";
import MyApplications from "./pages/student/MyApplications";
import ODDetails from "./pages/student/ODDetails";
import UploadEvidence from "./pages/student/UploadEvidence";
import MentorDashboard from "./pages/mentor/Dashboard";
import HODDashboard from "./pages/hod/Dashboard";
import VerifierDashboard from "./pages/verifier/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";

export default function App(){
 return <BrowserRouter><Routes>
   <Route path="/login" element={<Login/>}/>
   <Route path="/student" element={<ProtectedRoute roles={["STUDENT"]}><StudentDashboard/></ProtectedRoute>}/>
   <Route path="/student/apply-od" element={<ProtectedRoute roles={["STUDENT"]}><ApplyOD/></ProtectedRoute>}/>
   <Route path="/student/apply-leave" element={<ProtectedRoute roles={["STUDENT"]}><ApplyLeave/></ProtectedRoute>}/>
   <Route path="/student/applications" element={<ProtectedRoute roles={["STUDENT"]}><MyApplications/></ProtectedRoute>}/>
   <Route path="/student/od/:id" element={<ProtectedRoute roles={["STUDENT"]}><ODDetails/></ProtectedRoute>}/>
   <Route path="/student/od/:id/evidence" element={<ProtectedRoute roles={["STUDENT"]}><UploadEvidence/></ProtectedRoute>}/>
   <Route path="/mentor" element={<ProtectedRoute roles={["MENTOR"]}><MentorDashboard/></ProtectedRoute>}/>
   <Route path="/hod" element={<ProtectedRoute roles={["HOD"]}><HODDashboard/></ProtectedRoute>}/>
   <Route path="/verifier" element={<ProtectedRoute roles={["VERIFIER"]}><VerifierDashboard/></ProtectedRoute>}/>
   <Route path="/admin" element={<ProtectedRoute roles={["ADMIN"]}><AdminDashboard/></ProtectedRoute>}/>
   <Route path="/" element={<Navigate to="/login" replace/>}/>
   <Route path="*" element={<Navigate to="/login" replace/>}/>
 </Routes></BrowserRouter>
}
