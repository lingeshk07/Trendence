// Node type identifiers
export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end'

// Per-node data interfaces
export interface StartNodeData {
  type: 'start'
  title: string
  metadata: { key: string; value: string }[]
}

export interface TaskNodeData {
  type: 'task'
  title: string
  description: string
  assignee: string
  dueDate: string
  customFields: { key: string; value: string }[]
}

export interface ApprovalNodeData {
  type: 'approval'
  title: string
  approverRole: string
  autoApproveThreshold: number
}

export interface AutomatedNodeData {
  type: 'automated'
  title: string
  actionId: string
  actionParams: Record<string, string>
}

export interface EndNodeData {
  type: 'end'
  endMessage: string
  showSummary: boolean
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData

// API types
export interface AutomationAction {
  id: string
  label: string
  params: string[]
}

export interface SimulationStep {
  nodeId: string
  label: string
  status: 'completed' | 'approved' | 'rejected' | 'triggered' | 'skipped'
  timestamp: string
  detail?: string
}

export interface SimulationResult {
  status: 'success' | 'error'
  steps: SimulationStep[]
  error?: string
}

export interface SimulationRequest {
  nodes: { id: string; type: string; data: WorkflowNodeData }[]
  edges: { id: string; source: string; target: string }[]
}
