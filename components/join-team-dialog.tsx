'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface JoinTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JoinTeamDialog({ open, onOpenChange }: JoinTeamDialogProps) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<JoinTeamResponse | null>(null)

  const resetForm = useCallback(() => {
    setCode('')
    setError('')
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

    if (code.length < 6) {
      setError('Please enter the full 6-character invite code.')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      // TODO: Replace joinTeam() with real API call. The user should be
      // authenticated before joining, or prompted to create an account.
      // After joining, navigate to /workspace/[teamId].
      const response = await joinTeam({ inviteCode: code.toUpperCase() })

      setResult(response)
      toast.success(`Joined ${response.teamName}!`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
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
              Welcome to {result.teamName}. {result.memberCount} teammates are
              already here.
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
              {/* TODO: Live member count via real-time subscriptions. */}
              {result.memberCount} teammates already here
            </p>
          </div>

          <DialogFooter>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                // TODO: Navigate to /workspace/[teamId] with real teamId
                handleOpenChange(false)
                router.push('/workspace')
              }}
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Join a Hackathon</DialogTitle>
          <DialogDescription>
            Enter the 6-character invite code shared by your team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <div className="flex flex-col items-center gap-3">
            <Label htmlFor="join-code" className="sr-only">
              Invite Code
            </Label>
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
