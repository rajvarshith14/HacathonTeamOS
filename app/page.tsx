'use client'

import { useState } from 'react'
import { SiteHeader } from '@/components/site-header'
import { MissionEntry } from '@/components/mission-entry'
import { CreateTeamDialog } from '@/components/create-team-dialog'
import { JoinTeamDialog } from '@/components/join-team-dialog'
import { RoleCommitmentFlow } from '@/components/role-commitment'
import { WorkspaceProvider } from '@/lib/workspace-context'
import { WorkspaceShell } from '@/components/workspace/workspace-shell'
import type { HackathonContext, RoleCommitment } from '@/lib/workspace-types'

// ---------------------------------------------------------------------------
// App phases — a single continuous flow
// ---------------------------------------------------------------------------

type AppPhase =
  | { step: 'entry' }
  | { step: 'commitment'; hackathon: HackathonContext; userName: string }
  | { step: 'workspace'; hackathon: HackathonContext }

export default function EntryPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false)
  const [phase, setPhase] = useState<AppPhase>({ step: 'entry' })

  // Called by CreateTeamDialog or JoinTeamDialog when team is ready
  const handleTeamReady = (hackathon: HackathonContext, userName: string) => {
    setPhase({ step: 'commitment', hackathon, userName })
  }

  // Called when user commits their role
  const handleCommit = (commitment: RoleCommitment, hackathon: HackathonContext) => {
    // Apply commitment to the hackathon context
    const updated: HackathonContext = {
      ...hackathon,
      members: hackathon.members.map((m) =>
        m.isCurrentUser
          ? { ...m, role: commitment.role, commitment, commitmentComplete: true }
          : m
      ),
      onboardingState: 'onboarding-complete',
    }
    setPhase({ step: 'workspace', hackathon: updated })
  }

  // Called when user skips commitment
  const handleSkip = (hackathon: HackathonContext) => {
    const updated: HackathonContext = {
      ...hackathon,
      members: hackathon.members.map((m) =>
        m.isCurrentUser
          ? { ...m, role: 'Joined — No Commitment', commitment: null, commitmentComplete: true }
          : m
      ),
      onboardingState: 'onboarding-complete',
    }
    setPhase({ step: 'workspace', hackathon: updated })
  }

  // -------------------------------------------------------------------------
  // Phase: Workspace — the full persistent environment
  // -------------------------------------------------------------------------
  if (phase.step === 'workspace') {
    return (
      <WorkspaceProvider hackathon={phase.hackathon}>
        <WorkspaceShell />
      </WorkspaceProvider>
    )
  }

  // -------------------------------------------------------------------------
  // Phase: Commitment — role commitment onboarding
  // -------------------------------------------------------------------------
  if (phase.step === 'commitment') {
    return (
      <RoleCommitmentFlow
        teamName={phase.hackathon.teamName}
        hackathonName={phase.hackathon.hackathonName}
        userName={phase.userName}
        onCommit={(commitment) => handleCommit(commitment, phase.hackathon)}
        onSkip={() => handleSkip(phase.hackathon)}
      />
    )
  }

  // -------------------------------------------------------------------------
  // Phase: Entry — create or join
  // -------------------------------------------------------------------------
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <MissionEntry
          onCreateHackathon={() => setCreateOpen(true)}
          onJoinHackathon={() => setJoinOpen(true)}
        />
      </main>

      <CreateTeamDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onTeamReady={handleTeamReady}
      />
      <JoinTeamDialog
        open={joinOpen}
        onOpenChange={setJoinOpen}
        onTeamReady={handleTeamReady}
      />
    </div>
  )
}
