/** @param {string} [fileName] @param {string} [mimeType] */
export function isPreviewableFile(fileName, mimeType) {
  const mime = (mimeType || '').toLowerCase()
  if (mime.startsWith('image/') || mime === 'application/pdf') return true
  const ext = fileName?.split('.').pop()?.toLowerCase()
  return ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'].includes(ext || '')
}

/** @param {File} file */
export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(/** @type {string} */ (reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/** @param {{ fileName?: string, fileDataUrl?: string }} doc */
export function downloadDocument(doc) {
  if (!doc.fileDataUrl) return false
  const a = document.createElement('a')
  a.href = doc.fileDataUrl
  a.download = doc.fileName || 'document'
  a.click()
  return true
}

/** @param {File} file */
export function inferMimeType(file) {
  if (file.type) return file.type
  const ext = file.name.split('.').pop()?.toLowerCase()
  const map = {
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
  }
  return map[ext || ''] || 'application/octet-stream'
}
