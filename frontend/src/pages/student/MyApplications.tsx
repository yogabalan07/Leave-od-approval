import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "./StudentPages.css";

interface Application {
  id: string;
  applicationNumber?: string;
  eventName?: string;
  eventType?: string;
  eventLocation?: string;
  leaveType?: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
  createdAt?: string;
}

const MyApplications = () => {
  const navigate = useNavigate();

  const [ods, setOds] = useState<Application[]>([]);
  const [leaves, setLeaves] = useState<Application[]>([]);
  const [activeTab, setActiveTab] =
    useState<"all" | "od" | "leave">("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);

        const [odResponse, leaveResponse] =
          await Promise.all([
            api.get("/od/my"),
            api.get("/leave/my"),
          ]);

        setOds(
          odResponse.data?.data ||
            odResponse.data ||
            []
        );

        setLeaves(
          leaveResponse.data?.data ||
            leaveResponse.data ||
            []
        );
      } catch (err: any) {
        console.error(err);

        setError(
          err?.response?.data?.message ||
            "Unable to load applications."
        );
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const formatDate = (date: string) => {
    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return date;
    }

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusClass = (status: string) => {
    const value = status?.toUpperCase() || "";

    if (value.includes("REJECT")) {
      return "status-rejected";
    }

    if (value.includes("APPROVED")) {
      return "status-approved";
    }

    return "status-pending";
  };

  const formatStatus = (status: string) => {
    return status
      ?.replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) ||
      "Pending";
  };

  const all = [
    ...ods.map((item) => ({
      ...item,
      applicationType: "OD",
    })),

    ...leaves.map((item) => ({
      ...item,
      applicationType: "LEAVE",
    })),
  ];

  const filtered =
    activeTab === "od"
      ? ods.map((item) => ({
          ...item,
          applicationType: "OD",
        }))
      : activeTab === "leave"
      ? leaves.map((item) => ({
          ...item,
          applicationType: "LEAVE",
        }))
      : all;

  return (
    <div className="student-page">

      <div className="student-page-header">

        <div>
          <span className="page-kicker">
            STUDENT PORTAL
          </span>

          <h1>My Applications</h1>

          <p>
            Track your OD and leave applications.
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={() =>
            navigate("/student/dashboard")
          }
        >
          ← Dashboard
        </button>

      </div>

      <div className="application-tabs">

        <button
          className={
            activeTab === "all" ? "active" : ""
          }
          onClick={() => setActiveTab("all")}
        >
          All
          <span>{all.length}</span>
        </button>

        <button
          className={
            activeTab === "od" ? "active" : ""
          }
          onClick={() => setActiveTab("od")}
        >
          OD
          <span>{ods.length}</span>
        </button>

        <button
          className={
            activeTab === "leave" ? "active" : ""
          }
          onClick={() => setActiveTab("leave")}
        >
          Leave
          <span>{leaves.length}</span>
        </button>

      </div>

      {error && (
        <div className="alert alert-error">
          ⚠️ {error}
        </div>
      )}

      {loading ? (

        <div className="loading-box">
          <div className="spinner" />
          <p>Loading applications...</p>
        </div>

      ) : filtered.length === 0 ? (

        <div className="empty-box">

          <div className="empty-icon">
            📂
          </div>

          <h2>
            No Applications Found
          </h2>

          <p>
            You have not submitted any applications yet.
          </p>

          <div className="empty-actions">

            <button
              className="primary-btn"
              onClick={() =>
                navigate("/student/apply-od")
              }
            >
              + Apply OD
            </button>

            <button
              className="secondary-btn"
              onClick={() =>
                navigate("/student/apply-leave")
              }
            >
              + Apply Leave
            </button>

          </div>

        </div>

      ) : (

        <div className="application-list">

          {filtered.map((application) => (

            <div
              className="application-card"
              key={`${application.applicationType}-${application.id}`}
            >

              <div className="application-card-top">

                <div className="application-type">

                  <span className="application-type-icon">
                    {application.applicationType === "OD"
                      ? "🎓"
                      : "🏠"}
                  </span>

                  <div>
                    <strong>
                      {application.applicationType ===
                      "OD"
                        ? application.eventName ||
                          "OD Application"
                        : application.leaveType ||
                          "Leave Application"}
                    </strong>

                    <small>
                      {application.applicationNumber ||
                        `APP-${application.id.slice(
                          0,
                          8
                        )}`}
                    </small>
                  </div>

                </div>

                <span
                  className={`application-status ${statusClass(
                    application.status
                  )}`}
                >
                  {formatStatus(application.status)}
                </span>

              </div>

              <div className="application-info-grid">

                <div>
                  <small>From</small>
                  <strong>
                    {formatDate(application.fromDate)}
                  </strong>
                </div>

                <div>
                  <small>To</small>
                  <strong>
                    {formatDate(application.toDate)}
                  </strong>
                </div>

                {application.eventLocation && (
                  <div>
                    <small>Location</small>
                    <strong>
                      {application.eventLocation}
                    </strong>
                  </div>
                )}

                {application.eventType && (
                  <div>
                    <small>Event Type</small>
                    <strong>
                      {application.eventType}
                    </strong>
                  </div>
                )}

              </div>

              <div className="application-card-footer">

                <span>
                  Submitted{" "}
                  {application.createdAt
                    ? formatDate(application.createdAt)
                    : ""}
                </span>

                <button
                  className="view-btn"
                  onClick={() => {
                    if (
                      application.applicationType ===
                      "OD"
                    ) {
                      navigate(
                        `/student/od/${application.id}`
                      );
                    }
                  }}
                >
                  View Details →
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default MyApplications;