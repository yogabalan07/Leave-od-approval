import { useEffect, useState } from "react";
import { api } from "../../services/api";

type Application = {
  id: string;
  applicationNumber: string;
  eventName?: string;
  eventType?: string;
  eventLocation?: string;
  leaveType?: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
  student?: {
    name: string;
    email: string;
    registerNo?: string;
  };
};

type DashboardData = {
  od: Application[];
  leave: Application[];
};

export default function HODDashboard() {
  const [data, setData] = useState<DashboardData>({
    od: [],
    leave: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApp, setSelectedApp] = useState<{ id: string; type: "OD" | "LEAVE"; action: "APPROVED" | "REJECTED" } | null>(null);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [viewingApp, setViewingApp] = useState<Application | null>(null);

  const handleAction = async () => {
    if (!selectedApp) return;
    try {
      setSubmitting(true);
      const url = selectedApp.type === "OD" 
        ? `/hod/od/${selectedApp.id}` 
        : `/hod/leave/${selectedApp.id}`;
      await api.patch(url, { action: selectedApp.action, remarks });
      setSelectedApp(null);
      setRemarks("");
      await loadDashboard();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to process application.");
    } finally {
      setSubmitting(false);
    }
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/hod/queue");

      console.log("HOD Queue:", response.data);

      const result = response.data?.data || response.data || {};

      setData({
        od: Array.isArray(result.od) ? result.od : [],
        leave: Array.isArray(result.leave) ? result.leave : [],
      });
    } catch (err: any) {
      console.error("HOD dashboard error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load HOD dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const odCount = data.od.length;
  const leaveCount = data.leave.length;
  const totalPending = odCount + leaveCount;

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusClass = (status: string) => {
    switch (status) {
      case "HOD_PENDING":
        return "status pending";

      case "APPROVED":
        return "status approved";

      case "REJECTED":
        return "status rejected";

      case "MENTOR_PENDING":
        return "status mentor";

      case "MENTOR_APPROVED":
        return "status mentorApproved";

      default:
        return "status";
    }
  };

  return (
    <div className="dashboard-content">

        {/* ERROR */}

        {error && (
          <div className="error-box">
            <span>⚠️</span>
            <div>
              <strong>Unable to load dashboard</strong>
              <p>{error}</p>
            </div>

            <button onClick={loadDashboard}>
              Retry
            </button>
          </div>
        )}

        {/* ================= STAT CARDS ================= */}

        <section className="stats-grid">

          <div className="stat-card od-card">

            <div className="stat-icon">
              📄
            </div>

            <div className="stat-content">
              <span>OD Pending</span>

              <strong>
                {loading ? "..." : odCount}
              </strong>

              <small>
                Applications waiting for approval
              </small>
            </div>

          </div>


          <div className="stat-card leave-card">

            <div className="stat-icon">
              📝
            </div>

            <div className="stat-content">
              <span>Leave Pending</span>

              <strong>
                {loading ? "..." : leaveCount}
              </strong>

              <small>
                Leave requests waiting for approval
              </small>
            </div>

          </div>


          <div className="stat-card total-card">

            <div className="stat-icon">
              ⏳
            </div>

            <div className="stat-content">
              <span>Total Pending</span>

              <strong>
                {loading ? "..." : totalPending}
              </strong>

              <small>
                Applications requiring your action
              </small>
            </div>

          </div>

        </section>


        {/* ================= QUICK SUMMARY ================= */}

        <section className="welcome-card">

          <div className="welcome-icon">
            🎓
          </div>

          <div>

            <h2>
              Welcome to HOD Approval Center
            </h2>

            <p>
              Review applications approved by mentors and
              make the final department-level decision.
            </p>

          </div>

          <div className="welcome-badge">
            FINAL APPROVAL
          </div>

        </section>


        {/* ================= OD APPLICATIONS ================= */}

        <section className="application-section">

          <div className="section-header">

            <div>
              <h2>
                OD Applications
              </h2>

              <p>
                Applications waiting for HOD approval
              </p>
            </div>

            <div className="count-badge">
              {odCount}
            </div>

          </div>


          {loading ? (

            <div className="loading-card">

              <div className="spinner"></div>

              <p>
                Loading OD applications...
              </p>

            </div>

          ) : data.od.length === 0 ? (

            <div className="empty-card">

              <div className="empty-icon">
                📭
              </div>

              <h3>
                No pending OD applications
              </h3>

              <p>
                All OD applications have been processed.
              </p>

            </div>

          ) : (

            <div className="application-list">

              {data.od.map((application) => (

                <div
                  className="application-card"
                  key={application.id}
                >

                  {/* APPLICATION TOP */}

                  <div className="application-top">

                    <div className="application-number">
                      #{application.applicationNumber}
                    </div>

                    <span className={statusClass(application.status)}>
                      {application.status.replaceAll("_", " ")}
                    </span>

                  </div>


                  {/* STUDENT */}

                  <div className="student-row">

                    <div className="student-avatar">
                      {application.student?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "S"}
                    </div>

                    <div>

                      <strong>
                        {application.student?.name ||
                          "Unknown Student"}
                      </strong>

                      <span>
                        {application.student?.registerNo ||
                          "Register number unavailable"}
                      </span>

                    </div>

                  </div>


                  {/* DETAILS */}

                  <div className="details-grid">

                    <div className="detail-item">

                      <span className="detail-icon">
                        🎯
                      </span>

                      <div>
                        <small>Event</small>

                        <strong>
                          {application.eventName || "-"}
                        </strong>
                      </div>

                    </div>


                    <div className="detail-item">

                      <span className="detail-icon">
                        📍
                      </span>

                      <div>
                        <small>Location</small>

                        <strong>
                          {application.eventLocation || "-"}
                        </strong>
                      </div>

                    </div>


                    <div className="detail-item">

                      <span className="detail-icon">
                        📅
                      </span>

                      <div>
                        <small>From</small>

                        <strong>
                          {formatDate(application.fromDate)}
                        </strong>
                      </div>

                    </div>


                    <div className="detail-item">

                      <span className="detail-icon">
                        📅
                      </span>

                      <div>
                        <small>To</small>

                        <strong>
                          {formatDate(application.toDate)}
                        </strong>
                      </div>

                    </div>

                  </div>


                  {/* REASON */}

                  <div className="reason-box">

                    <small>
                      Reason
                    </small>

                    <p>
                      {application.reason || "No reason provided"}
                    </p>

                  </div>


                  {/* ACTIONS */}

                  <div className="application-actions">

                    <button
                      className="view-btn"
                      onClick={() =>
                        alert(
                          `Application: ${application.applicationNumber}`
                        )
                      }
                    >
                      👁 View Details
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() =>
                        alert("Reject API can be connected here.")
                      }
                    >
                      ✕ Reject
                    </button>

                    <button
                      className="approve-btn"
                      onClick={() =>
                        alert("Approve API can be connected here.")
                      }
                    >
                      ✓ Approve
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* ================= LEAVE APPLICATIONS ================= */}

        <section className="application-section">

          <div className="section-header">

            <div>
              <h2>
                Leave Applications
              </h2>

              <p>
                Leave requests waiting for HOD approval
              </p>
            </div>

            <div className="count-badge leave-count">
              {leaveCount}
            </div>

          </div>


          {loading ? (

            <div className="loading-card">

              <div className="spinner"></div>

              <p>
                Loading leave applications...
              </p>

            </div>

          ) : data.leave.length === 0 ? (

            <div className="empty-card">

              <div className="empty-icon">
                🌴
              </div>

              <h3>
                No pending leave applications
              </h3>

              <p>
                There are no leave requests waiting for approval.
              </p>

            </div>

          ) : (

            <div className="application-list">

              {data.leave.map((application) => (

                <div
                  className="application-card"
                  key={application.id}
                >

                  <div className="application-top">

                    <div className="application-number">
                      #{application.applicationNumber}
                    </div>

                    <span className={statusClass(application.status)}>
                      {application.status.replaceAll("_", " ")}
                    </span>

                  </div>


                  <div className="student-row">

                    <div className="student-avatar leave-avatar">
                      {application.student?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "S"}
                    </div>

                    <div>

                      <strong>
                        {application.student?.name ||
                          "Unknown Student"}
                      </strong>

                      <span>
                        {application.student?.registerNo ||
                          "Register number unavailable"}
                      </span>

                    </div>

                  </div>


                  <div className="details-grid">

                    <div className="detail-item">

                      <span className="detail-icon">
                        🏖️
                      </span>

                      <div>
                        <small>Leave Type</small>

                        <strong>
                          {application.leaveType || "-"}
                        </strong>
                      </div>

                    </div>


                    <div className="detail-item">

                      <span className="detail-icon">
                        📅
                      </span>

                      <div>
                        <small>From</small>

                        <strong>
                          {formatDate(application.fromDate)}
                        </strong>
                      </div>

                    </div>


                    <div className="detail-item">

                      <span className="detail-icon">
                        📅
                      </span>

                      <div>
                        <small>To</small>

                        <strong>
                          {formatDate(application.toDate)}
                        </strong>
                      </div>

                    </div>

                  </div>


                  <div className="reason-box">

                    <small>
                      Reason
                    </small>

                    <p>
                      {application.reason || "No reason provided"}
                    </p>

                  </div>


                  <div className="application-actions">

                    <button
                      className="view-btn"
                      onClick={() =>
                        alert(
                          `Application: ${application.applicationNumber}`
                        )
                      }
                    >
                      👁 View Details
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() =>
                        alert("Reject API can be connected here.")
                      }
                    >
                      ✕ Reject
                    </button>

                    <button
                      className="approve-btn"
                      onClick={() =>
                        alert("Approve API can be connected here.")
                      }
                    >
                      ✓ Approve
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>


      {/* ================= CSS ================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          background: #f4f7fb;
          color: #172033;
        }

        .hod-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top right,
              rgba(79, 70, 229, 0.08),
              transparent 30%
            ),
            #f4f7fb;
        }


        /* HEADER */

        .top-header {
          background: linear-gradient(
            135deg,
            #111827,
            #1e293b
          );

          color: white;

          padding: 32px 48px;

          display: flex;
          justify-content: space-between;
          align-items: center;

          gap: 30px;

          box-shadow:
            0 10px 30px rgba(15, 23, 42, 0.15);
        }

        .brand-small {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 3px;
          color: #93c5fd;
          margin-bottom: 8px;
        }

        .top-header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 800;
        }

        .top-header p {
          margin: 8px 0 0;
          color: #cbd5e1;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }


        .refresh-btn {
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.1);
          color: white;

          padding: 11px 18px;
          border-radius: 10px;

          cursor: pointer;
          font-weight: 600;

          transition: 0.2s;
        }

        .refresh-btn:hover {
          background: rgba(255,255,255,0.2);
        }


        .profile {
          display: flex;
          align-items: center;
          gap: 10px;

          padding-left: 20px;
          border-left: 1px solid rgba(255,255,255,0.15);
        }

        .profile strong,
        .profile span {
          display: block;
        }

        .profile span {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 3px;
        }

        .avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          background: linear-gradient(
            135deg,
            #6366f1,
            #8b5cf6
          );

          font-weight: 800;
        }


        /* CONTAINER */

        .dashboard-container {
          max-width: 1450px;
          margin: auto;

          padding: 36px 48px 70px;
        }


        /* ERROR */

        .error-box {
          display: flex;
          align-items: center;
          gap: 15px;

          background: #fff1f2;
          border: 1px solid #fecdd3;

          padding: 16px 20px;
          border-radius: 14px;

          margin-bottom: 25px;

          color: #9f1239;
        }

        .error-box p {
          margin: 4px 0 0;
        }

        .error-box button {
          margin-left: auto;

          border: none;
          background: #be123c;
          color: white;

          padding: 9px 15px;
          border-radius: 8px;

          cursor: pointer;
        }


        /* STAT CARDS */

        .stats-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 22px;

          margin-bottom: 28px;
        }

        .stat-card {
          position: relative;

          overflow: hidden;

          display: flex;
          align-items: center;

          gap: 18px;

          padding: 25px;

          border-radius: 20px;

          background: white;

          border: 1px solid #e5e7eb;

          box-shadow:
            0 8px 25px rgba(15, 23, 42, 0.06);

          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-3px);

          box-shadow:
            0 15px 35px rgba(15, 23, 42, 0.10);
        }

        .stat-icon {
          width: 58px;
          height: 58px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 16px;

          font-size: 25px;
        }

        .od-card .stat-icon {
          background: #eef2ff;
        }

        .leave-card .stat-icon {
          background: #ecfdf5;
        }

        .total-card .stat-icon {
          background: #fff7ed;
        }

        .stat-content span {
          display: block;

          color: #64748b;

          font-size: 14px;
          font-weight: 600;

          margin-bottom: 4px;
        }

        .stat-content strong {
          display: block;

          font-size: 32px;

          line-height: 1.1;

          color: #111827;
        }

        .stat-content small {
          display: block;

          color: #94a3b8;

          margin-top: 5px;
        }


        /* WELCOME */

        .welcome-card {
          display: flex;
          align-items: center;
          gap: 18px;

          background:
            linear-gradient(
              135deg,
              #eef2ff,
              #f8fafc
            );

          border: 1px solid #c7d2fe;

          padding: 25px;

          border-radius: 20px;

          margin-bottom: 35px;
        }

        .welcome-icon {
          width: 60px;
          height: 60px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: white;

          border-radius: 16px;

          font-size: 28px;

          box-shadow:
            0 5px 15px rgba(79,70,229,0.08);
        }

        .welcome-card h2 {
          margin: 0;

          font-size: 20px;
        }

        .welcome-card p {
          margin: 5px 0 0;

          color: #64748b;
        }

        .welcome-badge {
          margin-left: auto;

          padding: 8px 13px;

          background: #4f46e5;
          color: white;

          border-radius: 999px;

          font-size: 11px;
          font-weight: 800;

          letter-spacing: 0.8px;
        }


        /* SECTION */

        .application-section {
          margin-top: 35px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 18px;
        }

        .section-header h2 {
          margin: 0;

          font-size: 24px;
        }

        .section-header p {
          margin: 5px 0 0;

          color: #64748b;
        }

        .count-badge {
          min-width: 40px;
          height: 40px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #eef2ff;
          color: #4f46e5;

          border-radius: 12px;

          font-weight: 800;
        }

        .leave-count {
          background: #ecfdf5;
          color: #059669;
        }


        /* APPLICATION LIST */

        .application-list {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 20px;
        }


        .application-card {
          background: white;

          border: 1px solid #e5e7eb;

          border-radius: 18px;

          padding: 22px;

          box-shadow:
            0 8px 25px rgba(15, 23, 42, 0.05);

          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .application-card:hover {
          transform: translateY(-3px);

          box-shadow:
            0 15px 35px rgba(15, 23, 42, 0.09);
        }


        .application-top {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 20px;
        }

        .application-number {
          font-weight: 800;

          color: #4f46e5;

          font-size: 14px;
        }


        /* STATUS */

        .status {
          display: inline-flex;

          padding: 6px 10px;

          border-radius: 999px;

          font-size: 11px;

          font-weight: 800;

          background: #f1f5f9;
          color: #475569;
        }

        .status.pending {
          background: #fff7ed;
          color: #c2410c;
        }

        .status.approved {
          background: #ecfdf5;
          color: #047857;
        }

        .status.rejected {
          background: #fff1f2;
          color: #be123c;
        }

        .status.mentor {
          background: #fef3c7;
          color: #92400e;
        }

        .status.mentorApproved {
          background: #dbeafe;
          color: #1d4ed8;
        }


        /* STUDENT */

        .student-row {
          display: flex;

          align-items: center;

          gap: 12px;

          margin-bottom: 20px;
        }

        .student-avatar {
          width: 45px;
          height: 45px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #eef2ff;

          color: #4f46e5;

          font-weight: 800;
        }

        .leave-avatar {
          background: #ecfdf5;
          color: #059669;
        }

        .student-row strong,
        .student-row span {
          display: block;
        }

        .student-row strong {
          font-size: 15px;
        }

        .student-row span {
          color: #94a3b8;

          font-size: 12px;

          margin-top: 3px;
        }


        /* DETAILS */

        .details-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 12px;

          margin-bottom: 16px;
        }

        .detail-item {
          display: flex;

          gap: 9px;

          padding: 12px;

          background: #f8fafc;

          border-radius: 12px;
        }

        .detail-icon {
          font-size: 17px;
        }

        .detail-item small,
        .detail-item strong {
          display: block;
        }

        .detail-item small {
          color: #94a3b8;

          font-size: 10px;

          margin-bottom: 3px;
        }

        .detail-item strong {
          font-size: 12px;

          color: #334155;

          word-break: break-word;
        }


        /* REASON */

        .reason-box {
          padding: 14px;

          background: #f8fafc;

          border-radius: 12px;

          margin-bottom: 18px;
        }

        .reason-box small {
          display: block;

          color: #94a3b8;

          font-size: 11px;

          font-weight: 700;

          margin-bottom: 5px;
        }

        .reason-box p {
          margin: 0;

          color: #475569;

          font-size: 13px;

          line-height: 1.5;
        }


        /* BUTTONS */

        .application-actions {
          display: flex;

          gap: 9px;

          padding-top: 15px;

          border-top: 1px solid #eef2f7;
        }

        .application-actions button {
          border: none;

          padding: 10px 13px;

          border-radius: 9px;

          cursor: pointer;

          font-size: 12px;

          font-weight: 700;

          transition: 0.2s;
        }

        .view-btn {
          flex: 1;

          background: #f1f5f9;

          color: #334155;
        }

        .view-btn:hover {
          background: #e2e8f0;
        }

        .reject-btn {
          background: #fff1f2;

          color: #be123c;
        }

        .reject-btn:hover {
          background: #ffe4e6;
        }

        .approve-btn {
          background: #4f46e5;

          color: white;
        }

        .approve-btn:hover {
          background: #4338ca;
        }


        /* EMPTY */

        .empty-card,
        .loading-card {
          background: white;

          border: 1px dashed #cbd5e1;

          border-radius: 18px;

          min-height: 220px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          text-align: center;

          color: #64748b;
        }

        .empty-icon {
          font-size: 40px;

          margin-bottom: 8px;
        }

        .empty-card h3 {
          margin: 5px 0;

          color: #334155;
        }

        .empty-card p {
          margin: 0;

          font-size: 14px;
        }


        /* LOADING */

        .spinner {
          width: 35px;
          height: 35px;

          border: 4px solid #e2e8f0;

          border-top-color: #4f46e5;

          border-radius: 50%;

          animation:
            spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }


        /* RESPONSIVE */

        @media (max-width: 1000px) {

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .application-list {
            grid-template-columns: 1fr;
          }

          .top-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
            justify-content: space-between;
          }

        }


        @media (max-width: 650px) {

          .dashboard-container {
            padding: 25px 15px 50px;
          }

          .top-header {
            padding: 25px 20px;
          }

          .top-header h1 {
            font-size: 25px;
          }

          .welcome-card {
            align-items: flex-start;
            flex-direction: column;
          }

          .welcome-badge {
            margin-left: 0;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .application-actions {
            flex-wrap: wrap;
          }

          .view-btn {
            flex-basis: 100%;
          }

        }

      `}</style>

    </div>
  );
}