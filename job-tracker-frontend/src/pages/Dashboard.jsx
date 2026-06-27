import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import JobList from "../components/JobList";
import AddJobForm from "../components/AddJobForm";
import AIMatcher from "../components/AIMatcher";

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  gradient,
  bgLight,
  textColor,
  change,
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 ${bgLight} border border-white/60 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl ${gradient} flex items-center justify-center shadow-lg text-white text-lg`}
        >
          {icon}
        </div>
        {change !== undefined && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${change >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}
          >
            {change >= 0 ? "↑" : "↓"} {Math.abs(change)}
          </span>
        )}
      </div>
      <div className={`text-3xl font-bold ${textColor} mb-0.5`}>{value}</div>
      <div className="text-sm text-slate-500 font-medium">{label}</div>

      {/* Decorative circle */}
      <div
        className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
      />
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ user, onLogout }) {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2"
              />
            </svg>
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900">
              Smart Job Tracker
            </span>
            <span className="hidden sm:inline ml-2 text-xs bg-violet-100 text-violet-700 font-medium px-1.5 py-0.5 rounded">
              Beta
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="text-sm text-slate-700 font-medium">
              {user?.name || "User"}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 font-medium px-3 py-1.5 rounded-xl hover:bg-red-50 transition-all"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const token = localStorage.getItem("token");

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    let isMounted = true;

    const fetchJobs = async () => {
      setLoading(true);

      try {
        const { data } = await API.get("/jobs");
        if (!isMounted) return;
        setJobs(Array.isArray(data) ? data : data.jobs || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        if (!isMounted) return;
        handleLogout();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const { data } = await API.get("/auth/me");
        if (!isMounted) return;
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const loadDashboard = async () => {
      await Promise.all([fetchJobs(), fetchUser()]);
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [handleLogout, navigate, token]);

  const handleJobAdded = (job) => {
    setJobs((prev) => [job, ...prev]);
    setShowAddForm(false);
  };

  const handleJobDeleted = (id) => {
    setJobs((prev) => prev.filter((j) => j._id !== id));
  };

  const handleJobUpdated = (updatedJob) => {
    setJobs((prev) =>
      prev.map((job) => (job._id === updatedJob._id ? updatedJob : job)),
    );
  };

  // Stats
  const stats = {
    total: Array.isArray(jobs) ? jobs.length : 0,

    applied: Array.isArray(jobs)
      ? jobs.filter((j) => j.status === "Applied").length
      : 0,

    interview: Array.isArray(jobs)
      ? jobs.filter((j) => j.status === "Interview").length
      : 0,

    rejected: Array.isArray(jobs)
      ? jobs.filter((j) => j.status === "Rejected").length
      : 0,

    offer: Array.isArray(jobs)
      ? jobs.filter((j) => j.status === "Offer").length
      : 0,
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-violet-500/20">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute right-20 bottom-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-violet-200 text-sm font-medium mb-1">
                {greeting} 👋
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {user?.name
                  ? `Welcome back, ${user.name.split(" ")[0]}!`
                  : "Welcome back!"}
              </h1>
              <p className="text-violet-200 text-sm">
                {stats.total === 0
                  ? "Start tracking your job applications today"
                  : `You have ${stats.total} application${stats.total !== 1 ? "s" : ""} tracked · ${stats.interview} in interview stage`}
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 bg-white text-violet-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-violet-50 transition-all duration-200 hover:-translate-y-0.5 shadow-lg"
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
              Add Application
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 h-28 animate-pulse border border-slate-100"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-xl mb-4" />
                <div className="w-16 h-7 bg-slate-100 rounded mb-1.5" />
                <div className="w-24 h-4 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Applications"
              value={stats.total}
              icon="📋"
              gradient="bg-gradient-to-br from-violet-500 to-indigo-600"
              bgLight="bg-gradient-to-br from-violet-50 to-indigo-50"
              textColor="text-violet-700"
            />
            <StatCard
              label="Applied"
              value={stats.applied}
              icon="🚀"
              gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
              bgLight="bg-gradient-to-br from-blue-50 to-cyan-50"
              textColor="text-blue-700"
            />
            <StatCard
              label="Interviews"
              value={stats.interview}
              icon="🎯"
              gradient="bg-gradient-to-br from-amber-500 to-orange-500"
              bgLight="bg-gradient-to-br from-amber-50 to-orange-50"
              textColor="text-amber-700"
            />
            <StatCard
              label="Offers / Rejected"
              value={`${stats.offer} / ${stats.rejected}`}
              icon="✨"
              gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
              bgLight="bg-gradient-to-br from-emerald-50 to-teal-50"
              textColor="text-emerald-700"
            />
          </div>
        )}

        {/* Add Job Modal */}
        {showAddForm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) =>
              e.target === e.currentTarget && setShowAddForm(false)
            }
          >
            <div className="w-full max-w-lg animate-in zoom-in-95 duration-200">
              <AddJobForm
                token={token}
                onJobAdded={handleJobAdded}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        )}

        {/* Job List */}
        <JobList
          jobs={jobs}
          loading={loading}
          token={token}
          onJobDeleted={handleJobDeleted}
          onJobUpdated={handleJobUpdated}
          onAddNew={() => setShowAddForm(true)}
        />

        <section className="mt-10">
          <AIMatcher token={token} />
        </section>
      </main>
    </div>
  );
}
