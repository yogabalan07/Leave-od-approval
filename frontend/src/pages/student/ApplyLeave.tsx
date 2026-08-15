import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "./StudentPages.css";

const ApplyLeave = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
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

  const submitLeave = async (e: FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!form.leaveType) {
      setError("Please select a leave type.");
      return;
    }

    if (!form.fromDate || !form.toDate) {
      setError("Please select the leave dates.");
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

      const response = await api.post("/leave", form);

      setMessage(
        response.data?.message ||
          "Leave application submitted successfully."
      );

      setForm({
        leaveType: "",
        fromDate: "",
        toDate: "",
        reason: "",
      });

      setTimeout(() => {
        navigate("/student/applications");
      }, 1200);
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to submit leave application."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-page">

      <div className="student-page-header">
        <div>
          <span className="page-kicker">STUDENT PORTAL</span>
          <h1>Apply for Leave</h1>
          <p>
            Submit your leave request for mentor approval.
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => navigate("/student/dashboard")}
        >
          ← Dashboard
        </button>
      </div>

      <div className="student-form-card">

        <div className="form-card-header">
          <div className="form-icon">🏠</div>

          <div>
            <h2>Leave Application</h2>
            <p>
              Fill in the details carefully before submitting.
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

        <form onSubmit={submitLeave}>

          <div className="form-grid">

            <div className="form-group">
              <label>Leave Type *</label>

              <select
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
              >
                <option value="">
                  Select leave type
                </option>

                <option value="Medical">
                  Medical Leave
                </option>

                <option value="Personal">
                  Personal Leave
                </option>

                <option value="Family">
                  Family Leave
                </option>

                <option value="Emergency">
                  Emergency Leave
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div />

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
                placeholder="Explain the reason for your leave..."
                rows={6}
              />
            </div>

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
                : "Submit Leave Application"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default ApplyLeave;