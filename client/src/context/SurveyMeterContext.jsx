import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { surveyMetersApi } from '../services/surveyMetersApi'
import { computeSurveyMeterKpis } from '../utils/surveyMeterUtils'

const SurveyMeterContext = createContext(null)

export function SurveyMeterProvider({ children }) {
  const [surveyMeters, setSurveyMeters] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const fetchSurveyMeters = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await surveyMetersApi.getAll()
      setSurveyMeters(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSurveyMeters()
  }, [fetchSurveyMeters])

  const kpis = useMemo(() => computeSurveyMeterKpis(surveyMeters), [surveyMeters])

  const addSurveyMeter = useCallback(async (form) => {
    setSaving(true)
    setError(null)
    try {
      const meter = await surveyMetersApi.create({
        id: form.id?.trim() || undefined,
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
      })
      setSurveyMeters((prev) => [meter, ...prev])
      return meter
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const updateSurveyMeter = useCallback(async (id, form) => {
    setSaving(true)
    setError(null)
    try {
      const updated = await surveyMetersApi.update(id, {
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
      })
      setSurveyMeters((prev) => prev.map((m) => (m.id === id ? updated : m)))
      return updated
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const deleteSurveyMeter = useCallback(async (id) => {
    setSaving(true)
    setError(null)
    try {
      await surveyMetersApi.remove(id)
      setSurveyMeters((prev) => prev.filter((m) => m.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const uploadSurveyMeterDocument = useCallback(async (id, file) => {
    setSaving(true)
    setError(null)
    try {
      const document = await surveyMetersApi.uploadDocument(id, file)
      setSurveyMeters((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, documents: [document, ...(m.documents || [])] } : m,
        ),
      )
      return document
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const value = useMemo(
    () => ({
      surveyMeters,
      kpis,
      loading,
      saving,
      error,
      fetchSurveyMeters,
      addSurveyMeter,
      updateSurveyMeter,
      deleteSurveyMeter,
      uploadSurveyMeterDocument,
    }),
    [
      surveyMeters,
      kpis,
      loading,
      saving,
      error,
      fetchSurveyMeters,
      addSurveyMeter,
      updateSurveyMeter,
      deleteSurveyMeter,
      uploadSurveyMeterDocument,
    ],
  )

  return <SurveyMeterContext.Provider value={value}>{children}</SurveyMeterContext.Provider>
}

export function useSurveyMeters() {
  const ctx = useContext(SurveyMeterContext)
  if (!ctx) throw new Error('useSurveyMeters must be used within SurveyMeterProvider')
  return ctx
}
