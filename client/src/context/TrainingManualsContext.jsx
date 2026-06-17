import { createContext, useCallback, useContext, useMemo, useState } from 'react'

import { useEffect } from 'react'
import { trainingManualsApi } from '../services/trainingManualsApi'

const TrainingManualsContext = createContext(null)

export function TrainingManualsProvider({ children }) {
  const [manuals, setManuals] = useState([])
  const loadManuals = useCallback(async () => {
    try {
      const response = await trainingManualsApi.getAll()

      setManuals(
        response.data.data.map((m) => ({
          ...m,
          fileDataUrl: m.filePath
            ? `http://localhost:5000/${m.filePath.replace(/\\/g, '/')}`
            : '',
        }))
      )
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    loadManuals()
  }, [loadManuals])

  const addManual = useCallback(async (form) => {
    try {
      console.log('FORM RECEIVED:', form)
      console.log('FILE RECEIVED:', form.file)
      const formData = new FormData()

      formData.append('manualName', form.manualName)
      formData.append('category', form.category)

      if (form.file) {
        formData.append('file', form.file)
      }

      const response = await trainingManualsApi.create(formData)

      setManuals((prev) => [
        {
          ...response.data.data,
          fileDataUrl: response.data.data.filePath
            ? `http://localhost:5000/${response.data.data.filePath.replace(/\\/g, '/')}`
            : '',
        },
        ...prev,
      ])
    } catch (error) {
      console.error(error)
    }
  }, [])

  const updateManual = useCallback((id, form) => {
    setManuals((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
            ...m,
            manualName: form.manualName,
            category: form.category,
            fileName: form.fileName ?? m.fileName,
            fileMimeType: form.fileMimeType ?? m.fileMimeType,
            fileDataUrl: form.fileDataUrl ?? m.fileDataUrl,
          }
          : m,
      ),
    )
  }, [])

  const deleteManual = useCallback(async (id) => {
    try {
      await trainingManualsApi.delete(id)

      setManuals((prev) =>
        prev.filter((m) => m.id !== id)
      )
    } catch (error) {
      console.error(error)
    }
  }, [])
  console.log('REACHED VALUE')
  const value = useMemo(
    () => ({
      manuals,
      addManual,
      updateManual,
      deleteManual,
    }),
    [manuals, addManual, updateManual, deleteManual]
  )

  return (
    <TrainingManualsContext.Provider value={value}>{children}</TrainingManualsContext.Provider>
  )
}

export function useTrainingManuals() {
  const ctx = useContext(TrainingManualsContext)
  if (!ctx) throw new Error('useTrainingManuals must be used within TrainingManualsProvider')
  return ctx
}
