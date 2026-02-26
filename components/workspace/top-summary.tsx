'use client'

import { useState, useEffect } from 'react'
import {
  Terminal,
  Clock,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { useWorkspace } from '@/lib/workspace-context'
import type { Phase } from '@/lib/workspace-types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Lifecycle phases in order — matches the nav rail stages
const LIFECYCLE_PHASES: { id: Phase; label: string }[] = [
  { id: 'planning',      label: 'Plan' },
  { id: 'build',         label: 'Build' },
  { id: 'submission',    label: 'Submit' },
  { id: 'presentation',  label: 'Present' },
]

function formatCountdown(ms: number): { h: string; m: string; s: string } {
  if (ms <= 0) return { h: '00', m: '00', s: '00' }
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return {
    h: String(h).padStart(2, '0'),
    m: String(m).padStart(2, '0'),
    s: String(s).padStart(2, '0'),
  }
}

/** Returns a urgency class based on remaining fraction of time */
function urgencyClass(remaining: number, total: number): string {
  if (total <= 0) return 'text-destructive'
  const frac = remaining / total
  if (frac > 0.5) return 'text-primary'
  if (frac > 0.2) return 'text-accent'
  return 'text-destructive'
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TopSummary() {
  const { hackathon } = useWorkspace()
  const [remaining, setRemaining] = useState(0)

  const totalDuration =
    new Date(hackathon.endTime).getTime() - new Date(hackathon.startTime).getTime()

  useEffect(() => {
    function tick() {
      setRemaining(Math.max(0, new Date(hackathon.endTime).getTime() - Date.now()))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [hackathon.endTime])

  const countdown = formatCountdown(remaining)
  const timerColor = urgencyClass(remaining, totalDuration)

  const currentPhaseIndex = LIFECYCLE_PHASES.findIndex((p) => p.id === hackathon.phase)

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border/50 bg-card/50 px-4 py-2.5">
      {/* Brand mark */}
      <div className="flex items-center gap-2">
        <Terminal className="size-4 text-primary" aria-hidden="true" />
        <span className="font-mono text-xs font-bold tracking-wider text-foreground">
          hackathon<span className="text-primary">OS</span>
        </span>
      </div>

      {/* Separator */}
      <div className="hidden h-5 w-px bg-border/50 sm:block" aria-hidden="true" />

      {/* Team + Hackathon */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-medium text-foreground">{hackathon.teamName}</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">{hackathon.hackathonName}</span>
      </div>

      {/* Phase progress — linear steps */}
      <div className="hidden items-center gap-1 sm:flex" role="list" aria-label="Hackathon phase progress">
        {LIFECYCLE_PHASES.map((phase, i) => {
          const isCurrent = i === currentPhaseIndex
          const isPast = i < currentPhaseIndex
          return (
            <div key={phase.id} className="flex items-center gap-1" role="listitem">
              {i > 0 && (
                <div
                  className={`h-px w-3 ${isPast ? 'bg-primary/40' : 'bg-border/50'}`}
                  aria-hidden="true"
                />
              )}
              <span
                className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  isCurrent
                    ? 'bg-primary/10 text-primary font-medium'
                    : isPast
                      ? 'text-primary/50'
                      : 'text-muted-foreground/40'
                }`}
              >
                {phase.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Mobile: simple phase badge */}
      <Badge variant="secondary" className="text-[10px] font-mono uppercase tracking-wider sm:hidden">
        {LIFECYCLE_PHASES[currentPhaseIndex]?.label ?? hackathon.phase}
      </Badge>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Countdown */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex items-center gap-1.5"
            role="timer"
            aria-label={`${countdown.h} hours ${countdown.m} minutes ${countdown.s} seconds remaining`}
          >
            <Clock className={`size-3.5 ${timerColor}`} aria-hidden="true" />
            <span className={`font-mono text-sm font-bold tabular-nums tracking-wider ${timerColor}`}>
              {countdown.h}:{countdown.m}:{countdown.s}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>Time remaining until submission deadline</TooltipContent>
      </Tooltip>
    </div>
  )
}
