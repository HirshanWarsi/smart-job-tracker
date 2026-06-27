import { useEffect, useState } from "react";
import API from "../services/api";
import AddJobForm from "./AddJobForm";
import { Toast } from "./ui";

const STATUS_CONFIG = {
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

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Applied;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${cfg.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

function JobCard({ job, token, onDeleted, onEdit }) {
  const [deleting, setDeleting] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleDelete = async () => {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    setDeleting(true);
    try {
      await API.delete(`/jobs/${job._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDeleted(job._id);
    } catch {
      setDeleting(false);
      setConfirm(false);
    }
  };

  const timeAgo = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000 / 60);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  // Company initial avatar
  const initials = job.company?.slice(0, 2)?.toUpperCase() || "?";
  const colors = [
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];
  const colorIdx = job.company?.charCodeAt(0) % colors.length || 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${colors[colorIdx]}`}
        >
          {initials}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-violet-700 transition-colors truncate">
                {job.role}
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">{job.company}</p>
            </div>
            <StatusBadge status={job.status} />
          </div>

          {job.notes && (
            <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {job.notes}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {job.createdAt ? timeAgo(job.createdAt) : "Just now"}
              </span>

              {job.jobUrl && (
                <a
                  href={job.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-violet-500 hover:text-violet-700 flex items-center gap-1 font-medium transition-colors"
                >
                  View posting
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(job)}
                className="text-xs font-medium px-3 py-1 rounded-lg transition-all flex items-center gap-1 text-slate-400 hover:text-violet-600 hover:bg-violet-50"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L15.232 5.232z"
                  />
                </svg>
                Edit
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`text-xs font-medium px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  confirm
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "text-slate-400 hover:text-red-500 hover:bg-red-50"
                }`}
              >
                {deleting ? (
                  <svg
                    className="animate-spin h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
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
                ) : (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                )}
                {confirm ? "Confirm?" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobList({
  jobs,
  loading,
  token,
  onJobDeleted,
  onJobUpdated,
  onAddNew,
}) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [editingJob, setEditingJob] = useState(null);
  const [toast, setToast] = useState(null);

  const statuses = [
    "All",
    "Applied",
    "Interview",
    "Offer",
    "Rejected",
    "Saved",
  ];

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleJobUpdated = (updatedJob) => {
    setEditingJob(null);
    onJobUpdated?.(updatedJob);
    showToast("Application updated successfully.", "success");
  };

  const filtered = jobs
    .filter((j) => {
      const matchSearch =
        j.company?.toLowerCase().includes(search.toLowerCase()) ||
        j.role?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "All" || j.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "company") return a.company?.localeCompare(b.company);
      return 0;
    });

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-base font-bold text-slate-900">Applications</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {jobs.length} total · {filtered.length} shown
            </p>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 cursor-pointer"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="company">Company A–Z</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company or role..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 hover:border-slate-300 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <svg
                className="w-4 h-4"
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
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-1.5 mt-4 overflow-x-auto pb-1">
          {statuses.map((s) => {
            const count =
              s === "All"
                ? jobs.length
                : jobs.filter((j) => j.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filterStatus === s
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {s}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${filterStatus === s ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-slate-50 rounded-2xl p-5 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="w-48 h-4 bg-slate-200 rounded" />
                    <div className="w-32 h-3 bg-slate-200 rounded" />
                    <div className="w-64 h-3 bg-slate-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mb-4 text-3xl">
              {search || filterStatus !== "All" ? "🔍" : "📋"}
            </div>
            <h3 className="text-base font-semibold text-slate-700 mb-1">
              {search || filterStatus !== "All"
                ? "No results found"
                : "No applications yet"}
            </h3>
            <p className="text-sm text-slate-400 max-w-xs mb-5">
              {search || filterStatus !== "All"
                ? "Try adjusting your search or filters"
                : "Start tracking your job applications to see them here"}
            </p>
            {!search && filterStatus === "All" && (
              <button
                onClick={onAddNew}
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-violet-500/25"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add your first application
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                token={token}
                onDeleted={onJobDeleted}
                onEdit={() => setEditingJob(job)}
              />
            ))}
          </div>
        )}
      </div>

      {editingJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setEditingJob(null)}
        >
          <div className="w-full max-w-lg animate-in zoom-in-95 duration-200">
            <AddJobForm
              token={token}
              mode="edit"
              initialValues={editingJob}
              onCancel={() => setEditingJob(null)}
              onJobUpdated={handleJobUpdated}
              onSubmitError={(message) => showToast(message, "error")}
            />
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
