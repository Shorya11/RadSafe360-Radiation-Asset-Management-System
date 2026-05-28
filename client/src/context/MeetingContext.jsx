import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { MEETINGS } from '../data/meetings'
import { ATTENDANCE, createAttendanceRecord } from '../data/attendance'
import { ACTION_ITEMS } from '../data/actionItems'
import { computeAttendanceCounts, buildAttendanceTrend, buildDepartmentParticipation, buildFrequentAbsentees } from '../utils/meetingUtils'
import { buildMeetingCreatedEmailPayload } from '../utils/meetingEmailNotifications'

const MeetingContext = createContext(null)

function syncMeetingCounts(meeting, attendanceRecords) {
  const counts = computeAttendanceCounts(attendanceRecords)
  return { ...meeting, ...counts }
}

function normalizeStringList(value) {
  return (value ?? [])
    .map((item) => String(item ?? '').trim())
    .filter(Boolean)
}

export function MeetingProvider({ children }) {
  const [meetings, setMeetings] = useState(MEETINGS)
  const [attendance, setAttendance] = useState(ATTENDANCE)
  const [actionItems, setActionItems] = useState(ACTION_ITEMS)

  const getMeetingById = useCallback(
    (id) => meetings.find((m) => m.id === id),
    [meetings],
  )

  const getAttendanceForMeeting = useCallback(
    (meetingId) => attendance.filter((a) => a.meetingId === meetingId),
    [attendance],
  )

  const getActionItemsForMeeting = useCallback(
    (meetingId) =>
      actionItems
        .filter((i) => i.meetingId === meetingId)
        .sort((a, b) => a.serialNo - b.serialNo),
    [actionItems],
  )

  const prepareMeetingCreatedEmail = useCallback(
    (meetingId) => {
      const meeting = getMeetingById(meetingId)
      if (!meeting) return null
      const participants = getAttendanceForMeeting(meetingId)
      return buildMeetingCreatedEmailPayload(meeting, participants)
    },
    [getMeetingById, getAttendanceForMeeting],
  )

  const getMeetingDetails = useCallback(
    (meetingId) => {
      const meeting = getMeetingById(meetingId)
      if (!meeting) return null

      return {
        meeting,
        attendance: getAttendanceForMeeting(meetingId),
        actionItems: getActionItemsForMeeting(meetingId),
      }
    },
    [getMeetingById, getAttendanceForMeeting, getActionItemsForMeeting],
  )

  const syncMeetingFromAttendance = useCallback((meetingId, records) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === meetingId ? syncMeetingCounts(m, records) : m)),
    )
  }, [])

  const updateMeeting = useCallback((meetingId, patch) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === meetingId ? { ...m, ...patch } : m)),
    )
  }, [])

  const updateMeetingTopics = useCallback((meetingId, nextTopics) => {
    updateMeeting(meetingId, { topics: normalizeStringList(nextTopics) })
  }, [updateMeeting])

  const updateMeetingDiscussionPoints = useCallback((meetingId, nextPoints) => {
    updateMeeting(meetingId, { discussionPoints: normalizeStringList(nextPoints) })
  }, [updateMeeting])

  const updateMeetingSummary = useCallback((meetingId, description) => {
    updateMeeting(meetingId, { description: description ?? '' })
  }, [updateMeeting])

  const updateAttendanceStatus = useCallback((attendanceId, status) => {
    setAttendance((prev) => {
      const next = prev.map((a) => (a.id === attendanceId ? { ...a, status } : a))
      const changed = next.find((a) => a.id === attendanceId)
      if (changed) syncMeetingFromAttendance(changed.meetingId, next.filter((a) => a.meetingId === changed.meetingId))
      return next
    })
  }, [syncMeetingFromAttendance])

  const addActionItem = useCallback((meetingId, payload) => {
    const id = `mom-${meetingId}-${Date.now()}`
    setActionItems((prev) => {
      const existing = prev.filter((i) => i.meetingId === meetingId)
      const nextSerialNo = (existing.reduce((max, i) => Math.max(max, i.serialNo ?? 0), 0) || 0) + 1
      const item = {
        id,
        meetingId,
        serialNo: nextSerialNo,
        task: payload.task ?? '',
        assignedTo: payload.assignedTo ?? '',
        dueDate: payload.dueDate ?? '',
        status: payload.status ?? 'Pending',
      }
      return [...prev, item]
    })
    return id
  }, [])

  const updateActionItem = useCallback((actionItemId, patch) => {
    setActionItems((prev) =>
      prev.map((i) => (i.id === actionItemId ? { ...i, ...patch } : i)),
    )
  }, [])

  const deleteActionItem = useCallback((actionItemId) => {
    setActionItems((prev) => prev.filter((i) => i.id !== actionItemId))
  }, [])

  const addParticipant = useCallback(
    (meetingId, participant) => {
      const record = createAttendanceRecord(meetingId, participant)
      setAttendance((prev) => {
        const next = [...prev, record]
        syncMeetingFromAttendance(meetingId, next.filter((a) => a.meetingId === meetingId))
        return next
      })
      return record
    },
    [syncMeetingFromAttendance],
  )

  const removeParticipant = useCallback(
    (attendanceId) => {
      setAttendance((prev) => {
        const removed = prev.find((a) => a.id === attendanceId)
        const next = prev.filter((a) => a.id !== attendanceId)
        if (removed) {
          syncMeetingFromAttendance(
            removed.meetingId,
            next.filter((a) => a.meetingId === removed.meetingId),
          )
        }
        return next
      })
    },
    [syncMeetingFromAttendance],
  )

  const addMeeting = useCallback(
    (form) => {
      const id = form.date
      const topics = (form.topics ?? []).map((t) => t.trim()).filter(Boolean)
      const discussionPoints = (form.discussionPoints ?? [])
        .map((point) => point.trim())
        .filter(Boolean)
      const participantRecords = (form.participants ?? []).map((p) =>
        createAttendanceRecord(id, p),
      )
      const counts = computeAttendanceCounts(participantRecords)
      const newActionItems = (form.actionActivities ?? [])
        .map((activity, index) => ({
          id: `mom-${id}-${index + 1}`,
          meetingId: id,
          serialNo: index + 1,
          task: activity.task,
          assignedTo: activity.assignedTo,
          dueDate: activity.dueDate,
          status: activity.status,
        }))
        .filter((item) => item.task && item.assignedTo)

      const newMeeting = {
        id,
        title: form.title,
        venue: form.venue,
        date: form.date,
        timeLabel: form.time,
        chairPerson: form.chairPerson,
        description: form.description ?? '',
        status: 'scheduled',
        topics,
        discussionPoints,
        ...counts,
      }

      setAttendance((prev) => [...prev, ...participantRecords])
      setActionItems((prev) => [...newActionItems, ...prev])
      setMeetings((prev) => [newMeeting, ...prev])
      return newMeeting
    },
    [],
  )

  const analytics = useMemo(() => {
    const totalMeetings = meetings.length
    const avgAttendance =
      totalMeetings > 0
        ? Math.round(
            (meetings.reduce((s, m) => s + m.attendanceRate, 0) / totalMeetings) * 10,
          ) / 10
        : 0

    const deptStats = buildDepartmentParticipation(attendance)
    const mostActiveDept = deptStats[0]?.department ?? '—'
    const frequentAbsentees = buildFrequentAbsentees(attendance)
    const trend = buildAttendanceTrend(meetings)
    const comparison = meetings.map((m) => ({
      name: m.date.slice(5),
      rate: m.attendanceRate,
      present: m.presentCount,
      absent: m.absentCount,
    }))

    return {
      totalMeetings,
      avgAttendance,
      mostActiveDept,
      frequentAbsentees,
      trend,
      comparison,
      departmentParticipation: deptStats,
    }
  }, [meetings, attendance])

  const value = useMemo(
    () => ({
      meetings,
      attendance,
      actionItems,
      analytics,
      getMeetingById,
      getMeetingDetails,
      getAttendanceForMeeting,
      getActionItemsForMeeting,
      prepareMeetingCreatedEmail,
      updateMeeting,
      updateMeetingTopics,
      updateMeetingDiscussionPoints,
      updateMeetingSummary,
      updateAttendanceStatus,
      addMeeting,
      addParticipant,
      removeParticipant,
      addActionItem,
      updateActionItem,
      deleteActionItem,
    }),
    [
      meetings,
      attendance,
      actionItems,
      analytics,
      getMeetingById,
      getMeetingDetails,
      getAttendanceForMeeting,
      getActionItemsForMeeting,
      prepareMeetingCreatedEmail,
      updateMeeting,
      updateMeetingTopics,
      updateMeetingDiscussionPoints,
      updateMeetingSummary,
      updateAttendanceStatus,
      addMeeting,
      addParticipant,
      removeParticipant,
      addActionItem,
      updateActionItem,
      deleteActionItem,
    ],
  )

  return (
    <MeetingContext.Provider value={value}>{children}</MeetingContext.Provider>
  )
}

export function useMeetings() {
  const ctx = useContext(MeetingContext)
  if (!ctx) throw new Error('useMeetings must be used within MeetingProvider')
  return ctx
}
