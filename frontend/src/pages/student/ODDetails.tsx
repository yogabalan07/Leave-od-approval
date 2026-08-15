import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import "./StudentPages.css";

interface Evidence {
  id: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  capturedAt: string;
  description?: string;
}

interface ODApplication {
  id: string;
  applicationNumber: string;
  eventName: string;
  eventType: string;
  eventLocation: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
  eventLatitude?: number;
  eventLongitude?: number;
  evidence?: Evidence[];
}

const ODDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] =
    useState<ODApplication | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplication = async () => {
      if (!id) return;

      try {
        const response = await api.get(`/od/${id}`);

        setApplication(
          response.data?.data ||
            response.data
        );
      } catch (err: any) {
        console.error(err);

        setError(
          err?.response?.data?.message ||
            "Unable to load OD details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [id]);

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  const formatStatus = (status?: string) => {
    return (
      status
        ?.replaceAll("_", " ")
        .replace(/\b\w/g, (c) =>
          c.toUpperCase()
        ) || "Pending"
    );
  };

  if (loading) {
    return (
      <div className="student-page">
        <div className="loading-box">
          <div className="spinner" />
          <p>Loading OD details...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="student-page">

        <div className="empty-box">

          <div className="empty-icon">
            ⚠️
          </div>

          <h2>
            Application Not Found
          </h2>

          <p>
            {error || "Unable to find this application."}
          </p>

          <button
            className="primary-btn"
            onClick={() =>
              navigate("/student/applications")
            }
          >
            Back to Applications
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="student-page">

      <div className="student-page-header">

        <div>
          <span className="page-kicker">
            OD APPLICATION
          </span>

          <h1>
            {application.eventName}
          </h1>

          <p>
            {application.applicationNumber}
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={() =>
            navigate("/student/applications")
          }
        >
          ← Applications
        </button>

      </div>

      <div className="details-layout">

        <div className="details-main">

          <section className="details-card">

            <div className="details-card-header">
              <h2>
                Event Information
              </h2>

              <span className="application-status status-pending">
                {formatStatus(application.status)}
              </span>
            </div>

            <div className="detail-grid">

              <div>
                <small>Event Name</small>
                <strong>
                  {application.eventName}
                </strong>
              </div>

              <div>
                <small>Event Type</small>
                <strong>
                  {application.eventType}
                </strong>
              </div>

              <div>
                <small>Location</small>
                <strong>
                  📍 {application.eventLocation}
                </strong>
              </div>

              <div>
                <small>From Date</small>
                <strong>
                  {formatDate(application.fromDate)}
                </strong>
              </div>

              <div>
                <small>To Date</small>
                <strong>
                  {formatDate(application.toDate)}
                </strong>
              </div>

            </div>

          </section>


          <section className="details-card">

            <h2>
              Reason
            </h2>

            <p className="reason-text">
              {application.reason}
            </p>

          </section>


          {application.eventLatitude &&
            application.eventLongitude && (

              <section className="details-card">

                <h2>
                  📍 Event Coordinates
                </h2>

                <div className="coordinates">

                  <div>
                    Latitude
                    <strong>
                      {application.eventLatitude}
                    </strong>
                  </div>

                  <div>
                    Longitude
                    <strong>
                      {application.eventLongitude}
                    </strong>
                  </div>

                </div>

              </section>

            )}

        </div>


        <aside className="details-sidebar">

          <div className="action-card">

            <h3>
              Participation Evidence
            </h3>

            <p>
              After participating in the event,
              upload photographs with your current
              location.
            </p>

            <button
              className="primary-btn full-btn"
              onClick={() =>
                navigate(
                  `/student/upload-evidence/${application.id}`
                )
              }
            >
              📷 Upload Evidence
            </button>

          </div>

          <div className="action-card">

            <h3>
              Application Status
            </h3>

            <div className="status-timeline">

              <div className="timeline-item active">
                <span>✓</span>
                <div>
                  <strong>Application Submitted</strong>
                  <small>Completed</small>
                </div>
              </div>

              <div
                className={
                  application.status !==
                  "MENTOR_PENDING"
                    ? "timeline-item active"
                    : "timeline-item"
                }
              >
                <span>2</span>
                <div>
                  <strong>Mentor Review</strong>
                  <small>
                    {application.status ===
                    "MENTOR_PENDING"
                      ? "Waiting"
                      : "Completed"}
                  </small>
                </div>
              </div>

              <div className="timeline-item">
                <span>3</span>
                <div>
                  <strong>HOD Approval</strong>
                  <small>Next stage</small>
                </div>
              </div>

              <div className="timeline-item">
                <span>4</span>
                <div>
                  <strong>Evidence Verification</strong>
                  <small>Final stage</small>
                </div>
              </div>

            </div>

          </div>

        </aside>

      </div>

    </div>
  );
};

export default ODDetails;