import "../styles/SignIn.css";
import eyeOpen from "../images/eye-open.png";
import eyeClosed from "../images/eye-closed.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // This function enables hide/show password input feature.
  const handleEye = (e) => {
    const password = document.getElementById("password");
    if (password.type === "password") {
      password.type = "text";
      e.target.src = eyeOpen;
    } else {
      password.type = "password";
      e.target.src = eyeClosed;
    }
  };

  // This function handles input changes.
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // This function handles form submission.
  const handleSubmit = async (e) => {
    e.preventDefault(); // This prevents refreshing the page when the form is submitted.
    setError(null);
    try {
      if (!formData.email) {
        setError("Oops! You need to enter an email.");
        return; // End "handleSubmit" function as we have an error.
      }
      if (!formData.password) {
        setError("Oops! You need to enter a password.");
        return; // End "handleSubmit" function as we have an error.
      }
      setLoading(true);
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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

      // If we are here, then we are successfully signed in.
      setLoading(false);
      navigate("/");
    } catch (error) {
      // We use "try/catch" here to handle errors NOT defined in the backend.
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="sign-in">
      <h1>SIGN IN</h1>
      <form className="sign-in-input-container" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          id="email"
          onChange={handleChange}
        />
        <div className="password-container">
          <input
            type="password"
            placeholder="password"
            id="password"
            onChange={handleChange}
          />
          <img src={eyeClosed} alt="eye-closed" id="eye" onClick={handleEye} />
        </div>
        <button disabled={loading} type="submit">
          {loading ? "LOADING..." : "SIGN IN"}
        </button>
      </form>
      <div className="sign-up-info">
        <div>
          <p>Don't have an account?</p>
          <Link to={"/sign-up"}>
            <span>Sign Up</span>
          </Link>
        </div>
        <Link to={"/forgot-password"}>
          <span>Forgot password?</span>
        </Link>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
