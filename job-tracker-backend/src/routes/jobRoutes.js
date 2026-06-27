const express = require("express");
const router = express.Router();

const {
  createJob,
  getJobs,
  deleteJob,
  updateJob,
} = require("../controllers/jobController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createJob);
router.get("/", protect, getJobs);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;
