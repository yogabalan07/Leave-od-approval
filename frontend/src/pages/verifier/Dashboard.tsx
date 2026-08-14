import { useEffect, useState } from "react";
import { api } from "../../services/api";
import "../dashboard.css";

interface Evidence {
  id?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  capturedAt?: string;
  description?: string;
}

interface VerificationItem {
  id: string;
  odApplicationId?: string;
  status?: string;
  distanceFromEvent?: number;
  remarks?: string;

  odApplication?: {
    applicationNumber?: string;
    eventName?: string;
    eventLocation?: string;
    eventLatitude?: number;
    eventLongitude?: number;

    student?: {
      name?: string;
      registerNo?: string;
    };

    evidence?: Evidence[];
  };

  student?: {
    name?: string;
    registerNo?: string;
  };
}

function formatStatus(status?: string) {
  return (status || "PENDING")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getStatusClass(status?: string) {
  if (status === "VERIFIED") {
    return "status-verified";
  }

  if (status === "REJECTED") {
    return "status-rejected";
  }

  if (status === "NEEDS_MORE_EVIDENCE") {
    return "status-info";
  }

  return "status-pending";
}

function formatDate(date?: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function VerifierDashboard() {
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/verification/queue"
      );

      const result = response.data;

      setItems(
        result?.data ||
        result?.items ||
        result ||
        []
      );
    } catch (error) {
      console.error(
        "Verifier dashboard error:",
        error
      );
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

  const pendingCount = items.filter(
    (item) =>
      !item.status ||
      item.status === "PENDING"
  ).length;

  const evidenceCount = items.reduce(
    (total, item) =>
      total +
      (item.odApplication?.evidence?.length || 0),
    0
  );

  return (
    <div className="dashboard-page">

      <div className="dashboard-layout">

        {/* SIDEBAR */}

        <aside className="dashboard-sidebar">

          <div className="brand">

            <div className="brand-logo">
              🎓
            </div>

            <div className="brand-text">
              <h2>Smart OD</h2>
              <span>Approval System</span>
            </div>

          </div>

          <div className="sidebar-label">
            VERIFIER MENU
          </div>

          <nav className="sidebar-nav">

            <button className="sidebar-link active">
              <span className="sidebar-icon">
                📊
              </span>

              <span>
                Dashboard
              </span>
            </button>

            <button className="sidebar-link">

              <span className="sidebar-icon">
                🔍
              </span>

              <span>
                Verification Queue
              </span>

            </button>

            <button className="sidebar-link">

              <span className="sidebar-icon">
                📸
              </span>

              <span>
                Evidence
              </span>

            </button>

            <button className="sidebar-link">

              <span className="sidebar-icon">
                🗺️
              </span>

              <span>
                Geo Verification
              </span>

            </button>

          </nav>

          <div className="sidebar-label">
            SYSTEM
          </div>

          <nav className="sidebar-nav">

            <button className="sidebar-link">

              <span className="sidebar-icon">
                🔔
              </span>

              <span>
                Notifications
              </span>

            </button>

            <button className="sidebar-link">

              <span className="sidebar-icon">
                ⚙️
              </span>

              <span>
                Settings
              </span>

            </button>

          </nav>

        </aside>

        {/* MAIN */}

        <main className="dashboard-main">

          <header className="topbar">

            <div className="topbar-title">

              <h1>
                Verifier Dashboard
              </h1>

              <p>
                Participation evidence verification
              </p>

            </div>

            <div className="topbar-right">

              <button className="notification-button">
                🔔
              </button>

              <div className="user-chip">

                <div className="user-avatar">
                  V
                </div>

                <div className="user-info">

                  <strong>
                    Verifier
                  </strong>

                  <span>
                    Verification Team
                  </span>

                </div>

              </div>

            </div>

          </header>

          <div className="dashboard-content">

            {/* WELCOME */}

            <section className="welcome-card">

              <h2>
                Evidence Verification Center 🔍
              </h2>

              <p>
                Verify student participation evidence,
                photographs and geographic information.
              </p>

            </section>

            {/* STATS */}

            <section className="stats-grid">

              <div className="stat-card">

                <div className="stat-top">

                  <div className="stat-icon icon-orange">
                    ⏳
                  </div>

                </div>

                <p>
                  Pending Verification
                </p>

                <div className="stat-number">
                  {pendingCount}
                </div>

                <div className="stat-footer">
                  Applications waiting for verification
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-top">

                  <div className="stat-icon icon-blue">
                    📸
                  </div>

                </div>

                <p>
                  Evidence Items
                </p>

                <div className="stat-number">
                  {evidenceCount}
                </div>

                <div className="stat-footer">
                  Uploaded participation evidence
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-top">

                  <div className="stat-icon icon-purple">
                    📍
                  </div>

                </div>

                <p>
                  Geo Verification
                </p>

                <div className="stat-number">
                  Active
                </div>

                <div className="stat-footer">
                  Location verification enabled
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-top">

                  <div className="stat-icon icon-green">
                    🛡️
                  </div>

                </div>

                <p>
                  Verification System
                </p>

                <div className="stat-number">
                  Online
                </div>

                <div className="stat-footer">
                  Evidence checking system operational
                </div>

              </div>

            </section>

            {/* QUEUE */}

            <section className="dashboard-card">

              <div className="card-header">

                <div>

                  <h3>
                    Verification Queue
                  </h3>

                  <p>
                    Review student participation evidence
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

                  Loading verification queue...

                </div>

              ) : items.length === 0 ? (

                <div className="empty-box">

                  <div className="empty-icon">
                    🎉
                  </div>

                  <h4>
                    Verification queue is empty
                  </h4>

                  <p>
                    No student evidence is waiting for verification.
                  </p>

                </div>

              ) : (

                <div className="table-container">

                  <table className="dashboard-table">

                    <thead>

                      <tr>
                        <th>
                          Application
                        </th>

                        <th>
                          Student
                        </th>

                        <th>
                          Event
                        </th>

                        <th>
                          Evidence
                        </th>

                        <th>
                          Location
                        </th>

                        <th>
                          Date
                        </th>

                        <th>
                          Status
                        </th>
                      </tr>

                    </thead>

                    <tbody>

                      {items.map((item) => {

                        const application =
                          item.odApplication;

                        const student =
                          application?.student ||
                          item.student;

                        const evidence =
                          application?.evidence || [];

                        return (

                          <tr key={item.id}>

                            <td>

                              <span className="application-number">
                                {application?.applicationNumber ||
                                  item.odApplicationId ||
                                  item.id}
                              </span>

                            </td>

                            <td>

                              <div className="student-name">
                                {student?.name ||
                                  "Student"}
                              </div>

                              <small>
                                {student?.registerNo ||
                                  "-"}
                              </small>

                            </td>

                            <td>
                              {application?.eventName ||
                                "-"}
                            </td>

                            <td>

                              <span className="status-badge status-info">
                                📸 {evidence.length}
                              </span>

                            </td>

                            <td>

                              {evidence.length > 0
                                ? "📍 Available"
                                : "—"}

                            </td>

                            <td>

                              {formatDate(
                                evidence[0]?.capturedAt
                              )}

                            </td>

                            <td>

                              <span
                                className={`status-badge ${getStatusClass(
                                  item.status
                                )}`}
                              >
                                {formatStatus(
                                  item.status
                                )}
                              </span>

                            </td>

                          </tr>

                        );

                      })}

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