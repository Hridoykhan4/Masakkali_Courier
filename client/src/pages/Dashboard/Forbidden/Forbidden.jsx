import { Link, useLocation } from "react-router";

const Forbidden = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname;

  return (
    <section className="min-h-screen flex items-center justify-center px-6 font-urbanist bg-base-200">
      <div className="max-w-xl w-full shadow-lg rounded-xl p-8 border border-base-300 bg-base-100 text-base-content">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-error"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Title & message */}
        <h1 className="text-2xl font-semibold text-center">Access Denied</h1>
        <p className="mt-3 text-sm text-center opacity-80">
          You don’t have permission to view this page. If you believe this is a
          mistake, please contact your administrator.
        </p>

        {/* Context */}
        <div className="mt-6 rounded-lg border border-base-300 p-4 bg-base-200">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium opacity-70">Requested Path</dt>
              <dd className="mt-1 text-sm break-all">{from || "/dashboard"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium opacity-70">Reason</dt>
              <dd className="mt-1 text-sm">Admin role required</dd>
            </div>
          </dl>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link to="/dashboard" className="btn btn-primary flex-1">
            Back to Dashboard
          </Link>
        </div>

        {/* Small tip */}
        <p className="mt-4 text-xs text-center opacity-60">
          Tip: If you recently changed roles, try signing out and back in.
        </p>
      </div>
    </section>
  );
};

export default Forbidden;
