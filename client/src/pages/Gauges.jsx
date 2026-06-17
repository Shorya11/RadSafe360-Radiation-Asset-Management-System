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
import { ApiStatus } from '../components/ui/ApiStatus'
import { DocumentPreviewModal } from '../components/ui/DocumentPreviewModal'
import { downloadDocument } from '../utils/fileUtils'

export function Gauges() {
  const { gauges, loading, error, fetchGauges, addGauge, updateGauge, deleteGauge, uploadGaugeDocument } =
    useGauges()

  const [viewGauge, setViewGauge] = useState(null)
  const [editGauge, setEditGauge] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [previewDocument, setPreviewDocument] = useState(null)

  const triggerFilePicker = (onSelect) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.png,.jpg,.jpeg,.gif,.webp'
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) onSelect(file)
    }
    input.click()
  }

  const handleUpload = (gauge) => {
    triggerFilePicker(async (file) => {
      await uploadGaugeDocument(gauge.id, file)
    })
  }

  const handleDownload = (gauge) => {
    const firstDocument = gauge.documents?.[0]
    if (firstDocument) {
      downloadDocument(firstDocument)
      return
    }

    const text = [
      `Gauge Report: ${gauge.id}`,
      `Serial: ${gauge.serialNumber}`,
      `Make/Model: ${gauge.make} ${gauge.model}`,
      `Source: ${gauge.source}`,
      `Quantity: ${gauge.quantity}`,
      `Activity: ${gauge.activity}`,
      `Purchase Date: ${gauge.purchaseDate}`,
      `Installation Date: ${gauge.installDate || '-'}`,
      `Source Test Date: ${gauge.sourceTestDate || '-'}`,
      `Lifecycle (Years): ${gauge.lifecycleYears || '-'}`,
      `Expiry Date: ${gauge.expiryDate || '-'}`,
      `Remaining Life: ${gauge.remainingLife || '-'}`,
      `Lifecycle Status: ${gauge.lifecycleStatus || '-'}`,
      `Location: ${gauge.location}`,
      `Plant: ${gauge.plant}`,
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
        title=" Nucleonic Gauge"
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

      <ApiStatus loading={loading} error={error} onRetry={fetchGauges} />

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
          onUpload={handleUpload}
          onDownload={handleDownload}
        />
      </section>

      <GaugeViewModal
        gauge={viewGauge}
        open={Boolean(viewGauge)}
        onClose={() => setViewGauge(null)}
        onPreviewDocument={setPreviewDocument}
        onDownloadDocument={downloadDocument}
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

      <DocumentPreviewModal
        open={Boolean(previewDocument)}
        onClose={() => setPreviewDocument(null)}
        document={previewDocument}
        title={previewDocument?.fileName}
      />
    </div>
  )
}
