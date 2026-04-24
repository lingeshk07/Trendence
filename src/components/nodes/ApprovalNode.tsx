import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { ApprovalNodeData } from '../../types/workflow.types'
import { ShieldCheck } from 'lucide-react'

export function ApprovalNode({ data, selected }: NodeProps & { data: ApprovalNodeData }) {
  return (
    <div className={`relative min-w-[180px] rounded-xl border-2 px-4 py-3 transition-all
      ${selected ? 'border-warning shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'border-warning/40'}
      bg-panel`}>
      <Handle type="target" position={Position.Top} className="!bg-warning !border-canvas !w-3 !h-3" />
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning/20">
          <ShieldCheck size={13} className="text-warning" />
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-warning/70">Approval</p>
          <p className="text-sm font-medium text-white leading-tight">{data.title || 'Approval'}</p>
        </div>
      </div>
      {data.approverRole && (
        <p className="mt-1.5 text-[11px] text-muted">🎯 {data.approverRole}</p>
      )}
      {data.autoApproveThreshold > 0 && (
        <p className="text-[11px] text-muted">⚡ Auto &gt;{data.autoApproveThreshold}%</p>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-warning !border-canvas !w-3 !h-3" />
    </div>
  )
}
