'use client'

import { useState } from 'react'
import { SiteHeader } from '@/components/site-header'
import { MissionEntry } from '@/components/mission-entry'
import { CreateTeamDialog } from '@/components/create-team-dialog'
import { JoinTeamDialog } from '@/components/join-team-dialog'

export default function EntryPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <MissionEntry
          onCreateHackathon={() => setCreateOpen(true)}
          onJoinHackathon={() => setJoinOpen(true)}
        />
      </main>

      <CreateTeamDialog open={createOpen} onOpenChange={setCreateOpen} />
      <JoinTeamDialog open={joinOpen} onOpenChange={setJoinOpen} />
    </div>
  )
}
