import { Play, ClipboardList, ShieldCheck, Zap, Flag } from 'lucide-react'
import type { WorkflowNodeData } from '../../types/workflow.types'

interface NodeDef {
  type: WorkflowNodeData['type']
  label: string
  description: string
  icon: React.ReactNode
  color: string
  border: string
  bg: string
}

const nodeDefs: NodeDef[] = [
  {
    type: 'start',
    label: 'Start',
    description: 'Workflow entry point',
    icon: <Play size={14} className="fill-current" />,
    color: 'text-success',
    border: 'border-success/40 hover:border-success',
    bg: 'bg-success/10',
  },
  {
    type: 'task',
    label: 'Task',
    description: 'Human task step',
    icon: <ClipboardList size={14} />,
    color: 'text-accent',
    border: 'border-accent/40 hover:border-accent',
    bg: 'bg-accent/10',
  },
  {
    type: 'approval',
    label: 'Approval',
    description: 'Manager/HR approval',
    icon: <ShieldCheck size={14} />,
    color: 'text-warning',
    border: 'border-warning/40 hover:border-warning',
    bg: 'bg-warning/10',
  },
  {
    type: 'automated',
    label: 'Automated',
    description: 'System-triggered action',
    icon: <Zap size={14} />,
    color: 'text-purple-400',
    border: 'border-purple-400/40 hover:border-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    type: 'end',
    label: 'End',
    description: 'Workflow completion',
    icon: <Flag size={14} />,
    color: 'text-danger',
    border: 'border-danger/40 hover:border-danger',
    bg: 'bg-danger/10',
  },
]

export function NodeSidebar() {
  function onDragStart(e: React.DragEvent, type: WorkflowNodeData['type']) {
    e.dataTransfer.setData('application/reactflow-type', type)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="flex h-full w-56 flex-col border-r border-border bg-panel">
      <div className="border-b border-border px-4 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">Node Palette</p>
        <p className="mt-0.5 text-[11px] text-muted/60">Drag nodes onto the canvas</p>
      </div>

      <div className="flex flex-col gap-2 p-3">
        {nodeDefs.map((def) => (
          <div
            key={def.type}
            draggable
            onDragStart={(e) => onDragStart(e, def.type)}
            className={`flex cursor-grab items-center gap-3 rounded-lg border px-3 py-2.5 transition-all duration-150 active:cursor-grabbing active:scale-95 ${def.border} bg-surface/50`}
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${def.bg} ${def.color}`}>
              {def.icon}
            </div>
            <div>
              <p className={`text-sm font-medium ${def.color}`}>{def.label}</p>
              <p className="text-[10px] leading-tight text-muted/70">{def.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-border p-4">
        <p className="text-[10px] text-muted/50 leading-relaxed">
          Connect nodes by dragging from one handle to another. Click a node to edit its properties.
        </p>
      </div>
    </aside>
  )
}
