import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { GAUGES } from '../data/gauges'
import {
  computeGaugeKpis,
  buildPlantDistribution,
  buildStatusDistribution,
  generateGaugeId,
} from '../utils/gaugeUtils'

const GaugeContext = createContext(null)

export function GaugeProvider({ children }) {
  const [gauges, setGauges] = useState(GAUGES)

  const kpis = useMemo(() => computeGaugeKpis(gauges), [gauges])
  const plantDistribution = useMemo(() => buildPlantDistribution(gauges), [gauges])
  const statusDistribution = useMemo(() => buildStatusDistribution(gauges), [gauges])

  const getGaugeById = useCallback(
    (id) => gauges.find((g) => g.id === id),
    [gauges],
  )

  const addGauge = useCallback((form) => {
    const gauge = {
      id: form.id?.trim() || generateGaugeId(gauges),
      serialNumber: form.serialNumber,
      make: form.make,
      model: form.model,
      source: form.source,
      quantity: Number(form.quantity) || 0,
      activity: form.activity,
      purchaseDate: form.purchaseDate,
      installDate: form.installDate,
      location: form.location,
      plant: form.plant,
      life: form.life,
      nocNumber: form.nocNumber,
      contactPerson: form.contactPerson,
      calibrationDueDate: form.calibrationDueDate,
      status: form.status,
    }
    setGauges((prev) => [gauge, ...prev])
    return gauge
  }, [gauges])

  const updateGauge = useCallback((id, form) => {
    setGauges((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              serialNumber: form.serialNumber,
              make: form.make,
              model: form.model,
              source: form.source,
              quantity: Number(form.quantity) || 0,
              activity: form.activity,
              purchaseDate: form.purchaseDate,
              installDate: form.installDate,
              location: form.location,
              plant: form.plant,
              life: form.life,
              nocNumber: form.nocNumber,
              contactPerson: form.contactPerson,
              calibrationDueDate: form.calibrationDueDate,
              status: form.status,
            }
          : g,
      ),
    )
  }, [])

  const deleteGauge = useCallback((id) => {
    setGauges((prev) => prev.filter((g) => g.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      gauges,
      kpis,
      plantDistribution,
      statusDistribution,
      getGaugeById,
      addGauge,
      updateGauge,
      deleteGauge,
    }),
    [
      gauges,
      kpis,
      plantDistribution,
      statusDistribution,
      getGaugeById,
      addGauge,
      updateGauge,
      deleteGauge,
    ],
  )

  return <GaugeContext.Provider value={value}>{children}</GaugeContext.Provider>
}

export function useGauges() {
  const ctx = useContext(GaugeContext)
  if (!ctx) throw new Error('useGauges must be used within GaugeProvider')
  return ctx
}
