import { Routes, Route } from 'react-router-dom'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { Dashboard } from '../pages/Dashboard'
import { Gauges } from '../pages/Gauges'
import { Meetings } from '../pages/Meetings'
import { MeetingDetails } from '../pages/MeetingDetails'
import { Attendance } from '../pages/Attendance'
import { Reports } from '../pages/Reports'
import { SurveyMeterManagement } from '../pages/SurveyMeterManagement'
import { RsoPersonnel } from '../pages/RsoPersonnel'
import { TrainingManuals } from '../pages/TrainingManuals'
import { EloraInformation } from '../pages/EloraInformation'
import { Settings } from '../pages/Settings'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="gauges" element={<Gauges />} />
        <Route path="survey-meters" element={<SurveyMeterManagement />} />
        <Route path="rso-personnel" element={<RsoPersonnel />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="meetings/:meetingId" element={<MeetingDetails />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="reports" element={<Reports />} />
        <Route path="training-manuals" element={<TrainingManuals />} />
        <Route path="elora-information" element={<EloraInformation />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
