import type { SimulationRequest, SimulationResult } from '../types/workflow.types'

export async function simulateWorkflow(payload: SimulationRequest): Promise<SimulationResult> {
  const res = await fetch('/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.json()
}
