import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { TaskNodeData } from '../../types/workflow.types'
import { ClipboardList } from 'lucide-react'

export function TaskNode({ data, selected }: NodeProps & { data: TaskNodeData }) {
  return (
    <div className={`relative min-w-[180px] rounded-xl border-2 px-4 py-3 transition-all
      ${selected ? 'border-accent shadow-[0_0_20px_rgba(79,142,247,0.3)]' : 'border-accent/40'}
      bg-panel`}>
      <Handle type="target" position={Position.Top} className="!bg-accent !border-canvas !w-3 !h-3" />
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/20">
          <ClipboardList size={13} className="text-accent" />
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-accent/70">Task</p>
          <p className="text-sm font-medium text-white leading-tight">{data.title || 'Task'}</p>
        </div>
      </div>
      {data.assignee && (
        <p className="mt-1.5 text-[11px] text-muted">👤 {data.assignee}</p>
      )}
      {data.dueDate && (
        <p className="text-[11px] text-muted">📅 {data.dueDate}</p>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-accent !border-canvas !w-3 !h-3" />
    </div>
  )
}
