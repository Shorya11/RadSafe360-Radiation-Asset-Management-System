import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/ui/PageHeader'
import { DocumentPreviewModal } from '../components/ui/DocumentPreviewModal'
import { ReportsTable } from '../components/reports/ReportsTable'
import { ReportFormModal } from '../components/reports/ReportFormModal'
import { DeleteReportModal } from '../components/reports/DeleteReportModal'
import { useReports } from '../context/ReportsContext'

export function Reports() {
  const { addReport, updateReport, deleteReport } = useReports()

  const [previewReport, setPreviewReport] = useState(null)
  const [editReport, setEditReport] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [uploadOpen, setUploadOpen] = useState(false)

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports & Documents"
        description="Store and manage operational, safety, and compliance documents by department."
        action={
          <Button onClick={() => setUploadOpen(true)}>
            <Plus className="h-4 w-4" />
            Upload Document
          </Button>
        }
      />

      <section aria-label="Reports and documents">
        <h2 className="section-heading mb-4">Document Library</h2>
        <ReportsTable
          onView={setPreviewReport}
          onEdit={setEditReport}
          onDelete={setDeleteTarget}
        />
      </section>

      <DocumentPreviewModal
        open={Boolean(previewReport)}
        onClose={() => setPreviewReport(null)}
        document={previewReport}
        title={
          previewReport?.fileName ||
          `${previewReport?.contactName} — ${previewReport?.reportType}`
        }
      />

      <ReportFormModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload Document"
        onSave={(form) => addReport(form)}
      />

      <ReportFormModal
        open={Boolean(editReport)}
        onClose={() => setEditReport(null)}
        report={editReport}
        title="Edit Document"
        onSave={(form) => updateReport(editReport.id, form)}
      />

      <DeleteReportModal
        report={deleteTarget}
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={deleteReport}
      />
    </div>
  )
}
