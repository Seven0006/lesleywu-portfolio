export default function Loading({ show }) {
  if (!show) {
    return null;
  }

  return (
    <div className="loading-backdrop" aria-hidden="true">
      <div className="loading-indicator">Loading…</div>
    </div>
  );
}