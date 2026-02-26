'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Copy, Loader2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createTeam, type CreateTeamResponse } from '@/lib/mock-api'
import { createHackathonContext } from '@/lib/mock-workspace'
import type { HackathonContext } from '@/lib/workspace-types'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Australia/Sydney',
] as const

const TEAM_SIZES = [1, 2, 3, 4, 5, 6, 8, 10] as const

function getDefaultDatetimeLocal(offset: number): string {
  const d = new Date(Date.now() + offset)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

interface FormErrors {
  userName?: string
  teamName?: string
  hackathonName?: string
  startTime?: string
  endTime?: string
  timezone?: string
  teamSize?: string
}

function validate(fields: {
  userName: string
  teamName: string
  hackathonName: string
  startTime: string
  endTime: string
  timezone: string
  teamSize: string
}): FormErrors {
  const errors: FormErrors = {}

  if (!fields.userName.trim()) {
    errors.userName = 'Your name is required.'
  }

  if (!fields.teamName.trim()) {
    errors.teamName = 'Team name is required.'
  } else if (fields.teamName.trim().length < 2) {
    errors.teamName = 'Must be at least 2 characters.'
  }

  if (!fields.hackathonName.trim()) {
    errors.hackathonName = 'Hackathon name is required.'
  }

  if (!fields.startTime) {
    errors.startTime = 'Start time is required.'
  }

  if (!fields.endTime) {
    errors.endTime = 'End time is required.'
  } else if (fields.startTime && new Date(fields.endTime) <= new Date(fields.startTime)) {
    errors.endTime = 'End time must be after start time.'
  }

  if (!fields.timezone) {
    errors.timezone = 'Please select a timezone.'
  }

  if (!fields.teamSize) {
    errors.teamSize = 'Please select a team size.'
  }

  return errors
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface CreateTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTeamReady: (hackathon: HackathonContext, userName: string) => void
}

export function CreateTeamDialog({ open, onOpenChange, onTeamReady }: CreateTeamDialogProps) {
  // Form state
  const [userName, setUserName] = useState('')
  const [teamName, setTeamName] = useState('')
  const [hackathonName, setHackathonName] = useState('')
  const [startTime, setStartTime] = useState(getDefaultDatetimeLocal(0))
  const [endTime, setEndTime] = useState(getDefaultDatetimeLocal(36 * 3600_000))
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
  const [teamSize, setTeamSize] = useState('4')

  // UI state
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<CreateTeamResponse | null>(null)

  const resetForm = useCallback(() => {
    setUserName('')
    setTeamName('')
    setHackathonName('')
    setStartTime(getDefaultDatetimeLocal(0))
    setEndTime(getDefaultDatetimeLocal(36 * 3600_000))
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
    setTeamSize('4')
    setErrors({})
    setSubmitting(false)
    setResult(null)
  }, [])

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) resetForm()
      onOpenChange(next)
    },
    [onOpenChange, resetForm]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formErrors = validate({
      userName,
      teamName,
      hackathonName,
      startTime,
      endTime,
      timezone,
      teamSize,
    })

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setErrors({})
    setSubmitting(true)

    try {
      const response = await createTeam({
        teamName: teamName.trim(),
        hackathonName: hackathonName.trim(),
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        timezone,
        teamSize: Number(teamSize),
      })

      setResult(response)
      toast.success('Team created! Share the invite code with your teammates.')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Something went wrong.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const copyInviteCode = () => {
    if (result?.inviteCode) {
      navigator.clipboard.writeText(result.inviteCode)
      toast.success('Invite code copied to clipboard.')
    }
  }

  const handleEnterWorkspace = () => {
    if (!result) return
    const hackathon = createHackathonContext({
      teamName: result.teamName,
      hackathonName: result.hackathonName,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      timezone,
      inviteCode: result.inviteCode,
      userName: userName.trim(),
    })
    handleOpenChange(false)
    onTeamReady(hackathon, userName.trim())
  }

  // ---------------------------------------------------------------------------
  // Success state — show invite code, then proceed
  // ---------------------------------------------------------------------------

  if (result) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Team Created</DialogTitle>
            <DialogDescription>
              Share this invite code with your teammates so they can join.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              {result.hackathonName} — {result.teamName}
            </p>
            <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-6 py-4">
              <span className="font-mono text-2xl font-bold tracking-[0.3em] text-primary">
                {result.inviteCode}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={copyInviteCode}
                aria-label="Copy invite code"
              >
                <Copy className="size-4 text-primary" />
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Your workspace is ready. Share this code so your team can join.
            </p>
          </div>

          <DialogFooter>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleEnterWorkspace}
            >
              Enter Workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // ---------------------------------------------------------------------------
  // Form state
  // ---------------------------------------------------------------------------

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">Start a Hackathon</DialogTitle>
          <DialogDescription>
            Define your hackathon, set the deadline, and invite your team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          {/* Your Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-user-name">Your Name</Label>
            <Input
              id="create-user-name"
              placeholder="e.g. Alex Chen"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              aria-invalid={!!errors.userName}
              aria-describedby={errors.userName ? 'err-user-name' : undefined}
              autoFocus
            />
            {errors.userName && (
              <p id="err-user-name" className="text-xs text-destructive-foreground">
                {errors.userName}
              </p>
            )}
          </div>

          {/* Team Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-team-name">Team Name</Label>
            <Input
              id="create-team-name"
              placeholder="e.g. Quantum Quokkas"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              aria-invalid={!!errors.teamName}
              aria-describedby={errors.teamName ? 'err-team-name' : undefined}
            />
            {errors.teamName && (
              <p id="err-team-name" className="text-xs text-destructive-foreground">
                {errors.teamName}
              </p>
            )}
          </div>

          {/* Hackathon Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-hackathon-name">Hackathon Name</Label>
            <Input
              id="create-hackathon-name"
              placeholder="e.g. TreeHacks 2026"
              value={hackathonName}
              onChange={(e) => setHackathonName(e.target.value)}
              aria-invalid={!!errors.hackathonName}
              aria-describedby={
                errors.hackathonName ? 'err-hackathon-name' : undefined
              }
            />
            {errors.hackathonName && (
              <p
                id="err-hackathon-name"
                className="text-xs text-destructive-foreground"
              >
                {errors.hackathonName}
              </p>
            )}
          </div>

          {/* Start / End times */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-start-time">Start Time</Label>
              <Input
                id="create-start-time"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                aria-invalid={!!errors.startTime}
                aria-describedby={
                  errors.startTime ? 'err-start-time' : undefined
                }
              />
              {errors.startTime && (
                <p
                  id="err-start-time"
                  className="text-xs text-destructive-foreground"
                >
                  {errors.startTime}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-end-time">End Time</Label>
              <Input
                id="create-end-time"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                aria-invalid={!!errors.endTime}
                aria-describedby={errors.endTime ? 'err-end-time' : undefined}
              />
              {errors.endTime && (
                <p
                  id="err-end-time"
                  className="text-xs text-destructive-foreground"
                >
                  {errors.endTime}
                </p>
              )}
            </div>
          </div>

          {/* Timezone & Team Size */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-timezone">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger
                  id="create-timezone"
                  className="w-full"
                  aria-invalid={!!errors.timezone}
                >
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.timezone && (
                <p className="text-xs text-destructive-foreground">
                  {errors.timezone}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-team-size">Team Size</Label>
              <Select value={teamSize} onValueChange={setTeamSize}>
                <SelectTrigger
                  id="create-team-size"
                  className="w-full"
                  aria-invalid={!!errors.teamSize}
                >
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_SIZES.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size === 1 ? 'Solo' : `${size} people`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.teamSize && (
                <p className="text-xs text-destructive-foreground">
                  {errors.teamSize}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Zap className="size-4" />
                  Create Team
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
