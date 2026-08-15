import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import "./StudentPages.css";

const UploadEvidence = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);

  const [description, setDescription] =
    useState("");

  const [latitude, setLatitude] =
    useState<number | null>(null);

  const [longitude, setLongitude] =
    useState<number | null>(null);

  const [capturedAt, setCapturedAt] =
    useState<string>("");

  const [loading, setLoading] =
    useState(false);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      e.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    setFile(selectedFile);
    setError("");
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by this browser."
      );
      return;
    }

    setLocationLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(
          position.coords.latitude
        );

        setLongitude(
          position.coords.longitude
        );

        setCapturedAt(
          new Date().toISOString()
        );

        setLocationLoading(false);
      },
      (err) => {
        console.error(err);

        setError(
          "Location permission is required to upload verified evidence."
        );

        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const submitEvidence = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!id) {
      setError("Invalid OD application.");
      return;
    }

    if (!file) {
      setError(
        "Please select a participation image."
      );
      return;
    }

    if (
      latitude === null ||
      longitude === null
    ) {
      setError(
        "Please capture your current location."
      );
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "image",
        file
      );

      formData.append(
        "latitude",
        latitude.toString()
      );

      formData.append(
        "longitude",
        longitude.toString()
      );

      formData.append(
        "capturedAt",
        capturedAt ||
          new Date().toISOString()
      );

      formData.append(
        "description",
        description
      );

      /*
       * IMPORTANT:
       *
       * Do not manually set Content-Type here.
       * Axios will automatically create the
       * multipart/form-data boundary.
       */

      const response =
        await api.post(
          `/evidence/od/${id}`,
          formData
        );

      setMessage(
        response.data?.message ||
          "Evidence uploaded successfully."
      );

      setTimeout(() => {
        navigate(
          `/student/od/${id}`
        );
      }, 1500);

    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to upload evidence."
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
            PARTICIPATION VERIFICATION
          </span>

          <h1>
            Upload Evidence
          </h1>

          <p>
            Upload a photo from the event with
            your current GPS location.
          </p>

        </div>

        <button
          className="secondary-btn"
          onClick={() =>
            navigate(
              `/student/od/${id}`
            )
          }
        >
          ← Back
        </button>

      </div>


      <div className="evidence-layout">

        <div className="student-form-card">

          <div className="form-card-header">

            <div className="form-icon">
              📷
            </div>

            <div>

              <h2>
                Participation Evidence
              </h2>

              <p>
                Your evidence will be reviewed
                by the verifier.
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


          <form onSubmit={submitEvidence}>

            <div className="upload-area">

              <div className="upload-icon">
                📸
              </div>

              <h3>
                Upload Participation Photo
              </h3>

              <p>
                Choose a clear photo showing
                your participation.
              </p>

              <label className="upload-button">

                Choose Image

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />

              </label>

              {file && (
                <div className="selected-file">
                  ✓ {file.name}
                </div>
              )}

            </div>


            <div className="location-verification">

              <div className="location-header">

                <div>

                  <h3>
                    📍 GPS Verification
                  </h3>

                  <p>
                    Your location is required
                    for verification.
                  </p>

                </div>

                <button
                  type="button"
                  className="location-btn"
                  onClick={captureLocation}
                  disabled={locationLoading}
                >
                  {locationLoading
                    ? "Getting GPS..."
                    : "Capture GPS"}
                </button>

              </div>


              {latitude !== null &&
                longitude !== null && (

                  <div className="gps-success">

                    <div>
                      <span>
                        Latitude
                      </span>

                      <strong>
                        {latitude.toFixed(6)}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Longitude
                      </span>

                      <strong>
                        {longitude.toFixed(6)}
                      </strong>
                    </div>

                  </div>

                )}

            </div>


            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                rows={4}
                placeholder="Describe your participation..."
              />

            </div>


            <div className="form-actions">

              <button
                type="button"
                className="secondary-btn"
                onClick={() =>
                  navigate(
                    `/student/od/${id}`
                  )
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
                  ? "Uploading..."
                  : "Submit Evidence"}
              </button>

            </div>

          </form>

        </div>


        <aside className="evidence-info">

          <div className="info-card">

            <div className="info-icon">
              🔐
            </div>

            <h3>
              Secure Verification
            </h3>

            <p>
              The uploaded evidence contains
              your GPS coordinates and capture
              time so the verifier can confirm
              your participation.
            </p>

          </div>


          <div className="info-card">

            <div className="info-icon">
              📍
            </div>

            <h3>
              Location Verification
            </h3>

            <p>
              Make sure you are physically at
              the event location when capturing
              the evidence.
            </p>

          </div>


          <div className="info-card">

            <div className="info-icon">
              👁️
            </div>

            <h3>
              Verifier Review
            </h3>

            <p>
              A verifier will review your
              photograph and location before
              marking the application as verified.
            </p>

          </div>

        </aside>

      </div>

    </div>
  );
};

export default UploadEvidence;