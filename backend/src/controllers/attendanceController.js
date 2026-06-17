import prisma from "../config/prisma.js";

// Helper for Attendance Status Mapping
const toPrismaAttendanceStatus = (status) => {
  if (!status) return "Present";
  const mapped = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  const valid = ["Present", "Absent", "Leave", "Resigned"];
  return valid.includes(mapped) ? mapped : "Present";
};

const toFrontendAttendanceStatus = (status) => {
  if (!status) return "present";
  return status.toLowerCase();
};

/**
 * Update the attendance status of a participant
 * PUT /api/attendance/:attendanceId
 */
export const updateAttendanceStatus = async (req, res, next) => {
  try {
    const { attendanceId } = req.params;
    const { status } = req.body; // e.g. 'present', 'absent', 'leave', 'resigned'

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Missing required attendance status field",
      });
    }

    const validStatuses = ["present", "absent", "leave", "resigned"];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid attendance status: ${status}. Must be one of ${validStatuses.join(", ")}`,
      });
    }

    const attendanceExists = await prisma.attendance.findUnique({
      where: { id: attendanceId },
    });

    if (!attendanceExists) {
      return res.status(404).json({
        success: false,
        message: `Attendance record with ID ${attendanceId} not found`,
      });
    }

    const updated = await prisma.attendance.update({
      where: { id: attendanceId },
      data: {
        status: toPrismaAttendanceStatus(status),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Attendance status updated successfully",
      data: {
        id: updated.id,
        status: toFrontendAttendanceStatus(updated.status),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get attendance statistics and breakdowns for a specific meeting
 * GET /api/attendance/stats/:meetingId
 */
export const getAttendanceStatsByMeeting = async (req, res, next) => {
  try {
    const { meetingId } = req.params;

    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        participants: {
          include: {
            attendance: true,
          },
        },
      },
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: `Meeting with ID ${meetingId} not found`,
      });
    }

    const total = meeting.participants.length;
    const present = meeting.participants.filter(
      (p) => p.attendance?.status === "Present"
    ).length;
    const absent = meeting.participants.filter(
      (p) => p.attendance?.status === "Absent"
    ).length;
    const leave = meeting.participants.filter(
      (p) => p.attendance?.status === "Leave"
    ).length;
    const resigned = meeting.participants.filter(
      (p) => p.attendance?.status === "Resigned"
    ).length;

    const activeCount = total - resigned;
    const rate = activeCount > 0 ? Math.round((present / activeCount) * 1000) / 10 : 0;

    // Group stats by department
    const deptMap = {};
    meeting.participants.forEach((p) => {
      const dept = p.department || "Other";
      if (!deptMap[dept]) {
        deptMap[dept] = { total: 0, present: 0 };
      }
      deptMap[dept].total += 1;
      if (p.attendance?.status === "Present") {
        deptMap[dept].present += 1;
      }
    });

    const departmentBreakdown = Object.entries(deptMap).map(([deptName, counts]) => ({
      department: deptName,
      totalParticipants: counts.total,
      presentParticipants: counts.present,
      attendanceRate: counts.total > 0 ? Math.round((counts.present / counts.total) * 1000) / 10 : 0,
    }));

    return res.status(200).json({
      success: true,
      message: "Attendance statistics compiled successfully",
      data: {
        participantCount: total,
        presentCount: present,
        absentCount: absent,
        leaveCount: leave,
        resignedCount: resigned,
        attendanceRate: rate,
        departmentBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};
