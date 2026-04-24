import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { AutomatedNodeData } from '../../types/workflow.types'
import { Zap } from 'lucide-react'

export function AutomatedNode({ data, selected }: NodeProps & { data: AutomatedNodeData }) {
  return (
    <div className={`relative min-w-[180px] rounded-xl border-2 px-4 py-3 transition-all
      ${selected ? 'border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.3)]' : 'border-purple-400/40'}
      bg-panel`}>
      <Handle type="target" position={Position.Top} className="!bg-purple-400 !border-canvas !w-3 !h-3" />
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-400/20">
          <Zap size={13} className="text-purple-400" />
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-purple-400/70">Automated</p>
          <p className="text-sm font-medium text-white leading-tight">{data.title || 'Automated Step'}</p>
        </div>
      </div>
      {data.actionId && (
        <p className="mt-1.5 text-[11px] text-muted">⚙️ {data.actionId}</p>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-purple-400 !border-canvas !w-3 !h-3" />
    </div>
  )
}
