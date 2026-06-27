// src/components/AddJobForm.jsx
import { useEffect, useState } from "react";
import API from "../services/api";

const defaultForm = {
  company: "",
  role: "",
  status: "Applied",
  jobUrl: "",
  notes: "",
};

const addStatusOptions = ["Applied", "Interview", "Offer", "Rejected", "Saved"];
const editStatusOptions = ["Applied", "Interview", "Offer", "Rejected"];

export default function AddJobForm({
  token,
  onJobAdded,
  onJobUpdated,
  onCancel,
  mode = "add",
  initialValues = null,
  onSubmitError,
}) {
  const [form, setForm] = useState(initialValues || defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initialValues || defaultForm);
  }, [initialValues]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company?.trim() || !form.role?.trim()) {
      setError("Company and role are required.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "edit") {
        const { data } = await API.put(`/jobs/${initialValues._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onJobUpdated?.(data);
      } else {
        const { data } = await API.post("/jobs", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onJobAdded?.(data);
      }
      onCancel?.();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (mode === "edit"
          ? "Failed to update job. Please try again."
          : "Failed to add job. Please try again.");
      setError(message);
      onSubmitError?.(message);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    Applied: "border-blue-400 bg-blue-50 text-blue-700",
    Interview: "border-violet-400 bg-violet-50 text-violet-700",
    Offer: "border-emerald-400 bg-emerald-50 text-emerald-700",
    Rejected: "border-red-400 bg-red-50 text-red-600",
    Saved: "border-amber-400 bg-amber-50 text-amber-700",
  };

  const isEditMode = mode === "edit";
  const statusOptions = isEditMode ? editStatusOptions : addStatusOptions;

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              {isEditMode ? "Edit Application" : "Add New Application"}
            </h2>
            <p className="text-violet-200 text-sm mt-0.5">
              {isEditMode
                ? "Update your job application details"
                : "Track a new job opportunity"}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
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
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Company */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Company *
            </label>
            <div className="relative">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="company"
                value={form.company || ""}
                onChange={handleChange}
                placeholder="e.g. Google, Stripe..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 hover:border-slate-300 transition-all"
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Role / Position *
            </label>
            <div className="relative">
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
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="role"
                value={form.role || ""}
                onChange={handleChange}
                placeholder="e.g. Frontend Engineer"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 hover:border-slate-300 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Application Status
          </label>
          {isEditMode ? (
            <select
              name="status"
              value={form.status || "Applied"}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 hover:border-slate-300 transition-all"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, status: s })}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border-2 transition-all duration-150 ${
                    form.status === s
                      ? statusColors[s] + " shadow-sm scale-105"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Job URL */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Job URL{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
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
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <input
              type="url"
              name="jobUrl"
              value={form.jobUrl || ""}
              onChange={handleChange}
              placeholder="https://jobs.company.com/..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 hover:border-slate-300 transition-all"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Notes <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            name="notes"
            value={form.notes || ""}
            onChange={handleChange}
            placeholder="Any notes about this application..."
            rows={3}
            className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 hover:border-slate-300 transition-all resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
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
                Saving...
              </>
            ) : (
              <>
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
                {isEditMode ? "Save Changes" : "Add Application"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
