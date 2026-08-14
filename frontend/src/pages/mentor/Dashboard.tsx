import { useEffect, useState } from "react";
import { api } from "../../services/api";
import "../dashboard.css";

interface Application {
  id: string;
  applicationNumber?: string;
  eventName?: string;
  eventType?: string;
  fromDate?: string;
  toDate?: string;
  leaveType?: string;
  reason?: string;
  status?: string;
  student?: {
    name?: string;
    registerNo?: string;
  };
}

interface QueueData {
  od?: Application[];
  leave?: Application[];
}

function formatDate(date?: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusClass(status?: string) {
  if (status === "REJECTED") return "status-rejected";
  if (status?.includes("APPROVED")) return "status-approved";
  if (status?.includes("PENDING")) return "status-pending";

  return "status-info";
}

function statusText(status?: string) {
  return (status || "UNKNOWN")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function MentorDashboard() {
  const [data, setData] = useState<QueueData>({
    od: [],
    leave: [],
  });

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get("/mentor/queue");

      const result = response.data;

      setData({
        od: result?.od || result?.data?.od || [],
        leave: result?.leave || result?.data?.leave || [],
      });
    } catch (error) {
      console.error("Mentor dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadDashboard();
    };

    fetchData();
  }, []);

  const od = data.od || [];
  const leave = data.leave || [];

  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">

        {/* SIDEBAR */}
        <aside className="dashboard-sidebar">

          <div className="brand">
            <div className="brand-logo">🎓</div>

            <div className="brand-text">
              <h2>Smart OD</h2>
              <span>Approval System</span>
            </div>
          </div>

          <div className="sidebar-label">
            MENTOR MENU
          </div>

          <nav className="sidebar-nav">

            <button className="sidebar-link active">
              <span className="sidebar-icon">📊</span>
              <span>Dashboard</span>
            </button>

            <button className="sidebar-link">
              <span className="sidebar-icon">📋</span>
              <span>OD Requests</span>
            </button>

            <button className="sidebar-link">
              <span className="sidebar-icon">📝</span>
              <span>Leave Requests</span>
            </button>

            <button className="sidebar-link">
              <span className="sidebar-icon">🕘</span>
              <span>Approval History</span>
            </button>

          </nav>

          <div className="sidebar-label">
            SYSTEM
          </div>

          <nav className="sidebar-nav">

            <button className="sidebar-link">
              <span className="sidebar-icon">🔔</span>
              <span>Notifications</span>
            </button>

            <button className="sidebar-link">
              <span className="sidebar-icon">⚙️</span>
              <span>Settings</span>
            </button>

          </nav>
        </aside>

        {/* MAIN */}
        <main className="dashboard-main">

          <header className="topbar">

            <div className="topbar-title">
              <h1>Mentor Dashboard</h1>
              <p>Student application review</p>
            </div>

            <div className="topbar-right">

              <button className="notification-button">
                🔔
              </button>

              <div className="user-chip">

                <div className="user-avatar">
                  M
                </div>

                <div className="user-info">
                  <strong>Mentor</strong>
                  <span>Faculty</span>
                </div>

              </div>

            </div>

          </header>

          <div className="dashboard-content">

            <section className="welcome-card">
              <h2>Welcome back, Mentor 👋</h2>
              <p>
                Review and manage OD and leave applications
                submitted by your students.
              </p>
            </section>

            {/* STATS */}
            <section className="stats-grid">

              <div className="stat-card">

                <div className="stat-top">
                  <div className="stat-icon icon-purple">
                    📋
                  </div>
                </div>

                <p>OD Requests</p>

                <div className="stat-number">
                  {od.length}
                </div>

                <div className="stat-footer">
                  Waiting for mentor review
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-top">
                  <div className="stat-icon icon-blue">
                    📝
                  </div>
                </div>

                <p>Leave Requests</p>

                <div className="stat-number">
                  {leave.length}
                </div>

                <div className="stat-footer">
                  Waiting for mentor review
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-top">
                  <div className="stat-icon icon-orange">
                    ⏳
                  </div>
                </div>

                <p>Total Pending</p>

                <div className="stat-number">
                  {od.length + leave.length}
                </div>

                <div className="stat-footer">
                  Requires your attention
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-top">
                  <div className="stat-icon icon-green">
                    👨‍🎓
                  </div>
                </div>

                <p>Student Requests</p>

                <div className="stat-number">
                  {od.length + leave.length}
                </div>

                <div className="stat-footer">
                  Active student applications
                </div>

              </div>

            </section>

            {/* APPLICATIONS */}
            <section className="dashboard-card">

              <div className="card-header">

                <div>
                  <h3>Student Applications</h3>
                  <p>
                    Applications requiring mentor review
                  </p>
                </div>

                <button
                  className="refresh-btn"
                  onClick={loadDashboard}
                >
                  ↻ Refresh
                </button>

              </div>

              {loading ? (

                <div className="loading-box">
                  <div className="loading-spinner"></div>
                  Loading requests...
                </div>

              ) : od.length === 0 && leave.length === 0 ? (

                <div className="empty-box">
                  <div className="empty-icon">
                    🎉
                  </div>

                  <h4>No pending applications</h4>

                  <p>
                    All student applications have been processed.
                  </p>
                </div>

              ) : (

                <div className="table-container">

                  <table className="dashboard-table">

                    <thead>
                      <tr>
                        <th>Application</th>
                        <th>Student</th>
                        <th>Type</th>
                        <th>Details</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>

                      {od.map((item) => (

                        <tr key={`od-${item.id}`}>

                          <td>
                            <span className="application-number">
                              {item.applicationNumber || item.id}
                            </span>
                          </td>

                          <td>
                            <div className="student-name">
                              {item.student?.name || "Student"}
                            </div>

                            <small>
                              {item.student?.registerNo || "-"}
                            </small>
                          </td>

                          <td>
                            <span className="status-badge status-info">
                              OD
                            </span>
                          </td>

                          <td>
                            {item.eventName || "-"}
                          </td>

                          <td>
                            {formatDate(item.fromDate)}
                          </td>

                          <td>
                            <span
                              className={`status-badge ${statusClass(
                                item.status
                              )}`}
                            >
                              {statusText(item.status)}
                            </span>
                          </td>

                        </tr>

                      ))}

                      {leave.map((item) => (

                        <tr key={`leave-${item.id}`}>

                          <td>
                            <span className="application-number">
                              {item.applicationNumber || item.id}
                            </span>
                          </td>

                          <td>
                            <div className="student-name">
                              {item.student?.name || "Student"}
                            </div>

                            <small>
                              {item.student?.registerNo || "-"}
                            </small>
                          </td>

                          <td>
                            <span className="status-badge status-info">
                              LEAVE
                            </span>
                          </td>

                          <td>
                            {item.leaveType || "-"}
                          </td>

                          <td>
                            {formatDate(item.fromDate)}
                          </td>

                          <td>
                            <span
                              className={`status-badge ${statusClass(
                                item.status
                              )}`}
                            >
                              {statusText(item.status)}
                            </span>
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

            </section>

          </div>

        </main>

      </div>
    </div>
  );
}