import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "./StudentPages.css";

interface User {
  id?: string;
  name?: string;
  email?: string;
  registerNo?: string;
  role?: string;
  department?: {
    name?: string;
    code?: string;
  };
}

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response =
          await api.get("/student/profile");

        setUser(
          response.data?.data ||
            response.data
        );
      } catch (err: any) {
        console.error(err);

        /*
         * If your backend uses /auth/me instead,
         * change the endpoint above to:
         *
         * api.get("/auth/me")
         */

        setError(
          err?.response?.data?.message ||
            "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="student-page">

        <div className="loading-box">
          <div className="spinner" />
          <p>
            Loading profile...
          </p>
        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="student-page">

        <div className="empty-box">

          <div className="empty-icon">
            ⚠️
          </div>

          <h2>
            Unable to Load Profile
          </h2>

          <p>
            {error}
          </p>

          <button
            className="primary-btn"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="student-page">

      <div className="student-page-header">

        <div>
          <span className="page-kicker">
            STUDENT PORTAL
          </span>

          <h1>
            My Profile
          </h1>

          <p>
            View your student account information.
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


      <div className="profile-layout">

        <section className="profile-card">

          <div className="profile-cover" />

          <div className="profile-main">

            <div className="large-avatar">

              {user?.name
                ?.charAt(0)
                .toUpperCase() || "S"}

            </div>

            <h2>
              {user?.name || "Student"}
            </h2>

            <p>
              {user?.email || "No email"}
            </p>

            <span className="role-badge">
              STUDENT
            </span>

          </div>

        </section>


        <section className="profile-details">

          <div className="profile-details-header">

            <h2>
              Personal Information
            </h2>

            <span>
              Account Details
            </span>

          </div>


          <div className="profile-grid">

            <div className="profile-field">

              <span>
                Full Name
              </span>

              <strong>
                {user?.name || "-"}
              </strong>

            </div>


            <div className="profile-field">

              <span>
                Register Number
              </span>

              <strong>
                {user?.registerNo || "-"}
              </strong>

            </div>


            <div className="profile-field">

              <span>
                Email
              </span>

              <strong>
                {user?.email || "-"}
              </strong>

            </div>


            <div className="profile-field">

              <span>
                Role
              </span>

              <strong>
                {user?.role || "STUDENT"}
              </strong>

            </div>


            <div className="profile-field">

              <span>
                Department
              </span>

              <strong>
                {user?.department?.name || "-"}
              </strong>

            </div>


            <div className="profile-field">

              <span>
                Department Code
              </span>

              <strong>
                {user?.department?.code || "-"}
              </strong>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
};

export default Profile;