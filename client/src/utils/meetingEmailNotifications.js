import { formatMeetingDate } from './meetingUtils'

function uniqueEmails(records) {
  const set = new Set()
  for (const r of records ?? []) {
    const email = String(r?.email ?? '').trim().toLowerCase()
    if (email) set.add(email)
  }
  return [...set]
}

/**
 * Nodemailer-friendly payload builder for "meeting created" notifications.
 * This is intentionally simple (subject + text) so backend can plug in any templating later.
 *
 * @param {import('../data/meetings').Meeting} meeting
 * @param {import('../data/attendance').MeetingAttendance[]} participants
 */
export function buildMeetingCreatedEmailPayload(meeting, participants) {
  const to = uniqueEmails(participants)

  const title = meeting?.title ?? 'Meeting'
  const date = meeting?.date ? formatMeetingDate(meeting.date) : '—'
  const time = meeting?.timeLabel ?? '—'
  const venue = meeting?.venue ?? '—'

  const subject = `Meeting Scheduled: ${title}`
  const text = [
    'Dear Participant,',
    '',
    'A meeting has been scheduled.',
    '',
    `Title: ${title}`,
    `Date: ${date}`,
    `Time: ${time}`,
    `Venue: ${venue}`,
    '',
    'Regards,',
    'Meeting Management System',
  ].join('\n')

  return {
    to,
    subject,
    text,
    meta: {
      meetingId: meeting?.id,
      title,
      dateRaw: meeting?.date ?? null,
      timeLabel: meeting?.timeLabel ?? null,
      venue,
    },
  }
}

