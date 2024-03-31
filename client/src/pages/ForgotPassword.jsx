import "../styles/ForgotPassword.css";
import check from "../images/check.png";
import { useState } from "react";

export default function ForgotPassword() {
  const [formData, setFormData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // This function closes a modal, empties the input value, and reset "formData".
  const modalClose = () => {
    emptyInput();
    setFormData("");
    const modal = document.getElementById("modal");
    modal.close();
  };

  // This function empties the input value. Note that it won't reset "formData" assoicated with the input value.
  const emptyInput = () => {
    const email = document.getElementById("email");
    email.value = "";
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
      setLoading(true);
      const res = await fetch("/api/auth/forgotpassword", {
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

      // If we are here, then we are successfully signed up.
      setLoading(false);
      modalOpen();
    } catch (error) {
      // We use "try/catch" here to handle errors NOT defined in the backend.
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="forgot-password">
      <h3>Enter your email address</h3>
      <form className="forgot-password-input-container" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          id="email"
          onChange={handleChange}
        />
        <button disabled={loading} type="submit">
          {loading ? "LOADING..." : "SUBMIT"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <dialog id="modal">
        <div className="popup">
          <img src={check} alt="Check" />
          <h3>Thank You!</h3>
          <p>
            A password reset email has been sent to {formData.email}. Please
            check the email to reset your password.
          </p>
          <button onClick={modalClose}>OK</button>
        </div>
      </dialog>
    </div>
  );
}
