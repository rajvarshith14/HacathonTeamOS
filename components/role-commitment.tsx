'use client'

import { useState } from 'react'
import {
  Terminal,
  Shield,
  ArrowRight,
  SkipForward,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import type { RoleCommitment } from '@/lib/workspace-types'

// ---------------------------------------------------------------------------
// Suggested roles — not auto-assigned, just offered as inspiration
// ---------------------------------------------------------------------------

const SUGGESTED_ROLES = [
  'Frontend Lead',
  'Backend Lead',
  'Designer',
  'ML / AI Engineer',
  'Full-Stack',
  'Product / PM',
  'DevOps',
  'Research',
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface RoleCommitmentFlowProps {
  teamName: string
  hackathonName: string
  userName: string
  onCommit: (commitment: RoleCommitment) => void
  onSkip: () => void
}

export function RoleCommitmentFlow({
  teamName,
  hackathonName,
  userName,
  onCommit,
  onSkip,
}: RoleCommitmentFlowProps) {
  const [role, setRole] = useState('')
  const [deliverables, setDeliverables] = useState('')
  const [responsibilityShare, setResponsibilityShare] = useState(50)
  const [accepted, setAccepted] = useState(false)

  const [errors, setErrors] = useState<{ role?: string; deliverables?: string; accepted?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: typeof errors = {}

    if (!role.trim()) newErrors.role = 'Choose or type a role.'
    if (!deliverables.trim()) newErrors.deliverables = 'Describe what you will deliver.'
    if (!accepted) newErrors.accepted = 'You must accept responsibility to commit.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onCommit({
      role: role.trim(),
      deliverables: deliverables.trim(),
      responsibilityShare,
      accepted: true,
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Minimal header */}
      <header className="border-b border-border/50 bg-card/50 px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="size-4 text-primary" aria-hidden="true" />
            <span className="font-mono text-xs font-bold tracking-wider text-foreground">
              hackathon<span className="text-primary">OS</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{teamName}</span>
            <span>/</span>
            <span>{hackathonName}</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          {/* Introduction */}
          <div className="mb-8 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Shield className="size-5 text-primary" aria-hidden="true" />
              <h1 className="text-lg font-bold text-foreground">
                Define Your Commitment
              </h1>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">{userName}</span>. Before entering the workspace, tell your team what you will own.
              This is not assigned to you — you choose it. Your teammates will see exactly what you committed to.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
            {/* Role selection */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="commitment-role" className="text-sm font-medium text-foreground">
                What role will you take?
              </Label>
              <Input
                id="commitment-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Type your role or pick one below..."
                aria-invalid={!!errors.role}
                aria-describedby={errors.role ? 'err-role' : 'role-suggestions'}
              />
              {errors.role && (
                <p id="err-role" className="text-xs text-destructive-foreground">{errors.role}</p>
              )}
              <div id="role-suggestions" className="flex flex-wrap gap-1.5">
                {SUGGESTED_ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`rounded-md border px-2.5 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      role === r
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-border/50 bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="commitment-deliverables" className="text-sm font-medium text-foreground">
                What will you deliver?
              </Label>
              <p className="text-xs text-muted-foreground">
                Describe the specific things you will build or produce during this hackathon.
              </p>
              <Textarea
                id="commitment-deliverables"
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
                placeholder="e.g. Landing page with auth flow, API endpoints for user data, dashboard components..."
                className="min-h-[100px] resize-none text-sm"
                aria-invalid={!!errors.deliverables}
                aria-describedby={errors.deliverables ? 'err-deliverables' : undefined}
              />
              {errors.deliverables && (
                <p id="err-deliverables" className="text-xs text-destructive-foreground">{errors.deliverables}</p>
              )}
            </div>

            {/* Responsibility share */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">
                  Responsibility share
                </Label>
                <Badge variant="secondary" className="font-mono text-xs">
                  {responsibilityShare}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                How much of the total project workload are you taking on? This is visible to teammates and helps balance the team.
              </p>
              <Slider
                value={[responsibilityShare]}
                onValueChange={([val]) => setResponsibilityShare(val)}
                min={10}
                max={100}
                step={5}
                className="w-full"
                aria-label="Responsibility share percentage"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground/60">
                <span>10%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Acceptance */}
            <div className="rounded-lg border border-border/50 bg-card/50 p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="commitment-accept"
                  checked={accepted}
                  onCheckedChange={(checked) => setAccepted(checked === true)}
                  aria-invalid={!!errors.accepted}
                  className="mt-0.5"
                />
                <div className="flex flex-col gap-1">
                  <Label htmlFor="commitment-accept" className="text-sm font-medium text-foreground cursor-pointer">
                    I accept responsibility for these deliverables
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Your team is counting on you. This commitment is visible to everyone and tracked throughout the hackathon.
                  </p>
                </div>
              </div>
              {errors.accepted && (
                <p className="mt-2 text-xs text-destructive-foreground">{errors.accepted}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-border/50 pt-5">
              <Button
                type="button"
                variant="ghost"
                onClick={onSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                <SkipForward className="size-4" aria-hidden="true" />
                <span className="text-sm">Skip for now</span>
              </Button>

              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <CheckCircle2 className="size-4" aria-hidden="true" />
                <span className="text-sm">Commit and Enter Workspace</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>

            <p className="text-center text-[11px] text-muted-foreground/60">
              If you skip, you will be marked as &quot;Joined — No Commitment&quot; and can set your role later from inside the workspace.
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}
