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
    name: string;
    registerNo?: string;
    email?: string;
  };
}

export default function MentorDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/mentor/queue");

      const data = response.data?.data ?? response.data ?? [];

      setApplications(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Mentor dashboard error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load mentor applications."
      );
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

  const pending = applications.length;

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-100">
                Leave & OD Approval System
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                Mentor Dashboard
              </h1>

              <p className="mt-2 text-indigo-100">
                Review and approve student applications.
              </p>
            </div>

            <button
              onClick={loadApplications}
              className="rounded-xl bg-white/15 px-5 py-3 font-semibold backdrop-blur transition hover:bg-white/25"
            >
              ↻ Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Pending Applications"
            value={pending}
            icon="📋"
            gradient="from-indigo-500 to-purple-500"
          />

          <StatCard
            title="OD Applications"
            value={
              applications.filter(
                (item) =>
                  item.eventName ||
                  item.eventType
              ).length
            }
            icon="🎓"
            gradient="from-blue-500 to-cyan-500"
          />

          <StatCard
            title="Students"
            value={
              new Set(
                applications
                  .map((item) => item.student?.registerNo)
                  .filter(Boolean)
              ).size
            }
            icon="👨‍🎓"
            gradient="from-emerald-500 to-teal-500"
          />

          <StatCard
            title="Needs Review"
            value={pending}
            icon="⏳"
            gradient="from-orange-500 to-amber-500"
          />
        </div>

        {/* Applications */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Applications Waiting for Approval
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review student OD requests before sending them to HOD.
                </p>
              </div>

              <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
                {pending} Pending
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

                <p className="mt-4 text-sm text-slate-500">
                  Loading applications...
                </p>
              </div>
            </div>
          ) : applications.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl">
                ✓
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No pending applications
              </h3>

              <p className="mt-2 max-w-md text-sm text-slate-500">
                Great! There are currently no student applications waiting
                for your approval.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {applications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onRefresh={loadApplications}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  gradient,
}: {
  title: string;
  value: number;
  icon: string;
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br ${gradient} opacity-10`}
      />

      <div className="flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-xl shadow-lg`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function ApplicationCard({
  application,
  onRefresh,
  formatDate,
}: {
  application: Application;
  onRefresh: () => void;
  formatDate: (date?: string) => string;
}) {
  const [processing, setProcessing] = useState(false);

  const approve = async () => {
    try {
      setProcessing(true);

      await api.post(
        `/mentor/applications/${application.id}/approve`
      );

      await onRefresh();
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Failed to approve application."
      );
    } finally {
      setProcessing(false);
    }
  };

  const reject = async () => {
    const remarks = window.prompt(
      "Enter rejection reason:"
    );

    if (!remarks) return;

    try {
      setProcessing(true);

      await api.post(
        `/mentor/applications/${application.id}/reject`,
        {
          remarks,
        }
      );

      await onRefresh();
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Failed to reject application."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-6 transition hover:bg-slate-50">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* Student */}
        <div className="flex gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white">
            {application.student?.name?.charAt(0)?.toUpperCase() ||
              "S"}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-900">
                {application.student?.name || "Student"}
              </h3>

              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                Pending
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {application.student?.registerNo || "No register number"}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Application #{application.applicationNumber}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="grid gap-4 sm:grid-cols-3 lg:min-w-[500px]">
          <Info
            label="Event"
            value={application.eventName || "OD Application"}
          />

          <Info
            label="Location"
            value={application.eventLocation || "-"}
          />

          <Info
            label="Date"
            value={`${formatDate(application.fromDate)} - ${formatDate(
              application.toDate
            )}`}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            disabled={processing}
            onClick={reject}
            className="rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            Reject
          </button>

          <button
            disabled={processing}
            onClick={approve}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3 font-semibold text-white shadow-md transition hover:shadow-lg disabled:opacity-50"
          >
            {processing ? "Processing..." : "✓ Approve"}
          </button>
        </div>
      </div>

      {application.reason && (
        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Reason
          </p>

          <p className="mt-1 text-sm text-slate-600">
            {application.reason}
          </p>
        </div>
      )}
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
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}