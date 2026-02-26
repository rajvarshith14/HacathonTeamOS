'use client'

import { WorkspaceProvider } from '@/lib/workspace-context'
import { WorkspaceShell } from '@/components/workspace/workspace-shell'
import { getMockHackathon } from '@/lib/mock-workspace'

/**
 * /workspace — the main workspace page.
 *
 * TODO: Replace getMockHackathon() with a real API fetch using the teamId
 * from the URL or session. The data should be fetched once here and passed
 * to WorkspaceProvider so all child components consume the same context.
 *
 * TODO: Add authentication guard — redirect to / if user is not signed in.
 */
export default function WorkspacePage() {
  // Fetch workspace data once and provide to all children
  const hackathon = getMockHackathon()

  return (
    <WorkspaceProvider hackathon={hackathon}>
      <WorkspaceShell />
    </WorkspaceProvider>
  )
}
