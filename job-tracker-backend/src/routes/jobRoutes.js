const express = require("express");
const router = express.Router();
const { getJobStats } = require("../controllers/jobController");

const {
    createJob,
    getJobs,
    updateJob,
    deleteJob,
} = require("../controllers/jobController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createJob);
router.get("/", protect, getJobs);
router.get("/stats", protect, getJobStats);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;