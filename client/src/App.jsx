import { BrowserRouter } from 'react-router-dom'
import { MeetingProvider } from './context/MeetingContext'
import { GaugeProvider } from './context/GaugeContext'
import { SurveyMeterProvider } from './context/SurveyMeterContext'
import { RsoPersonnelProvider } from './context/RsoPersonnelContext'
import { EloraProvider } from './context/EloraContext'
import { EloraMembersProvider } from './context/EloraMembersContext'
import { ReportsProvider } from './context/ReportsContext'
import { TrainingManualsProvider } from './context/TrainingManualsContext'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <MeetingProvider>
        <RsoPersonnelProvider>
          <SurveyMeterProvider>
            <GaugeProvider>
              <EloraProvider>
                <EloraMembersProvider>
                  <ReportsProvider>
                    <TrainingManualsProvider>
                      <AppRoutes />
                    </TrainingManualsProvider>
                  </ReportsProvider>
                </EloraMembersProvider>
              </EloraProvider>
            </GaugeProvider>
          </SurveyMeterProvider>
        </RsoPersonnelProvider>
      </MeetingProvider>
    </BrowserRouter>
  )
}

export default App
