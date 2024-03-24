import "../styles/ResetPassword.css";
import eyeOpen from "../images/eye-open.png";
import eyeClosed from "../images/eye-closed.png";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const [enterPassword, setEnterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { resetToken } = useParams();

  const navigate = useNavigate();

  // This function enables hide/show password input feature.
  const handleEyeEnter = (e) => {
    const password = document.getElementById("enter-password");
    if (password.type === "password") {
      password.type = "text";
      e.target.src = eyeOpen;
    } else {
      password.type = "password";
      e.target.src = eyeClosed;
    }
  };

  // This function enables hide/show password input feature, too.
  const handleEyeConfirm = (e) => {
    const password = document.getElementById("confirm-password");
    if (password.type === "password") {
      password.type = "text";
      e.target.src = eyeOpen;
    } else {
      password.type = "password";
      e.target.src = eyeClosed;
    }
  };

  // This function handles input changes.
  const handleChangeEnterPassword = (e) => {
    setEnterPassword({
      ...enterPassword,
      password: e.target.value,
    });
  };

  // This function handles input changes, too.
  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword({
      ...confirmPassword,
      password: e.target.value,
    });
  };

  // This function handles form submission.
  const handleSubmit = async (e) => {
    e.preventDefault(); // This prevents refreshing the page when the form is submitted.
    setError(null);
    try {
      if (!enterPassword.password) {
        setError("Oops! You need to enter a new password.");
        return; // End "handleSubmit" function as we have an error.
      }
      if (!confirmPassword.password) {
        setError("Oops! You need to confirm your new password.");
        return; // End "handleSubmit" function as we have an error.
      }
      if (enterPassword.password != confirmPassword.password) {
        setError("Oops! The passwords you entered are different.");
        return;
      }
      setLoading(true);
      const res = await fetch(`/api/auth/resetpassword/${resetToken}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(confirmPassword),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        if (data.statusCode === 500) {
          setError("Oops! Something is wrong. Please try again later.");
        } else {
          setError(data.message);
        }
        return; // End "handleSubmit" function as we have an error.
      }

      // If we are here, then we have successfully reset the password.
      setLoading(false);
      navigate("/");
    } catch (error) {
      // We use "try/catch" here to handle errors NOT defined in the backend.
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="reset-password">
      <h1>RESET PASSWORD</h1>
      <form className="reset-password-input-container" onSubmit={handleSubmit}>
        <div className="confirm-password-container">
          <input
            type="password"
            placeholder="Enter your new password"
            id="enter-password"
            onChange={handleChangeEnterPassword}
          />
          <img
            src={eyeClosed}
            alt="eye-closed"
            id="eye"
            onClick={handleEyeEnter}
          />
        </div>
        <div className="confirm-password-container">
          <input
            type="password"
            placeholder="Enter your new password again"
            id="confirm-password"
            onChange={handleChangeConfirmPassword}
          />
          <img
            src={eyeClosed}
            alt="eye-closed"
            id="eye"
            onClick={handleEyeConfirm}
          />
        </div>
        <button disabled={loading} type="submit">
          {loading ? "LOADING..." : "SUBMIT"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
