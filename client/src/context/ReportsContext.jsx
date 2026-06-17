import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { REPORTS } from '../data/reports'
import { generateReportId } from '../utils/reportUtils'
import { useEffect } from 'react'
import { reportsApi } from '../services/reportsApi'

const ReportsContext = createContext(null)

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState([])

  const loadReports = useCallback(async () => {
    try {
      const response = await reportsApi.getAll()
      setReports(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    loadReports()
  }, [loadReports])

  const addReport = useCallback(async (form) => {
  try {
    const formData = new FormData()

    formData.append('department', form.department)
    formData.append('contactName', form.contactName)
    formData.append('reportType', form.reportType)

    if (form.file) {
      formData.append('file', form.file)
    }

    const response = await reportsApi.create(formData)

    setReports((prev) => [
      response.data.data,
      ...prev,
    ])
  } catch (error) {
    console.error(error)
  }
}, [])
  const updateReport = useCallback(() => { }, [])

  const deleteReport = useCallback(async (id) => {
    try {
      await reportsApi.delete(id)

      setReports((prev) =>
        prev.filter((report) => report.id !== id)
      )
    } catch (error) {
      console.error(error)
    }
  }, [])
  const value = useMemo(
    () => ({
      reports,
      addReport,
      updateReport,
      deleteReport,
    }),
    [reports, addReport, updateReport, deleteReport],
  )

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>
}

export function useReports() {
  const ctx = useContext(ReportsContext)
  if (!ctx) throw new Error('useReports must be used within ReportsProvider')
  return ctx
}
