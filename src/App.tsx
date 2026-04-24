import { ReactFlowProvider } from '@xyflow/react'
import { Play, Download, Upload, RotateCcw, Workflow } from 'lucide-react'
import { NodeSidebar } from './components/sidebar/NodeSidebar'
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas'
import { NodeFormPanel } from './components/forms/NodeFormPanel'
import { SandboxPanel } from './components/sandbox/SandboxPanel'
import { useWorkflowStore } from './store/workflowStore'
import { useSimulation } from './hooks/useSimulation'

function Toolbar() {
  const { nodes, edges, setSandboxOpen, setSimulationResult } = useWorkflowStore()
  const { runSimulation } = useSimulation()

  function exportWorkflow() {
    const data = JSON.stringify({ nodes, edges }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'workflow.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function importWorkflow() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target?.result as string)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          useWorkflowStore.setState({ nodes: parsed.nodes || [], edges: parsed.edges || [] } as any)
        } catch {
          alert('Invalid workflow JSON file.')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  function clearCanvas() {
    if (nodes.length === 0) return
    if (confirm('Clear the entire canvas?')) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      useWorkflowStore.setState({ nodes: [], edges: [], selectedNodeId: null } as any)
      setSimulationResult(null)
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-panel px-5">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/20">
          <Workflow size={15} className="text-accent" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-tight">HR Workflow Designer</p>
          <p className="text-[10px] text-muted/60 leading-tight">Tredence Studio</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-[11px] text-muted">
        <span>{nodes.length} node{nodes.length !== 1 ? 's' : ''}</span>
        <span>{edges.length} connection{edges.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={importWorkflow}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:border-accent/40 hover:text-white transition-all"
        >
          <Upload size={12} /> Import
        </button>
        <button
          onClick={exportWorkflow}
          disabled={nodes.length === 0}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:border-accent/40 hover:text-white transition-all disabled:opacity-30"
        >
          <Download size={12} /> Export
        </button>
        <button
          onClick={clearCanvas}
          disabled={nodes.length === 0}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:border-danger/40 hover:text-danger transition-all disabled:opacity-30"
        >
          <RotateCcw size={12} /> Clear
        </button>
        <button
          onClick={() => { setSandboxOpen(true); runSimulation() }}
          disabled={nodes.length === 0}
          className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-1.5 text-xs font-medium text-white transition-all hover:bg-accent/90 disabled:opacity-40"
        >
          <Play size={12} className="fill-white" /> Simulate
        </button>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <div className="flex h-screen flex-col bg-canvas font-sans text-white overflow-hidden">
        <Toolbar />
        <div className="relative flex flex-1 overflow-hidden">
          <NodeSidebar />
          <main className="relative flex-1 overflow-hidden">
            <WorkflowCanvas />
            <SandboxPanel />
          </main>
          <NodeFormPanel />
        </div>
      </div>
    </ReactFlowProvider>
  )
}
