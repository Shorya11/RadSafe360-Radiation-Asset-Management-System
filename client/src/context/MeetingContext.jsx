import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { meetingsApi } from '../services/meetingsApi'
import { attendanceApi } from '../services/attendanceApi'
import {
  computeAttendanceCounts,
  buildAttendanceTrend,
  buildDepartmentParticipation,
  buildFrequentAbsentees,
} from '../utils/meetingUtils'
import { buildMeetingCreatedEmailPayload } from '../utils/meetingEmailNotifications'

const MeetingContext = createContext(null)

function normalizeStringList(value) {
  return (value ?? [])
    .map((item) => String(item ?? '').trim())
    .filter(Boolean)
}

function mergeMeetingDetails(meeting, attendanceRecords) {
  const counts = computeAttendanceCounts(attendanceRecords)
  return { ...meeting, ...counts }
}

export function MeetingProvider({ children }) {
  const [meetings, setMeetings] = useState([])
  const [attendance, setAttendance] = useState([])
  const [actionItems, setActionItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [loadedMeetingIds, setLoadedMeetingIds] = useState(() => new Set())

  const fetchMeetings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await meetingsApi.getAll()
      setMeetings(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMeetings()
  }, [fetchMeetings])

  const applyMeetingDetails = useCallback((meetingId, payload) => {
    const { meeting, attendance: att, actionItems: items } = payload
    setMeetings((prev) => prev.map((m) => (m.id === meetingId ? meeting : m)))
    setAttendance((prev) => [...prev.filter((a) => a.meetingId !== meetingId), ...att])
    setActionItems((prev) => [...prev.filter((i) => i.meetingId !== meetingId), ...items])
    setLoadedMeetingIds((prev) => new Set(prev).add(meetingId))
  }, [])

  const loadMeetingDetails = useCallback(
    async (meetingId, { force = false } = {}) => {
      if (!meetingId) return null
      if (!force && loadedMeetingIds.has(meetingId)) {
        return null
      }

      setDetailsLoading(true)
      setError(null)
      try {
        const payload = await meetingsApi.getById(meetingId)
        applyMeetingDetails(meetingId, payload)
        return payload
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setDetailsLoading(false)
      }
    },
    [applyMeetingDetails, loadedMeetingIds],
  )

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

  const prepareMeetingCreatedEmail = useCallback(
    (meetingId) => {
      const meeting = getMeetingById(meetingId)
      if (!meeting) return null
      const participants = getAttendanceForMeeting(meetingId)
      return buildMeetingCreatedEmailPayload(meeting, participants)
    },
    [getMeetingById, getAttendanceForMeeting],
  )

  const syncMeetingFromAttendance = useCallback((meetingId, records) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === meetingId ? mergeMeetingDetails(m, records) : m)),
    )
  }, [])

  const updateMeeting = useCallback(
    async (meetingId, patch) => {
      setSaving(true)
      setError(null)
      try {
        const updated = await meetingsApi.update(meetingId, {
          title: patch.title,
          date: patch.date,
          timeLabel: patch.timeLabel,
          venue: patch.venue,
          chairPerson: patch.chairPerson,
          description: patch.description,
          status: patch.status,
        })
        setMeetings((prev) =>
          prev.map((m) =>
            m.id === meetingId
              ? mergeMeetingDetails({ ...m, ...updated }, getAttendanceForMeeting(meetingId))
              : m,
          ),
        )
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setSaving(false)
      }
    },
    [getAttendanceForMeeting],
  )

  const updateMeetingTopics = useCallback((meetingId, nextTopics) => {
    const topics = normalizeStringList(nextTopics)
    setMeetings((prev) => prev.map((m) => (m.id === meetingId ? { ...m, topics } : m)))
  }, [])

  const updateMeetingDiscussionPoints = useCallback((meetingId, nextPoints) => {
    const discussionPoints = normalizeStringList(nextPoints)
    setMeetings((prev) =>
      prev.map((m) => (m.id === meetingId ? { ...m, discussionPoints } : m)),
    )
  }, [])

  const updateMeetingSummary = useCallback(
    (meetingId, description) => {
      updateMeeting(meetingId, { description: description ?? '' }).catch(() => {})
    },
    [updateMeeting],
  )

  const updateAttendanceStatus = useCallback(
    async (attendanceId, status) => {
      setSaving(true)
      setError(null)
      try {
        await attendanceApi.updateStatus(attendanceId, status)
        const changed = attendance.find((a) => a.id === attendanceId)
        setAttendance((prev) => {
          const next = prev.map((a) => (a.id === attendanceId ? { ...a, status } : a))
          if (changed) {
            syncMeetingFromAttendance(
              changed.meetingId,
              next.filter((a) => a.meetingId === changed.meetingId),
            )
          }
          return next
        })
        if (changed) {
          await loadMeetingDetails(changed.meetingId, { force: true })
        }
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setSaving(false)
      }
    },
    [attendance, syncMeetingFromAttendance, loadMeetingDetails],
  )

  const addActionItem = useCallback(
    async (meetingId, payload) => {
      setSaving(true)
      setError(null)
      try {
        const item = await meetingsApi.addActionItem(meetingId, {
          task: payload.task ?? '',
          assignedTo: payload.assignedTo ?? '',
          dueDate: payload.dueDate ?? '',
          status: payload.status ?? 'Pending',
        })
        setActionItems((prev) => [...prev, item])
        return item.id
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setSaving(false)
      }
    },
    [],
  )

  const updateActionItem = useCallback(async (actionItemId, patch) => {
    setSaving(true)
    setError(null)
    try {
      const updated = await meetingsApi.updateActionItem(actionItemId, patch)
      setActionItems((prev) => prev.map((i) => (i.id === actionItemId ? updated : i)))
      return updated
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const deleteActionItem = useCallback(async (actionItemId) => {
    setSaving(true)
    setError(null)
    try {
      await meetingsApi.deleteActionItem(actionItemId)
      setActionItems((prev) => prev.filter((i) => i.id !== actionItemId))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const addParticipant = useCallback(
    async (meetingId, participant) => {
      setSaving(true)
      setError(null)
      try {
        const record = await meetingsApi.addParticipant(meetingId, {
          personnelId: participant.personnelId || null,
          participantSource: participant.participantSource || 'external',
          name: participant.name,
          department: participant.department,
          designation: participant.designation || 'Guest',
          phoneNumber: participant.phoneNumber || '',
          email: participant.email || '',
          group: participant.group || 'certified_rso',
          status: participant.status ?? 'present',
        })
        setAttendance((prev) => {
          const next = [...prev, record]
          syncMeetingFromAttendance(meetingId, next.filter((a) => a.meetingId === meetingId))
          return next
        })
        await loadMeetingDetails(meetingId, { force: true })
        return record
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setSaving(false)
      }
    },
    [syncMeetingFromAttendance, loadMeetingDetails],
  )

  const removeParticipant = useCallback(
    async (attendanceId) => {
      setSaving(true)
      setError(null)
      try {
        const removed = attendance.find((a) => a.id === attendanceId)
        await meetingsApi.removeParticipant(attendanceId)
        setAttendance((prev) => {
          const next = prev.filter((a) => a.id !== attendanceId)
          if (removed) {
            syncMeetingFromAttendance(
              removed.meetingId,
              next.filter((a) => a.meetingId === removed.meetingId),
            )
          }
          return next
        })
        if (removed) {
          await loadMeetingDetails(removed.meetingId, { force: true })
        }
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setSaving(false)
      }
    },
    [attendance, syncMeetingFromAttendance, loadMeetingDetails],
  )

  const addMeeting = useCallback(
    async (form) => {
      setSaving(true)
      setError(null)
      try {
        const meetingId = form.date
        await meetingsApi.create({
          id: meetingId,
          title: form.title,
          venue: form.venue,
          date: form.date,
          time: form.time,
          chairPerson: form.chairPerson,
          description: form.description ?? '',
          topics: (form.topics ?? []).map((t) => t.trim()).filter(Boolean),
          discussionPoints: (form.discussionPoints ?? [])
            .map((point) => point.trim())
            .filter(Boolean),
          participants: (form.participants ?? []).filter(
            (p) => p.name?.trim() && p.department?.trim(),
          ),
          actionActivities: (form.actionActivities ?? []).filter(
            (a) => a.task?.trim() && a.assignedTo?.trim(),
          ),
        })
        await fetchMeetings()
        const payload = await meetingsApi.getById(meetingId)
        applyMeetingDetails(meetingId, payload)
        return payload.meeting
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setSaving(false)
      }
    },
    [fetchMeetings, applyMeetingDetails],
  )

  const analytics = useMemo(() => {
    const totalMeetings = meetings.length
    const avgAttendance =
      totalMeetings > 0
        ? Math.round(
            (meetings.reduce((s, m) => s + (m.attendanceRate ?? 0), 0) / totalMeetings) * 10,
          ) / 10
        : 0

    const deptStats = buildDepartmentParticipation(attendance)
    const mostActiveDept = deptStats[0]?.department ?? '—'
    const frequentAbsentees = buildFrequentAbsentees(attendance)
    const trend = buildAttendanceTrend(meetings)
    const comparison = meetings.map((m) => ({
      name: m.date.slice(5),
      rate: m.attendanceRate ?? 0,
      present: m.presentCount ?? 0,
      absent: m.absentCount ?? 0,
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
      loading,
      detailsLoading,
      saving,
      error,
      fetchMeetings,
      loadMeetingDetails,
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
      loading,
      detailsLoading,
      saving,
      error,
      fetchMeetings,
      loadMeetingDetails,
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

  return <MeetingContext.Provider value={value}>{children}</MeetingContext.Provider>
}

export function useMeetings() {
  const ctx = useContext(MeetingContext)
  if (!ctx) throw new Error('useMeetings must be used within MeetingProvider')
  return ctx
}
