import { useEffect, useState } from "react";
import api from "../../services/api";

interface VerificationItem {
  id: string;
  status?: string;
  distanceFromEvent?: number;
  remarks?: string;

  odApplication?: {
    id: string;
    applicationNumber: string;
    eventName: string;
    eventLocation: string;
    eventLatitude?: number;
    eventLongitude?: number;

    student?: {
      name?: string;
      registerNo?: string;
      email?: string;
    };

    evidence?: Evidence[];
  };
}

interface Evidence {
  id: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  capturedAt: string;
  description?: string;
}

export default function VerifierDashboard() {
  const [items, setItems] = useState<
    VerificationItem[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected, setSelected] =
    useState<VerificationItem | null>(null);

  const [processing, setProcessing] =
    useState(false);

  const loadQueue = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/verification/queue"
      );

      setItems(response.data?.data ?? []);
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Unable to load verification queue."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const verify = async () => {
    if (!selected) return;

    const remarks = window.prompt(
      "Verification remarks:"
    );

    try {
      setProcessing(true);

      await api.post(
        `/verification/${selected.id}/verify`,
        {
          remarks: remarks || "",
        }
      );

      alert("Evidence verified successfully.");

      setSelected(null);

      await loadQueue();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Verification failed."
      );
    } finally {
      setProcessing(false);
    }
  };

  const reject = async () => {
    if (!selected) return;

    const remarks = window.prompt(
      "Enter rejection reason:"
    );

    if (!remarks) {
      alert("Rejection reason is required.");
      return;
    }

    try {
      setProcessing(true);

      await api.post(
        `/verification/${selected.id}/reject`,
        {
          remarks,
        }
      );

      alert("Evidence rejected.");

      setSelected(null);

      await loadQueue();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Rejection failed."
      );
    } finally {
      setProcessing(false);
    }
  };

  const pending = items.filter(
    (item) =>
      !item.status ||
      item.status === "PENDING"
  );

  const verified = items.filter(
    (item) =>
      item.status === "VERIFIED"
  );

  const rejected = items.filter(
    (item) =>
      item.status === "REJECTED"
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* Header */}

      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Verification Dashboard
          </h1>

          <p className="mt-1 text-slate-500">
            Verify student participation and geo-tagged evidence.
          </p>

        </div>

        <button
          onClick={loadQueue}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          ↻ Refresh
        </button>

      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Statistics */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        <Stat
          title="Pending"
          value={pending.length}
          icon="⏳"
        />

        <Stat
          title="Verified"
          value={verified.length}
          icon="✓"
        />

        <Stat
          title="Rejected"
          value={rejected.length}
          icon="✕"
        />

      </div>

      {/* Queue */}

      <div className="mt-8 rounded-2xl border bg-white shadow-sm">

        <div className="border-b p-6">

          <h2 className="text-xl font-bold">
            Verification Queue
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review participation photographs and location.
          </p>

        </div>

        {loading ? (

          <div className="p-10 text-center text-slate-500">
            Loading verification queue...
          </div>

        ) : pending.length === 0 ? (

          <div className="p-10 text-center text-slate-500">
            No evidence waiting for verification.
          </div>

        ) : (

          <div className="divide-y">

            {pending.map((item) => {

              const application =
                item.odApplication;

              return (
                <div
                  key={item.id}
                  className="p-6 hover:bg-slate-50"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex-1">

                      <div className="flex flex-wrap gap-3">

                        <span className="font-bold text-blue-600">
                          {application?.applicationNumber ||
                            item.id}
                        </span>

                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                          PENDING VERIFICATION
                        </span>

                      </div>

                      <h3 className="mt-3 text-lg font-bold">
                        {application?.student?.name ||
                          "Student"}
                      </h3>

                      <p className="text-sm text-slate-500">
                        Register No:{" "}
                        {application?.student?.registerNo ||
                          "-"}
                      </p>

                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">

                        <Info
                          label="Event"
                          value={
                            application?.eventName ||
                            "-"
                          }
                        />

                        <Info
                          label="Location"
                          value={
                            application?.eventLocation ||
                            "-"
                          }
                        />

                        <Info
                          label="Evidence"
                          value={`${application?.evidence?.length || 0} photo(s)`}
                        />

                      </div>

                    </div>

                    <button
                      onClick={() =>
                        setSelected(item)
                      }
                      className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                      🔍 Review Evidence
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

      {/* Evidence Modal */}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b p-6">

              <div>

                <h2 className="text-xl font-bold">
                  Evidence Verification
                </h2>

                <p className="text-sm text-slate-500">
                  {selected.odApplication?.applicationNumber}
                </p>

              </div>

              <button
                onClick={() => setSelected(null)}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>

            </div>

            {/* Student Information */}

            <div className="grid gap-4 p-6 md:grid-cols-2">

              <Info
                label="Student"
                value={
                  selected.odApplication?.student?.name ||
                  "-"
                }
              />

              <Info
                label="Register Number"
                value={
                  selected.odApplication?.student
                    ?.registerNo || "-"
                }
              />

              <Info
                label="Event"
                value={
                  selected.odApplication?.eventName ||
                  "-"
                }
              />

              <Info
                label="Event Location"
                value={
                  selected.odApplication?.eventLocation ||
                  "-"
                }
              />

            </div>

            {/* Evidence */}

            <div className="border-t p-6">

              <h3 className="mb-4 text-lg font-bold">
                Participation Evidence
              </h3>

              {selected.odApplication?.evidence
                ?.length ? (

                <div className="grid gap-6 md:grid-cols-2">

                  {selected.odApplication.evidence.map(
                    (evidence) => (

                      <div
                        key={evidence.id}
                        className="overflow-hidden rounded-2xl border bg-slate-50"
                      >

                        <img
                          src={evidence.imageUrl}
                          alt="Participation evidence"
                          className="h-64 w-full object-cover"
                        />

                        <div className="p-4">

                          <p className="text-sm font-semibold">
                            📍 Geo Location
                          </p>

                          <p className="mt-1 text-sm text-slate-600">
                            Latitude:{" "}
                            {evidence.latitude}
                          </p>

                          <p className="text-sm text-slate-600">
                            Longitude:{" "}
                            {evidence.longitude}
                          </p>

                          <p className="mt-2 text-sm text-slate-500">
                            Captured:{" "}
                            {new Date(
                              evidence.capturedAt
                            ).toLocaleString("en-IN")}
                          </p>

                          {evidence.description && (
                            <p className="mt-2 text-sm">
                              {evidence.description}
                            </p>
                          )}

                        </div>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="rounded-xl bg-yellow-50 p-5 text-yellow-700">
                  No participation evidence uploaded.
                </div>

              )}

            </div>

            {/* Actions */}

            <div className="flex flex-col gap-3 border-t p-6 md:flex-row md:justify-end">

              <button
                onClick={() => setSelected(null)}
                className="rounded-xl border px-6 py-3 font-semibold"
              >
                Close
              </button>

              <button
                disabled={processing}
                onClick={reject}
                className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                ✕ Reject
              </button>

              <button
                disabled={processing}
                onClick={verify}
                className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                {processing
                  ? "Processing..."
                  : "✓ Verify Evidence"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}


// --------------------------------------------------

function Stat({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold">
            {value}
          </p>

        </div>

        <div className="text-3xl">
          {icon}
        </div>

      </div>

    </div>
  );
}


// --------------------------------------------------

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

      <p className="mt-1 font-medium text-slate-700">
        {value}
      </p>

    </div>
  );
}