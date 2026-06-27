const express = require("express");
const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Connect DB
connectDB();

// Initialize app
const app = express();

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL].filter(Boolean),
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/ai", aiRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Server start (LAST)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`);
});
