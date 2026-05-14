import { Link } from "react-router-dom";

function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
  actionOnClick,
}) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>

      {actionLabel && actionTo ? (
        <Link to={actionTo} className="btn btn-primary empty-state-action">
          {actionLabel}
        </Link>
      ) : null}

      {actionLabel && actionOnClick ? (
        <button
          type="button"
          className="btn btn-primary empty-state-action"
          onClick={actionOnClick}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default EmptyState;
