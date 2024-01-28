import "../styles/SignUp.css";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="sign-up">
      <h1>SIGN UP</h1>
      <form className="sign-up-input-container">
        <input type="email" placeholder="email" />
        <input type="password" placeholder="password" />
        <button>SIGN UP</button>
      </form>
      <div className="sign-in-info">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span>Sign In</span>
        </Link>
      </div>
    </div>
  );
}
