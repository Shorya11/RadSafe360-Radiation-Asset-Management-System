import express from "express";
import cors from "cors";

// Import Routes
import gaugeRoutes from "./routes/gaugeRoutes.js";
import surveyMeterRoutes from "./routes/surveyMeterRoutes.js";
import rsoPersonnelRoutes from "./routes/rsoPersonnelRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import eloraMemberRoutes from "./routes/eloraMemberRoutes.js";
import reportRoutes from './routes/reportRoutes.js'
import trainingRoutes from './routes/trainingRoutes.js'
import path from 'path'

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'))

// API Route Registration
app.use("/api/gauges", gaugeRoutes);
app.use("/api/survey-meters", surveyMeterRoutes);
app.use("/api/rso-personnel", rsoPersonnelRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/elora-members", eloraMemberRoutes);
app.use('/api/reports', reportRoutes);
app.use(
  '/uploads',
  express.static('uploads')
)
app.use('/api/training-manuals', trainingRoutes)

// Root Endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Industrial Radiation Safety Backend Running",
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error encountered:", err.stack || err);
  
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

