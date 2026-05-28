import { Settings as SettingsIcon } from 'lucide-react'
import { PlaceholderPage } from '../components/ui/PlaceholderPage'

export function Settings() {
  return (
    <PlaceholderPage
      title="Settings"
      description="Configure plant zones, user roles, notifications, and integrations."
      icon={SettingsIcon}
    />
  )
}
