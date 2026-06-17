import express from "express";
import {
  getAllMeetings,
  getMeetingDetails,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  addParticipant,
  removeParticipant,
  addActionItem,
  updateActionItem,
  deleteActionItem,
  sendMomEmail,
} from "../controllers/meetingController.js";


const router = express.Router();

// General Meeting CRUD
router.route("/")
  .get(getAllMeetings)
  .post(createMeeting);

router.route("/:id")
  .get(getMeetingDetails)
  .put(updateMeeting)
  .delete(deleteMeeting);

// Meeting Participants operations
router.post("/:id/participants", addParticipant);
router.delete("/participants/:attendanceId", removeParticipant);

// MOM Action Items operations
router.post("/:id/action-items", addActionItem);
router.put("/action-items/:itemId", updateActionItem);
router.delete("/action-items/:itemId", deleteActionItem);

// MOM EMAIL ROUTE
router.post("/:id/send-mom", sendMomEmail);

export default router;
