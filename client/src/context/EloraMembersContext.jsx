import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { eloraMembersApi } from '../services/eloraMembersApi'

const EloraMembersContext = createContext(null)

export function EloraMembersProvider({ children }) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await eloraMembersApi.getAll()
      setMembers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const addMember = useCallback(async (form) => {
    setSaving(true)
    setError(null)
    try {
      const created = await eloraMembersApi.create(form)
      setMembers((prev) => [created, ...prev])
      return created
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const updateMember = useCallback(async (id, form) => {
    setSaving(true)
    setError(null)
    try {
      const updated = await eloraMembersApi.update(id, form)
      setMembers((prev) => prev.map((item) => (item.id === id ? updated : item)))
      return updated
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const deleteMember = useCallback(async (id) => {
    setSaving(true)
    setError(null)
    try {
      await eloraMembersApi.remove(id)
      setMembers((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const value = useMemo(
    () => ({
      members,
      loading,
      saving,
      error,
      fetchMembers,
      addMember,
      updateMember,
      deleteMember,
    }),
    [members, loading, saving, error, fetchMembers, addMember, updateMember, deleteMember],
  )

  return <EloraMembersContext.Provider value={value}>{children}</EloraMembersContext.Provider>
}

export function useEloraMembers() {
  const ctx = useContext(EloraMembersContext)
  if (!ctx) throw new Error('useEloraMembers must be used within EloraMembersProvider')
  return ctx
}
