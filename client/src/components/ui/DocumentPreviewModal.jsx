import { Modal } from './Modal'
import { API_BASE_URL } from '../../services/api'

export function DocumentPreviewModal({
  open,
  onClose,
  document,
  title,
}) {
  if (!document) return null

const fileUrl = document.filePath
  ? `${API_BASE_URL}/${document.filePath}`
  : document.fileDataUrl || null

const isPdf =
  document.fileName?.toLowerCase().endsWith('.pdf') ||
  document.fileMimeType === 'application/pdf'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title || document.fileName}
      className="max-w-5xl"
    >
      {fileUrl ? (
        isPdf ? (
          <iframe
            src={fileUrl}
            title={document.fileName}
            className="h-[75vh] w-full rounded-lg border"
          />
        ) : (
          <img
            src={fileUrl}
            alt={document.fileName}
            className="max-h-[75vh] w-full object-contain"
          />
        )
      ) : (
        <p>No preview available.</p>
      )}
    </Modal>
  )
}