import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = [
    "",
    "bg-red-400",
    "bg-amber-400",
    "bg-blue-400",
    "bg-emerald-400",
  ];
  const strength = passwordStrength(form.password);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (strength < 2) {
      setError("Please choose a stronger password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const eyeIcon = (show, toggle) => (
    <button
      type="button"
      onClick={toggle}
      className="text-slate-400 hover:text-slate-600 transition-colors"
    >
      {show ? (
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
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
          />
        </svg>
      ) : (
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
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      )}
    </button>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-950 via-violet-900 to-purple-800 flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-400/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/20 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 mb-8">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Start your journey
          </h1>
          <p className="text-indigo-200 text-lg mb-12 max-w-sm">
            Join thousands of job seekers who landed their dream role using
            Smart Job Tracker.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: "Users", value: "10K+" },
              { label: "Jobs Tracked", value: "250K+" },
              { label: "Offers Landed", value: "8K+" },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white/10 border border-white/10 rounded-xl p-3"
              >
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-indigo-200 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="text-sm text-indigo-300 italic">
            "Got 3 interviews in my first week of using this!"
            <div className="text-indigo-400 text-xs mt-1">
              — Sarah K., Software Engineer
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-800">
              Smart Job Tracker
            </span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">
                Create your account
              </h2>
              <p className="text-sm text-slate-500">
                Free forever. No credit card required.
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Full name
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 hover:border-slate-300 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Email address
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 hover:border-slate-300 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Password
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    required
                    className="w-full pl-10 pr-11 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 hover:border-slate-300 transition-all"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {eyeIcon(showPassword, () =>
                      setShowPassword(!showPassword),
                    )}
                  </div>
                </div>

                {/* Password strength */}
                {form.password && (
                  <div className="pt-1">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i <= strength
                              ? strengthColor[strength]
                              : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">
                      Strength:{" "}
                      <span
                        className={`font-medium ${
                          strength <= 1
                            ? "text-red-500"
                            : strength === 2
                              ? "text-amber-500"
                              : strength === 3
                                ? "text-blue-500"
                                : "text-emerald-500"
                        }`}
                      >
                        {strengthLabel[strength]}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Confirm password
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    required
                    className={`w-full pl-10 pr-11 py-2.5 text-sm border rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 hover:border-slate-300 transition-all ${
                      form.confirmPassword &&
                      form.confirmPassword !== form.password
                        ? "border-red-300 focus:ring-red-400/30 focus:border-red-400"
                        : form.confirmPassword &&
                            form.confirmPassword === form.password
                          ? "border-emerald-300 focus:ring-emerald-400/30 focus:border-emerald-400"
                          : "border-slate-200 focus:ring-violet-500/30 focus:border-violet-400"
                    }`}
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {eyeIcon(showConfirm, () => setShowConfirm(!showConfirm))}
                  </div>
                </div>
                {form.confirmPassword &&
                  form.confirmPassword !== form.password && (
                    <p className="text-xs text-red-500">
                      Passwords do not match
                    </p>
                  )}
                {form.confirmPassword &&
                  form.confirmPassword === form.password && (
                    <p className="text-xs text-emerald-600 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Passwords match
                    </p>
                  )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
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
                    Creating account...
                  </>
                ) : (
                  "Create free account →"
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-violet-600 hover:text-violet-700 font-semibold transition-colors"
                >
                  Sign in →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
