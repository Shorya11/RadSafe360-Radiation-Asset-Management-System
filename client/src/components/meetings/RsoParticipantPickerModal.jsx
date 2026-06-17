import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

export function RsoParticipantPickerModal({
  open,
  onClose,
  personnel,
  selectedPersonnelIds,
  onApply,
}) {
  const [search, setSearch] = useState('')
  const [localSelected, setLocalSelected] = useState([])
  console.log("RSO Personnel received:", personnel)
console.log("Count:", personnel?.length)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return personnel.filter((p) => {
      //if (p.status !== 'Valid') return false
      if (!q) return true
      return (
        p.employeeId.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q)
      )
    })
  }, [personnel, search])

  const toggle = (employeeId) => {
    setLocalSelected((prev) =>
      prev.includes(employeeId) ? prev.filter((id) => id !== employeeId) : [...prev, employeeId],
    )
  }

  const selectedSet = new Set([...selectedPersonnelIds, ...localSelected])

  return (
    <Modal open={open} onClose={onClose} title="Add Participants from RSO Personnel" className="max-w-4xl">
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-industrial-600" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee, name, email..."
            className="enterprise-input w-full py-2.5 pl-10 pr-4"
          />
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="enterprise-table-head-accent">
                  <th className="px-4 py-3 font-semibold">Select</th>
                  <th className="px-4 py-3 font-semibold">Employee ID</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Department</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Valid Till</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((p) => {
                  const alreadyAdded = selectedPersonnelIds.includes(p.employeeId)
                  return (
                    <tr key={p.employeeId} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedSet.has(p.employeeId)}
                          disabled={alreadyAdded}
                          onChange={() => toggle(p.employeeId)}
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-accent-amber">{p.employeeId}</td>
                      <td className="px-4 py-3 text-gray-900">{p.name}</td>
                      <td className="px-4 py-3 text-gray-600">{p.department}</td>
                      <td className="px-4 py-3 text-gray-600">{p.email}</td>
                      <td className="px-4 py-3 text-gray-500">{p.validTill}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              onApply(localSelected)
              setLocalSelected([])
            }}
          >
            Add Selected
          </Button>
        </div>
      </div>
    </Modal>
  )
}
