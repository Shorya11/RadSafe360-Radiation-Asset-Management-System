import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { DEFAULT_ELORA_INFORMATION } from '../data/elora'

const EloraContext = createContext(null)

export function EloraProvider({ children }) {
  const [information, setInformation] = useState(DEFAULT_ELORA_INFORMATION)

  const updateInformation = useCallback((form) => {
    setInformation({
      loginId: form.loginId?.trim() || DEFAULT_ELORA_INFORMATION.loginId,
      password: form.password ?? '',
      institute: form.institute?.trim() || '',
      role: form.role?.trim() || '',
      installationType: form.installationType?.trim() || '',
      portalUrl: form.portalUrl?.trim() || '',
    })
  }, [])

  const value = useMemo(
    () => ({
      information,
      updateInformation,
    }),
    [information, updateInformation],
  )

  return <EloraContext.Provider value={value}>{children}</EloraContext.Provider>
}

export function useElora() {
  const ctx = useContext(EloraContext)
  if (!ctx) throw new Error('useElora must be used within EloraProvider')
  return ctx
}
