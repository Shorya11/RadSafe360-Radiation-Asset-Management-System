import nodemailer from "nodemailer";
import "dotenv/config";

const {
  SMTP_HOST = "smtp.mailtrap.io",
  SMTP_PORT = 2525,
  SMTP_USER = "",
  SMTP_PASS = "",
  SMTP_FROM = "radiation-safety@industrialops.com",
  EMAIL_SERVICE_MODE = "mock", // "mock" (log to console) or "smtp" (active sending)
} = process.env;

let transporter = null;

if (EMAIL_SERVICE_MODE === "smtp" && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // True for port 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
} else {
  // Mock mode transporter (does not send emails, logs to terminal instead)
  transporter = {
    sendMail: async (mailOptions) => {
      console.log("\n==================================================");
      console.log("📨 [MOCK EMAIL SERVICE] - Email Triggered!");
      console.log(`From:    ${mailOptions.from}`);
      console.log(`To:      ${mailOptions.to}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log("--------------------------------------------------");
      console.log("Text Body:\n", mailOptions.text);
      console.log("--------------------------------------------------");
      console.log("HTML Body Preview (First 350 chars):\n", mailOptions.html.slice(0, 350) + "...");
      console.log("==================================================\n");
      return {
        messageId: `mock-msg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        response: "Mock Sent Success",
      };
    },
  };
}

/**
 * Verify current SMTP connection (Only executes if EMAIL_SERVICE_MODE is "smtp")
 */
export const verifySmtpConnection = async () => {
  if (EMAIL_SERVICE_MODE === "smtp" && typeof transporter.verify === "function") {
    try {
      await transporter.verify();
      console.log("✅ SMTP Connection established successfully.");
      return true;
    } catch (error) {
      console.error("❌ SMTP Connection verification failed:", error);
      return false;
    }
  }
  console.log("ℹ️ Email Service is running in MOCK mode. SMTP connection skipped.");
  return true;
};

export const mailSender = SMTP_FROM;
export default transporter;
