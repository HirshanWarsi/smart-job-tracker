import { useEffect, useState } from "react";
import API from "../services/api";

export default function JobList() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchJobs();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="mt-5">
      <h2 className="text-lg font-semibold mb-3">Your Jobs</h2>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs added yet</p>
      ) : (
        jobs.map((job) => (
          <div key={job._id} className="border p-3 mb-2 rounded shadow-sm">
            <h3 className="font-bold">{job.company}</h3>
            <p>{job.role}</p>
            <p className="text-sm text-gray-600">{job.status}</p>

            <button
              className="bg-red-500 text-white px-2 py-1 mt-2 rounded"
              onClick={() => handleDelete(job._id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}