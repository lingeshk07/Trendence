import { useCallback, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useWorkflowStore } from '../../store/workflowStore'
import { StartNode } from '../nodes/StartNode'
import { TaskNode } from '../nodes/TaskNode'
import { ApprovalNode } from '../nodes/ApprovalNode'
import { AutomatedNode } from '../nodes/AutomatedNode'
import { EndNode } from '../nodes/EndNode'
import type { WorkflowNodeData } from '../../types/workflow.types'

const nodeTypes: NodeTypes = {
  start: StartNode as unknown as NodeTypes[string],
  task: TaskNode as unknown as NodeTypes[string],
  approval: ApprovalNode as unknown as NodeTypes[string],
  automated: AutomatedNode as unknown as NodeTypes[string],
  end: EndNode as unknown as NodeTypes[string],
}

export function WorkflowCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, selectNode } =
    useWorkflowStore()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const type = e.dataTransfer.getData('application/reactflow-type') as WorkflowNodeData['type']
      if (!type || !wrapperRef.current) return

      const bounds = wrapperRef.current.getBoundingClientRect()
      const position = {
        x: e.clientX - bounds.left - 90,
        y: e.clientY - bounds.top - 40,
      }
      addNode(type, position)
    },
    [addNode]
  )

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  return (
    <div ref={wrapperRef} className="h-full w-full" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => selectNode(node.id)}
        onPaneClick={() => selectNode(null)}
        fitView
        deleteKeyCode="Delete"
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#4f8ef7', strokeWidth: 1.5 },
        }}
        style={{ background: 'transparent' }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#2a3347"
        />
        <Controls
          className="!bg-panel !border-border !rounded-xl overflow-hidden"
          style={{ boxShadow: 'none' }}
        />
        <MiniMap
          nodeColor={(node) => {
            const map: Record<string, string> = {
              start: '#22d3a5',
              task: '#4f8ef7',
              approval: '#f59e0b',
              automated: '#c084fc',
              end: '#f43f5e',
            }
            return map[node.type!] || '#2a3347'
          }}
          className="!bg-panel !border !border-border !rounded-xl overflow-hidden"
          style={{ boxShadow: 'none' }}
        />
      </ReactFlow>

      {nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-3 opacity-20">⟶</p>
            <p className="text-sm font-medium text-muted/50">Drag nodes from the left panel</p>
            <p className="text-xs text-muted/30 mt-1">to start building your workflow</p>
          </div>
        </div>
      )}
    </div>
  )
}
