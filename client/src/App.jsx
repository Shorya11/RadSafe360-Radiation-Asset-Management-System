import { BrowserRouter } from 'react-router-dom'
import { MeetingProvider } from './context/MeetingContext'
import { GaugeProvider } from './context/GaugeContext'
import { SurveyMeterProvider } from './context/SurveyMeterContext'
import { RsoPersonnelProvider } from './context/RsoPersonnelContext'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <MeetingProvider>
        <RsoPersonnelProvider>
          <SurveyMeterProvider>
            <GaugeProvider>
              <AppRoutes />
            </GaugeProvider>
          </SurveyMeterProvider>
        </RsoPersonnelProvider>
      </MeetingProvider>
    </BrowserRouter>
  )
}

export default App
