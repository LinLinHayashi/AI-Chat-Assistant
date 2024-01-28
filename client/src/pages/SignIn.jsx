import "../styles/SignIn.css";
import { Link } from "react-router-dom";

export default function SignIn() {
  return (
    <div className="sign-in">
      <h1>SIGN IN</h1>
      <form className="sign-in-input-container">
        <input type="email" placeholder="email" />
        <input type="password" placeholder="password" />
        <button>SIGN IN</button>
      </form>
      <div className="sign-up-info">
        <p>Don't have an account?</p>
        <Link to={"/sign-up"}>
          <span>Sign Up</span>
        </Link>
      </div>
    </div>
  );
}
