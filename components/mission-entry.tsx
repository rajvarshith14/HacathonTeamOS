'use client'

import { Terminal, Rocket, Users, ArrowRight, Clock, Brain, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MissionEntryProps {
  onCreateHackathon: () => void
  onJoinHackathon: () => void
}

function StatusIndicator() {
  return (
    <span className="relative flex size-2">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-50" />
      <span className="relative inline-flex size-2 rounded-full bg-primary" />
    </span>
  )
}

export function MissionEntry({ onCreateHackathon, onJoinHackathon }: MissionEntryProps) {
  return (
    <section className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-16">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(oklch(0.75 0.15 195) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.15 195) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-12">
        {/* Status bar */}
        <div className="flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-1.5">
          <StatusIndicator />
          <span className="font-mono text-xs tracking-wider text-muted-foreground">
            System ready
          </span>
        </div>

        {/* Core message */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Every hackathon has a deadline.
            <br />
            <span className="text-primary">This is how you meet it.</span>
          </h1>
          <p className="max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Hackathon OS is a time-aware workspace with an AI Coach that keeps
            your team aligned from kickoff to demo. Start a new hackathon or join
            one already in progress.
          </p>
        </div>

        {/* Two entry paths */}
        <div className="grid w-full gap-4 sm:grid-cols-2">
          {/* Start a Hackathon */}
          <button
            onClick={onCreateHackathon}
            className="group flex flex-col gap-4 rounded-lg border border-border/50 bg-card/50 p-6 text-left transition-all hover:border-primary/40 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Rocket className="size-5" />
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-base font-semibold text-foreground">
                Start a Hackathon
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Create a workspace, set your deadline, and invite your team. The
                AI Coach activates as soon as you begin.
              </p>
            </div>
          </button>

          {/* Join a Hackathon */}
          <button
            onClick={onJoinHackathon}
            className="group flex flex-col gap-4 rounded-lg border border-border/50 bg-card/50 p-6 text-left transition-all hover:border-primary/40 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Users className="size-5" />
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-base font-semibold text-foreground">
                Join a Hackathon
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Enter the invite code from your team lead. You will see your
                teammates appear the moment you arrive.
              </p>
            </div>
          </button>
        </div>

        {/* Capabilities strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Capability icon={Clock} label="Time-aware workspace" />
          <Capability icon={Brain} label="AI Coach" />
          <Capability icon={MessageSquare} label="Shared timeline" />
          <Capability icon={Users} label="Real-time presence" />
        </div>
      </div>
    </section>
  )
}

function Capability({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-3.5 text-primary/60" />
      <span className="font-mono text-xs tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  )
}
