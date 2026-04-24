import { X, CheckCircle2, AlertCircle, Loader2, Play, Clock } from 'lucide-react'
import { useWorkflowStore } from '../../store/workflowStore'
import { useSimulation } from '../../hooks/useSimulation'
import type { SimulationStep } from '../../types/workflow.types'

const STATUS_CONFIG: Record<
  SimulationStep['status'],
  { color: string; bg: string; icon: React.ReactNode }
> = {
  completed: {
    color: 'text-success',
    bg: 'bg-success/10 border-success/20',
    icon: <CheckCircle2 size={13} className="text-success" />,
  },
  approved: {
    color: 'text-success',
    bg: 'bg-success/10 border-success/20',
    icon: <CheckCircle2 size={13} className="text-success" />,
  },
  rejected: {
    color: 'text-danger',
    bg: 'bg-danger/10 border-danger/20',
    icon: <AlertCircle size={13} className="text-danger" />,
  },
  triggered: {
    color: 'text-purple-400',
    bg: 'bg-purple-400/10 border-purple-400/20',
    icon: <Play size={13} className="text-purple-400 fill-current" />,
  },
  skipped: {
    color: 'text-muted',
    bg: 'bg-surface border-border',
    icon: <Clock size={13} className="text-muted" />,
  },
}

export function SandboxPanel() {
  const { simulationResult, isSimulating, sandboxOpen, setSandboxOpen, setSimulationResult } =
    useWorkflowStore()
  const { runSimulation } = useSimulation()

  if (!sandboxOpen) return null

  return (
    <div className="absolute bottom-4 right-4 z-50 w-80 rounded-2xl border border-border bg-panel shadow-2xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isSimulating ? 'bg-accent animate-pulse' : simulationResult?.status === 'success' ? 'bg-success' : 'bg-danger'}`} />
          <p className="text-sm font-medium text-white">Simulation Sandbox</p>
        </div>
        <button
          onClick={() => setSandboxOpen(false)}
          className="rounded-lg p-1 text-muted hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Body */}
      <div className="max-h-80 overflow-y-auto p-4">
        {isSimulating && (
          <div className="flex flex-col items-center justify-center gap-3 py-8">
            <Loader2 size={24} className="text-accent animate-spin" />
            <p className="text-sm text-muted">Running simulation…</p>
          </div>
        )}

        {!isSimulating && simulationResult?.status === 'error' && (
          <div className="flex items-start gap-2 rounded-xl border border-danger/20 bg-danger/10 p-3">
            <AlertCircle size={14} className="mt-0.5 shrink-0 text-danger" />
            <p className="text-sm text-danger/90">{simulationResult.error}</p>
          </div>
        )}

        {!isSimulating && simulationResult?.status === 'success' && (
          <div className="space-y-2">
            {simulationResult.steps.map((step, i) => {
              const cfg = STATUS_CONFIG[step.status]
              return (
                <div
                  key={step.nodeId}
                  className={`rounded-xl border px-3 py-2.5 ${cfg.bg} animate-fade-in`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center gap-2">
                    {cfg.icon}
                    <p className={`text-sm font-medium ${cfg.color}`}>{step.label}</p>
                    <span className="ml-auto rounded bg-surface px-1.5 py-0.5 text-[10px] font-mono text-muted capitalize">
                      {step.status}
                    </span>
                  </div>
                  {step.detail && (
                    <p className="mt-1 pl-5 text-[11px] text-muted/70">{step.detail}</p>
                  )}
                  <p className="mt-1 pl-5 font-mono text-[10px] text-muted/40">
                    {new Date(step.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {!isSimulating && !simulationResult && (
          <div className="py-6 text-center">
            <p className="text-sm text-muted">Click Run to simulate the workflow.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 border-t border-border px-4 py-3">
        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition-all hover:bg-accent/90 disabled:opacity-50"
        >
          {isSimulating ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Play size={13} className="fill-white" />
          )}
          {isSimulating ? 'Running…' : 'Run Again'}
        </button>
        <button
          onClick={() => setSimulationResult(null)}
          className="rounded-xl border border-border px-3 py-2 text-sm text-muted hover:text-white transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
