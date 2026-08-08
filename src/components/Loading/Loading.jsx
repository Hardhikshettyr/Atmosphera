import "./Loading.css";

export default function Loading({ label = "Fetching conditions..." }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="loading__ring" aria-hidden="true" />
      <p className="mono">{label}</p>
    </div>
  );
}
