import { useRef, useState } from "react";
import API from "../services/api";

export default function AIMatcher() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setResumeFile(null);
      setResumeFileName("");
      return;
    }
    setResumeFile(file);
    setResumeFileName(file.name);
  };

  const clearResume = () => {
    setResumeFile(null);
    setResumeFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      alert("Please enter a job description");
      return;
    }
    if (!resumeFile) {
      alert("Please upload your resume (PDF)");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("jobDescription", jobDescription.trim());
    formData.append("resume", resumeFile);

    try {
      const res = await API.post("/ai/match", formData);
      setResult(res.data);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Try again.";
      alert(msg);
    }

    setLoading(false);
  };

  const canSubmit = Boolean(jobDescription.trim() && resumeFile);

  return (
    <div className="relative mt-12 rounded-xl p-[1px] bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 hover:shadow-lg transition">
      <div className="bg-white rounded-xl p-6 shadow">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-semibold">🤖 AI Resume Analyzer</h2>
            <p className="text-sm text-gray-500">
              Get instant insights on how well your resume matches the job
            </p>
          </div>
          <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
            AI Powered
          </span>
        </div>

        {/* Job Description */}
        <div>
          <p className="text-sm font-medium mb-1">Job Description</p>
          <textarea
            className="border p-4 w-full mb-3 rounded 
            focus:outline-none focus:ring-2 focus:ring-purple-400 
            transition placeholder:text-gray-400"
            rows="4"
            placeholder="Paste job description..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        {/* Resume PDF */}
        <div className="mb-3">
          <p className="text-sm font-medium mb-1">Your Resume</p>
          <p className="text-xs text-gray-500 mb-2">
            Upload your resume (PDF only)
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label
              className="inline-flex items-center justify-center px-4 py-2 rounded border border-purple-200 bg-purple-50 text-purple-700 text-sm font-medium cursor-pointer hover:bg-purple-100 transition"
            >
              Choose PDF
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleResumeChange}
              />
            </label>
            {resumeFileName ? (
              <>
                <span
                  className="text-sm text-gray-700 truncate max-w-[200px] sm:max-w-xs"
                  title={resumeFileName}
                >
                  {resumeFileName}
                </span>
                <button
                  type="button"
                  className="text-xs text-gray-500 underline hover:text-gray-800"
                  onClick={clearResume}
                >
                  Remove
                </button>
              </>
            ) : (
              <span className="text-sm text-gray-400">No file selected</span>
            )}
          </div>
        </div>

        {/* Button */}
        <button
          className="bg-gradient-to-r from-purple-500 to-indigo-600 
          text-white px-4 py-2 rounded w-full 
          hover:opacity-90 hover:scale-[1.01] active:scale-[0.98] 
          transition font-medium flex items-center justify-center
          disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100"
          onClick={handleMatch}
          disabled={loading || !canSubmit}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Analyzing...
            </span>
          ) : (
            "Analyze Match"
          )}
        </button>

        {/* RESULT */}
        {result && (
          <div className="bg-gray-50 p-5 rounded-lg border mt-6 space-y-5 animate-fadeIn hover:shadow-md transition">
            {/* Summary */}
            <p className="text-sm text-gray-600">
              Based on your resume, you have a{" "}
              <span className="font-semibold">{result.match}%</span> match with
              this role.
            </p>

            {/* Match Score */}
            <div>
              <p className="font-semibold mb-1">Match Score</p>

              <div className="w-full bg-gray-200 rounded h-4">
                <div
                  className={`h-4 rounded ${
                    result.match > 75
                      ? "bg-green-500"
                      : result.match > 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${result.match}%` }}
                ></div>
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-red-50 p-4 rounded">
              <p className="font-semibold text-red-600 mb-2">
                Missing Skills ⚠️
              </p>
              <ul className="list-disc ml-5 text-red-500">
                {result.missingSkills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="bg-green-50 p-4 rounded">
              <p className="font-semibold text-green-600 mb-2">
                Suggestions 💡
              </p>
              <ul className="list-disc ml-5 text-green-600">
                {result.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>

              {/* Copy Button */}
              <button
                className="text-sm text-purple-600 mt-2 underline hover:text-purple-800"
                onClick={() =>
                  navigator.clipboard.writeText(result.suggestions.join(", "))
                }
              >
                Copy Suggestions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
