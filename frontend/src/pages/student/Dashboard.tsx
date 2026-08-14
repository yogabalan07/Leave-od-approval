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
  status?: string;
}

function statusClass(status?: string) {
  if (status === "REJECTED") {
    return "status-rejected";
  }

  if (
    status === "APPROVED" ||
    status === "VERIFIED"
  ) {
    return "status-approved";
  }

  if (status?.includes("PENDING")) {
    return "status-pending";
  }

  return "status-info";
}

function statusText(status?: string) {
  return (status || "UNKNOWN")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(date?: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function StudentDashboard() {

  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {

    try {

      setLoading(true);

      const response =
        await api.get("/od/my");

      setApps(
        response.data?.data ||
        response.data ||
        []
      );

    } catch (error) {

      console.error(
        "Student dashboard error:",
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

  const pending = apps.filter(
    (app) =>
      app.status?.includes("PENDING")
  ).length;

  const approved = apps.filter(
    (app) =>
      app.status === "APPROVED" ||
      app.status === "VERIFIED"
  ).length;

  const rejected = apps.filter(
    (app) =>
      app.status === "REJECTED"
  ).length;

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

              <h2>
                Smart OD
              </h2>

              <span>
                Approval System
              </span>

            </div>

          </div>

          <div className="sidebar-label">
            STUDENT MENU
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
                📝
              </span>

              <span>
                Apply OD
              </span>

            </button>

            <button className="sidebar-link">

              <span className="sidebar-icon">
                📅
              </span>

              <span>
                Apply Leave
              </span>

            </button>

            <button className="sidebar-link">

              <span className="sidebar-icon">
                📋
              </span>

              <span>
                My Applications
              </span>

            </button>

            <button className="sidebar-link">

              <span className="sidebar-icon">
                📸
              </span>

              <span>
                Participation Evidence
              </span>

            </button>

          </nav>

          <div className="sidebar-label">
            ACCOUNT
          </div>

          <nav className="sidebar-nav">

            <button className="sidebar-link">

              <span className="sidebar-icon">
                👤
              </span>

              <span>
                Profile
              </span>

            </button>

            <button className="sidebar-link">

              <span className="sidebar-icon">
                🔔
              </span>

              <span>
                Notifications
              </span>

            </button>

          </nav>

        </aside>

        {/* MAIN */}

        <main className="dashboard-main">

          <header className="topbar">

            <div className="topbar-title">

              <h1>
                Student Dashboard
              </h1>

              <p>
                Manage your OD and leave applications
              </p>

            </div>

            <div className="topbar-right">

              <button className="notification-button">
                🔔
              </button>

              <div className="user-chip">

                <div className="user-avatar">
                  S
                </div>

                <div className="user-info">

                  <strong>
                    Student
                  </strong>

                  <span>
                    CSE Department
                  </span>

                </div>

              </div>

            </div>

          </header>

          <div className="dashboard-content">

            {/* WELCOME */}

            <section className="welcome-card">

              <h2>
                Welcome back! 👋
              </h2>

              <p>
                Track your OD requests, leave applications
                and participation verification.
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

                <p>
                  Total OD
                </p>

                <div className="stat-number">
                  {apps.length}
                </div>

                <div className="stat-footer">
                  OD applications submitted
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-top">

                  <div className="stat-icon icon-orange">
                    ⏳
                  </div>

                </div>

                <p>
                  Pending
                </p>

                <div className="stat-number">
                  {pending}
                </div>

                <div className="stat-footer">
                  Applications under review
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-top">

                  <div className="stat-icon icon-green">
                    ✅
                  </div>

                </div>

                <p>
                  Approved
                </p>

                <div className="stat-number">
                  {approved}
                </div>

                <div className="stat-footer">
                  Successfully approved
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-top">

                  <div className="stat-icon icon-blue">
                    ❌
                  </div>

                </div>

                <p>
                  Rejected
                </p>

                <div className="stat-number">
                  {rejected}
                </div>

                <div className="stat-footer">
                  Applications rejected
                </div>

              </div>

            </section>

            {/* QUICK ACTIONS */}

            <section className="dashboard-card">

              <div className="card-header">

                <div>

                  <h3>
                    Quick Actions
                  </h3>

                  <p>
                    Frequently used student services
                  </p>

                </div>

              </div>

              <div className="card-body">

                <div className="quick-grid">

                  <button className="quick-action">

                    <div className="quick-action-icon">
                      📝
                    </div>

                    <strong>
                      Apply OD
                    </strong>

                    <span>
                      Submit an On-Duty application
                    </span>

                  </button>

                  <button className="quick-action">

                    <div className="quick-action-icon">
                      📅
                    </div>

                    <strong>
                      Apply Leave
                    </strong>

                    <span>
                      Submit a leave request
                    </span>

                  </button>

                  <button className="quick-action">

                    <div className="quick-action-icon">
                      📸
                    </div>

                    <strong>
                      Upload Evidence
                    </strong>

                    <span>
                      Submit participation proof
                    </span>

                  </button>

                </div>

              </div>

            </section>

            <br />

            {/* RECENT APPLICATIONS */}

            <section className="dashboard-card">

              <div className="card-header">

                <div>

                  <h3>
                    Recent OD Applications
                  </h3>

                  <p>
                    Track the progress of your applications
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

                  Loading applications...

                </div>

              ) : apps.length === 0 ? (

                <div className="empty-box">

                  <div className="empty-icon">
                    📭
                  </div>

                  <h4>
                    No OD applications yet
                  </h4>

                  <p>
                    Your submitted applications will appear here.
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
                          Event
                        </th>

                        <th>
                          From
                        </th>

                        <th>
                          To
                        </th>

                        <th>
                          Status
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {apps.slice(0, 10).map(
                        (app) => (

                          <tr key={app.id}>

                            <td>

                              <span className="application-number">
                                {app.applicationNumber ||
                                  app.id}
                              </span>

                            </td>

                            <td>
                              {app.eventName || "-"}
                            </td>

                            <td>
                              {formatDate(
                                app.fromDate
                              )}
                            </td>

                            <td>
                              {formatDate(
                                app.toDate
                              )}
                            </td>

                            <td>

                              <span
                                className={`status-badge ${statusClass(
                                  app.status
                                )}`}
                              >
                                {statusText(
                                  app.status
                                )}
                              </span>

                            </td>

                          </tr>

                        )
                      )}

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