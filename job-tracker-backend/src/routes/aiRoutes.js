const express = require("express");
const router = express.Router();
const { matchResume } = require("../controllers/aiController");
const { uploadResume } = require("../middleware/upload");

router.post("/match", uploadResume, matchResume);

module.exports = router;