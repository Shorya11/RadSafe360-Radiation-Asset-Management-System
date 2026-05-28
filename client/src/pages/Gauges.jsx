import { useState } from 'react'
import { Plus, Download } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/ui/PageHeader'
import { GaugeKpiCards } from '../components/gauges/GaugeKpiCards'
import { GaugeCharts } from '../components/gauges/GaugeCharts'
import { GaugeTable } from '../components/gauges/GaugeTable'
import { GaugeViewModal } from '../components/gauges/GaugeViewModal'
import { GaugeFormModal } from '../components/gauges/GaugeFormModal'
import { DeleteGaugeModal } from '../components/gauges/DeleteGaugeModal'
import { useGauges } from '../context/GaugeContext'
import { exportGaugesCsv } from '../utils/gaugeUtils'

export function Gauges() {
  const { gauges, addGauge, updateGauge, deleteGauge } = useGauges()

  const [viewGauge, setViewGauge] = useState(null)
  const [editGauge, setEditGauge] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [addOpen, setAddOpen] = useState(false)

  const handleDownload = (gauge) => {
    const text = [
      `Gauge Report: ${gauge.id}`,
      `Serial: ${gauge.serialNumber}`,
      `Make/Model: ${gauge.make} ${gauge.model}`,
      `Source: ${gauge.source}`,
      `Quantity: ${gauge.quantity}`,
      `Activity: ${gauge.activity}`,
      `Purchase Date: ${gauge.purchaseDate}`,
      `Install Date: ${gauge.installDate || '-'}`,
      `Location: ${gauge.location}`,
      `Plant: ${gauge.plant}`,
      `Life: ${gauge.life}`,
      `Status: ${gauge.status}`,
      `NOC: ${gauge.nocNumber}`,
      `Contact: ${gauge.contactPerson}`,
      `Calibration Due Date: ${gauge.calibrationDueDate}`,
    ].join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${gauge.id}-details.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gauge Management"
        description="Track and monitor industrial nucleonic gauges across plants and facilities."
        action={
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => exportGaugesCsv(gauges)}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Gauge
            </Button>
          </div>
        }
      />

      {/* Section 2 — KPI Cards */}
      <section aria-label="Gauge KPIs">
        <GaugeKpiCards />
      </section>

      {/* Section 3 — Analytics */}
      <section aria-label="Gauge analytics">
        <GaugeCharts />
      </section>

      {/* Section 4 — Table */}
      <section aria-label="Gauge inventory">
        <h2 className="section-heading mb-4">Gauge Inventory</h2>
        <GaugeTable
          onView={setViewGauge}
          onEdit={setEditGauge}
          onDelete={setDeleteTarget}
          onDownload={handleDownload}
        />
      </section>

      <GaugeViewModal
        gauge={viewGauge}
        open={Boolean(viewGauge)}
        onClose={() => setViewGauge(null)}
      />

      <GaugeFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Gauge"
        onSave={(form) => addGauge(form)}
      />

      <GaugeFormModal
        open={Boolean(editGauge)}
        onClose={() => setEditGauge(null)}
        gauge={editGauge}
        title="Edit Gauge"
        onSave={(form) => updateGauge(editGauge.id, form)}
      />

      <DeleteGaugeModal
        gauge={deleteTarget}
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={deleteGauge}
      />
    </div>
  )
}
