/**
 * Generate highly-styled HTML template for meeting notifications
 */
export const generateMeetingCreatedHtml = (meeting, participant) => {
  const dateFormatted = new Date(meeting.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>RSO Safety Meeting Notification</title>
      <style>
        body {
          font-family: 'Outfit', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        .header {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          padding: 32px;
          text-align: center;
          color: #ffffff;
          border-bottom: 4px solid #f59e0b; /* Amber accent color */
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .header p {
          margin: 8px 0 0 0;
          font-size: 14px;
          color: #94a3b8;
        }
        .content {
          padding: 32px;
        }
        .greeting {
          font-size: 16px;
          color: #334155;
          margin-bottom: 18px;
        }
        .intro {
          font-size: 15px;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 24px;
        }
        .card {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .card-row {
          display: flex;
          margin-bottom: 12px;
          border-bottom: 1px dashed #e2e8f0;
          padding-bottom: 12px;
        }
        .card-row:last-child {
          margin-bottom: 0;
          border-bottom: none;
          padding-bottom: 0;
        }
        .label {
          font-weight: 600;
          color: #475569;
          width: 140px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .val {
          color: #0f172a;
          font-size: 15px;
          flex: 1;
        }
        .btn-wrapper {
          text-align: center;
          margin-top: 32px;
          margin-bottom: 12px;
        }
        .btn {
          display: inline-block;
          background-color: #f59e0b;
          color: #0f172a !important;
          text-decoration: none;
          padding: 12px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 15px;
          transition: all 0.2s ease;
        }
        .footer {
          background-color: #f1f5f9;
          padding: 24px;
          text-align: center;
          font-size: 12px;
          color: #64748b;
          border-top: 1px solid #e2e8f0;
        }
        .footer p {
          margin: 6px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Industrial Radiation Safety</h1>
          <p>Compliance & Safety Management Portal</p>
        </div>
        <div class="content">
          <div class="greeting">Dear <strong>${participant.name}</strong>,</div>
          <div class="intro">
            You have been registered as an attendee for an upcoming RSO Compliance Review Meeting. Please find the scheduled session specifications detailed below:
          </div>
          
          <div class="card">
            <div class="card-row">
              <div class="label">Meeting Title</div>
              <div class="val"><strong>${meeting.title}</strong></div>
            </div>
            <div class="card-row">
              <div class="label">Date</div>
              <div class="val">${dateFormatted}</div>
            </div>
            <div class="card-row">
              <div class="label">Time</div>
              <div class="val">${meeting.timeLabel || "TBD"}</div>
            </div>
            <div class="card-row">
              <div class="label">Venue</div>
              <div class="val">${meeting.venue}</div>
            </div>
            <div class="card-row">
              <div class="label">Chairperson</div>
              <div class="val">${meeting.chairPerson}</div>
            </div>
            ${
              meeting.description
                ? `
            <div class="card-row">
              <div class="label">Agenda Summary</div>
              <div class="val" style="font-style: italic;">${meeting.description}</div>
            </div>
            `
                : ""
            }
          </div>

          <p class="intro" style="font-size: 14px; color: #64748b;">
            TLD Badges, SSR report worksheets, and active survey meter calibration certificates must be accessible during audit reviews.
          </p>

          <div class="btn-wrapper">
            <a href="http://localhost:5173/meetings/${meeting.id}" class="btn">View Meeting in Portal</a>
          </div>
        </div>
        
        <div class="footer">
          <p>This is an automated administrative notification. Please do not reply directly.</p>
          <p>© ${new Date().getFullYear()} Industrial Radiation Safety & Compliance Operations.</p>
        </div>
      </div>
    </body>
  </html>
  `;
};

/**
 * Generate plain text fallback template for meeting notifications
 */
export const generateMeetingCreatedText = (meeting, participant) => {
  return `
Dear ${participant.name},

This is an automated notification from the Industrial Radiation Safety Compliance Management System.

You have been registered as an attendee for the following RSO Safety Meeting:

==================================================
MEETING INFO:
--------------------------------------------------
* Meeting Title: ${meeting.title}
* Date:          ${meeting.date}
* Time:          ${meeting.timeLabel || "TBD"}
* Venue:         ${meeting.venue}
* Chairperson:   ${meeting.chairPerson}
* MOM Description: ${meeting.description || "N/A"}
==================================================

Please prepare and bring along relevant TLD Badges, SSR sheets, and survey meter records.

You can view the full details of this meeting in your dashboard:
http://localhost:5173/meetings/${meeting.id}

Regards,
Radiation Safety Officer (RSO) Portal Admin
  `;
};
