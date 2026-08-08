import "./ErrorMessage.css";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message" role="alert">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <line x1="12" y1="8" x2="12" y2="13" />
        <line x1="12" y1="16.5" x2="12" y2="16.51" />
      </svg>
      <div>
        <p className="error-message__title">Something didn't load</p>
        <p className="error-message__body">{message}</p>
      </div>
      {onRetry && (
        <button type="button" onClick={onRetry} className="error-message__retry">
          Try again
        </button>
      )}
    </div>
  );
}
