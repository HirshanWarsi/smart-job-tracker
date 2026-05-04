import { useState } from "react";
import API from "../services/api";

export default function JobForm({ refreshJobs }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async () => {
    if (!company.trim() || !role.trim()) return;

    const token = localStorage.getItem("token");

    await API.post(
      "/jobs",
      { company: company.trim(), role: role.trim() },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCompany("");
    setRole("");

    refreshJobs();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Add New Job</h2>
        <p className="mt-1 text-sm text-slate-500">
          Save a new opportunity to track your application progress.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]">
        <input
          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Company name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <input
          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Role title"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <button
          className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleSubmit}
          disabled={!company.trim() || !role.trim()}
        >
          Add Job
        </button>
      </div>
    </div>
  );
}