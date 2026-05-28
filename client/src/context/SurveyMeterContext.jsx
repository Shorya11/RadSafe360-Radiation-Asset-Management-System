import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { SURVEY_METERS } from '../data/surveyMeters'
import {
  computeSurveyMeterKpis,
  generateSurveyMeterId,
} from '../utils/surveyMeterUtils'

const SurveyMeterContext = createContext(null)

export function SurveyMeterProvider({ children }) {
  const [surveyMeters, setSurveyMeters] = useState(SURVEY_METERS)

  const kpis = useMemo(() => computeSurveyMeterKpis(surveyMeters), [surveyMeters])

  const addSurveyMeter = useCallback((form) => {
    const meter = {
      id: form.id?.trim() || generateSurveyMeterId(surveyMeters),
      surveyMeterName: form.surveyMeterName,
      supplier: form.supplier,
      dateOfProcurement: form.dateOfProcurement,
      make: form.make,
      model: form.model,
      serialNumber: form.serialNumber,
      detectorType: form.detectorType,
      detectorVolume: form.detectorVolume,
      radiationType: form.radiationType,
      functionalStatus: form.functionalStatus,
      calibrationDate: form.calibrationDate,
      calibrationTillDate: form.calibrationTillDate,
      calibrationLab: form.calibrationLab,
    }
    setSurveyMeters((prev) => [meter, ...prev])
    return meter
  }, [surveyMeters])

  const updateSurveyMeter = useCallback((id, form) => {
    setSurveyMeters((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              surveyMeterName: form.surveyMeterName,
              supplier: form.supplier,
              dateOfProcurement: form.dateOfProcurement,
              make: form.make,
              model: form.model,
              serialNumber: form.serialNumber,
              detectorType: form.detectorType,
              detectorVolume: form.detectorVolume,
              radiationType: form.radiationType,
              functionalStatus: form.functionalStatus,
              calibrationDate: form.calibrationDate,
              calibrationTillDate: form.calibrationTillDate,
              calibrationLab: form.calibrationLab,
            }
          : m,
      ),
    )
  }, [])

  const deleteSurveyMeter = useCallback((id) => {
    setSurveyMeters((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      surveyMeters,
      kpis,
      addSurveyMeter,
      updateSurveyMeter,
      deleteSurveyMeter,
    }),
    [surveyMeters, kpis, addSurveyMeter, updateSurveyMeter, deleteSurveyMeter],
  )

  return <SurveyMeterContext.Provider value={value}>{children}</SurveyMeterContext.Provider>
}

export function useSurveyMeters() {
  const ctx = useContext(SurveyMeterContext)
  if (!ctx) throw new Error('useSurveyMeters must be used within SurveyMeterProvider')
  return ctx
}
