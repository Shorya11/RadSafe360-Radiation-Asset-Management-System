import transporter, { mailSender } from "./emailConfig.js";
import { generateMeetingCreatedHtml, generateMeetingCreatedText } from "./templates.js";

/**
 * Sends a safety meeting notification email to all registered participants of a meeting
 * 
 * @param {Object} meeting - The Prisma meeting object
 * @param {Array<Object>} participants - Array of participant objects
 * @returns {Promise<Object>} Summary of notifications trigger
 */
export const sendMeetingCreatedNotification = async (meeting, participants = []) => {
  console.log(`📨 Triggering meeting notification service for meeting ID: ${meeting.id}`);

  if (!participants || participants.length === 0) {
    console.log("ℹ️ No participants found. Notification execution skipped.");
    return { success: true, sentCount: 0, skippedCount: 0, failures: [] };
  }

  const results = {
    success: true,
    sentCount: 0,
    skippedCount: 0,
    failures: [],
  };

  // Filter participants with emails
  const targetParticipants = participants.filter((p) => {
    const hasEmail = p.email && p.email.trim() !== "";
    if (!hasEmail) {
      results.skippedCount += 1;
    }
    return hasEmail;
  });

  // Loop through participants and send email asynchronously (non-blocking)
  const promises = targetParticipants.map(async (participant) => {
    try {
      const htmlContent = generateMeetingCreatedHtml(meeting, participant);
      const textContent = generateMeetingCreatedText(meeting, participant);

      const mailOptions = {
        from: `"RSO Safety Admin" <${mailSender}>`,
        to: participant.email,
        subject: `[Safety Notice] Scheduled RSO Audit Meeting - ${meeting.title}`,
        text: textContent,
        html: htmlContent,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Meeting notification successfully sent to: ${participant.email} (Msg ID: ${info.messageId})`);
      results.sentCount += 1;
      return { email: participant.email, success: true };
    } catch (error) {
      console.error(`❌ Failed to send meeting notification to ${participant.email}:`, error);
      results.failures.push({ email: participant.email, error: error.message || error });
      return { email: participant.email, success: false, error };
    }
  });

  await Promise.allSettled(promises);

  if (results.failures.length > 0) {
    results.success = false;
  }

  console.log(`📊 Email Notification Summary: Triggered=${targetParticipants.length}, Sent=${results.sentCount}, Failures=${results.failures.length}, Skipped(No Email)=${results.skippedCount}`);
  
  return results;
};
