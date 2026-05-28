/**
 * @param {import('../data/attendance.js').MeetingAttendance[]} records
 */
export function computeAttendanceCounts(records) {
  const counts = {
    present: 0,
    absent: 0,
    leave: 0,
    resigned: 0,
  }

  for (const r of records) {
    counts[r.status] = (counts[r.status] ?? 0) + 1
  }

  const participantCount = records.length

  const recorded =
    counts.present +
    counts.absent +
    counts.leave +
    counts.resigned

  const attendanceRate =
    recorded > 0
      ? Math.round((counts.present / recorded) * 1000) / 10
      : 0

  return {
    participantCount,
    presentCount: counts.present,
    absentCount: counts.absent,
    leaveCount: counts.leave,
    resignedCount: counts.resigned,
    attendanceRate,
  }
}

/**
 * @param {import('../data/meetings.js').Meeting} meeting
 */
export function formatMeetingDate(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * @param {number} rate
 */
export function attendanceRateVariant(rate) {
  if (rate >= 75) return 'success'
  if (rate >= 50) return 'warning'
  return 'danger'
}

/** @type {Record<string, { label: string, variant: string }>} */
export const ATTENDANCE_STATUS_META = {
  present: {
    label: 'Present',
    variant: 'success',
  },

  absent: {
    label: 'Absent',
    variant: 'danger',
  },

  leave: {
    label: 'Leave',
    variant: 'warning',
  },

  resigned: {
    label: 'Resigned',
    variant: 'muted',
  },
}

/**
 * @param {import('../data/meetings.js').Meeting[]} meetings
 */
export function buildAttendanceTrend(meetings) {
  return [...meetings]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((m) => ({
      date: formatMeetingDate(m.date),
      rate: m.attendanceRate,
      present: m.presentCount,
      absent: m.absentCount,
    }))
}

/**
 * @param {import('../data/attendance.js').MeetingAttendance[]} attendance
 */
export function buildDepartmentParticipation(attendance) {
  const stats = {}

  for (const a of attendance) {
    if (a.status === 'resigned' || !a.department) continue

    const key = a.department

    if (!stats[key]) {
      stats[key] = {
        present: 0,
        total: 0,
      }
    }

    stats[key].total += 1

    if (a.status === 'present' || a.status === 'leave') {
      stats[key].present += 1
    }
  }

  return Object.entries(stats)
    .map(([department, { present, total }]) => ({
      department,
      rate: total ? Math.round((present / total) * 100) : 0,
      present,
      total,
    }))
    .sort((a, b) => b.rate - a.rate)
}

/**
 * @param {import('../data/attendance.js').MeetingAttendance[]} attendance
 */
export function buildFrequentAbsentees(attendance) {
  const absentCount = {}

  for (const a of attendance) {
    if (a.status !== 'absent') continue

    const key = a.email || a.name || a.id

    absentCount[key] = (absentCount[key] ?? 0) + 1
  }

  return Object.entries(absentCount)
    .map(([key, count]) => ({
      name:
        attendance.find(
          (a) => (a.email || a.name || a.id) === key,
        )?.name ?? key,

      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}