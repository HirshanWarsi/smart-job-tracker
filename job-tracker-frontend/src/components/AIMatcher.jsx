import { useState, useRef, useCallback } from "react";
import API from "../services/api";

// ─── Circular Score Ring ──────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const size = 140;
  const strokeWidth = 12;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label =
    score >= 75
      ? "Excellent"
      : score >= 50
        ? "Good"
        : score >= 30
          ? "Fair"
          : "Needs Work";
  const bgGlow =
    score >= 75
      ? "from-emerald-500/20 to-teal-500/20"
      : score >= 50
        ? "from-amber-500/20 to-orange-500/20"
        : "from-red-500/20 to-rose-500/20";

  return (
    <div className="flex flex-col items-center">
      <div className={`relative bg-gradient-to-br ${bgGlow} rounded-full p-4`}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
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
            style={{
              transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
              filter: `drop-shadow(0 0 6px ${color}60)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>
            {score}%
          </span>
          <span className="text-xs font-semibold text-slate-500 mt-0.5">
            {label}
          </span>
        </div>
      </div>
      <div className="mt-3 text-sm font-semibold text-slate-700">
        Match Score
      </div>
    </div>
  );
}

// ─── Upload Area ──────────────────────────────────────────────────────────────
function UploadArea({ file, onFileChange, dragActive, onDrag, onDrop }) {
  const inputRef = useRef();

  return (
    <div
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={(e) => {
        e.preventDefault();
        onDrag(e);
      }}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
        transition-all duration-200
        ${
          dragActive
            ? "border-violet-400 bg-violet-50 scale-[1.01]"
            : file
              ? "border-emerald-300 bg-emerald-50"
              : "border-slate-200 bg-slate-50 hover:border-violet-300 hover:bg-violet-50/30"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={onFileChange}
        className="hidden"
      />

      {file ? (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-emerald-700">{file.name}</p>
          <p className="text-xs text-slate-400 mt-1">
            {(file.size / 1024).toFixed(0)} KB · Click to change
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all ${dragActive ? "bg-violet-100" : "bg-slate-100"}`}
          >
            <svg
              className={`w-6 h-6 transition-colors ${dragActive ? "text-violet-600" : "text-slate-400"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-700">
            {dragActive ? "Drop your resume here" : "Upload your resume"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Drag & drop or click · PDF only · Max 5MB
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Skill Badge ──────────────────────────────────────────────────────────────
function SkillBadge({ skill, missing = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full transition-all ${
        missing
          ? "bg-red-50 text-red-600 border border-red-200"
          : "bg-violet-50 text-violet-700 border border-violet-200"
      }`}
    >
      {missing && (
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
            d="M12 4v16m8-8H4"
          />
        </svg>
      )}
      {skill}
    </span>
  );
}

// ─── Suggestion Card ──────────────────────────────────────────────────────────
function SuggestionCard({ text, index }) {
  const icons = ["🎯", "📝", "💡", "🚀", "✨", "🔑", "📊", "🌟"];
  return (
    <div className="flex gap-3 p-4 bg-slate-50 hover:bg-violet-50/50 rounded-xl border border-slate-100 hover:border-violet-200 transition-all group">
      <span className="text-lg flex-shrink-0 mt-0.5">
        {icons[index % icons.length]}
      </span>
      <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors">
        {text}
      </p>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AIMatcher() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
      setError("");
    } else if (f) {
      setError("Please upload a PDF file.");
    }
  };

  const handleDrag = useCallback((e) => {
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
      setError("");
    } else {
      setError("Please drop a PDF file.");
    }
  }, []);

  const simulateProgress = () => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 90) {
        clearInterval(interval);
        setProgress(90);
        return;
      }
      setProgress(Math.min(p, 90));
    }, 300);
    return interval;
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload your resume first.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setProgress(0);

    const interval = simulateProgress();

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const { data } = await API.post("/ai/match", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        const normalized = {
          matchScore: data.match,
          score: data.match,
          missingSkills: data.missingSkills || [],
          suggestions: data.suggestions || [],
          matchedSkills: data.matchedSkills || [],
        };
        setResult(normalized);
        setLoading(false);
        setProgress(0);
      }, 400);
    } catch (err) {
      clearInterval(interval);
      setError(
        err.response?.data?.message || "Analysis failed. Please try again.",
      );
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900">
              AI Resume Analyzer
            </span>
            <span className="ml-2 text-xs bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium px-1.5 py-0.5 rounded">
              AI Powered
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 rounded-3xl p-8 mb-8 text-white shadow-xl shadow-violet-500/20">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              AI Resume Analyzer
            </h1>
            <p className="text-violet-200 max-w-lg">
              Upload your resume and paste a job description. Our AI will
              analyze the match, highlight missing skills, and give you
              actionable suggestions to improve your chances.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              {[
                "Match Score Analysis",
                "Missing Skills Detection",
                "Improvement Tips",
                "ATS Optimization",
              ].map((f) => (
                <span
                  key={f}
                  className="flex items-center gap-1.5 text-xs font-medium bg-white/15 border border-white/20 rounded-full px-3 py-1.5 backdrop-blur-sm"
                >
                  <svg
                    className="w-3 h-3 text-violet-200"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="space-y-5">
            {/* Upload */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-violet-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-sm font-bold text-slate-800">
                  Step 1 — Upload Resume
                </h2>
              </div>
              <UploadArea
                file={file}
                onFileChange={handleFileChange}
                dragActive={dragActive}
                onDrag={handleDrag}
                onDrop={handleDrop}
              />
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h2 className="text-sm font-bold text-slate-800">
                  Step 2 — Paste Job Description
                </h2>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => {
                  setJobDescription(e.target.value);
                  setError("");
                }}
                placeholder="Paste the full job description here — requirements, responsibilities, qualifications..."
                rows={8}
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 hover:border-slate-300 transition-all resize-none leading-relaxed"
              />
              <p className="text-xs text-slate-400 mt-2">
                {jobDescription.length} characters
              </p>
            </div>

            {/* Error */}
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

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !file || !jobDescription.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
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
                  Analyzing with AI...
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
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Analyze with AI
                </>
              )}
            </button>

            {/* Progress Bar */}
            {loading && progress > 0 && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Processing your resume...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="space-y-5">
            {!result && !loading && (
              <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-violet-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-600 mb-1">
                  Results will appear here
                </h3>
                <p className="text-sm text-slate-400">
                  Upload your resume and paste a job description to get started
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-5">
                <div className="flex flex-col items-center py-4">
                  <div className="w-16 h-16 relative mb-4">
                    <div className="absolute inset-0 border-4 border-violet-100 rounded-full animate-pulse" />
                    <div className="absolute inset-2 border-4 border-t-violet-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                    <div className="absolute inset-4 bg-violet-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">🤖</span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    AI is analyzing your resume...
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    This may take a few moments
                  </p>
                </div>
                {[120, 80, 100, 60].map((w, i) => (
                  <div key={i} className="animate-pulse space-y-2">
                    <div
                      className="h-3 bg-slate-100 rounded"
                      style={{ width: `${w}px` }}
                    />
                    <div className="h-2 bg-slate-100 rounded w-full" />
                    <div className="h-2 bg-slate-100 rounded w-3/4" />
                  </div>
                ))}
              </div>
            )}

            {result && (
              <>
                {/* Score Card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                  <div className="flex flex-col items-center">
                    <ScoreRing score={result.matchScore || result.score || 0} />

                    {/* Score breakdown */}
                    {result.breakdown && (
                      <div className="w-full mt-5 space-y-2.5">
                        {Object.entries(result.breakdown).map(([key, val]) => (
                          <div key={key}>
                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                              <span className="font-medium capitalize">
                                {key.replace(/_/g, " ")}
                              </span>
                              <span className="font-semibold">{val}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-1000"
                                style={{ width: `${val}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                {result.missingSkills?.length > 0 && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-3.5 h-3.5 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">
                        Missing Skills
                      </h3>
                      <span className="ml-auto text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                        {result.missingSkills.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.missingSkills.map((skill, i) => (
                        <SkillBadge key={i} skill={skill} missing />
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Skills */}
                {result.matchedSkills?.length > 0 && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-3.5 h-3.5 text-emerald-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">
                        Matched Skills
                      </h3>
                      <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                        {result.matchedSkills.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.matchedSkills.map((skill, i) => (
                        <SkillBadge key={i} skill={skill} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {result.suggestions?.length > 0 && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-violet-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-3.5 h-3.5 text-violet-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">
                        AI Suggestions
                      </h3>
                    </div>
                    <div className="space-y-2.5">
                      {result.suggestions.map((s, i) => (
                        <SuggestionCard key={i} text={s} index={i} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Re-analyze */}
                <button
                  onClick={() => {
                    setResult(null);
                    setFile(null);
                    setJobDescription("");
                  }}
                  className="w-full py-2.5 border-2 border-dashed border-slate-200 text-slate-500 text-sm font-semibold rounded-xl hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-all"
                >
                  ↩ Analyze another resume
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
