// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 focus:ring-violet-500",
    secondary:
      "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:-translate-y-0.5 focus:ring-slate-300",
    ghost:
      "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300",
    danger:
      "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-lg shadow-red-500/25 hover:-translate-y-0.5 focus:ring-red-400",
    success:
      "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5 focus:ring-emerald-400",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({
  label,
  error,
  icon,
  rightElement,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900
            placeholder:text-slate-400 shadow-sm
            focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400
            hover:border-slate-300
            transition-all duration-200
            ${icon ? "pl-10" : ""}
            ${rightElement ? "pr-10" : ""}
            ${error ? "border-red-400 focus:ring-red-400/30 focus:border-red-400" : ""}
            ${className}
          `}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({ label, error, className = "", children, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        className={`
          w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900
          shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400
          hover:border-slate-300 transition-all duration-200 appearance-none cursor-pointer
          ${error ? "border-red-400" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-slate-100 shadow-sm
        ${hover ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer" : ""}
        transition-all duration-200
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Badge / Status ───────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const config = {
    Applied: {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      dot: "bg-blue-500",
    },
    Interview: {
      color: "bg-violet-50 text-violet-700 border-violet-200",
      dot: "bg-violet-500",
    },
    Offer: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    },
    Rejected: {
      color: "bg-red-50 text-red-600 border-red-200",
      dot: "bg-red-400",
    },
    Saved: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },
  };

  const cfg = config[status] || config["Saved"];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${cfg.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className = "" }) {
  return (
    <div className={`bg-slate-100 rounded-lg animate-pulse ${className}`} />
  );
}

// ─── Toast Notification ───────────────────────────────────────────────────────
export function Toast({ message, type = "success", onClose }) {
  const types = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const icons = {
    success: (
      <svg
        className="w-4 h-4 text-emerald-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    error: (
      <svg
        className="w-4 h-4 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    info: (
      <svg
        className="w-4 h-4 text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium
        animate-in slide-in-from-right-5 duration-300
        ${types[type]}`}
    >
      {icons[type]}
      {message}
      <button
        onClick={onClose}
        className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mb-4 text-3xl">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-5">{description}</p>
      {action}
    </div>
  );
}

// ─── Circular Progress ────────────────────────────────────────────────────────
export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  color = "#7c3aed",
}) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#f1f5f9"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
}
