import { useEffect, useState } from "react";
import api from "../../services/api";

interface Application {
  id: string;
  applicationNumber: string;
  eventName?: string;
  eventType?: string;
  eventLocation?: string;
  fromDate?: string;
  toDate?: string;
  reason?: string;
  status?: string;
  student?: {
    id?: string;
    name?: string;
    registerNo?: string;
    email?: string;
  };
}

export default function MentorDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/mentor/queue");

      setApplications(response.data?.data ?? []);
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to load mentor applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const approveApplication = async (id: string) => {
    const remarks = window.prompt(
      "Enter approval remarks (optional):"
    );

    try {
      setProcessing(id);

      await api.post(`/mentor/applications/${id}/approve`, {
        remarks: remarks || "",
      });

      await loadApplications();

      alert("Application approved successfully.");
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Unable to approve application."
      );
    } finally {
      setProcessing(null);
    }
  };

  const rejectApplication = async (id: string) => {
    const remarks = window.prompt(
      "Enter rejection reason:"
    );

    if (!remarks) {
      alert("Rejection reason is required.");
      return;
    }

    try {
      setProcessing(id);

      await api.post(`/mentor/applications/${id}/reject`, {
        remarks,
      });

      await loadApplications();

      alert("Application rejected.");
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Unable to reject application."
      );
    } finally {
      setProcessing(null);
    }
  };

  const pending = applications.filter(
    (a) => a.status === "MENTOR_PENDING"
  );

  const approved = applications.filter(
    (a) =>
      a.status === "MENTOR_APPROVED" ||
      a.status === "HOD_PENDING" ||
      a.status === "APPROVED"
  );

  const rejected = applications.filter(
    (a) => a.status === "REJECTED"
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* Header */}

      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Mentor Dashboard
          </h1>

          <p className="mt-1 text-slate-500">
            Review student OD and leave applications.
          </p>
        </div>

        <button
          onClick={loadApplications}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          ↻ Refresh
        </button>

      </div>

      {/* Error */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        <StatCard
          title="Pending"
          value={pending.length}
          icon="⏳"
          color="orange"
        />

        <StatCard
          title="Approved"
          value={approved.length}
          icon="✓"
          color="green"
        />

        <StatCard
          title="Rejected"
          value={rejected.length}
          icon="✕"
          color="red"
        />

      </div>

      {/* Pending Applications */}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b p-6">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Pending Applications
            </h2>

            <p className="text-sm text-slate-500">
              Applications waiting for your approval
            </p>
          </div>

          <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
            {pending.length}
          </span>

        </div>

        {loading ? (

          <div className="p-10 text-center text-slate-500">
            Loading applications...
          </div>

        ) : pending.length === 0 ? (

          <div className="p-10 text-center">

            <div className="text-5xl">
              🎉
            </div>

            <h3 className="mt-3 font-semibold text-slate-800">
              No pending applications
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              You're all caught up.
            </p>

          </div>

        ) : (

          <div className="divide-y">

            {pending.map((application) => (

              <div
                key={application.id}
                className="p-6 hover:bg-slate-50"
              >

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  <div className="flex-1">

                    <div className="flex flex-wrap items-center gap-3">

                      <span className="font-bold text-blue-600">
                        {application.applicationNumber}
                      </span>

                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                        MENTOR PENDING
                      </span>

                    </div>

                    <h3 className="mt-3 text-lg font-bold text-slate-900">
                      {application.student?.name ||
                        "Unknown Student"}
                    </h3>

                    <p className="text-sm text-slate-500">
                      Register No:{" "}
                      {application.student?.registerNo ||
                        "-"}
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">

                      <Info
                        label="Event"
                        value={
                          application.eventName || "-"
                        }
                      />

                      <Info
                        label="Type"
                        value={
                          application.eventType || "OD"
                        }
                      />

                      <Info
                        label="Location"
                        value={
                          application.eventLocation ||
                          "-"
                        }
                      />

                    </div>

                    <div className="mt-4">

                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Date
                      </p>

                      <p className="text-sm text-slate-700">
                        {formatDate(
                          application.fromDate
                        )}{" "}
                        →{" "}
                        {formatDate(
                          application.toDate
                        )}
                      </p>

                    </div>

                  </div>

                  <div className="flex gap-3 lg:flex-col">

                    <button
                      disabled={
                        processing === application.id
                      }
                      onClick={() =>
                        approveApplication(
                          application.id
                        )
                      }
                      className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {processing === application.id
                        ? "Processing..."
                        : "✓ Approve"}
                    </button>

                    <button
                      disabled={
                        processing === application.id
                      }
                      onClick={() =>
                        rejectApplication(
                          application.id
                        )
                      }
                      className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      ✕ Reject
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}


// --------------------------------------------------
// Components
// --------------------------------------------------

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: "orange" | "green" | "red";
}) {
  const colors = {
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${colors[color]}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}