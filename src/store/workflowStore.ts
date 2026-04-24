import { create } from 'zustand'
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from '@xyflow/react'
import { v4 as uuidv4 } from 'uuid'
import type { WorkflowNodeData, SimulationResult } from '../types/workflow.types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WorkflowNode = Node<any>
export type WorkflowEdge = Edge

interface WorkflowStore {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNodeId: string | null
  simulationResult: SimulationResult | null
  isSimulating: boolean
  sandboxOpen: boolean

  onNodesChange: OnNodesChange<WorkflowNode>
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect

  addNode: (type: WorkflowNodeData['type'], position: { x: number; y: number }) => void
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void
  deleteNode: (id: string) => void
  selectNode: (id: string | null) => void

  setSimulationResult: (result: SimulationResult | null) => void
  setIsSimulating: (v: boolean) => void
  setSandboxOpen: (v: boolean) => void
}

function defaultData(type: WorkflowNodeData['type']): WorkflowNodeData {
  switch (type) {
    case 'start':
      return { type: 'start', title: 'Start', metadata: [] }
    case 'task':
      return { type: 'task', title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] }
    case 'approval':
      return { type: 'approval', title: 'Approval', approverRole: 'Manager', autoApproveThreshold: 0 }
    case 'automated':
      return { type: 'automated', title: 'Automated Step', actionId: '', actionParams: {} }
    case 'end':
      return { type: 'end', endMessage: 'Workflow complete.', showSummary: false }
  }
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  simulationResult: null,
  isSimulating: false,
  sandboxOpen: false,

  onNodesChange: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),

  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),

  onConnect: (connection) =>
    set((state) => ({ edges: addEdge({ ...connection, animated: true }, state.edges) })),

  addNode: (type, position) => {
    const id = uuidv4()
    const newNode: WorkflowNode = {
      id,
      type,
      position,
      data: defaultData(type),
    }
    set((state) => ({ nodes: [...state.nodes, newNode] }))
  },

  updateNodeData: (id, data) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } as WorkflowNodeData } : n
      ),
    }))
  },

  deleteNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }))
  },

  selectNode: (id) => set({ selectedNodeId: id }),

  setSimulationResult: (result) => set({ simulationResult: result }),
  setIsSimulating: (v) => set({ isSimulating: v }),
  setSandboxOpen: (v) => set({ sandboxOpen: v }),
}))
