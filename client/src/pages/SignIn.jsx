import "../styles/SignIn.css";
import eyeOpen from "../images/eye-open.png";
import eyeClosed from "../images/eye-closed.png";
import check from "../images/check.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ message: "", statusCode: "" });

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

  // This function displays a modal.
  const modalOpen = () => {
    const modal = document.getElementById("modal");
    modal.showModal();
  };

  // This function closes a modal, empties the input values, and reset "formData".
  const modalClose = () => {
    emptyInput();
    setFormData({ email: "", password: "" });
    const modal = document.getElementById("modal");
    modal.close();
  };

  // This function empties the input values. Note that it won't reset "formData" assoicated with the input values.
  const emptyInput = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    email.value = "";
    password.value = "";
  };

  // This function handles form submission.
  const handleSubmit = async (e) => {
    e.preventDefault(); // This prevents refreshing the page when the form is submitted.
    setError({ message: "", statusCode: "" });
    try {
      if (!formData.email) {
        setError({
          message: "Oops! You need to enter an email.",
          statusCode: "",
        });
        return; // End "handleSubmit" function as we have an error.
      }
      if (!formData.password) {
        setError({
          message: "Oops! You need to enter a password.",
          statusCode: "",
        });
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
          setError({
            message: "Oops! Something is wrong. Please try again later.",
            statusCode: 500,
          });
        } else {
          setError({ message: data.message, statusCode: data.statusCode });
        }
        return; // End "handleSubmit" function as we have an error.
      }

      // If we are here, then we are successfully signed in.
      setLoading(false);
      navigate("/");
    } catch (error) {
      // We use "try/catch" here to handle errors NOT defined in the backend.
      setLoading(false);
      setError({ message: error.message, statusCode: error.statusCode });
    }
  };

  const resendEmail = async (e) => {
    e.preventDefault(); // This prevents refreshing the page when the form is submitted.
    setError({ message: "", statusCode: "" });
    try {
      setLoading(true);
      const res = await fetch("/api/auth/resendemail", {
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
          setError({
            message: "Oops! Something is wrong. Please try again later.",
            statusCode: 500,
          });
        } else {
          setError({ message: data.message, statusCode: data.statusCode });
        }
        return; // End "handleSubmit" function as we have an error.
      }
      setLoading(false);
      modalOpen();
    } catch (error) {
      // We use "try/catch" here to handle errors NOT defined in the backend.
      setLoading(false);
      setError({ message: error.message, statusCode: error.statusCode });
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
      {error && <p className="error">{error.message}</p>}
      {error && error.statusCode === 403 && (
        <button className="resend-email" onClick={resendEmail}>
          Resend verification email?
        </button>
      )}
      <dialog id="modal">
        <div className="popup">
          <img src={check} alt="Check" />
          <h3>Thank You!</h3>
          <p>
            A verification email has been sent to {formData.email}. Please
            verify your email to sign in.
          </p>
          <button onClick={modalClose}>OK</button>
        </div>
      </dialog>
    </div>
  );
}
