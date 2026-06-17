import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { rsoPersonnelApi } from '../services/rsoPersonnelApi'
import { computeRsoPersonnelKpis, derivePersonnelStatus } from '../utils/rsoPersonnelUtils'

const RsoPersonnelContext = createContext(null)

function normalizePersonnel(record) {
  return {
    ...record,
    status: derivePersonnelStatus(record.validTill),
    certificateName: record.certificateName || '',
  }
}

export function RsoPersonnelProvider({ children }) {
  const [personnel, setPersonnel] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const fetchPersonnel = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await rsoPersonnelApi.getAll()
      setPersonnel(data.map(normalizePersonnel))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPersonnel()
  }, [fetchPersonnel])

  const kpis = useMemo(() => computeRsoPersonnelKpis(personnel), [personnel])

  const addPersonnel = useCallback(async (form) => {
    setSaving(true)
    setError(null)
    try {
      const record = await rsoPersonnelApi.create({
        employeeId: form.employeeId?.trim(),
        name: form.name,
        department: form.department,
        phone: form.phone,
        email: form.email,
        caseFileNumber: form.caseFileNumber,
        documentNumber: form.documentNumber,
        dateOfIssue: form.dateOfIssue,
        validTill: form.validTill,
        status: derivePersonnelStatus(form.validTill),
        certificateName: form.certificateName || null,
      })
      const normalized = normalizePersonnel(record)
      setPersonnel((prev) => [normalized, ...prev])
      return normalized
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const updatePersonnel = useCallback(async (employeeId, form) => {
    setSaving(true)
    setError(null)
    try {
      const record = await rsoPersonnelApi.update(employeeId, {
        name: form.name,
        department: form.department,
        phone: form.phone,
        email: form.email,
        caseFileNumber: form.caseFileNumber,
        documentNumber: form.documentNumber,
        dateOfIssue: form.dateOfIssue,
        validTill: form.validTill,
        status: derivePersonnelStatus(form.validTill),
        certificateName: form.certificateName || null,
      })
      const normalized = normalizePersonnel(record)
      setPersonnel((prev) =>
        prev.map((p) => (p.employeeId === employeeId ? normalized : p)),
      )
      return normalized
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const deletePersonnel = useCallback(async (employeeId) => {
    setSaving(true)
    setError(null)
    try {
      await rsoPersonnelApi.remove(employeeId)
      setPersonnel((prev) => prev.filter((p) => p.employeeId !== employeeId))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const updateCertificateName = useCallback(async (employeeId, certificateName) => {
    setSaving(true)
    setError(null)
    try {
      const record = await rsoPersonnelApi.update(employeeId, {
        certificateName: certificateName || null,
      })
      const normalized = normalizePersonnel(record)
      setPersonnel((prev) =>
        prev.map((p) => (p.employeeId === employeeId ? normalized : p)),
      )
      return normalized
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const value = useMemo(
    () => ({
      personnel,
      kpis,
      loading,
      saving,
      error,
      fetchPersonnel,
      addPersonnel,
      updatePersonnel,
      deletePersonnel,
      updateCertificateName,
    }),
    [
      personnel,
      kpis,
      loading,
      saving,
      error,
      fetchPersonnel,
      addPersonnel,
      updatePersonnel,
      deletePersonnel,
      updateCertificateName,
    ],
  )

  return <RsoPersonnelContext.Provider value={value}>{children}</RsoPersonnelContext.Provider>
}

export function useRsoPersonnel() {
  const ctx = useContext(RsoPersonnelContext)
  if (!ctx) throw new Error('useRsoPersonnel must be used within RsoPersonnelProvider')
  return ctx
}
