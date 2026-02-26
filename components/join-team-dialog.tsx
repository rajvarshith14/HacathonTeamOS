'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Loader2, Users } from 'lucide-react'
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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { joinTeam, type JoinTeamResponse } from '@/lib/mock-api'
import { joinHackathonContext } from '@/lib/mock-workspace'
import type { HackathonContext } from '@/lib/workspace-types'

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface JoinTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTeamReady: (hackathon: HackathonContext, userName: string) => void
}

export function JoinTeamDialog({ open, onOpenChange, onTeamReady }: JoinTeamDialogProps) {
  const [userName, setUserName] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [nameError, setNameError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<JoinTeamResponse | null>(null)

  const resetForm = useCallback(() => {
    setUserName('')
    setCode('')
    setError('')
    setNameError('')
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

    let hasError = false
    if (!userName.trim()) {
      setNameError('Your name is required.')
      hasError = true
    } else {
      setNameError('')
    }

    if (code.length < 6) {
      setError('Please enter the full 6-character invite code.')
      hasError = true
    } else {
      setError('')
    }

    if (hasError) return

    setSubmitting(true)

    try {
      const response = await joinTeam({ inviteCode: code.toUpperCase() })
      setResult(response)
      toast.success(`Joined ${response.teamName}!`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEnterWorkspace = () => {
    if (!result) return
    const hackathon = joinHackathonContext({
      teamName: result.teamName,
      hackathonName: result.hackathonName,
      teamId: result.teamId,
      inviteCode: code.toUpperCase(),
      userName: userName.trim(),
    })
    handleOpenChange(false)
    onTeamReady(hackathon, userName.trim())
  }

  // ---------------------------------------------------------------------------
  // Success state
  // ---------------------------------------------------------------------------

  if (result) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              You&apos;re In
            </DialogTitle>
            <DialogDescription>
              Welcome to {result.teamName}.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-3 py-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="size-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {result.hackathonName}
            </p>
            <p className="text-xs text-muted-foreground">
              You will now set your role commitment before entering the workspace.
            </p>
          </div>

          <DialogFooter>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleEnterWorkspace}
            >
              Continue to Role Commitment
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Join a Hackathon</DialogTitle>
          <DialogDescription>
            Enter your name and the 6-character invite code shared by your team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          {/* User name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="join-user-name">Your Name</Label>
            <Input
              id="join-user-name"
              placeholder="e.g. Sam Rivera"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              aria-invalid={!!nameError}
              aria-describedby={nameError ? 'err-join-name' : undefined}
              autoFocus
            />
            {nameError && (
              <p id="err-join-name" className="text-xs text-destructive-foreground" role="alert">
                {nameError}
              </p>
            )}
          </div>

          {/* Invite code */}
          <div className="flex flex-col items-center gap-3">
            <Label htmlFor="join-code">Invite Code</Label>
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
              aria-invalid={!!error}
              aria-describedby={error ? 'err-join-code' : undefined}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            {error && (
              <p id="err-join-code" className="text-center text-xs text-destructive-foreground" role="alert">
                {error}
              </p>
            )}
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
              disabled={submitting || code.length < 6}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <Users className="size-4" />
                  Join Team
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
