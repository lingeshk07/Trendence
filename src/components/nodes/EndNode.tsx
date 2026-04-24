import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { EndNodeData } from '../../types/workflow.types'
import { Flag } from 'lucide-react'

export function EndNode({ data, selected }: NodeProps & { data: EndNodeData }) {
  return (
    <div className={`relative min-w-[160px] rounded-xl border-2 px-4 py-3 transition-all
      ${selected ? 'border-danger shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'border-danger/40'}
      bg-panel`}>
      <Handle type="target" position={Position.Top} className="!bg-danger !border-canvas !w-3 !h-3" />
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-danger/20">
          <Flag size={13} className="text-danger" />
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-danger/70">End</p>
          <p className="text-sm font-medium text-white leading-tight">{data.endMessage || 'End'}</p>
        </div>
      </div>
      {data.showSummary && (
        <span className="mt-1.5 inline-block rounded bg-danger/10 px-1.5 py-0.5 text-[10px] text-danger/80">
          Summary enabled
        </span>
      )}
    </div>
  )
}
