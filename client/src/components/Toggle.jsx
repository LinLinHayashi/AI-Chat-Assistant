import "../styles/Toggle.css";

export default function Toggle() {
  return (
    <div className="dark_mode">
      <input className="dark_mode_input" type="checkbox" id="darkmode-toggle" />
      <label className="dark_mode_label" htmlFor="darkmode-toggle"></label>
    </div>
  );
}
