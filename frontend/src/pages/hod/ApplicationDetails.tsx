import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";

export default function ApplicationDetails() {
  const { id, type } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [remarks, setRemarks] =
    useState("");

  const [processing, setProcessing] =
    useState(false);

  const loadApplication = async () => {
    try {
      setLoading(true);

      const endpoint =
        type === "leave"
          ? `/leave/${id}`
          : `/od/${id}`;

      const response =
        await api.get(endpoint);

      setApplication(
        response.data?.data ??
        response.data
      );

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadApplication();
    };

    fetchData();
  }, [id, type]);

  const handleAction = async (
    action: "approve" | "reject"
  ) => {

    if (!id) return;

    if (
      action === "reject" &&
      !remarks.trim()
    ) {
      alert("Please enter rejection remarks.");
      return;
    }

    try {

      setProcessing(true);

      const endpoint =
        type === "leave"
          ? `/leave/${id}/${action}`
          : `/od/${id}/${action}`;

      await api.post(endpoint, {
        remarks,
      });

      alert(
        action === "approve"
          ? "Application approved successfully."
          : "Application rejected."
      );

      navigate("/hod/applications");

    } catch (error: any) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Unable to process application."
      );

    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="details-loading">
        Loading application...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="details-empty">
        <h2>Application not found</h2>

        <button
          onClick={() =>
            navigate("/hod/applications")
          }
        >
          Back
        </button>
      </div>
    );
  }

  const student =
    application.student || {};

  const isOD =
    type === "od";

  return (
    <div className="details-page">

      <div className="details-header">

        <button
          className="back-btn"
          onClick={() =>
            navigate("/hod/applications")
          }
        >
          ← Back
        </button>

        <div>
          <h1>
            Application Details
          </h1>

          <p>
            Review student application
          </p>
        </div>

      </div>

      <div className="application-number">

        <div>
          <span>Application Number</span>

          <strong>
            {application.applicationNumber ||
              `#${application.id}`}
          </strong>
        </div>

        <span className="status">
          {application.status
            ?.replaceAll("_", " ")}
        </span>

      </div>

      <div className="details-grid">

        <section className="details-card">

          <div className="card-title">
            <span>👨‍🎓</span>
            Student Information
          </div>

          <div className="info-grid">

            <div>
              <label>Name</label>
              <strong>
                {student.name || "-"}
              </strong>
            </div>

            <div>
              <label>Register Number</label>
              <strong>
                {student.registerNo || "-"}
              </strong>
            </div>

            <div>
              <label>Email</label>
              <strong>
                {student.email || "-"}
              </strong>
            </div>

            <div>
              <label>Department</label>
              <strong>
                {student.department?.name ||
                  "-"}
              </strong>
            </div>

          </div>

        </section>

        <section className="details-card">

          <div className="card-title">
            <span>
              {isOD ? "🎓" : "📅"}
            </span>

            {isOD
              ? "OD Information"
              : "Leave Information"}
          </div>

          {isOD ? (

            <div className="info-grid">

              <div>
                <label>Event</label>
                <strong>
                  {application.eventName ||
                    "-"}
                </strong>
              </div>

              <div>
                <label>Event Type</label>
                <strong>
                  {application.eventType ||
                    "-"}
                </strong>
              </div>

              <div>
                <label>Location</label>
                <strong>
                  {application.eventLocation ||
                    "-"}
                </strong>
              </div>

              <div>
                <label>From</label>
                <strong>
                  {new Date(
                    application.fromDate
                  ).toLocaleDateString()}
                </strong>
              </div>

              <div>
                <label>To</label>
                <strong>
                  {new Date(
                    application.toDate
                  ).toLocaleDateString()}
                </strong>
              </div>

            </div>

          ) : (

            <div className="info-grid">

              <div>
                <label>Leave Type</label>
                <strong>
                  {application.leaveType ||
                    "-"}
                </strong>
              </div>

              <div>
                <label>From</label>
                <strong>
                  {new Date(
                    application.fromDate
                  ).toLocaleDateString()}
                </strong>
              </div>

              <div>
                <label>To</label>
                <strong>
                  {new Date(
                    application.toDate
                  ).toLocaleDateString()}
                </strong>
              </div>

            </div>

          )}

        </section>

        <section className="details-card full">

          <div className="card-title">
            📝 Reason
          </div>

          <p className="reason">
            {application.reason ||
              "No reason provided."}
          </p>

        </section>

        {isOD &&
          application.eventLatitude &&
          application.eventLongitude && (

          <section className="details-card full">

            <div className="card-title">
              📍 Event Location
            </div>

            <div className="coordinates">

              <div>
                <label>Latitude</label>
                <strong>
                  {application.eventLatitude}
                </strong>
              </div>

              <div>
                <label>Longitude</label>
                <strong>
                  {application.eventLongitude}
                </strong>
              </div>

            </div>

            <a
              className="map-link"
              href={`https://www.google.com/maps?q=${application.eventLatitude},${application.eventLongitude}`}
              target="_blank"
              rel="noreferrer"
            >
              Open location in Google Maps →
            </a>

          </section>
        )}

        {isOD &&
          application.evidence?.length > 0 && (

          <section className="details-card full">

            <div className="card-title">
              📸 Participation Evidence
            </div>

            <div className="evidence-grid">

              {application.evidence.map(
                (item: any) => (

                  <div
                    className="evidence"
                    key={item.id}
                  >

                    <img
                      src={item.imageUrl}
                      alt="Participation evidence"
                    />

                    <div>
                      <strong>
                        📍{" "}
                        {item.latitude},
                        {" "}
                        {item.longitude}
                      </strong>

                      <small>
                        {item.capturedAt
                          ? new Date(
                              item.capturedAt
                            ).toLocaleString()
                          : ""}
                      </small>
                    </div>

                  </div>

                )
              )}

            </div>

          </section>
        )}

        <section className="details-card full">

          <div className="card-title">
            💬 HOD Remarks
          </div>

          <textarea
            value={remarks}
            onChange={e =>
              setRemarks(e.target.value)
            }
            placeholder="Enter your remarks..."
            rows={4}
          />

        </section>

      </div>

      {(application.status === "HOD_PENDING" ||
        application.status ===
          "MENTOR_APPROVED") && (

        <div className="action-bar">

          <button
            className="reject-btn"
            disabled={processing}
            onClick={() =>
              handleAction("reject")
            }
          >
            ✕ Reject
          </button>

          <button
            className="approve-btn"
            disabled={processing}
            onClick={() =>
              handleAction("approve")
            }
          >
            ✓ Approve
          </button>

        </div>

      )}

      <style>{`

        .details-page {
          min-height: 100vh;
          background: #f6f8fc;
          padding: 28px;
        }

        .details-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .details-header h1 {
          margin: 0;
          font-size: 28px;
        }

        .details-header p {
          margin: 5px 0;
          color: #7b8498;
        }

        .back-btn {
          border: none;
          background: white;
          padding: 10px 15px;
          border-radius: 10px;
          cursor: pointer;
        }

        .application-number {
          background: #172554;
          color: white;
          padding: 20px 24px;
          border-radius: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .application-number span {
          display: block;
          opacity: .7;
          font-size: 12px;
        }

        .application-number strong {
          display: block;
          margin-top: 5px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .details-card {
          background: white;
          padding: 22px;
          border-radius: 18px;
          box-shadow:
            0 5px 20px rgba(20,30,60,.05);
        }

        .details-card.full {
          grid-column: 1 / -1;
        }

        .card-title {
          font-weight: 800;
          font-size: 17px;
          margin-bottom: 20px;
          display: flex;
          gap: 9px;
          align-items: center;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        label {
          display: block;
          color: #8a93a7;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .info-grid strong {
          font-size: 14px;
        }

        .reason {
          color: #4f596d;
          line-height: 1.7;
        }

        .coordinates {
          display: flex;
          gap: 60px;
        }

        .map-link {
          display: inline-block;
          margin-top: 18px;
          color: #4054c7;
          font-weight: 600;
          text-decoration: none;
        }

        .evidence-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fill, minmax(220px, 1fr));
          gap: 15px;
        }

        .evidence {
          border: 1px solid #edf0f5;
          border-radius: 12px;
          overflow: hidden;
        }

        .evidence img {
          width: 100%;
          height: 170px;
          object-fit: cover;
          display: block;
        }

        .evidence div {
          padding: 12px;
        }

        .evidence small {
          display: block;
          color: #8992a5;
          margin-top: 5px;
        }

        textarea {
          width: 100%;
          box-sizing: border-box;
          resize: vertical;
          border: 1px solid #dfe4ed;
          border-radius: 10px;
          padding: 13px;
          outline: none;
          font-family: inherit;
        }

        .action-bar {
          background: white;
          position: sticky;
          bottom: 15px;
          margin-top: 20px;
          padding: 15px;
          border-radius: 15px;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          box-shadow:
            0 5px 25px rgba(0,0,0,.1);
        }

        .approve-btn,
        .reject-btn {
          border: none;
          padding: 12px 22px;
          border-radius: 10px;
          color: white;
          font-weight: 700;
          cursor: pointer;
        }

        .approve-btn {
          background: #16834b;
        }

        .reject-btn {
          background: #d43b3b;
        }

        button:disabled {
          opacity: .5;
          cursor: not-allowed;
        }

        .details-loading,
        .details-empty {
          padding: 80px;
          text-align: center;
        }

        @media(max-width: 800px) {
          .details-page {
            padding: 16px;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .details-card.full {
            grid-column: auto;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .coordinates {
            flex-direction: column;
            gap: 15px;
          }
        }

      `}</style>

    </div>
  );
}
