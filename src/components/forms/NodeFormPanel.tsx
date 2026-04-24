import { X, Trash2 } from 'lucide-react'
import { useWorkflowStore } from '../../store/workflowStore'
import { NodeFormRenderer } from '../forms/NodeForms'

const NODE_COLORS: Record<string, string> = {
  start: 'text-success border-success/30',
  task: 'text-accent border-accent/30',
  approval: 'text-warning border-warning/30',
  automated: 'text-purple-400 border-purple-400/30',
  end: 'text-danger border-danger/30',
}

const NODE_LABELS: Record<string, string> = {
  start: 'Start Node',
  task: 'Task Node',
  approval: 'Approval Node',
  automated: 'Automated Step',
  end: 'End Node',
}

export function NodeFormPanel() {
  const { nodes, selectedNodeId, selectNode, deleteNode } = useWorkflowStore()
  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  if (!selectedNode) return null

  const colorClass = NODE_COLORS[selectedNode.type!] || 'text-white border-border'
  const label = NODE_LABELS[selectedNode.type!] || 'Node'

  return (
    <aside className="flex h-full w-72 flex-col border-l border-border bg-panel animate-slide-in">
      {/* Header */}
      <div className={`flex items-center justify-between border-b px-4 py-3 ${colorClass}`}>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest opacity-70">{label}</p>
          <p className="text-xs text-white/50 font-mono mt-0.5">{selectedNode.id.slice(0, 8)}…</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => deleteNode(selectedNode.id)}
            className="rounded-lg p-1.5 text-muted hover:bg-danger/10 hover:text-danger transition-colors"
            title="Delete node"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={() => selectNode(null)}
            className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-white transition-colors"
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        <NodeFormRenderer id={selectedNode.id} data={selectedNode.data} />
      </div>
    </aside>
  )
}
