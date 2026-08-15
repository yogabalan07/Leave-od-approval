import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import "./Dashboard.css";

interface Application {
  id: string;
  applicationNumber?: string;

  student?: {
    id?: string;
    name?: string;
    email?: string;
    registerNo?: string;
  };

  studentName?: string;
  registerNo?: string;

  eventName?: string;
  eventType?: string;
  eventLocation?: string;

  fromDate?: string;
  toDate?: string;

  reason?: string;
  status?: string;

  createdAt?: string;
}

interface DashboardData {
  od: Application[];
  leave: Application[];
}

const MentorDashboard = () => {
  const [data, setData] = useState<DashboardData>({
    od: [],
    leave: [],
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedApp, setSelectedApp] = useState<{ id: string; type: string; action: "APPROVED" | "REJECTED" } | null>(null);
  const [viewingApp, setViewingApp] = useState<Application & { applicationType?: string } | null>(null);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      await loadDashboard();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to process application.");
    } finally {
      setSubmitting(false);
    }
  };

  const loadDashboard = useCallback(async () => {
    try {
      setError("");

      const response = await api.get("/mentor/queue");

      const result = response.data;

      /*
       * Your backend may return:
       *
       * { od: [], leave: [] }
       *
       * OR
       *
       * { data: { od: [], leave: [] } }
       */

      const dashboard = result?.data ?? result;

      setData({
        od: Array.isArray(dashboard?.od) ? dashboard.od : [],
        leave: Array.isArray(dashboard?.leave) ? dashboard.leave : [],
      });
    } catch (err: any) {
      console.error("Mentor dashboard error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load mentor dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /*
   * IMPORTANT:
   *
   * Do NOT use:
   *
   * useEffect(loadDashboard, []);
   *
   * if loadDashboard is async.
   *
   * Instead we call it inside a normal synchronous useEffect.
   */
  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
  };

  const getStudentName = (application: Application) => {
    return (
      application.student?.name ||
      application.studentName ||
      "Unknown Student"
    );
  };

  const getRegisterNumber = (application: Application) => {
    return (
      application.student?.registerNo ||
      application.registerNo ||
      "No Register Number"
    );
  };

  const getInitial = (application: Application) => {
    const name = getStudentName(application);

    return name.charAt(0).toUpperCase();
  };

  const formatDate = (date?: string) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status?: string) => {
    const value = status?.toUpperCase() || "";

    if (value.includes("REJECT")) {
      return "rejected";
    }

    if (
      value.includes("APPROVED") ||
      value === "APPROVED"
    ) {
      return "approved";
    }

    return "pending";
  };

  const formatStatus = (status?: string) => {
    if (!status) return "PENDING";

    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const totalApplications =
    data.od.length + data.leave.length;

  const pendingApplications = [
    ...data.od,
    ...data.leave,
  ].filter((application) => {
    const status = application.status?.toUpperCase();

    return (
      !status ||
      status === "MENTOR_PENDING" ||
      status === "PENDING"
    );
  }).length;

  const approvedApplications = [
    ...data.od,
    ...data.leave,
  ].filter((application) =>
    application.status
      ?.toUpperCase()
      .includes("APPROVED")
  ).length;

  const students = new Set(
    [...data.od, ...data.leave]
      .map((application) => application.student?.id)
      .filter(Boolean)
  ).size;

  const allApplications = [
    ...data.od.map((application) => ({
      ...application,
      applicationType: "OD",
    })),

    ...data.leave.map((application) => ({
      ...application,
      applicationType: "LEAVE",
    })),
  ];

  return (
    <div className="mentor-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="mentor-header">

        <div className="mentor-header-left">

          <div className="mentor-brand">
            SMART OD SYSTEM
          </div>

          <h1>Mentor Dashboard</h1>

          <p>
            Review and manage student OD & leave applications
          </p>

        </div>

        <div className="mentor-header-right">

          <button
            className="mentor-refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? "↻ Refreshing..." : "↻ Refresh"}
          </button>

          <div className="mentor-profile">

            <div className="mentor-avatar">
              M
            </div>

            <div className="mentor-profile-info">

              <strong>Mentor</strong>

              <span>
                Application Reviewer
              </span>

            </div>

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mentor-container">

        {/* ERROR */}

        {error && (
          <div className="mentor-error">

            <div className="mentor-error-icon">
              ⚠️
            </div>

            <div className="mentor-error-content">

              <strong>
                Dashboard Error
              </strong>

              <p>
                {error}
              </p>

            </div>

            <button onClick={handleRefresh}>
              Retry
            </button>

          </div>
        )}


        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="mentor-stats">

          {/* Pending */}

          <div className="mentor-stat pending">

            <div className="mentor-stat-icon">
              ⏳
            </div>

            <div className="mentor-stat-info">

              <span>
                Pending Review
              </span>

              <strong>
                {pendingApplications}
              </strong>

              <small>
                Awaiting your action
              </small>

            </div>

          </div>


          {/* OD */}

          <div className="mentor-stat od">

            <div className="mentor-stat-icon">
              📋
            </div>

            <div className="mentor-stat-info">

              <span>
                OD Applications
              </span>

              <strong>
                {data.od.length}
              </strong>

              <small>
                On-duty requests
              </small>

            </div>

          </div>


          {/* Students */}

          <div className="mentor-stat students">

            <div className="mentor-stat-icon">
              👨‍🎓
            </div>

            <div className="mentor-stat-info">

              <span>
                Students
              </span>

              <strong>
                {students}
              </strong>

              <small>
                Unique applicants
              </small>

            </div>

          </div>


          {/* Approved */}

          <div className="mentor-stat review">

            <div className="mentor-stat-icon">
              ✓
            </div>

            <div className="mentor-stat-info">

              <span>
                Approved
              </span>

              <strong>
                {approvedApplications}
              </strong>

              <small>
                Applications approved
              </small>

            </div>

          </div>

        </section>


        {/* =================================================
            WELCOME CARD
        ================================================= */}

        <section className="mentor-welcome">

          <div className="mentor-welcome-icon">
            👋
          </div>

          <div className="mentor-welcome-content">

            <h2>
              Welcome, Mentor
            </h2>

            <p>
              Review student applications carefully before
              approving them. Approved applications will move
              to the HOD verification stage.
            </p>

          </div>

          <div className="mentor-welcome-badge">
            MENTOR
          </div>

        </section>


        {/* =================================================
            APPLICATIONS
        ================================================= */}

        <section className="mentor-section">

          <div className="mentor-section-header">

            <div className="mentor-section-title">

              <h2>
                Applications
              </h2>

              <p>
                Student OD and leave requests waiting for review
              </p>

            </div>

            <div className="mentor-count">
              {totalApplications}
            </div>

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (

            <div className="mentor-loading">

              <div className="mentor-spinner"></div>

              <p>
                Loading applications...
              </p>

            </div>

          ) : allApplications.length === 0 ? (

            /* =================================================
               EMPTY
            ================================================= */

            <div className="mentor-empty">

              <div className="mentor-empty-icon">
                ✓
              </div>

              <h3>
                No Applications
              </h3>

              <p>
                There are currently no applications waiting
                for your review.
              </p>

            </div>

          ) : (

            /* =================================================
               APPLICATION LIST
            ================================================= */

            <div className="mentor-application-list">

              {allApplications.map((application) => (

                <div
                  className="mentor-application-card"
                  key={`${application.applicationType}-${application.id}`}
                >

                  {/* APPLICATION TOP */}

                  <div className="mentor-application-top">

                    <span className="mentor-application-number">

                      {application.applicationNumber ||
                        `APP-${application.id.slice(0, 8).toUpperCase()}`}

                    </span>

                    <span
                      className={`mentor-status ${getStatusClass(
                        application.status
                      )}`}
                    >
                      {formatStatus(application.status)}
                    </span>

                  </div>


                  {/* STUDENT */}

                  <div className="mentor-student">

                    <div className="mentor-student-avatar">

                      {getInitial(application)}

                    </div>

                    <div className="mentor-student-info">

                      <strong>
                        {getStudentName(application)}
                      </strong>

                      <span>
                        {getRegisterNumber(application)}
                      </span>

                    </div>

                  </div>


                  {/* DETAILS */}

                  <div className="mentor-details">

                    {/* TYPE */}

                    <div className="mentor-detail">

                      <div className="mentor-detail-icon">
                        {application.applicationType === "OD"
                          ? "🎓"
                          : "🏠"}
                      </div>

                      <div className="mentor-detail-content">

                        <small>
                          Type
                        </small>

                        <strong>
                          {application.applicationType === "OD"
                            ? "On Duty"
                            : "Leave"}
                        </strong>

                      </div>

                    </div>


                    {/* EVENT / LEAVE */}

                    <div className="mentor-detail">

                      <div className="mentor-detail-icon">
                        📌
                      </div>

                      <div className="mentor-detail-content">

                        <small>
                          {application.applicationType === "OD"
                            ? "Event"
                            : "Leave Type"}
                        </small>

                        <strong>
                          {application.eventName ||
                            application.eventType ||
                            "Leave Application"}
                        </strong>

                      </div>

                    </div>


                    {/* FROM */}

                    <div className="mentor-detail">

                      <div className="mentor-detail-icon">
                        📅
                      </div>

                      <div className="mentor-detail-content">

                        <small>
                          From
                        </small>

                        <strong>
                          {formatDate(
                            application.fromDate
                          )}
                        </strong>

                      </div>

                    </div>


                    {/* TO */}

                    <div className="mentor-detail">

                      <div className="mentor-detail-icon">
                        📅
                      </div>

                      <div className="mentor-detail-content">

                        <small>
                          To
                        </small>

                        <strong>
                          {formatDate(
                            application.toDate
                          )}
                        </strong>

                      </div>

                    </div>


                    {/* LOCATION */}

                    {application.eventLocation && (
                      <div className="mentor-detail">

                        <div className="mentor-detail-icon">
                          📍
                        </div>

                        <div className="mentor-detail-content">

                          <small>
                            Location
                          </small>

                          <strong>
                            {application.eventLocation}
                          </strong>

                        </div>

                      </div>
                    )}

                  </div>


                  {/* REASON */}

                  {application.reason && (

                    <div className="mentor-reason">

                      <span className="mentor-reason-label">
                        Reason
                      </span>

                      <p>
                        {application.reason}
                      </p>

                    </div>

                  )}


                  {/* ACTIONS */}

                  <div className="mentor-actions">

                    <button
                      className="mentor-action mentor-view"
                      onClick={() => setViewingApp(application)}
                    >
                      👁 View
                    </button>

                    <button
                      className="mentor-action mentor-reject"
                      onClick={() => setSelectedApp({ id: application.id, type: application.applicationType, action: "REJECTED" })}
                    >
                      ✕ Reject
                    </button>

                    <button
                      className="mentor-action mentor-approve"
                      onClick={() => setSelectedApp({ id: application.id, type: application.applicationType, action: "APPROVED" })}
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

      {/* ================= MODALS ================= */}
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

      {viewingApp && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: "600px" }}>
            <div className="modal-header">
              <h3>Application Details</h3>
              <button className="modal-close" onClick={() => setViewingApp(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: "grid", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <small style={{ color: "#64748b", display: "block" }}>Student Name</small>
                  <strong>{viewingApp.student?.name || viewingApp.studentName || "N/A"}</strong>
                </div>
                <div>
                  <small style={{ color: "#64748b", display: "block" }}>Register No</small>
                  <strong>{viewingApp.student?.registerNo || viewingApp.registerNo || "N/A"}</strong>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <small style={{ color: "#64748b", display: "block" }}>Type</small>
                  <strong>{viewingApp.applicationType === "OD" ? "On Duty (OD)" : "Leave"}</strong>
                </div>
                <div>
                  <small style={{ color: "#64748b", display: "block" }}>Status</small>
                  <strong>{formatStatus(viewingApp.status)}</strong>
                </div>
              </div>
              <div>
                <small style={{ color: "#64748b", display: "block" }}>Event / Leave Type</small>
                <strong>{viewingApp.eventName || viewingApp.eventType || viewingApp.leaveType || "N/A"}</strong>
              </div>
              {viewingApp.eventLocation && (
                <div>
                  <small style={{ color: "#64748b", display: "block" }}>Location</small>
                  <strong>📍 {viewingApp.eventLocation}</strong>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <small style={{ color: "#64748b", display: "block" }}>From Date</small>
                  <strong>{formatDate(viewingApp.fromDate)}</strong>
                </div>
                <div>
                  <small style={{ color: "#64748b", display: "block" }}>To Date</small>
                  <strong>{formatDate(viewingApp.toDate)}</strong>
                </div>
              </div>
              <div>
                <small style={{ color: "#64748b", display: "block" }}>Reason</small>
                <p style={{ margin: "4px 0 0", color: "#334155", background: "#f8fafc", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  {viewingApp.reason || "No reason specified."}
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setViewingApp(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Inline styles for modal overlays */}
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
};

export default MentorDashboard;