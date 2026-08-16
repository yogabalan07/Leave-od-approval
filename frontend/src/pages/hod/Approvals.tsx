import { useEffect, useState } from "react";
import { api } from "../../services/api";
import "./Approvals.css";

interface Application {
  id: string;
  applicationNumber: string;
  student?: {
    id: string;
    name: string;
    email: string;
    registerNo?: string;
  };

  eventName?: string;
  eventType?: string;
  eventLocation?: string;

  leaveType?: string;

  fromDate: string;
  toDate: string;
  reason: string;

  status: string;
  createdAt: string;
}

interface ApiResponse {
  data?: Application[];
}

export default function Approvals() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  const [remarks, setRemarks] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  // --------------------------------------------------
  // LOAD HOD APPROVAL QUEUE
  // --------------------------------------------------

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);

        const response = await api.get("/hod/queue");

        const data = response.data?.data ?? response.data ?? {};

        /*
          Your backend may return:
          {
            od: [],
            leave: []
          }

          So convert both into one list.
        */

        const odApplications = (data.od || []).map((item: Application) => ({
          ...item,
          type: "OD",
        }));

        const leaveApplications = (data.leave || []).map(
          (item: Application) => ({
            ...item,
            type: "LEAVE",
          })
        );

        setApplications([...odApplications, ...leaveApplications]);
      } catch (error) {
        console.error("Failed to load HOD applications", error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  // --------------------------------------------------
  // APPROVE APPLICATION
  // --------------------------------------------------

  const approveApplication = async () => {
    if (!selectedApplication) return;

    try {
      setProcessing(true);

      await api.post(`/hod/applications/${selectedApplication.id}/approve`, {
        remarks,
      });

      alert("Application approved successfully.");

      setApplications((prev) =>
        prev.filter((item) => item.id !== selectedApplication.id)
      );

      setSelectedApplication(null);
      setRemarks("");
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Unable to approve application."
      );
    } finally {
      setProcessing(false);
    }
  };

  // --------------------------------------------------
  // REJECT APPLICATION
  // --------------------------------------------------

  const rejectApplication = async () => {
    if (!selectedApplication) return;

    if (!remarks.trim()) {
      alert("Please enter rejection remarks.");
      return;
    }

    try {
      setProcessing(true);

      await api.post(`/hod/applications/${selectedApplication.id}/reject`, {
        remarks,
      });

      alert("Application rejected.");

      setApplications((prev) =>
        prev.filter((item) => item.id !== selectedApplication.id)
      );

      setSelectedApplication(null);
      setRemarks("");
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Unable to reject application."
      );
    } finally {
      setProcessing(false);
    }
  };

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const filteredApplications = applications.filter((application: any) => {
    const matchesFilter =
      filter === "ALL" ||
      application.type === filter ||
      application.status === filter;

    const searchText = search.toLowerCase();

    const matchesSearch =
      application.applicationNumber
        ?.toLowerCase()
        .includes(searchText) ||
      application.student?.name
        ?.toLowerCase()
        .includes(searchText) ||
      application.student?.registerNo
        ?.toLowerCase()
        .includes(searchText) ||
      application.eventName
        ?.toLowerCase()
        .includes(searchText) ||
      application.leaveType
        ?.toLowerCase()
        .includes(searchText);

    return matchesFilter && matchesSearch;
  });

  // --------------------------------------------------
  // DATE FORMAT
  // --------------------------------------------------

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // --------------------------------------------------
  // STATUS
  // --------------------------------------------------

  const statusClass = (status: string) => {
    switch (status) {
      case "HOD_PENDING":
        return "status pending";

      case "APPROVED":
        return "status approved";

      case "REJECTED":
        return "status rejected";

      default:
        return "status";
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="hod-approvals">

      {/* HEADER */}

      <div className="approvals-header">

        <div>
          <div className="page-badge">
            HOD CONTROL CENTER
          </div>

          <h1>Application Approvals</h1>

          <p>
            Review and approve student OD and Leave applications.
          </p>
        </div>

        <div className="header-icon">
          ✓
        </div>

      </div>

      {/* STAT CARDS */}

      <div className="approval-stats">

        <div className="approval-stat-card">
          <div className="stat-icon blue">📋</div>

          <div>
            <span>Total Pending</span>
            <strong>{applications.length}</strong>
          </div>
        </div>

        <div className="approval-stat-card">
          <div className="stat-icon purple">🎓</div>

          <div>
            <span>OD Applications</span>
            <strong>
              {
                applications.filter(
                  (application: any) => application.type === "OD"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="approval-stat-card">
          <div className="stat-icon orange">📅</div>

          <div>
            <span>Leave Applications</span>
            <strong>
              {
                applications.filter(
                  (application: any) => application.type === "LEAVE"
                ).length
              }
            </strong>
          </div>
        </div>

      </div>

      {/* TOOLBAR */}

      <div className="approval-toolbar">

        <div className="search-box">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search student, register number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="filter-buttons">

          <button
            className={filter === "ALL" ? "active" : ""}
            onClick={() => setFilter("ALL")}
          >
            All
          </button>

          <button
            className={filter === "OD" ? "active" : ""}
            onClick={() => setFilter("OD")}
          >
            OD
          </button>

          <button
            className={filter === "LEAVE" ? "active" : ""}
            onClick={() => setFilter("LEAVE")}
          >
            Leave
          </button>

        </div>

      </div>

      {/* TABLE */}

      <div className="approval-card">

        <div className="table-header">

          <div>
            <h2>Pending Applications</h2>

            <span>
              {filteredApplications.length} applications
            </span>
          </div>

        </div>

        {loading ? (

          <div className="loading-container">

            <div className="loader"></div>

            <p>Loading applications...</p>

          </div>

        ) : filteredApplications.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              ✓
            </div>

            <h3>No pending applications</h3>

            <p>
              All applications have been processed.
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>
                  <th>Application</th>
                  <th>Student</th>
                  <th>Type</th>
                  <th>Purpose</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredApplications.map(
                  (application: any) => (

                    <tr key={application.id}>

                      {/* APPLICATION */}

                      <td>

                        <div className="application-number">

                          #
                          {application.applicationNumber}

                        </div>

                        <small>
                          {formatDate(application.createdAt)}
                        </small>

                      </td>

                      {/* STUDENT */}

                      <td>

                        <div className="student-info">

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
                                "No Register Number"}
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* TYPE */}

                      <td>

                        <span
                          className={
                            application.type === "OD"
                              ? "type-badge od"
                              : "type-badge leave"
                          }
                        >
                          {application.type === "OD"
                            ? "🎓 OD"
                            : "📅 Leave"}
                        </span>

                      </td>

                      {/* PURPOSE */}

                      <td>

                        <div className="purpose">

                          {application.type === "OD"
                            ? application.eventName
                            : application.leaveType}

                          <small>
                            {application.type === "OD"
                              ? application.eventLocation
                              : application.reason}
                          </small>

                        </div>

                      </td>

                      {/* DATE */}

                      <td>

                        <div className="date-range">

                          <span>
                            {formatDate(application.fromDate)}
                          </span>

                          <small>to</small>

                          <span>
                            {formatDate(application.toDate)}
                          </span>

                        </div>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={statusClass(
                            application.status
                          )}
                        >
                          {application.status
                            ?.replaceAll("_", " ")
                            .replace("HOD PENDING", "PENDING")}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td>

                        <button
                          className="review-button"
                          onClick={() =>
                            setSelectedApplication(application)
                          }
                        >
                          Review
                          <span>→</span>
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* REVIEW MODAL */}

      {selectedApplication && (

        <div
          className="modal-overlay"
          onClick={() => {
            if (!processing) {
              setSelectedApplication(null);
              setRemarks("");
            }
          }}
        >

          <div
            className="approval-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <span className="modal-label">
                  APPLICATION REVIEW
                </span>

                <h2>
                  {selectedApplication.applicationNumber}
                </h2>

              </div>

              <button
                className="close-button"
                onClick={() => {
                  if (!processing) {
                    setSelectedApplication(null);
                    setRemarks("");
                  }
                }}
              >
                ×
              </button>

            </div>

            {/* STUDENT */}

            <div className="modal-student">

              <div className="large-avatar">

                {selectedApplication.student?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "S"}

              </div>

              <div>

                <h3>
                  {selectedApplication.student?.name}
                </h3>

                <p>
                  Register No:
                  {" "}
                  {selectedApplication.student?.registerNo ||
                    "-"}
                </p>

                <p>
                  {selectedApplication.student?.email}
                </p>

              </div>

            </div>

            {/* DETAILS */}

            <div className="details-grid">

              <div className="detail-item">

                <label>Application Type</label>

                <strong>
                  {(selectedApplication as any).type === "OD"
                    ? "On Duty (OD)"
                    : "Leave"}
                </strong>

              </div>

              <div className="detail-item">

                <label>From Date</label>

                <strong>
                  {formatDate(
                    selectedApplication.fromDate
                  )}
                </strong>

              </div>

              <div className="detail-item">

                <label>To Date</label>

                <strong>
                  {formatDate(
                    selectedApplication.toDate
                  )}
                </strong>

              </div>

              <div className="detail-item">

                <label>Purpose</label>

                <strong>

                  {(selectedApplication as any).type === "OD"
                    ? selectedApplication.eventName
                    : selectedApplication.leaveType}

                </strong>

              </div>

            </div>

            {/* REASON */}

            <div className="reason-section">

              <label>
                Reason / Description
              </label>

              <div className="reason-box">

                {selectedApplication.reason ||
                  "No description provided."}

              </div>

            </div>

            {/* REMARKS */}

            <div className="remarks-section">

              <label>
                HOD Remarks
                <span>Required when rejecting</span>
              </label>

              <textarea
                placeholder="Enter your remarks..."
                value={remarks}
                onChange={(e) =>
                  setRemarks(e.target.value)
                }
                disabled={processing}
              />

            </div>

            {/* ACTIONS */}

            <div className="modal-actions">

              <button
                className="cancel-button"
                disabled={processing}
                onClick={() => {
                  setSelectedApplication(null);
                  setRemarks("");
                }}
              >
                Cancel
              </button>

              <button
                className="reject-button"
                disabled={processing}
                onClick={rejectApplication}
              >
                ✕ Reject
              </button>

              <button
                className="approve-button"
                disabled={processing}
                onClick={approveApplication}
              >
                {processing
                  ? "Processing..."
                  : "✓ Approve"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
            }
