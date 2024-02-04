import "../styles/Header.css";
import Toggle from "./Toggle";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <h1>LinGPT</h1>
      <div className="right-side">
        <Toggle />
        <Link to={"/sign-in"}>
          <p>Sign In</p>
        </Link>
      </div>
    </header>
  );
}
