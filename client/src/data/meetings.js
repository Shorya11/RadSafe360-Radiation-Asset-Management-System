/** @typedef {'completed' | 'scheduled' | 'cancelled'} MeetingStatus */

/**
 * @typedef {Object} Meeting
 * @property {string} id
 * @property {string} title
 * @property {string} venue
 * @property {string} date
 * @property {string} [timeLabel]
 * @property {string} chairPerson
 * @property {string} [description]
 * @property {MeetingStatus} status
 * @property {string[]} topics
 * @property {string[]} discussionPoints
 * @property {number} participantCount
 * @property {number} presentCount
 * @property {number} absentCount
 * @property {number} leaveCount
 * @property {number} resignedCount
 * @property {number} resignedCount
 * @property {number} attendanceRate
 */

/** @type {Meeting[]} */
export const MEETINGS = [
  {
    id: '2025-05-30',
    title: 'RSO meeting at OHS Conference Hall',
    venue: 'OHS Conference Hall',
    date: '2025-05-30',
    timeLabel: '3:00 PM',
    chairPerson: 'Mr. Lalit Kumar Goyal',
    description:
      'Radiation Safety Officer review — SSR compliance, source disposal, and TLD badge procurement.',
    status: 'completed',
    topics: [
      'Meeting Frequency',
      'SSR report for July-Dec 2024',
      'Disposal of old radioactive sources — SMS-2 & SMS-3',
      'New Cs-137 procurement for SMS-3 Combi caster',
      'TLD badge procurement (Phase 1 & 2)',
      'Radiation safety training for mould operators',
      'Survey meter registration in e-LORA',
    ],
    discussionPoints: [
      'Monthly RSO meetings confirmed; next session planned for June 2025.',
      'SSR Jul-Dec 2024 to be uploaded in e-LORA; departments to email SSR to Simanchal Panda.',
      'Old Co-60 sources: NOC received for export; disposal work orders target 30 Jun 2025.',
      'TLD Phase-1 PO raised for SMS-2; SRs pending for remaining departments.',
      'Training module for radiation safety to be scheduled in June 2025.',
    ],
    participantCount: 15,
    presentCount: 8,
    absentCount: 7,
    leaveCount: 0,
    resignedCount: 0,
    attendanceRate: 53.3,
  },
  {
    id: '2025-10-23',
    title: 'RSO meeting at SMS-3 Conference Room',
    venue: 'SMS-3 Conference Room',
    date: '2025-10-23',
    timeLabel: '5:30 PM - 6:30 PM',
    chairPerson: 'Mr. Lalit Kumar Goyal',
    description:
      'Quarterly RSO sync — new RSO registration, SSR Jan–June 2025, and survey meter e-LORA updates.',
    status: 'completed',
    topics: [
      'Meeting Frequency',
      'SSR report for Jan-June 2025',
      'New RSO registration and license finalization',
      'Survey meter e-LORA compliance',
    ],
    discussionPoints: [
      'SSR Jan-June 2025 submission tracked by OHS representative.',
      'RSO registration paperwork in progress across departments.',
      'Departments to complete survey meter registration after calibration validity checks.',
    ],
    participantCount: 13,
    presentCount: 5,
    absentCount: 8,
    leaveCount: 0,
    resignedCount: 0,
    attendanceRate: 38.5,
  },
  {
    id: '2026-03-17',
    title: 'RSO meeting at SMS-3 Conference Room',
    venue: 'SMS-3 Conference Room',
    date: '2026-03-17',
    timeLabel: '4:00 PM - 5:00 PM',
    chairPerson: 'Mr. Lalit Kumar Goyal',
    description:
      'Mid-quarter safety review — disposal timelines, TLD phase-2 rollout, and training modules.',
    status: 'completed',
    topics: [
      'Meeting Frequency',
      'SSR report for July-Dec 2025',
      'RSO registration follow-up',
      'Open disposal and calibration items',
    ],
    discussionPoints: [
      'Several department RSOs attendance pending confirmation for this session.',
      'SSR Jul-Dec 2025 timeline reviewed with plant representatives.',
      'Mandeep Rajput and Nikhilesh Gawhade assigned follow-up on registration items.',
    ],
    participantCount: 14,
    presentCount: 5,
    absentCount: 1,
    leaveCount: 0,
    resignedCount: 8,
    attendanceRate: 83.3,
  },
  {
    id: '2026-03-23',
    title: 'RSO meeting at SMS-3 Conference Room',
    venue: 'SMS-3 Conference Room',
    date: '2026-03-23',
    timeLabel: '3:00 PM - 5:00 PM',
    chairPerson: 'Mr. Lalit Kumar Goyal',
    description:
      'Follow-up on open MOM items — source disposal WOs, SSR uploads, and departmental survey meters.',
    status: 'completed',
    topics: [
      'Meeting Frequency',
      'SSR report for July-Dec 2025',
      'Survey meter e-LORA registration — BF, Coal Washery, Power Plant',
      'Source disposal work order status',
    ],
    discussionPoints: [
      'Strong attendance from core BF and SMS representatives; some records still unmarked.',
      'e-LORA additions pending until recalibration of BF and Coal Washery meters.',
      'Disposal WOs for legacy sources remain on track for Q2 completion.',
    ],
    participantCount: 13,
    presentCount: 7,
    absentCount: 0,
    leaveCount: 1,
    resignedCount: 5,
    attendanceRate: 87.5,
  },
]
