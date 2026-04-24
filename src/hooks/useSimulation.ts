import { useWorkflowStore } from '../store/workflowStore'
import { simulateWorkflow } from '../api/simulate'

export function useSimulation() {
  const { nodes, edges, setSimulationResult, setIsSimulating, setSandboxOpen } = useWorkflowStore()

  async function runSimulation() {
    // Validate
    const hasStart = nodes.some((n) => n.type === 'start')
    const hasEnd = nodes.some((n) => n.type === 'end')

    if (!hasStart || !hasEnd) {
      setSimulationResult({
        status: 'error',
        steps: [],
        error: !hasStart ? 'Workflow must have a Start node.' : 'Workflow must have an End node.',
      })
      setSandboxOpen(true)
      return
    }

    if (nodes.length < 2) {
      setSimulationResult({ status: 'error', steps: [], error: 'Add more nodes before simulating.' })
      setSandboxOpen(true)
      return
    }

    setIsSimulating(true)
    setSandboxOpen(true)

    try {
      const payload = {
        nodes: nodes.map((n) => ({ id: n.id, type: n.type!, data: n.data })),
        edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
      }
      const result = await simulateWorkflow(payload)
      setSimulationResult(result)
    } catch {
      setSimulationResult({ status: 'error', steps: [], error: 'Simulation failed. Try again.' })
    } finally {
      setIsSimulating(false)
    }
  }

  return { runSimulation }
}
