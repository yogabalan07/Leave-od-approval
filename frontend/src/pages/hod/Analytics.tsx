import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";

export default function Analytics() {

  const [applications, setApplications] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

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

  const statistics = useMemo(() => {

    const total =
      applications.length;

    const approved =
      applications.filter(
        x => x.status === "APPROVED"
      ).length;

    const rejected =
      applications.filter(
        x => x.status === "REJECTED"
      ).length;

    const pending =
      applications.filter(
        x =>
          x.status === "HOD_PENDING" ||
          x.status === "MENTOR_APPROVED"
      ).length;

    const od =
      applications.filter(
        x => x.type === "OD"
      ).length;

    const leave =
      applications.filter(
        x => x.type === "LEAVE"
      ).length;

    return {
      total,
      approved,
      rejected,
      pending,
      od,
      leave,
    };

  }, [applications]);

  const percentage = (
    value: number
  ) => {

    if (!statistics.total)
      return 0;

    return Math.round(
      (value / statistics.total) * 100
    );
  };

  return (
    <div className="analytics-page">

      <div className="analytics-header">

        <div>
          <h1>Department Analytics</h1>

          <p>
            Overview of OD and Leave activities
          </p>
        </div>

        <button
          onClick={loadData}
          className="refresh"
        >
          ↻ Refresh
        </button>

      </div>

      {loading ? (
        <div className="loading">
          Loading analytics...
        </div>
      ) : (

        <>

          <div className="analytics-cards">

            <div className="analytics-card">
              <span className="icon">📋</span>
              <div>
                <small>Total Applications</small>
                <h2>{statistics.total}</h2>
              </div>
            </div>

            <div className="analytics-card green">
              <span className="icon">✓</span>
              <div>
                <small>Approved</small>
                <h2>{statistics.approved}</h2>
              </div>
            </div>

            <div className="analytics-card orange">
              <span className="icon">⏳</span>
              <div>
                <small>Pending</small>
                <h2>{statistics.pending}</h2>
              </div>
            </div>

            <div className="analytics-card red">
              <span className="icon">✕</span>
              <div>
                <small>Rejected</small>
                <h2>{statistics.rejected}</h2>
              </div>
            </div>

          </div>

          <div className="analytics-grid">

            <div className="analytics-panel">

              <h3>Application Distribution</h3>

              <div className="distribution">

                <div className="distribution-item">

                  <div className="distribution-top">
                    <span>OD Applications</span>
                    <strong>
                      {statistics.od}
                    </strong>
                  </div>

                  <div className="progress">
                    <div
                      style={{
                        width:
                          `${percentage(
                            statistics.od
                          )}%`,
                      }}
                    />
                  </div>

                  <small>
                    {percentage(
                      statistics.od
                    )}% of total
                  </small>

                </div>

                <div className="distribution-item">

                  <div className="distribution-top">
                    <span>Leave Applications</span>
                    <strong>
                      {statistics.leave}
                    </strong>
                  </div>

                  <div className="progress leave">
                    <div
                      style={{
                        width:
                          `${percentage(
                            statistics.leave
                          )}%`,
                      }}
                    />
                  </div>

                  <small>
                    {percentage(
                      statistics.leave
                    )}% of total
                  </small>

                </div>

              </div>

            </div>

            <div className="analytics-panel">

              <h3>Approval Performance</h3>

              <div className="performance">

                <div className="circle">

                  <strong>
                    {percentage(
                      statistics.approved
                    )}%
                  </strong>

                  <span>
                    Approval Rate
                  </span>

                </div>

                <div className="performance-list">

                  <div>
                    <span>
                      <i className="dot approved-dot" />
                      Approved
                    </span>

                    <strong>
                      {statistics.approved}
                    </strong>
                  </div>

                  <div>
                    <span>
                      <i className="dot pending-dot" />
                      Pending
                    </span>

                    <strong>
                      {statistics.pending}
                    </strong>
                  </div>

                  <div>
                    <span>
                      <i className="dot rejected-dot" />
                      Rejected
                    </span>

                    <strong>
                      {statistics.rejected}
                    </strong>
                  </div>

                </div>

              </div>

            </div>

          </div>

          <div className="analytics-panel">

            <h3>Application Status</h3>

            <div className="status-chart">

              <div className="bar-row">

                <span>Approved</span>

                <div className="bar">
                  <div
                    className="bar-approved"
                    style={{
                      width:
                        `${percentage(
                          statistics.approved
                        )}%`,
                    }}
                  />
                </div>

                <strong>
                  {statistics.approved}
                </strong>

              </div>

              <div className="bar-row">

                <span>Pending</span>

                <div className="bar">
                  <div
                    className="bar-pending"
                    style={{
                      width:
                        `${percentage(
                          statistics.pending
                        )}%`,
                    }}
                  />
                </div>

                <strong>
                  {statistics.pending}
                </strong>

              </div>

              <div className="bar-row">

                <span>Rejected</span>

                <div className="bar">
                  <div
                    className="bar-rejected"
                    style={{
                      width:
                        `${percentage(
                          statistics.rejected
                        )}%`,
                    }}
                  />
                </div>

                <strong>
                  {statistics.rejected}
                </strong>

              </div>

            </div>

          </div>

        </>
      )}

      <style>{`

        .analytics-page {
          min-height: 100vh;
          background: #f6f8fc;
          padding: 28px;
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .analytics-header h1 {
          margin: 0;
          font-size: 30px;
        }

        .analytics-header p {
          margin: 6px 0;
          color: #7b8498;
        }

        .refresh {
          border: none;
          background: #172554;
          color: white;
          padding: 11px 18px;
          border-radius: 10px;
          cursor: pointer;
        }

        .analytics-cards {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 20px;
        }

        .analytics-card {
          background: white;
          border-radius: 18px;
          padding: 22px;
          display: flex;
          gap: 15px;
          align-items: center;
          box-shadow:
            0 5px 20px rgba(20,30,60,.05);
        }

        .analytics-card .icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #e9edff;
          font-size: 21px;
        }

        .analytics-card.green .icon {
          background: #e5f8ed;
        }

        .analytics-card.orange .icon {
          background: #fff2da;
        }

        .analytics-card.red .icon {
          background: #ffe7e7;
        }

        .analytics-card small {
          color: #8b94a7;
        }

        .analytics-card h2 {
          margin: 5px 0 0;
          font-size: 27px;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .analytics-panel {
          background: white;
          padding: 24px;
          border-radius: 18px;
          box-shadow:
            0 5px 20px rgba(20,30,60,.05);
          margin-bottom: 20px;
        }

        .analytics-panel h3 {
          margin: 0 0 25px;
        }

        .distribution-item {
          margin-bottom: 25px;
        }

        .distribution-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .progress {
          height: 10px;
          border-radius: 20px;
          background: #edf0f6;
          overflow: hidden;
        }

        .progress div {
          height: 100%;
          background: #5367e8;
          border-radius: 20px;
        }

        .progress.leave div {
          background: #9b63e8;
        }

        .distribution-item small {
          display: block;
          margin-top: 6px;
          color: #8b94a7;
        }

        .performance {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        .circle {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background:
            conic-gradient(
              #4f63dc 0% 70%,
              #edf0f6 70% 100%
            );
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .circle strong {
          font-size: 28px;
          background: white;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: grid;
          place-items: center;
        }

        .circle span {
          margin-top: -38px;
          font-size: 10px;
          color: #7b8498;
        }

        .performance-list {
          flex: 1;
        }

        .performance-list div {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #eef0f5;
        }

        .dot {
          display: inline-block;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          margin-right: 8px;
        }

        .approved-dot {
          background: #20a464;
        }

        .pending-dot {
          background: #f0a326;
        }

        .rejected-dot {
          background: #e34c4c;
        }

        .bar-row {
          display: grid;
          grid-template-columns: 100px 1fr 40px;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .bar {
          height: 12px;
          background: #edf0f5;
          border-radius: 20px;
          overflow: hidden;
        }

        .bar div {
          height: 100%;
          border-radius: 20px;
        }

        .bar-approved {
          background: #20a464;
        }

        .bar-pending {
          background: #f0a326;
        }

        .bar-rejected {
          background: #e34c4c;
        }

        .loading {
          background: white;
          border-radius: 18px;
          padding: 70px;
          text-align: center;
        }

        @media(max-width: 900px) {

          .analytics-cards {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .analytics-grid {
            grid-template-columns: 1fr;
          }

        }

        @media(max-width: 600px) {

          .analytics-page {
            padding: 16px;
          }

          .analytics-cards {
            grid-template-columns: 1fr;
          }

          .performance {
            flex-direction: column;
          }

        }

      `}</style>

    </div>
  );
}
