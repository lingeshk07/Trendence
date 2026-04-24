import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { StartNodeData } from '../../types/workflow.types'
import { Play } from 'lucide-react'

export function StartNode({ data, selected }: NodeProps & { data: StartNodeData }) {
  return (
    <div className={`relative min-w-[160px] rounded-xl border-2 px-4 py-3 transition-all
      ${selected ? 'border-success shadow-[0_0_20px_rgba(34,211,165,0.3)]' : 'border-success/40'}
      bg-panel`}>
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-success/20">
          <Play size={13} className="text-success fill-success" />
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-success/70">Start</p>
          <p className="text-sm font-medium text-white leading-tight">{data.title || 'Start'}</p>
        </div>
      </div>
      {data.metadata?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {data.metadata.map((m, i) => (
            <span key={i} className="rounded bg-success/10 px-1.5 py-0.5 text-[10px] text-success/80">
              {m.key}
            </span>
          ))}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-success !border-canvas !w-3 !h-3" />
    </div>
  )
}
