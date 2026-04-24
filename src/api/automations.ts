import type { AutomationAction } from '../types/workflow.types'

export async function fetchAutomations(): Promise<AutomationAction[]> {
  const res = await fetch('/automations')
  if (!res.ok) throw new Error('Failed to fetch automations')
  return res.json()
}
