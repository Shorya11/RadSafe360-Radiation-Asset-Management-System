import express from "express";
import {
  updateAttendanceStatus,
  getAttendanceStatsByMeeting,
} from "../controllers/attendanceController.js";

const router = express.Router();

// Attendance updates
router.put("/:attendanceId", updateAttendanceStatus);

// Attendance stats for a specific meeting
router.get("/stats/:meetingId", getAttendanceStatsByMeeting);

export default router;
