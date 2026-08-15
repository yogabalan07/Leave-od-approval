import { useEffect, useState } from "react";
import api from "../../services/api";

interface Application {
  id: string;
  applicationNumber?: string;
  student?: {
    name: string;
    registerNo?: string;
    email: string;
  };
  eventName?: string;
  eventType?: string;
  leaveType?: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
  applicationType: "OD" | "LEAVE";
}

export default function PendingApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<{ id: string; type: "OD" | "LEAVE"; action: "APPROVED" | "REJECTED" } | null>(null);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadPending = async () => {
    try {
      setLoading(true);
      const response = await api.get("/mentor/queue");
      const result = response.data?.data || response.data || {};
      
      const odList = (result.od || []).map((o: any) => ({ ...o, applicationType: "OD" }));
      const leaveList = (result.leave || []).map((l: any) => ({ ...l, applicationType: "LEAVE" }));
      
      setApps([...odList, ...leaveList]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleAction = async () => {
    if (!selectedApp) return;
    try {
      setSubmitting(true);
      const url = selectedApp.type === "OD" 
        ? `/mentor/od/${selectedApp.id}` 
        : `/mentor/leave/${selectedApp.id}`;
      await api.patch(url, { action: selectedApp.action, remarks });
      setSelectedApp(null);
      setRemarks("");
      await loadPending();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to process application.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="mentor-page" style={{ padding: "20px" }}>
      <section className="dashboard-card">
        <div className="card-header">
          <div>
            <h3>Pending Applications Queue</h3>
            <p>Review student requests awaiting mentor sign-off</p>
          </div>
          <button className="refresh-btn" onClick={loadPending}>↻ Refresh</button>
        </div>

        {loading ? (
          <div className="loading-box">Loading pending applications...</div>
        ) : apps.length === 0 ? (
          <div className="empty-box">
            <div className="empty-icon">✓</div>
            <h4>Queue is clear!</h4>
            <p>No student applications are currently waiting for review.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Application No</th>
                  <th>Student</th>
                  <th>Details</th>
                  <th>Dates</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <span className={`status-badge ${app.applicationType === "OD" ? "status-info" : "status-pending"}`}>
                        {app.applicationType}
                      </span>
                    </td>
                    <td>
                      <strong className="application-number">{app.applicationNumber || app.id.slice(0, 8)}</strong>
                    </td>
                    <td>
                      <div><strong>{app.student?.name || "Student"}</strong></div>
                      <small>{app.student?.registerNo || "-"}</small>
                    </td>
                    <td>
                      <div><strong>{app.eventName || app.leaveType || "-"}</strong></div>
                      <small>{app.eventType || "Leave Request"}</small>
                    </td>
                    <td>
                      <div>{formatDate(app.fromDate)}</div>
                      <small>to {formatDate(app.toDate)}</small>
                    </td>
                    <td>
                      <p style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }} title={app.reason}>
                        {app.reason}
                      </p>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="refresh-btn"
                          style={{ background: "#fecaca", color: "#b91c1c", border: "none" }}
                          onClick={() => setSelectedApp({ id: app.id, type: app.applicationType, action: "REJECTED" })}
                        >
                          Reject
                        </button>
                        <button
                          className="refresh-btn"
                          style={{ background: "#dcfce7", color: "#15803d", border: "none" }}
                          onClick={() => setSelectedApp({ id: app.id, type: app.applicationType, action: "APPROVED" })}
                        >
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ================= REMARKS MODAL ================= */}
      {selectedApp && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>{selectedApp.action === "APPROVED" ? "Approve Application" : "Reject Application"}</h3>
              <button className="modal-close" onClick={() => setSelectedApp(null)}>✕</button>
            </div>
            <div className="modal-body">
              <label>Remarks / Feedback</label>
              <textarea
                className="modal-textarea"
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks (optional)..."
              />
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setSelectedApp(null)}>Cancel</button>
              <button className="btn-submit" onClick={handleAction} disabled={submitting}>
                {submitting ? "Submitting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .modal-container {
          background: white;
          border-radius: 16px;
          width: 90%;
          max-width: 500px;
          padding: 24px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }
        .modal-close {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #64748b;
        }
        .modal-body {
          margin-bottom: 20px;
        }
        .modal-body label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #334155;
        }
        .modal-textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-family: inherit;
          font-size: 14px;
          resize: vertical;
        }
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .btn-cancel {
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          color: #475569;
          cursor: pointer;
          font-weight: 600;
        }
        .btn-submit {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          background: #4f46e5;
          color: white;
          cursor: pointer;
          font-weight: 600;
        }
        .btn-submit:disabled {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
