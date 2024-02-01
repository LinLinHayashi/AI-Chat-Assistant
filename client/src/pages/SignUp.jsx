import "../styles/SignUp.css";
import eyeOpen from "../images/eye-open.png";
import eyeClosed from "../images/eye-closed.png";
import check from "../images/check.png";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // This function closes a modal.
  const modalClose = () => {
    const modal = document.getElementById("modal");
    modal.close();
  };

  // This function empties the input values.
  const emptyInput = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    email.value = "";
    password.value = "";
  };

  // This function handles form submission.
  const handleSubmit = async (e) => {
    e.preventDefault(); // This prevents refreshing the page when the form is submitted.
    setError(null);
    try {
      const email = document.getElementById("email");
      const password = document.getElementById("password");
      if (email.value === "") {
        setError("Oops! You need to enter an email.");
        return; // End "handleSubmit" function as we have an error.
      }
      if (password.value === "") {
        setError("Oops! You need to enter a password.");
        return; // End "handleSubmit" function as we have an error.
      }
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      // If there is an error, as per the middleware for error handling we created in "index.js" in the backend.
      if (data.success === false) {
        setLoading(false);
        if (data.statusCode === 500) {
          setError(
            "Oops! This email is already used. Please try another email."
          );
        } else {
          setError("Oops! Something is wrong. Please try again later.");
        }
        return; // End "handleSubmit" function as we have an error.
      }

      // If we are here, then we are successfully signed up.
      setLoading(false);
      emptyInput();
      modalOpen();
    } catch (error) {
      // We use "try/catch" here to handle errors NOT defined in the backend.
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="sign-up">
      <h1>SIGN UP</h1>
      <form className="sign-up-input-container" onSubmit={handleSubmit}>
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
          {loading ? "LOADING..." : "SIGN UP"}
        </button>
      </form>
      <div className="sign-in-info">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span>Sign In</span>
        </Link>
      </div>
      {error && <p className="error">{error}</p>}
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
