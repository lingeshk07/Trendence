import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useWorkflowStore } from '../../store/workflowStore'
import { fetchAutomations } from '../../api/automations'
import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
  AutomationAction,
  WorkflowNodeData,
} from '../../types/workflow.types'

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-muted">
      {children}
    </label>
  )
}

function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white placeholder:text-muted/40 focus:border-accent focus:outline-none transition-colors"
    />
  )
}

function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white placeholder:text-muted/40 focus:border-accent focus:outline-none transition-colors resize-none"
    />
  )
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white focus:border-accent focus:outline-none transition-colors"
    >
      <option value="">Select…</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-sm text-white/80">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-border'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : ''}`}
        />
      </button>
    </label>
  )
}

function KeyValueEditor({
  pairs,
  onChange,
}: {
  pairs: { key: string; value: string }[]
  onChange: (pairs: { key: string; value: string }[]) => void
}) {
  function addPair() {
    onChange([...pairs, { key: '', value: '' }])
  }
  function removePair(i: number) {
    onChange(pairs.filter((_, idx) => idx !== i))
  }
  function updatePair(i: number, field: 'key' | 'value', val: string) {
    onChange(pairs.map((p, idx) => (idx === i ? { ...p, [field]: val } : p)))
  }

  return (
    <div className="space-y-2">
      {pairs.map((p, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={p.key}
            onChange={(e) => updatePair(i, 'key', e.target.value)}
            placeholder="Key"
            className="w-1/2 rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-white placeholder:text-muted/40 focus:border-accent focus:outline-none"
          />
          <input
            value={p.value}
            onChange={(e) => updatePair(i, 'value', e.target.value)}
            placeholder="Value"
            className="w-1/2 rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-white placeholder:text-muted/40 focus:border-accent focus:outline-none"
          />
          <button
            onClick={() => removePair(i)}
            className="shrink-0 rounded-lg p-1.5 text-muted hover:bg-danger/10 hover:text-danger transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}
      <button
        onClick={addPair}
        className="flex items-center gap-1.5 text-[11px] text-accent/70 hover:text-accent transition-colors"
      >
        <Plus size={11} /> Add field
      </button>
    </div>
  )
}

// ─── Individual Forms ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{title}</Label>
      {children}
    </div>
  )
}

export function StartForm({ id, data }: { id: string; data: StartNodeData }) {
  const update = useWorkflowStore((s) => s.updateNodeData)
  return (
    <div className="space-y-4 animate-fade-in">
      <Section title="Title">
        <Input value={data.title} onChange={(v) => update(id, { title: v } as Partial<StartNodeData>)} placeholder="Workflow title" />
      </Section>
      <Section title="Metadata">
        <KeyValueEditor
          pairs={data.metadata}
          onChange={(metadata) => update(id, { metadata } as Partial<StartNodeData>)}
        />
      </Section>
    </div>
  )
}

export function TaskForm({ id, data }: { id: string; data: TaskNodeData }) {
  const update = useWorkflowStore((s) => s.updateNodeData)
  return (
    <div className="space-y-4 animate-fade-in">
      <Section title="Title">
        <Input value={data.title} onChange={(v) => update(id, { title: v } as Partial<TaskNodeData>)} placeholder="Task title" />
      </Section>
      <Section title="Description">
        <Textarea value={data.description} onChange={(v) => update(id, { description: v } as Partial<TaskNodeData>)} placeholder="What needs to be done?" />
      </Section>
      <Section title="Assignee">
        <Input value={data.assignee} onChange={(v) => update(id, { assignee: v } as Partial<TaskNodeData>)} placeholder="e.g. HR Team" />
      </Section>
      <Section title="Due Date">
        <Input type="date" value={data.dueDate} onChange={(v) => update(id, { dueDate: v } as Partial<TaskNodeData>)} />
      </Section>
      <Section title="Custom Fields">
        <KeyValueEditor
          pairs={data.customFields}
          onChange={(customFields) => update(id, { customFields } as Partial<TaskNodeData>)}
        />
      </Section>
    </div>
  )
}

export function ApprovalForm({ id, data }: { id: string; data: ApprovalNodeData }) {
  const update = useWorkflowStore((s) => s.updateNodeData)
  const roleOptions = [
    { value: 'Manager', label: 'Manager' },
    { value: 'HRBP', label: 'HRBP' },
    { value: 'Director', label: 'Director' },
    { value: 'VP', label: 'VP' },
    { value: 'CEO', label: 'CEO' },
  ]
  return (
    <div className="space-y-4 animate-fade-in">
      <Section title="Title">
        <Input value={data.title} onChange={(v) => update(id, { title: v } as Partial<ApprovalNodeData>)} placeholder="Approval step title" />
      </Section>
      <Section title="Approver Role">
        <Select
          value={data.approverRole}
          onChange={(v) => update(id, { approverRole: v } as Partial<ApprovalNodeData>)}
          options={roleOptions}
        />
      </Section>
      <Section title="Auto-approve Threshold (%)">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            value={data.autoApproveThreshold}
            onChange={(e) => update(id, { autoApproveThreshold: Number(e.target.value) } as Partial<ApprovalNodeData>)}
            className="flex-1 accent-warning"
          />
          <span className="w-10 text-right font-mono text-sm text-warning">{data.autoApproveThreshold}%</span>
        </div>
        <p className="text-[10px] text-muted/50">Auto-approve if score exceeds threshold</p>
      </Section>
    </div>
  )
}

export function AutomatedForm({ id, data }: { id: string; data: AutomatedNodeData }) {
  const update = useWorkflowStore((s) => s.updateNodeData)
  const [actions, setActions] = useState<AutomationAction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAutomations()
      .then(setActions)
      .finally(() => setLoading(false))
  }, [])

  const selectedAction = actions.find((a) => a.id === data.actionId)

  function handleActionChange(actionId: string) {
    update(id, { actionId, actionParams: {} } as Partial<AutomatedNodeData>)
  }

  function handleParamChange(param: string, value: string) {
    update(id, {
      actionParams: { ...data.actionParams, [param]: value },
    } as Partial<AutomatedNodeData>)
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <Section title="Title">
        <Input value={data.title} onChange={(v) => update(id, { title: v } as Partial<AutomatedNodeData>)} placeholder="Step title" />
      </Section>
      <Section title="Action">
        {loading ? (
          <div className="h-9 rounded-lg bg-surface animate-pulse" />
        ) : (
          <Select
            value={data.actionId}
            onChange={handleActionChange}
            options={actions.map((a) => ({ value: a.id, label: a.label }))}
          />
        )}
      </Section>
      {selectedAction && selectedAction.params.length > 0 && (
        <Section title="Action Parameters">
          <div className="space-y-2">
            {selectedAction.params.map((param) => (
              <div key={param}>
                <p className="mb-1 text-[10px] capitalize text-muted/70">{param}</p>
                <Input
                  value={data.actionParams[param] || ''}
                  onChange={(v) => handleParamChange(param, v)}
                  placeholder={`Enter ${param}`}
                />
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

export function EndForm({ id, data }: { id: string; data: EndNodeData }) {
  const update = useWorkflowStore((s) => s.updateNodeData)
  return (
    <div className="space-y-4 animate-fade-in">
      <Section title="End Message">
        <Textarea
          value={data.endMessage}
          onChange={(v) => update(id, { endMessage: v } as Partial<EndNodeData>)}
          placeholder="Workflow completion message"
        />
      </Section>
      <Section title="Options">
        <Toggle
          checked={data.showSummary}
          onChange={(v) => update(id, { showSummary: v } as Partial<EndNodeData>)}
          label="Show execution summary"
        />
      </Section>
    </div>
  )
}

// ─── Router ───────────────────────────────────────────────────────────────────

export function NodeFormRenderer({ id, data }: { id: string; data: WorkflowNodeData }) {
  switch (data.type) {
    case 'start':
      return <StartForm id={id} data={data} />
    case 'task':
      return <TaskForm id={id} data={data} />
    case 'approval':
      return <ApprovalForm id={id} data={data} />
    case 'automated':
      return <AutomatedForm id={id} data={data} />
    case 'end':
      return <EndForm id={id} data={data} />
  }
}
