import { useEffect, useState } from 'react'
import { Copy, ExternalLink, Pencil, Save } from 'lucide-react'
import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

function DetailRow({ label, children }) {
  return (
    <div className="border-b border-slate-200 py-4 last:border-0 sm:grid sm:grid-cols-3 sm:gap-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-industrial-600">{label}</p>
      <div className="mt-1 sm:col-span-2 sm:mt-0">{children}</div>
    </div>
  )
}

export function EloraInfoPanel({ information, onSave }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(information)
  const [copyHint, setCopyHint] = useState('')

  useEffect(() => {
    if (!editing) setForm(information)
  }, [information, editing])

  const portalUrl = (editing ? form.portalUrl : information.portalUrl)?.trim()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSave = () => {
    onSave(form)
    setEditing(false)
  }

  const handleOpenPortal = () => {
    if (portalUrl) window.open(portalUrl, '_blank', 'noopener,noreferrer')
  }

  const handleCopyUrl = async () => {
    if (!portalUrl) return
    try {
      await navigator.clipboard.writeText(portalUrl)
      setCopyHint('URL copied to clipboard')
      setTimeout(() => setCopyHint(''), 2500)
    } catch {
      setCopyHint('Could not copy URL')
      setTimeout(() => setCopyHint(''), 2500)
    }
  }

  return (
    <Card>
      <CardHeader className="flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <CardTitle>ELORA Portal Credentials</CardTitle>
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          {!editing ? (
            <Button variant="secondary" onClick={() => setEditing(true)}>
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4" />
                Save
              </Button>
            </>
          )}
          <Button onClick={handleOpenPortal} disabled={!portalUrl}>
            <ExternalLink className="h-4 w-4" />
            Open Portal
          </Button>
          <Button variant="secondary" onClick={handleCopyUrl} disabled={!portalUrl}>
            <Copy className="h-4 w-4" />
            Copy URL
          </Button>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        {copyHint && (
          <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
            {copyHint}
          </p>
        )}

        {editing ? (
          <div className="space-y-4">
            <Input
              label="Contact Person"
              name="contactPerson"
              value={form.contactPerson}
              onChange={handleChange}
              required
            />
            <Input
              label="Login ID"
              name="loginId"
              value={form.loginId}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <Input
              label="Institute"
              name="institute"
              value={form.institute}
              onChange={handleChange}
              required
            />
            <Input label="Role" name="role" value={form.role} onChange={handleChange} required />
            <Input
              label="Installation Type"
              name="installationType"
              value={form.installationType}
              onChange={handleChange}
              required
            />
            <Input
              label="Portal URL"
              name="portalUrl"
              type="url"
              value={form.portalUrl}
              onChange={handleChange}
              placeholder="https://elora.aerb.gov.in/"
              required
            />
          </div>
        ) : (
          <>
            <DetailRow label="Contact Person">
              <p className="text-sm text-gray-900">Lalit Kumar Goyal
                {information.contactPerson}
              </p>
            </DetailRow>
            <DetailRow label="Login ID">
              <p className="font-mono text-sm text-gray-900">{information.loginId}</p>
            </DetailRow>
            <DetailRow label="Password">
              <p className="font-mono text-sm text-gray-500">{information.password}</p>
            </DetailRow>
            <DetailRow label="Institute">
              <p className="text-sm text-gray-900">{information.institute}</p>
            </DetailRow>
            <DetailRow label="Role">
              <p className="text-sm text-gray-900">{information.role}</p>
            </DetailRow>
            <DetailRow label="Installation Type">
              <p className="text-sm text-gray-900">{information.installationType}</p>
            </DetailRow>
            <DetailRow label="Portal URL">
              {portalUrl ? (
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-accent-amber hover:underline"
                >
                  {portalUrl}
                </a>
              ) : (
                <span className="text-sm text-gray-500">—</span>
              )}
            </DetailRow>
          </>
        )}
      </CardBody>
    </Card>
  )
}
