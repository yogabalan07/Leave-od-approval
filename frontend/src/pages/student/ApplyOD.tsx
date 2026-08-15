import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "./StudentPages.css";

const ApplyOD = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    eventName: "",
    eventType: "",
    eventLocation: "",
    fromDate: "",
    toDate: "",
    reason: "",
    eventLatitude: "",
    eventLongitude: "",
  });

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((previous) => ({
          ...previous,
          eventLatitude: position.coords.latitude.toString(),
          eventLongitude: position.coords.longitude.toString(),
        }));

        setLocationLoading(false);
      },
      () => {
        setError(
          "Unable to get your location. Please allow location permission."
        );

        setLocationLoading(false);
      }
    );
  };

  const submitOD = async (e: FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !form.eventName ||
      !form.eventType ||
      !form.eventLocation
    ) {
      setError("Please fill in the event details.");
      return;
    }

    if (!form.fromDate || !form.toDate) {
      setError("Please select the event dates.");
      return;
    }

    if (new Date(form.toDate) < new Date(form.fromDate)) {
      setError("To date cannot be before from date.");
      return;
    }

    if (!form.reason.trim()) {
      setError("Please enter the reason.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        eventName: form.eventName,
        eventType: form.eventType,
        eventLocation: form.eventLocation,
        fromDate: form.fromDate,
        toDate: form.toDate,
        reason: form.reason,
        eventLatitude: form.eventLatitude
          ? Number(form.eventLatitude)
          : undefined,
        eventLongitude: form.eventLongitude
          ? Number(form.eventLongitude)
          : undefined,
      };

      const response = await api.post("/od", payload);

      setMessage(
        response.data?.message ||
          "OD application submitted successfully."
      );

      setTimeout(() => {
        navigate("/student/applications");
      }, 1200);
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to submit OD application."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-page">

      <div className="student-page-header">

        <div>
          <span className="page-kicker">
            STUDENT PORTAL
          </span>

          <h1>Apply for OD</h1>

          <p>
            Submit your On-Duty request for an event,
            competition, internship or other activity.
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

      <div className="student-form-card">

        <div className="form-card-header">

          <div className="form-icon">
            🎓
          </div>

          <div>
            <h2>OD Application</h2>

            <p>
              Provide accurate event information.
            </p>
          </div>

        </div>

        {error && (
          <div className="alert alert-error">
            ⚠️ {error}
          </div>
        )}

        {message && (
          <div className="alert alert-success">
            ✓ {message}
          </div>
        )}

        <form onSubmit={submitOD}>

          <div className="form-grid">

            <div className="form-group">
              <label>Event Name *</label>

              <input
                name="eventName"
                value={form.eventName}
                onChange={handleChange}
                placeholder="Eg: Smart India Hackathon"
              />
            </div>

            <div className="form-group">
              <label>Event Type *</label>

              <select
                name="eventType"
                value={form.eventType}
                onChange={handleChange}
              >
                <option value="">
                  Select event type
                </option>

                <option value="Competition">
                  Competition
                </option>

                <option value="Hackathon">
                  Hackathon
                </option>

                <option value="Internship">
                  Internship
                </option>

                <option value="Workshop">
                  Workshop
                </option>

                <option value="Conference">
                  Conference
                </option>

                <option value="Seminar">
                  Seminar
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Event Location *</label>

              <input
                name="eventLocation"
                value={form.eventLocation}
                onChange={handleChange}
                placeholder="Eg: Coimbatore"
              />
            </div>

            <div className="form-group">
              <label>From Date *</label>

              <input
                type="date"
                name="fromDate"
                value={form.fromDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>To Date *</label>

              <input
                type="date"
                name="toDate"
                value={form.toDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Reason *</label>

              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                rows={5}
                placeholder="Explain why you are requesting OD..."
              />
            </div>

          </div>

          <div className="location-box">

            <div>
              <strong>
                📍 Event Location Coordinates
              </strong>

              <p>
                Capture the current location if available.
                This can help with later evidence verification.
              </p>

              {form.eventLatitude &&
                form.eventLongitude && (
                  <span>
                    Latitude: {form.eventLatitude}
                    <br />
                    Longitude: {form.eventLongitude}
                  </span>
                )}
            </div>

            <button
              type="button"
              className="location-btn"
              onClick={getLocation}
              disabled={locationLoading}
            >
              {locationLoading
                ? "Getting location..."
                : "📍 Capture Location"}
            </button>

          </div>

          <div className="form-actions">

            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                navigate("/student/dashboard")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit OD Application"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default ApplyOD;