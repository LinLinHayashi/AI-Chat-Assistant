import "../styles/PopUp.css";
import check from "../images/check.png";

export default function PopUp(props) {
  return (
    <div className="popup">
      <img src={check} alt="Check" />
      <h3>Thank You!</h3>
      <p>
        A verification email has been sent to {props.email}. Please verify your
        email to sign in.
      </p>
      <button>OK</button>
    </div>
  );
}
