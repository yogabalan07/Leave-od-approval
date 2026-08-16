import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";

export default function Reports() {

  const [applications, setApplications] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [type, setType] =
    useState("ALL");

  const [status, setStatus] =
    useState("ALL");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const loadData = async () => {

    try {

      setLoading(true);

      const response =
        await api.get("/hod/queue");

      const data =
        response.data?.data ??
        response.data;

      const od =
        Array.isArray(data?.od)
          ? data.od.map((x: any) => ({
              ...x,
              type: "OD",
            }))
          : [];

      const leave =
        Array.isArray(data?.leave)
          ? data.leave.map((x: any) => ({
              ...x,
              type: "LEAVE",
            }))
          : [];

      setApplications([
        ...od,
        ...leave,
      ]);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    const fetchData = async () => {
      await loadData();
    };

    fetchData();

  }, []);

  const filtered = useMemo(() => {

    return applications.filter(app => {

      const appDate =
        new Date(app.fromDate);

      const matchesType =
        type === "ALL" ||
        app.type === type;

      const matchesStatus =
        status === "ALL" ||
        app.status === status;

      const matchesFrom =
        !fromDate ||
        appDate >= new Date(fromDate);

      const matchesTo =
        !toDate ||
        appDate <= new Date(
          `${toDate}T23:59:59`
        );

      return (
        matchesType &&
        matchesStatus &&
        matchesFrom &&
        matchesTo
      );

    });

  }, [
    applications,
    type,
    status,
    fromDate,
    toDate,
  ]);

  const exportCSV = () => {

    const headers = [
      "Application Number",
      "Student",
      "Register Number",
      "Type",
      "From Date",
      "To Date",
      "Status",
      "Reason",
    ];

    const rows = filtered.map(app => [

      app.applicationNumber || "",

      app.student?.name ||
      app.studentName ||
      "",

      app.student?.registerNo ||
      app.registerNo ||
      "",

      app.type,

      new Date(
        app.fromDate
      ).toLocaleDateString(),

      new Date(
        app.toDate
      ).toLocaleDateString(),

      app.status,

      `"${String(
        app.reason || ""
      ).replaceAll('"', '""')}"`,

    ]);

    const csv = [
      headers.join(","),
      ...rows.map(row =>
        row.join(",")
      ),
    ].join("\n");

    const blob =
      new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "hod-application-report.csv";

    link.click();

    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="reports-page">

      <div className="reports-header">

        <div>
          <h1>Reports</h1>

          <p>
            Generate department OD and Leave reports.
          </p>
        </div>

        <div className="header-actions">

          <button
            className="print-btn"
            onClick={printReport}
          >
            🖨 Print
          </button>

          <button
            className="export-btn"
            onClick={exportCSV}
          >
            ↓ Export CSV
          </button>

        </div>

      </div>

      <div className="report-filters">

        <div>
          <label>Application Type</label>

          <select
            value={type}
            onChange={e =>
              setType(e.target.value)
            }
          >
            <option value="ALL">All</option>
            <option value="OD">OD</option>
            <option value="LEAVE">Leave</option>
          </select>
        </div>

        <div>
          <label>Status</label>

          <select
            value={status}
            onChange={e =>
              setStatus(e.target.value)
            }
          >
            <option value="ALL">All</option>
            <option value="HOD_PENDING">
              Pending
            </option>
            <option value="APPROVED">
              Approved
            </option>
            <option value="REJECTED">
              Rejected
            </option>
          </select>
        </div>

        <div>
          <label>From Date</label>

          <input
            type="date"
            value={fromDate}
            onChange={e =>
              setFromDate(e.target.value)
            }
          />
        </div>

        <div>
          <label>To Date</label>

          <input
            type="date"
            value={toDate}
            onChange={e =>
              setToDate(e.target.value)
            }
          />
        </div>

      </div>

      <div className="report-summary">

        <div>
          <span>Generated Results</span>
          <strong>
            {filtered.length}
          </strong>
        </div>

        <div>
          <span>OD</span>
          <strong>
            {
              filtered.filter(
                x => x.type === "OD"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Leave</span>
          <strong>
            {
              filtered.filter(
                x => x.type === "LEAVE"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Approved</span>
          <strong>
            {
              filtered.filter(
                x => x.status === "APPROVED"
              ).length
            }
          </strong>
        </div>

      </div>

      <div className="report-card">

        {loading ? (

          <div className="loading">
            Generating report...
          </div>

        ) : filtered.length === 0 ? (

          <div className="empty">
            <div>📊</div>
            <h3>No records found</h3>
            <p>
              Change your filters and try again.
            </p>
          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>
                  <th>Application</th>
                  <th>Student</th>
                  <th>Register No</th>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {filtered.map(
                  (app: any) => (

                    <tr
                      key={`${app.type}-${app.id}`}
                    >

                      <td>
                        <strong>
                          {app.applicationNumber ||
                            app.id}
                        </strong>
                      </td>

                      <td>
                        {app.student?.name ||
                          app.studentName ||
                          "-"}
                      </td>

                      <td>
                        {app.student?.registerNo ||
                          app.registerNo ||
                          "-"}
                      </td>

                      <td>
                        <span className="type">
                          {app.type}
                        </span>
                      </td>

                      <td>
                        {new Date(
                          app.fromDate
                        ).toLocaleDateString()}
                        {" - "}
                        {new Date(
                          app.toDate
                        ).toLocaleDateString()}
                      </td>

                      <td>

                        <span
                          className={`
                            status
                            ${
                              app.status ===
                              "APPROVED"
                                ? "approved"
                                : app.status ===
                                  "REJECTED"
                                ? "rejected"
                                : "pending"
                            }
                          `}
                        >
                          {app.status.replaceAll(
                            "_",
                            " "
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

      </div>

      <style>{`

        .reports-page {
          min-height: 100vh;
          background: #f6f8fc;
          padding: 28px;
        }

        .reports-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .reports-header h1 {
          margin: 0;
          font-size: 30px;
        }

        .reports-header p {
          color: #7b8498;
          margin: 6px 0;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .header-actions button {
          border: none;
          padding: 11px 17px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
        }

        .print-btn {
          background: white;
          color: #283044;
        }

        .export-btn {
          background: #172554;
          color: white;
        }

        .report-filters {
          background: white;
          padding: 20px;
          border-radius: 18px;
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 20px;
          box-shadow:
            0 5px 20px rgba(20,30,60,.05);
        }

        label {
          display: block;
          color: #7e8799;
          font-size: 12px;
          margin-bottom: 7px;
        }

        select,
        input {
          width: 100%;
          box-sizing: border-box;
          padding: 11px;
          border: 1px solid #e0e4ec;
          border-radius: 9px;
          outline: none;
          background: white;
        }

        .report-summary {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }

        .report-summary div {
          background: white;
          padding: 18px;
          border-radius: 15px;
          box-shadow:
            0 5px 20px rgba(20,30,60,.04);
        }

        .report-summary span {
          display: block;
          color: #8a93a7;
          font-size: 12px;
        }

        .report-summary strong {
          font-size: 25px;
          display: block;
          margin-top: 5px;
        }

        .report-card {
          background: white;
          border-radius: 18px;
          overflow: hidden;
          box-shadow:
            0 5px 20px rgba(20,30,60,.05);
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: #f8f9fc;
          color: #737d91;
          font-size: 12px;
          text-align: left;
          padding: 15px;
          text-transform: uppercase;
        }

        td {
          padding: 16px 15px;
          border-top: 1px solid #edf0f5;
          font-size: 14px;
        }

        .type {
          background: #eef2ff;
          color: #4357c5;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 11px;
          font-weight: 700;
        }

        .status {
          padding: 6px 10px;
          border-radius: 15px;
          font-size: 11px;
          font-weight: 700;
        }

        .approved {
          color: #16834b;
          background: #e6f8ed;
        }

        .pending {
          color: #a56c00;
          background: #fff2d8;
        }

        .rejected {
          color: #c53131;
          background: #ffe7e7;
        }

        .loading,
        .empty {
          text-align: center;
          padding: 70px;
          color: #7c8598;
        }

        .empty div {
          font-size: 42px;
        }

        @media(max-width: 900px) {

          .report-filters {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .report-summary {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        @media(max-width: 600px) {

          .reports-page {
            padding: 16px;
          }

          .reports-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .report-filters {
            grid-template-columns: 1fr;
          }

          .report-summary {
            grid-template-columns: 1fr;
          }

        }

        @media print {

          .reports-page {
            background: white;
            padding: 0;
          }

          .header-actions,
          .report-filters {
            display: none;
          }

          .report-card {
            box-shadow: none;
          }

        }

      `}</style>

    </div>
  );
                      }
