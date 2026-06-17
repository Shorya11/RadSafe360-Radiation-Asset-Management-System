import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { gaugesApi } from '../services/gaugesApi'
import {
  computeGaugeKpis,
  buildPlantDistribution,
  buildStatusDistribution,
} from '../utils/gaugeUtils'

const GaugeContext = createContext(null)

export function GaugeProvider({ children }) {
  const [gauges, setGauges] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const fetchGauges = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await gaugesApi.getAll()
      setGauges(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGauges()
  }, [fetchGauges])

  const kpis = useMemo(() => computeGaugeKpis(gauges), [gauges])
  const plantDistribution = useMemo(() => buildPlantDistribution(gauges), [gauges])
  const statusDistribution = useMemo(() => buildStatusDistribution(gauges), [gauges])

  const getGaugeById = useCallback((id) => gauges.find((g) => g.id === id), [gauges])

  const addGauge = useCallback(async (form) => {
    setSaving(true)
    setError(null)
    try {
      const gauge = await gaugesApi.create({
        id: form.id?.trim() || undefined,
        serialNumber: form.serialNumber,
        make: form.make,
        model: form.model,
        source: form.source,
        quantity: Number(form.quantity) || 1,
        activity: form.activity,
        purchaseDate: form.purchaseDate,
        installDate: form.installDate || null,
        sourceTestDate: form.sourceTestDate,
        location: form.location,
        plant: form.plant,
        lifecycleYears: String(form.lifecycleYears),
        nocNumber: form.nocNumber,
        contactPerson: form.contactPerson,
        calibrationDueDate: form.calibrationDueDate,
        status: form.status,
      })
      setGauges((prev) => [gauge, ...prev])
      return gauge
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const updateGauge = useCallback(async (id, form) => {
    setSaving(true)
    setError(null)
    try {
      const updated = await gaugesApi.update(id, {
        serialNumber: form.serialNumber,
        make: form.make,
        model: form.model,
        source: form.source,
        quantity: Number(form.quantity) || 1,
        activity: form.activity,
        purchaseDate: form.purchaseDate,
        installDate: form.installDate || null,
        sourceTestDate: form.sourceTestDate,
        location: form.location,
        plant: form.plant,
        lifecycleYears: String(form.lifecycleYears),
        nocNumber: form.nocNumber,
        contactPerson: form.contactPerson,
        calibrationDueDate: form.calibrationDueDate,
        status: form.status,
      })
      setGauges((prev) => prev.map((g) => (g.id === id ? updated : g)))
      return updated
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const deleteGauge = useCallback(async (id) => {
    setSaving(true)
    setError(null)
    try {
      await gaugesApi.remove(id)
      setGauges((prev) => prev.filter((g) => g.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const uploadGaugeDocument = useCallback(async (id, file) => {
    setSaving(true)
    setError(null)
    try {
      const document = await gaugesApi.uploadDocument(id, file)
      setGauges((prev) =>
        prev.map((g) =>
          g.id === id ? { ...g, documents: [document, ...(g.documents || [])] } : g,
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
      gauges,
      kpis,
      plantDistribution,
      statusDistribution,
      loading,
      saving,
      error,
      fetchGauges,
      getGaugeById,
      addGauge,
      updateGauge,
      deleteGauge,
      uploadGaugeDocument,
    }),
    [
      gauges,
      kpis,
      plantDistribution,
      statusDistribution,
      loading,
      saving,
      error,
      fetchGauges,
      getGaugeById,
      addGauge,
      updateGauge,
      deleteGauge,
      uploadGaugeDocument,
    ],
  )

  return <GaugeContext.Provider value={value}>{children}</GaugeContext.Provider>
}

export function useGauges() {
  const ctx = useContext(GaugeContext)
  if (!ctx) throw new Error('useGauges must be used within GaugeProvider')
  return ctx
}
