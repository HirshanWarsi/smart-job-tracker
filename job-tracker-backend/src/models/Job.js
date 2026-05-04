const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    company: String,
    role: String,
    status: {
      type: String,
      enum: ["Applied", "Interview", "Rejected"],
      default: "Applied",
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);