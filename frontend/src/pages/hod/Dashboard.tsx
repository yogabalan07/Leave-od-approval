import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "./Dashboard.css";

type Application = {
  id: string;
  applicationNumber?: string;
  eventName?: string;
  eventType?: string;
  eventLocation?: string;
  leaveType?: string;
  fromDate?: string;
  toDate?: string;
  reason?: string;
  status?: string;
  student?: {
    name?: string;
    registerNo?: string;
    email?: string;
  };
};

type DashboardData = {
  od: Application[];
  leave: Application[];
};

const getInitials = (name?: string) => {
  if (!name) return "H";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

const formatDate = (date?: string) => {
  if (!date) return "-";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return date;

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusText = (status?: string) => {
  if (!status) return "Pending";

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getStatusClass = (status?: string) => {
  if (!status) return "pending";

  const value = status.toLowerCase();

  if (value.includes("approved") || value === "verified") {
    return "approved";
  }

  if (value.includes("rejected")) {
    return "rejected";
  }

  return "pending";
};

export default function HODDashboard() {
  const [data, setData] = useState<DashboardData>({
    od: [],
    leave: [],
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"od" | "leave">("od");

  const [error, setError] = useState("");

  /*
   * IMPORTANT:
   * Do NOT write:
   *
   * useEffect(load, []);
   *
   * if load returns a Promise.
   *
   * We use a normal synchronous useEffect
   * and call the async function inside it.
   */
  const loadDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/hod/queue");

      const result = response?.data;

      /*
       * Supports both:
       *
       * { od: [], leave: [] }
       *
       * and
       *
       * { data: { od: [], leave: [] } }
       */
      const dashboard = result?.data ?? result ?? {};

      setData({
        od: Array.isArray(dashboard.od) ? dashboard.od : [],
        leave: Array.isArray(dashboard.leave) ? dashboard.leave : [],
      });
    } catch (err: any) {
      console.error("HOD dashboard error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/hod/queue");

        if (!mounted) return;

        const result = response?.data;
        const dashboard = result?.data ?? result ?? {};

        setData({
          od: Array.isArray(dashboard.od) ? dashboard.od : [],
          leave: Array.isArray(dashboard.leave)
            ? dashboard.leave
            : [],
        });
      } catch (err: any) {
        if (!mounted) return;

        console.error("HOD dashboard error:", err);

        setError(
          err?.response?.data?.message ||
            "Unable to load dashboard data."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const applications = useMemo(() => {
    return activeTab === "od" ? data.od : data.leave;
  }, [activeTab, data]);

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return applications;

    return applications.filter((application) => {
      const studentName =
        application.student?.name?.toLowerCase() || "";

      const registerNo =
        application.student?.registerNo?.toLowerCase() || "";

      const applicationNumber =
        application.applicationNumber?.toLowerCase() || "";

      const eventName =
        application.eventName?.toLowerCase() || "";

      const location =
        application.eventLocation?.toLowerCase() || "";

      return (
        studentName.includes(query) ||
        registerNo.includes(query) ||
        applicationNumber.includes(query) ||
        eventName.includes(query) ||
        location.includes(query)
      );
    });
  }, [applications, search]);

  const totalPending = data.od.length + data.leave.length;

  return (
    <div className="hod-page">

      {/* SIDEBAR */}
      <aside className="hod-sidebar">

        <div className="sidebar-brand">
          <div className="brand-logo">
            <span>OD</span>
          </div>

          <div>
            <h2>Smart OD</h2>
            <p>Approval System</p>
          </div>
        </div>

        <nav className="sidebar-nav">

          <div className="nav-section">
            <span>MAIN MENU</span>
          </div>

          <a className="nav-item active">
            <span className="nav-icon">▦</span>
            Dashboard
          </a>

          <a className="nav-item">
            <span className="nav-icon">📄</span>
            OD Applications
            {data.od.length > 0 && (
              <span className="nav-count">
                {data.od.length}
              </span>
            )}
          </a>

          <a className="nav-item">
            <span className="nav-icon">📝</span>
            Leave Applications
            {data.leave.length > 0 && (
              <span className="nav-count">
                {data.leave.length}
              </span>
            )}
          </a>

          <div className="nav-section">
            <span>MANAGEMENT</span>
          </div>

          <a className="nav-item">
            <span className="nav-icon">📊</span>
            Analytics
          </a>

          <a className="nav-item">
            <span className="nav-icon">📋</span>
            Reports
          </a>

          <a className="nav-item">
            <span className="nav-icon">⚙</span>
            Settings
          </a>

        </nav>

        <div className="sidebar-bottom">

          <div className="help-card">
            <div className="help-icon">?</div>

            <div>
              <strong>Need Help?</strong>
              <p>Contact system admin</p>
            </div>
          </div>

        </div>
      </aside>

      {/* MAIN */}
      <main className="hod-main">

        {/* TOP HEADER */}
        <header className="hod-header">

          <div>
            <div className="breadcrumb">
              Dashboard
              <span>/</span>
              HOD
            </div>

            <h1>Department Dashboard</h1>

            <p>
              Review and manage student OD & leave applications.
            </p>
          </div>

          <div className="header-actions">

            <button
              className="notification-btn"
              title="Notifications"
            >
              🔔
              {totalPending > 0 && (
                <span className="notification-dot" />
              )}
            </button>

            <div className="profile">

              <div className="profile-avatar">
                H
              </div>

              <div className="profile-info">
                <strong>Head of Department</strong>
                <span>HOD</span>
              </div>

              <span className="profile-arrow">⌄</span>

            </div>

          </div>

        </header>

        {/* ERROR */}
        {error && (
          <div className="error-banner">
            <span>⚠️</span>

            <div>
              <strong>Unable to load data</strong>
              <p>{error}</p>
            </div>

            <button onClick={() => loadDashboard(true)}>
              Retry
            </button>
          </div>
        )}

        {/* WELCOME CARD */}
        <section className="welcome-card">

          <div className="welcome-content">

            <div className="welcome-tag">
              ✨ HOD CONTROL CENTER
            </div>

            <h2>
              Good evening, HOD 👋
            </h2>

            <p>
              You have{" "}
              <strong>{totalPending}</strong>{" "}
              applications waiting for your attention.
            </p>

            <button
              className="primary-btn"
              onClick={() =>
                document
                  .getElementById("applications")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Review Applications
              <span>→</span>
            </button>

          </div>

          <div className="welcome-illustration">
            <div className="illustration-circle">
              📋
            </div>

            <div className="floating-card card-one">
              ✓
            </div>

            <div className="floating-card card-two">
              📄
            </div>
          </div>

        </section>

        {/* STATISTICS */}
        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-top">
              <div className="stat-icon blue">
                📄
              </div>

              <span className="stat-label">
                OD REQUESTS
              </span>
            </div>

            <div className="stat-number">
              {loading ? "—" : data.od.length}
            </div>

            <div className="stat-footer">
              <span className="stat-positive">
                ●
              </span>
              Waiting for HOD approval
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-top">
              <div className="stat-icon purple">
                📝
              </div>

              <span className="stat-label">
                LEAVE REQUESTS
              </span>
            </div>

            <div className="stat-number">
              {loading ? "—" : data.leave.length}
            </div>

            <div className="stat-footer">
              <span className="stat-positive">
                ●
              </span>
              Waiting for HOD approval
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-top">
              <div className="stat-icon orange">
                ⏳
              </div>

              <span className="stat-label">
                TOTAL PENDING
              </span>
            </div>

            <div className="stat-number">
              {loading ? "—" : totalPending}
            </div>

            <div className="stat-footer">
              <span className="stat-warning">
                ●
              </span>
              Requires your attention
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-top">
              <div className="stat-icon green">
                ✓
              </div>

              <span className="stat-label">
                SYSTEM STATUS
              </span>
            </div>

            <div className="system-status">
              <span className="online-dot" />
              Online
            </div>

            <div className="stat-footer">
              All systems operational
            </div>

          </div>

        </section>

        {/* APPLICATIONS */}
        <section
          className="applications-section"
          id="applications"
        >

          <div className="section-header">

            <div>
              <h2>Applications</h2>

              <p>
                Review applications submitted by students.
              </p>
            </div>

            <button
              className="refresh-btn"
              onClick={() => loadDashboard(true)}
              disabled={refreshing}
            >
              <span className={refreshing ? "spin" : ""}>
                ↻
              </span>

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

          </div>

          {/* TABS + SEARCH */}
          <div className="toolbar">

            <div className="tabs">

              <button
                className={
                  activeTab === "od"
                    ? "tab active"
                    : "tab"
                }
                onClick={() => {
                  setActiveTab("od");
                  setSearch("");
                }}
              >
                📄 OD Applications

                <span>
                  {data.od.length}
                </span>
              </button>

              <button
                className={
                  activeTab === "leave"
                    ? "tab active"
                    : "tab"
                }
                onClick={() => {
                  setActiveTab("leave");
                  setSearch("");
                }}
              >
                📝 Leave Applications

                <span>
                  {data.leave.length}
                </span>
              </button>

            </div>

            <div className="search-box">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search student, register no..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                >
                  ×
                </button>
              )}

            </div>

          </div>

          {/* TABLE */}
          <div className="table-wrapper">

            {loading ? (
              <div className="loading-state">

                <div className="loader" />

                <h3>Loading applications...</h3>

                <p>
                  Fetching the latest requests.
                </p>

              </div>
            ) : filteredApplications.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  🎉
                </div>

                <h3>
                  No applications found
                </h3>

                <p>
                  {search
                    ? "Try another search term."
                    : `There are no pending ${
                        activeTab === "od"
                          ? "OD"
                          : "leave"
                      } applications.`}
                </p>

              </div>

            ) : (

              <table className="applications-table">

                <thead>

                  <tr>
                    <th>APPLICATION</th>
                    <th>STUDENT</th>

                    {activeTab === "od" ? (
                      <>
                        <th>EVENT</th>
                        <th>LOCATION</th>
                      </>
                    ) : (
                      <th>LEAVE TYPE</th>
                    )}

                    <th>DATE</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredApplications.map(
                    (application) => (

                      <tr key={application.id}>

                        <td>

                          <div className="application-number">
                            #
                            {application.applicationNumber ||
                              application.id.substring(
                                0,
                                8
                              )}
                          </div>

                          <small>
                            Submitted
                          </small>

                        </td>

                        <td>

                          <div className="student-cell">

                            <div className="student-avatar">
                              {getInitials(
                                application.student?.name
                              )}
                            </div>

                            <div>

                              <strong>
                                {application.student?.name ||
                                  "Unknown Student"}
                              </strong>

                              <span>
                                {application.student
                                  ?.registerNo ||
                                  "No register number"}
                              </span>

                            </div>

                          </div>

                        </td>

                        {activeTab === "od" ? (
                          <>
                            <td>
                              <strong>
                                {application.eventName ||
                                  "—"}
                              </strong>

                              <span className="table-subtext">
                                {application.eventType ||
                                  "Event"}
                              </span>
                            </td>

                            <td>
                              <span className="location-text">
                                📍{" "}
                                {application.eventLocation ||
                                  "—"}
                              </span>
                            </td>
                          </>
                        ) : (
                          <td>
                            <span className="leave-type">
                              {application.leaveType ||
                                "General Leave"}
                            </span>
                          </td>
                        )}

                        <td>

                          <div className="date-cell">

                            <strong>
                              {formatDate(
                                application.fromDate
                              )}
                            </strong>

                            <span>
                              to{" "}
                              {formatDate(
                                application.toDate
                              )}
                            </span>

                          </div>

                        </td>

                        <td>

                          <span
                            className={`status-badge ${getStatusClass(
                              application.status
                            )}`}
                          >
                            <span>●</span>

                            {getStatusText(
                              application.status
                            )}
                          </span>

                        </td>

                        <td>

                          <button className="view-btn">
                            Review
                            <span>→</span>
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            )}

          </div>

        </section>

        {/* FOOTER */}
        <footer className="dashboard-footer">

          <span>
            © 2026 Smart OD System
          </span>

          <span>
            Department Management Portal
          </span>

        </footer>

      </main>
    </div>
  );
}