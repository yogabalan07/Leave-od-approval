import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

type Application = {
  id: string;
  applicationNumber?: string;
  student?: {
    name?: string;
    registerNo?: string;
    email?: string;
  };
  studentName?: string;
  registerNo?: string;
  eventName?: string;
  eventType?: string;
  eventLocation?: string;
  leaveType?: string;
  fromDate: string;
  toDate: string;
  reason?: string;
  status: string;
  createdAt?: string;
};

export default function Applications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const loadApplications = async () => {
    try {
      setLoading(true);

      const response = await api.get("/hod/queue");

      const data = response.data?.data ?? response.data;

      const od = Array.isArray(data?.od) ? data.od : [];
      const leave = Array.isArray(data?.leave) ? data.leave : [];

      const formattedOD = od.map((item: any) => ({
        ...item,
        type: "OD",
      }));

      const formattedLeave = leave.map((item: any) => ({
        ...item,
        type: "LEAVE",
      }));

      setApplications([...formattedOD, ...formattedLeave]);
    } catch (error) {
      console.error("Failed to load applications", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadApplications();
    };

    fetchData();
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((app: any) => {
      const studentName =
        app.student?.name ||
        app.studentName ||
        "";

      const registerNo =
        app.student?.registerNo ||
        app.registerNo ||
        "";

      const applicationNumber =
        app.applicationNumber || "";

      const searchText = search.toLowerCase();

      const matchesSearch =
        studentName.toLowerCase().includes(searchText) ||
        registerNo.toLowerCase().includes(searchText) ||
        applicationNumber.toLowerCase().includes(searchText);

      const matchesType =
        type === "ALL" || app.type === type;

      const matchesStatus =
        status === "ALL" || app.status === status;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [applications, search, type, status]);

  const getStatusClass = (value: string) => {
    if (
      value === "APPROVED" ||
      value === "MENTOR_APPROVED"
    ) {
      return "status approved";
    }

    if (value === "REJECTED") {
      return "status rejected";
    }

    return "status pending";
  };

  return (
    <div className="hod-page">

      <div className="page-header">
        <div>
          <h1>Applications</h1>
          <p>Review and manage student OD and Leave applications.</p>
        </div>

        <button
          className="refresh-btn"
          onClick={loadApplications}
        >
          ↻ Refresh
        </button>
      </div>

      <div className="stats-row">

        <div className="stat-card">
          <div className="stat-icon blue">📄</div>
          <div>
            <span>Total</span>
            <strong>{applications.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">⏳</div>
          <div>
            <span>Pending</span>
            <strong>
              {
                applications.filter(
                  a =>
                    a.status === "HOD_PENDING" ||
                    a.status === "MENTOR_APPROVED"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">✓</div>
          <div>
            <span>Approved</span>
            <strong>
              {
                applications.filter(
                  a => a.status === "APPROVED"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">!</div>
          <div>
            <span>Rejected</span>
            <strong>
              {
                applications.filter(
                  a => a.status === "REJECTED"
                ).length
              }
            </strong>
          </div>
        </div>

      </div>

      <div className="filter-card">

        <input
          type="text"
          placeholder="Search student, register number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <option value="ALL">All Types</option>
          <option value="OD">OD</option>
          <option value="LEAVE">Leave</option>
        </select>

        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="HOD_PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

      </div>

      <div className="table-card">

        {loading ? (
          <div className="loading">
            Loading applications...
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="empty">
            <div>📭</div>
            <h3>No applications found</h3>
            <p>There are no applications matching your filters.</p>
          </div>
        ) : (

          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>Application</th>
                  <th>Student</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredApplications.map((app: any) => (

                  <tr key={`${app.type}-${app.id}`}>

                    <td>
                      <strong>
                        {app.applicationNumber ||
                          `#${app.id.slice(0, 8)}`}
                      </strong>
                    </td>

                    <td>
                      <div className="student-cell">
                        <div className="avatar">
                          {(
                            app.student?.name ||
                            app.studentName ||
                            "S"
                          ).charAt(0)}
                        </div>

                        <div>
                          <strong>
                            {app.student?.name ||
                              app.studentName ||
                              "Unknown"}
                          </strong>

                          <small>
                            {app.student?.registerNo ||
                              app.registerNo ||
                              "-"}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="type-badge">
                        {app.type}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        app.fromDate
                      ).toLocaleDateString()}{" "}
                      -{" "}
                      {new Date(
                        app.toDate
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <span
                        className={getStatusClass(app.status)}
                      >
                        {app.status.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td>
                      <button
                        className="view-btn"
                        onClick={() =>
                          navigate(
                            `/hod/applications/${app.type.toLowerCase()
