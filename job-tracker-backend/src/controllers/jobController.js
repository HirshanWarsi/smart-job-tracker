const Job = require("../models/Job");

// Create Job
exports.createJob = async (req, res) => {
  const { company, role, status, notes } = req.body;

  const job = await Job.create({
    user: req.user._id,
    company,
    role,
    status,
    notes,
  });

  res.status(201).json(job);
};

// Get Jobs
exports.getJobs = async (req, res) => {
  const jobs = await Job.find({ user: req.user._id });
  res.json(jobs);
};

// Update Job
exports.updateJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) return res.status(404).json({ message: "Job not found" });

  if (job.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(updatedJob);
};

// Delete Job
exports.deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) return res.status(404).json({ message: "Job not found" });

  if (job.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await job.deleteOne();

  res.json({ message: "Job removed" });
};

// Job Stats
exports.getJobStats = async (req, res) => {
  const stats = await Job.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    total: 0,
    applied: 0,
    interview: 0,
    rejected: 0,
  };

  stats.forEach((item) => {
    result.total += item.count;

    if (item._id === "Applied") result.applied = item.count;
    if (item._id === "Interview") result.interview = item.count;
    if (item._id === "Rejected") result.rejected = item.count;
  });

  res.json(result);
};