import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { RSO_PERSONNEL } from '../data/rsoPersonnel'
import { computeRsoPersonnelKpis, derivePersonnelStatus } from '../utils/rsoPersonnelUtils'

const RsoPersonnelContext = createContext(null)

function normalizePersonnel(record) {
  return {
    ...record,
    status: derivePersonnelStatus(record.validTill),
  }
}

export function RsoPersonnelProvider({ children }) {
  const [personnel, setPersonnel] = useState(RSO_PERSONNEL.map(normalizePersonnel))

  const kpis = useMemo(() => computeRsoPersonnelKpis(personnel), [personnel])

  const addPersonnel = useCallback((form) => {
    const record = normalizePersonnel({
      employeeId: form.employeeId?.trim(),
      name: form.name,
      department: form.department,
      phone: form.phone,
      email: form.email,
      caseFileNumber: form.caseFileNumber,
      documentNumber: form.documentNumber,
      dateOfIssue: form.dateOfIssue,
      validTill: form.validTill,
      status: 'Valid',
      certificateName: form.certificateName || '',
    })
    setPersonnel((prev) => [record, ...prev])
    return record
  }, [])

  const updatePersonnel = useCallback((employeeId, form) => {
    setPersonnel((prev) =>
      prev.map((p) =>
        p.employeeId === employeeId
          ? normalizePersonnel({
              ...p,
              name: form.name,
              department: form.department,
              phone: form.phone,
              email: form.email,
              caseFileNumber: form.caseFileNumber,
              documentNumber: form.documentNumber,
              dateOfIssue: form.dateOfIssue,
              validTill: form.validTill,
              certificateName: form.certificateName || '',
            })
          : p,
      ),
    )
  }, [])

  const deletePersonnel = useCallback((employeeId) => {
    setPersonnel((prev) => prev.filter((p) => p.employeeId !== employeeId))
  }, [])

  const updateCertificateName = useCallback((employeeId, certificateName) => {
    setPersonnel((prev) =>
      prev.map((p) =>
        p.employeeId === employeeId
          ? {
              ...p,
              certificateName: certificateName || p.certificateName,
            }
          : p,
      ),
    )
  }, [])

  const value = useMemo(
    () => ({
      personnel,
      kpis,
      addPersonnel,
      updatePersonnel,
      deletePersonnel,
      updateCertificateName,
    }),
    [personnel, kpis, addPersonnel, updatePersonnel, deletePersonnel, updateCertificateName],
  )

  return <RsoPersonnelContext.Provider value={value}>{children}</RsoPersonnelContext.Provider>
}

export function useRsoPersonnel() {
  const ctx = useContext(RsoPersonnelContext)
  if (!ctx) throw new Error('useRsoPersonnel must be used within RsoPersonnelProvider')
  return ctx
}
