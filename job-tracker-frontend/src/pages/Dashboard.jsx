import { useEffect, useState } from "react";
import {
  BarChart3,
  Briefcase,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Trash2,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";
import API from "../services/api";
import JobForm from "../components/JobForm";
import AIMatcher from "../components/AIMatcher";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    rejected: 0,
  });

  // Fetch Jobs
  const fetchJobs = async () => {
    const token = localStorage.getItem("token");

    const res = await API.get("/jobs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setJobs(res.data);
  };

  // Fetch Stats
  const fetchStats = async () => {
    const token = localStorage.getItem("token");

    const res = await API.get("/jobs/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setStats(res.data);
  };

  // Delete Job
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    await API.delete(`/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchJobs();
    fetchStats();
  };

  // Update Status
  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem("token");

    await API.put(
      `/jobs/${id}`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchJobs();
    fetchStats();
  };

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, []);

  const statusBadgeMap = {
    Applied: "bg-blue-100 text-blue-700 border border-blue-200",
    Interview: "bg-amber-100 text-amber-700 border border-amber-200",
    Rejected: "bg-rose-100 text-rose-700 border border-rose-200",
  };

  const statusCardBorderMap = {
    Applied: "border-l-blue-500",
    Interview: "border-l-amber-500",
    Rejected: "border-l-rose-500",
  };

  const statCards = [
    {
      title: "Total Jobs",
      value: stats.total,
      bg: "bg-gradient-to-br from-slate-50 to-slate-100",
      text: "text-slate-900",
      accent: "text-slate-600 bg-slate-200",
      icon: Briefcase,
    },
    {
      title: "Applied",
      value: stats.applied,
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      text: "text-blue-900",
      accent: "text-blue-600 bg-blue-200",
      icon: BarChart3,
    },
    {
      title: "Interview",
      value: stats.interview,
      bg: "bg-gradient-to-br from-amber-50 to-amber-100",
      text: "text-amber-900",
      accent: "text-amber-600 bg-amber-200",
      icon: UserRoundCheck,
    },
    {
      title: "Rejected",
      value: stats.rejected,
      bg: "bg-gradient-to-br from-rose-50 to-rose-100",
      text: "text-rose-900",
      accent: "text-rose-600 bg-rose-200",
      icon: UserRoundX,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
              Smart Job Tracker
            </p>
            <h1 className="text-xl font-semibold text-slate-900">Job Tracker</h1>
          </div>

          <button
            className="inline-flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:scale-[1.02] hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:block">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Navigation
          </p>
          <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-medium text-white shadow-sm">
            <LayoutDashboard size={16} />
            Dashboard
          </div>
          <p className="mt-6 text-xs leading-5 text-slate-500">
            Track applications, monitor interview progress, and keep your search
            organized.
          </p>
        </aside>

        <main className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                  Overview
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                  Applications Dashboard
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                <Sparkles size={14} />
                Premium UI Mode
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.title}
                className={`${card.bg} rounded-2xl border border-white/70 p-5 shadow-sm transition duration-200 hover:scale-[1.02] hover:shadow-md`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">{card.title}</p>
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${card.accent}`}
                  >
                    <card.icon size={18} />
                  </span>
                </div>
                <p className={`text-3xl font-semibold ${card.text}`}>{card.value}</p>
              </div>
            ))}
          </section>

          <section>
            <JobForm
              refreshJobs={() => {
                fetchJobs();
                fetchStats();
              }}
            />
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Your Jobs</h2>
              <span className="text-sm text-slate-500">{jobs.length} records</span>
            </div>

            {jobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <p className="text-base font-medium text-slate-700">
                  No jobs yet. Start tracking your applications 🚀
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Add your first job from the section above.
                </p>
              </div>
            ) : (
              jobs.map((job) => (
                <article
                  key={job._id}
                  className={`rounded-2xl border border-slate-200 border-l-4 bg-white p-5 shadow-sm transition duration-200 hover:scale-[1.02] hover:shadow-md ${
                    statusCardBorderMap[job.status] || "border-l-slate-400"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {job.company}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-slate-600">
                        {job.role}
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <CalendarDays size={14} />
                        Applied on{" "}
                        {new Date(job.createdAt || Date.now()).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </div>
                      <span
                        className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          statusBadgeMap[job.status] ||
                          "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <button
                        className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:scale-[1.02] hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
                        onClick={() => updateStatus(job._id, "Interview")}
                      >
                        <UserRoundCheck size={16} />
                        Mark Interview
                      </button>

                      <button
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition duration-200 hover:scale-[1.02] hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        onClick={() => updateStatus(job._id, "Rejected")}
                      >
                        <UserRoundX size={16} />
                        Mark Rejected
                      </button>

                      <button
                        className="inline-flex items-center gap-2 rounded-lg bg-rose-500 px-3.5 py-2 text-sm font-semibold text-white transition duration-200 hover:scale-[1.02] hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300"
                        onClick={() => handleDelete(job._id)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
            <AIMatcher />
          </section>
        </main>
      </div>
    </div>
  );
}