const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Load env
dotenv.config();

// Connect DB
connectDB();

// Initialize app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

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
  console.log(`Server running on port ${PORT}`);
});

app.use(cors({
  origin: "https://your-frontend-url.vercel.app"
}));