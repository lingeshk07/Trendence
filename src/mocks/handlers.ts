import { http, HttpResponse } from 'msw'
import type { SimulationRequest, SimulationStep } from '../types/workflow.types'

const automations = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'notify_slack', label: 'Notify Slack', params: ['channel', 'message'] },
  { id: 'create_ticket', label: 'Create JIRA Ticket', params: ['project', 'summary'] },
  { id: 'update_hris', label: 'Update HRIS Record', params: ['employeeId', 'field'] },
]

export const handlers = [
  http.get('/automations', () => {
    return HttpResponse.json(automations)
  }),

  http.post('/simulate', async ({ request }) => {
    const body = (await request.json()) as SimulationRequest
    const { nodes, edges } = body

    // Validate: must have start node
    const startNode = nodes.find((n) => n.type === 'start')
    if (!startNode) {
      return HttpResponse.json(
        { status: 'error', steps: [], error: 'Workflow must have a Start node.' },
        { status: 400 }
      )
    }

    // Validate: must have end node
    const endNode = nodes.find((n) => n.type === 'end')
    if (!endNode) {
      return HttpResponse.json(
        { status: 'error', steps: [], error: 'Workflow must have an End node.' },
        { status: 400 }
      )
    }

    // Topological sort via BFS from start node
    const adjMap: Record<string, string[]> = {}
    nodes.forEach((n) => (adjMap[n.id] = []))
    edges.forEach((e) => {
      if (adjMap[e.source]) adjMap[e.source].push(e.target)
    })

    const visited: string[] = []
    const queue = [startNode.id]
    while (queue.length) {
      const curr = queue.shift()!
      if (visited.includes(curr)) continue
      visited.push(curr)
      ;(adjMap[curr] || []).forEach((next) => queue.push(next))
    }

    const orderedNodes = visited
      .map((id) => nodes.find((n) => n.id === id))
      .filter(Boolean) as SimulationRequest['nodes']

    const steps: SimulationStep[] = orderedNodes.map((node, i) => {
      const baseTime = new Date(Date.now() + i * 1500)
      const data = node.data as unknown as Record<string, unknown>

      const statusMap: Record<string, SimulationStep['status']> = {
        start: 'completed',
        task: 'completed',
        approval: 'approved',
        automated: 'triggered',
        end: 'completed',
      }

      return {
        nodeId: node.id,
        label: (data.title as string) || node.type,
        status: statusMap[node.type] || 'completed',
        timestamp: baseTime.toISOString(),
        detail: getDetail(node),
      }
    })

    return HttpResponse.json({ status: 'success', steps })
  }),
]

function getDetail(node: SimulationRequest['nodes'][0]): string {
  const d = node.data as unknown as Record<string, unknown>
  switch (node.type) {
    case 'task':
      return `Assigned to: ${d.assignee || 'Unassigned'}`
    case 'approval':
      return `Approver: ${d.approverRole || 'Manager'}`
    case 'automated':
      return `Action triggered: ${d.actionId || 'N/A'}`
    case 'end':
      return (d.endMessage as string) || 'Workflow complete.'
    default:
      return ''
  }
}
