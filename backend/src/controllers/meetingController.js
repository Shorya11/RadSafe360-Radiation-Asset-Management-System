import prisma from "../config/prisma.js";
import { sendMeetingCreatedNotification } from "../services/email/notificationService.js";
import { sendMomNotification }
from "../services/email/momNotificationService.js";

// Helper for Attendance Status Mapping
const toPrismaAttendanceStatus = (status) => {
  if (!status) return "Present";
  const mapped = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  const valid = ["Present", "Absent", "Leave", "Resigned"];
  return valid.includes(mapped) ? mapped : "Present";
};

const toFrontendAttendanceStatus = (status) => {
  if (!status) return "present";
  return status.toLowerCase(); // present, absent, leave, resigned
};

// Helper for MOM Action Item Status Mapping
const toPrismaActionStatus = (status) => {
  if (status === "In Progress") return "In_Progress";
  return status || "Pending"; // Pending, Completed
};

const toFrontendActionStatus = (status) => {
  if (status === "In_Progress") return "In Progress";
  return status || "Pending"; // Pending, Completed
};

// Helper to compute attendance stats for a meeting
const computeMeetingStats = (participantsWithAttendance) => {
  const total = participantsWithAttendance.length;
  const present = participantsWithAttendance.filter(
    (p) => p.attendance?.status === "Present"
  ).length;
  const absent = participantsWithAttendance.filter(
    (p) => p.attendance?.status === "Absent"
  ).length;
  const leave = participantsWithAttendance.filter(
    (p) => p.attendance?.status === "Leave"
  ).length;
  const resigned = participantsWithAttendance.filter(
    (p) => p.attendance?.status === "Resigned"
  ).length;

  const activeCount = total - resigned;
  const rate = activeCount > 0 ? Math.round((present / activeCount) * 1000) / 10 : 0;

  return {
    participantCount: total,
    presentCount: present,
    absentCount: absent,
    leaveCount: leave,
    resignedCount: resigned,
    attendanceRate: rate,
  };
};

/**
 * Get all meetings
 * GET /api/meetings
 */
export const getAllMeetings = async (req, res, next) => {
  try {
    const meetings = await prisma.meeting.findMany({
      include: {
        topics: true,
        discussionPoints: true,
        participants: {
          include: {
            attendance: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    const formattedMeetings = meetings.map((meeting) => {
      const stats = computeMeetingStats(meeting.participants);
      return {
        id: meeting.id,
        title: meeting.title,
        venue: meeting.venue,
        date: meeting.date,
        timeLabel: meeting.timeLabel,
        chairPerson: meeting.chairPerson,
        description: meeting.description,
        status: meeting.status,
        topics: meeting.topics.map((t) => t.topic),
        discussionPoints: meeting.discussionPoints.map((d) => d.point),
        ...stats,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Meetings retrieved successfully",
      data: formattedMeetings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single meeting details (meeting, participants/attendance, action items)
 * GET /api/meetings/:id
 */
export const getMeetingDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const meeting = await prisma.meeting.findUnique({
      where: { id },
      include: {
        topics: true,
        discussionPoints: true,
        participants: {
          include: {
            attendance: true,
          },
        },
        actionItems: true,
      },
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: `Meeting with ID ${id} not found`,
      });
    }

    // Compute live stats
    const stats = computeMeetingStats(meeting.participants);

    // Format meeting object
    const formattedMeeting = {
      id: meeting.id,
      title: meeting.title,
      venue: meeting.venue,
      date: meeting.date,
      timeLabel: meeting.timeLabel,
      chairPerson: meeting.chairPerson,
      description: meeting.description,
      status: meeting.status,
      topics: meeting.topics.map((t) => t.topic),
      discussionPoints: meeting.discussionPoints.map((d) => d.point),
      ...stats,
    };

    // Format attendance array
    const attendance = meeting.participants.map((p) => ({
      id: p.attendance?.id || `missing-att-${p.id}`,
      meetingId: meeting.id,
      participantId: p.id,
      personnelId: p.personnelId,
      participantSource: p.participantSource,
      name: p.name,
      department: p.department,
      designation: p.designation,
      phoneNumber: p.phoneNumber,
      email: p.email,
      status: toFrontendAttendanceStatus(p.attendance?.status),
      group: p.group,
    }));

    // Format action items array
    const actionItems = meeting.actionItems
      .map((item) => ({
        id: item.id,
        meetingId: item.meetingId,
        serialNo: item.serialNo,
        task: item.task,
        assignedTo: item.assignedTo,
        dueDate: item.dueDate,
        status: toFrontendActionStatus(item.status),
      }))
      .sort((a, b) => a.serialNo - b.serialNo);

    return res.status(200).json({
      success: true,
      message: "Meeting details retrieved successfully",
      data: {
        meeting: formattedMeeting,
        attendance,
        actionItems,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new meeting (including batch creation of initial participants/attendance and action items)
 * POST /api/meetings
 */
export const createMeeting = async (req, res, next) => {
  try {
    const {
      id,
      title,
      venue,
      date,
      time, // timeLabel from client
      chairPerson,
      description,
      topics = [],
      discussionPoints = [],
      participants = [],
      actionActivities = [],
    } = req.body;

    // Simple validation for required fields
    if (!title || !venue || !date || !chairPerson) {
      return res.status(400).json({
        success: false,
        message: "Missing required meeting fields (title, venue, date, chairperson)",
      });
    }

    // Set stable ID (defaulting to date or custom string if supplied)
    const targetId = id?.trim() || date;

    // Check if meeting ID is already taken
    const existingMeeting = await prisma.meeting.findUnique({
      where: { id: targetId },
    });

    if (existingMeeting) {
      return res.status(400).json({
        success: false,
        message: `A meeting dated or with ID ${targetId} already exists`,
      });
    }

    // Create meeting, topics, discussion points, participants and action items in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Meeting
      const newMeeting = await tx.meeting.create({
        data: {
          id: targetId,
          title,
          venue,
          date,
          timeLabel: time || null,
          chairPerson,
          description: description || "",
          status: "scheduled",
        },
      });

      // 2. Create Topics
      if (topics.length > 0) {
        await tx.meetingTopic.createMany({
          data: topics
            .map((t) => t?.trim())
            .filter(Boolean)
            .map((topic) => ({
              meetingId: targetId,
              topic,
            })),
        });
      }

      // 3. Create Discussion Points
      if (discussionPoints.length > 0) {
        await tx.discussionPoint.createMany({
          data: discussionPoints
            .map((d) => d?.trim())
            .filter(Boolean)
            .map((point) => ({
              meetingId: targetId,
              point,
            })),
        });
      }

      // 4. Create Action Items
      if (actionActivities.length > 0) {
        // Enforce serial numbers
        const validActions = actionActivities.filter((a) => a.task && a.assignedTo);
        for (let i = 0; i < validActions.length; i++) {
          await tx.actionItem.create({
            data: {
              meetingId: targetId,
              serialNo: i + 1,
              task: validActions[i].task,
              assignedTo: validActions[i].assignedTo,
              dueDate: validActions[i].dueDate || "",
              status: toPrismaActionStatus(validActions[i].status),
            },
          });
        }
      }

      // 5. Create Participants and Attendance records
      for (const participant of participants) {
        const newPart = await tx.meetingParticipant.create({
          data: {
            meetingId: targetId,
            personnelId: participant.personnelId || null,
            participantSource: participant.participantSource || "external",
            name: participant.name,
            department: participant.department,
            designation: participant.designation,
            phoneNumber: participant.phoneNumber || "",
            email: participant.email || "",
            group: participant.group || "certified_rso",
          },
        });

        await tx.attendance.create({
          data: {
            participantId: newPart.id,
            status: toPrismaAttendanceStatus(participant.status),
          },
        });
      }

      return newMeeting;
    });
    try {
      const meetingWithParticipants = await prisma.meeting.findUnique({
        where: { id: targetId },
        include: {
          participants: true,
        },
      });

      await sendMeetingCreatedNotification(
        meetingWithParticipants,
        meetingWithParticipants.participants
      );
    } catch (emailError) {
      console.error(
        "Meeting created but email notification failed:",
        emailError
      );
    }

    return res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update meeting details by ID
 * PUT /api/meetings/:id
 */
export const updateMeeting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, date, timeLabel, venue, chairPerson, description, status } = req.body;

    const meetingExists = await prisma.meeting.findUnique({
      where: { id },
    });

    if (!meetingExists) {
      return res.status(404).json({
        success: false,
        message: `Meeting with ID ${id} not found`,
      });
    }

    const updated = await prisma.meeting.update({
      where: { id },
      data: {
        title: title ?? undefined,
        date: date ?? undefined,
        timeLabel: timeLabel !== undefined ? timeLabel : undefined,
        venue: venue ?? undefined,
        chairPerson: chairPerson ?? undefined,
        description: description !== undefined ? description : undefined,
        status: status ?? undefined,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Meeting details updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete meeting by ID
 * DELETE /api/meetings/:id
 */
export const deleteMeeting = async (req, res, next) => {
  try {
    const { id } = req.params;

    const meetingExists = await prisma.meeting.findUnique({
      where: { id },
    });

    if (!meetingExists) {
      return res.status(404).json({
        success: false,
        message: `Meeting with ID ${id} not found`,
      });
    }

    // Cascade deletes handle topics, discussionPoints, participants, attendance, actionItems
    await prisma.meeting.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: `Meeting with ID ${id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add participant(s) to a meeting
 * POST /api/meetings/:id/participants
 */
export const addParticipant = async (req, res, next) => {
  try {
    const { id: meetingId } = req.params;
    const participant = req.body; // Can be a single participant object or array of participants

    const meetingExists = await prisma.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!meetingExists) {
      return res.status(404).json({
        success: false,
        message: `Meeting with ID ${meetingId} not found`,
      });
    }

    if (!participant.name || !participant.department) {
      return res.status(400).json({
        success: false,
        message: "Missing required participant fields (name, department)",
      });
    }

    // Transaction to create Participant + initial Attendance record
    const result = await prisma.$transaction(async (tx) => {
      const newPart = await tx.meetingParticipant.create({
        data: {
          meetingId,
          personnelId: participant.personnelId || null,
          participantSource: participant.participantSource || "external",
          name: participant.name,
          department: participant.department,
          designation: participant.designation || "Guest",
          phoneNumber: participant.phoneNumber || "",
          email: participant.email || "",
          group: participant.group || "certified_rso",
        },
      });

      const newAtt = await tx.attendance.create({
        data: {
          participantId: newPart.id,
          status: toPrismaAttendanceStatus(participant.status),
        },
      });

      return {
        id: newAtt.id,
        meetingId,
        participantId: newPart.id,
        personnelId: newPart.personnelId,
        participantSource: newPart.participantSource,
        name: newPart.name,
        department: newPart.department,
        designation: newPart.designation,
        phoneNumber: newPart.phoneNumber,
        email: newPart.email,
        status: toFrontendAttendanceStatus(newAtt.status),
        group: newPart.group,
      };
    });

    return res.status(201).json({
      success: true,
      message: "Participant added to meeting successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove participant from a meeting
 * DELETE /api/meetings/participants/:attendanceId
 */
export const removeParticipant = async (req, res, next) => {
  try {
    const { attendanceId } = req.params;

    // Find the attendance record to get the participantId
    const attendanceExists = await prisma.attendance.findUnique({
      where: { id: attendanceId },
    });

    if (!attendanceExists) {
      return res.status(404).json({
        success: false,
        message: `Attendance record with ID ${attendanceId} not found`,
      });
    }

    // Delete the participant (cascade delete will clean up the attendance record too)
    await prisma.meetingParticipant.delete({
      where: { id: attendanceExists.participantId },
    });

    return res.status(200).json({
      success: true,
      message: `Participant with Attendance ID ${attendanceId} removed successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a MOM Action Item to a meeting
 * POST /api/meetings/:id/action-items
 */
export const addActionItem = async (req, res, next) => {
  try {
    const { id: meetingId } = req.params;
    const { task, assignedTo, dueDate, status } = req.body;

    const meetingExists = await prisma.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!meetingExists) {
      return res.status(404).json({
        success: false,
        message: `Meeting with ID ${meetingId} not found`,
      });
    }

    if (!task || !assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Missing required action item fields (task, assignedTo)",
      });
    }

    // Determine serial number
    const count = await prisma.actionItem.count({
      where: { meetingId },
    });
    const nextSerialNo = count + 1;

    const item = await prisma.actionItem.create({
      data: {
        meetingId,
        serialNo: nextSerialNo,
        task,
        assignedTo,
        dueDate: dueDate || "",
        status: toPrismaActionStatus(status),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Action item added successfully",
      data: {
        id: item.id,
        meetingId: item.meetingId,
        serialNo: item.serialNo,
        task: item.task,
        assignedTo: item.assignedTo,
        dueDate: item.dueDate,
        status: toFrontendActionStatus(item.status),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a MOM Action Item by ID
 * PUT /api/meetings/action-items/:itemId
 */
export const updateActionItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { task, assignedTo, dueDate, status } = req.body;

    const itemExists = await prisma.actionItem.findUnique({
      where: { id: itemId },
    });

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: `Action item with ID ${itemId} not found`,
      });
    }

    const updated = await prisma.actionItem.update({
      where: { id: itemId },
      data: {
        task: task ?? undefined,
        assignedTo: assignedTo ?? undefined,
        dueDate: dueDate ?? undefined,
        status: status ? toPrismaActionStatus(status) : undefined,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Action item updated successfully",
      data: {
        id: updated.id,
        meetingId: updated.meetingId,
        serialNo: updated.serialNo,
        task: updated.task,
        assignedTo: updated.assignedTo,
        dueDate: updated.dueDate,
        status: toFrontendActionStatus(updated.status),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a MOM Action Item by ID
 * DELETE /api/meetings/action-items/:itemId
 */
export const deleteActionItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const itemExists = await prisma.actionItem.findUnique({
      where: { id: itemId },
    });

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: `Action item with ID ${itemId} not found`,
      });
    }

    await prisma.actionItem.delete({
      where: { id: itemId },
    });

    return res.status(200).json({
      success: true,
      message: `Action item with ID ${itemId} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
export const sendMomEmail = async (req, res) => {
  try {
    const meeting = await prisma.meeting.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        participants: true,
        actionItems: true,
        discussionPoints: true,
        topics: true,
      },
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

   await sendMomNotification(
  meeting,
  meeting.participants
);

    return res.json({
      success: true,
      message: "MOM email triggered",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
