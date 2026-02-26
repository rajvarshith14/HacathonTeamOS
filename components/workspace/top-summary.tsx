'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Terminal,
  Clock,
  Play,
  AlertTriangle,
  Bell,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useWorkspace } from '@/lib/workspace-context'
import type { OnboardingState, Phase } from '@/lib/workspace-types'
import { toast } from 'sonner'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PHASE_LABELS: Record<Phase, string> = {
  planning: 'Planning',
  build: 'Build',
  submission: 'Submission',
  presentation: 'Presentation',
}

const ONBOARDING_LABELS: Record<OnboardingState, string> = {
  'solo-mode': 'Solo Mode',
  'team-forming': 'Team Forming',
  'commitments-in-progress': 'Commitments In Progress',
  'onboarding-complete': 'Onboarding Complete',
}

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

// TODO: OWNER_LOCK_REQUIRED — when true, the owner must explicitly lock
// onboarding before it is marked complete. Set to false for permissive mode.
// Toggle this flag to switch between strict and permissive onboarding gating.
const OWNER_LOCK_REQUIRED = false

export function TopSummary() {
  const { hackathon } = useWorkspace()
  const [remaining, setRemaining] = useState(0)
  const [gateOpen, setGateOpen] = useState(false)

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

  const isOnboardingComplete = hackathon.onboardingState === 'onboarding-complete'
  const isSolo = hackathon.members.length <= 1

  const handleEnter = useCallback(() => {
    if (isOnboardingComplete || isSolo) {
      // TODO: Navigate to the active zone / full workspace mode
      toast.success('Entering workspace.')
    } else {
      setGateOpen(true)
    }
  }, [isOnboardingComplete, isSolo])

  const handleProceed = useCallback(() => {
    setGateOpen(false)
    // TODO: Navigate to the active zone / full workspace mode
    toast.success('Entering workspace — some commitments are still pending.')
  }, [])

  const handleRemind = useCallback(() => {
    setGateOpen(false)
    // TODO: Send reminder notifications to uncommitted members
    toast.info('Reminders sent to teammates with pending commitments.')
  }, [])

  const uncommittedCount = hackathon.members.filter((m) => !m.commitmentComplete).length

  return (
    <>
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

        {/* Phase badge */}
        <Badge variant="secondary" className="text-[10px] font-mono uppercase tracking-wider">
          {PHASE_LABELS[hackathon.phase]}
        </Badge>

        {/* Onboarding state badge */}
        <Badge
          variant={isOnboardingComplete ? 'default' : 'outline'}
          className="text-[10px] font-mono uppercase tracking-wider"
        >
          {ONBOARDING_LABELS[hackathon.onboardingState]}
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

        {/* Enter workspace */}
        <Button
          size="sm"
          className="h-7 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleEnter}
          aria-label="Enter workspace"
        >
          <Play className="size-3" aria-hidden="true" />
          <span className="text-xs">Enter Workspace</span>
        </Button>
      </div>

      {/* Soft-gate confirmation dialog */}
      <Dialog open={gateOpen} onOpenChange={setGateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="size-4 text-accent" aria-hidden="true" />
              Commitments incomplete
            </DialogTitle>
            <DialogDescription>
              {uncommittedCount} teammate{uncommittedCount !== 1 ? 's have' : ' has'} not
              completed their commitments yet. You can proceed anyway or send a reminder.
              {OWNER_LOCK_REQUIRED && (
                <span className="mt-1 block text-xs text-muted-foreground">
                  Owner lock is enabled — onboarding will not be marked complete
                  until the owner locks commitments.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={handleRemind}
              className="gap-1.5"
            >
              <Bell className="size-3.5" aria-hidden="true" />
              Stay & remind
            </Button>
            <Button
              onClick={handleProceed}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
            >
              <Play className="size-3.5" aria-hidden="true" />
              Proceed anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
