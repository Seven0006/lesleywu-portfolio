export default function Status({ status, onClear }) {
  if (!status || !status.message) {
    return null;
  }

  const { message, type } = status;

  const classes = ['status'];
  if (type === 'error') {
    classes.push('status-error');
  }
  if (type === 'success') {
    classes.push('status-success');
  }

  return (
    <div
      className={classes.join(' ')}
      role={type === 'error' ? 'alert' : 'status'}
    >
      <span className="status-text">{message}</span>
      <button
        type="button"
        className="icon-button"
        aria-label="Dismiss message"
        onClick={onClear}
      >
        ×
      </button>
    </div>
  );
}