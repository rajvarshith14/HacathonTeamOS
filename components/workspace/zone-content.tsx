'use client'

import {
  LayoutDashboard,
  Brain,
  FolderOpen,
  UserCog,
  Radio,
  Presentation,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Eye,
  Bell,
  Users,
  GitCommit,
  Play,
  FileText,
  MessageSquare,
  FolderTree,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useWorkspace } from '@/lib/workspace-context'
import type { WorkspaceZone } from '@/lib/workspace-types'
import { toast } from 'sonner'

// ---------------------------------------------------------------------------
// Zone content router
// ---------------------------------------------------------------------------

export function ZoneContent() {
  const { activeZone } = useWorkspace()

  const zones: Record<WorkspaceZone, React.ReactNode> = {
    'mission-control': <MissionControlZone />,
    'shared-ai': <SharedAIZone />,
    'project-folder': <ProjectFolderZone />,
    'role-workspaces': <RoleWorkspacesZone />,
    'live-feed': <LiveFeedZone />,
    'presentation-studio': <PresentationStudioZone />,
    'submission-readiness': <SubmissionReadinessZone />,
  }

  return (
    <ScrollArea className="flex-1 overflow-hidden">
      <div className="p-5">
        {zones[activeZone]}
      </div>
    </ScrollArea>
  )
}

// ---------------------------------------------------------------------------
// Shared components
// ---------------------------------------------------------------------------

function ZoneHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="mb-5 flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

function ActionCard({
  icon: Icon,
  label,
  description,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/50 p-3 text-left transition-colors hover:border-primary/30 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
        <Icon className="size-3.5 text-primary" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="text-[11px] leading-relaxed text-muted-foreground">{description}</span>
      </div>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Mission Control
// ---------------------------------------------------------------------------

function MissionControlZone() {
  const { hackathon } = useWorkspace()
  const online = hackathon.members.filter((m) => m.status === 'online').length
  const committed = hackathon.members.filter((m) => m.commitmentComplete).length
  const uncommitted = hackathon.members.filter((m) => !m.commitmentComplete)

  return (
    <div className="flex flex-col gap-5">
      <ZoneHeader
        icon={LayoutDashboard}
        title="Mission Control"
        description="High-level team alignment. Track health, run quick actions, and monitor onboarding."
      />

      {/* Health indicators */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1 rounded-lg border border-border/50 bg-card/50 p-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Members online
          </span>
          <span className="text-lg font-bold text-foreground">
            {online}<span className="text-sm font-normal text-muted-foreground">/{hackathon.members.length}</span>
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border/50 bg-card/50 p-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Commitments
          </span>
          <span className="text-lg font-bold text-foreground">
            {committed}<span className="text-sm font-normal text-muted-foreground">/{hackathon.members.length}</span>
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border/50 bg-card/50 p-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Demo-ready score
          </span>
          {/* TODO: Compute real demo-ready score from artifacts, tests, and completeness */}
          <span className="text-lg font-bold text-accent">
            Early
          </span>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="mb-2 text-xs font-medium text-foreground">Quick actions</h3>
        <div className="grid gap-2 sm:grid-cols-3">
          <ActionCard
            icon={Sparkles}
            label="Run AI Review"
            description="Let the Coach audit your current progress and suggest next steps."
            onClick={() => {
              // TODO: Trigger AI Coach review — POST /api/ai/review with current project state
              toast.info('AI Review would analyze your project and provide suggestions.')
            }}
          />
          <ActionCard
            icon={Play}
            label="Start demo preview"
            description="Launch a quick walkthrough of your current build."
            onClick={() => {
              // TODO: Open a demo preview overlay with current artifacts
              toast.info('Demo preview would show your end-to-end flow.')
            }}
          />
          <ActionCard
            icon={Bell}
            label="Remind team"
            description="Nudge teammates who have pending commitments."
            onClick={() => {
              // TODO: Send push/email notifications to uncommitted members
              toast.info(`Reminders sent to ${uncommitted.length} teammate(s).`)
            }}
          />
        </div>
      </div>

      {/* Onboarding checklist */}
      <div>
        <h3 className="mb-2 text-xs font-medium text-foreground">Onboarding checklist</h3>
        <div className="flex flex-col gap-1.5">
          {hackathon.members.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-md border border-border/50 bg-card/30 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`size-2 rounded-full ${m.commitmentComplete ? 'bg-primary' : 'bg-muted-foreground/40'}`}
                  aria-hidden="true"
                />
                <span className="text-xs text-foreground">{m.name}</span>
                {m.role && (
                  <Badge variant="secondary" className="text-[10px]">{m.role}</Badge>
                )}
                {!m.role && (
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">No role</Badge>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {m.commitmentComplete ? (
                  <CheckCircle2 className="size-3.5 text-primary" aria-label="Commitment complete" />
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      // TODO: Send targeted reminder or assign temporary owner
                      toast.info(`Reminded ${m.name} to complete commitment.`)
                    }}
                  >
                    <Bell className="size-3 mr-1" aria-hidden="true" />
                    Remind
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Shared AI
// ---------------------------------------------------------------------------

function SharedAIZone() {
  const EXAMPLE_SUGGESTIONS = [
    {
      id: 's1',
      prompt: 'How should we structure the API layer for our hackathon project?',
      response: {
        why: 'Your backend has no clear separation between routes and business logic.',
        what: 'Create a /services directory for business logic and keep /api routes thin.',
        risk: 'Without separation, debugging during the final hours will be painful.',
        links: 'Clean Architecture patterns, Express middleware docs',
      },
    },
    {
      id: 's2',
      prompt: 'What should we prioritize in the next 2 hours?',
      response: {
        why: 'You have 32h remaining and no end-to-end flow yet.',
        what: 'Get the happy-path working: signup -> dashboard -> one core action.',
        risk: 'Building features without a connected flow means no demo.',
        links: 'Demo Day best practices, MVP prioritization',
      },
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <ZoneHeader
        icon={Brain}
        title="Shared AI"
        description="Every prompt and response is visible to the whole team. The AI Coach builds on everyone's thinking — no siloed conversations."
      />

      {/* TODO: Wire real AI chat input — POST /api/ai/message with team context */}
      <div className="rounded-lg border border-dashed border-border/50 bg-card/30 p-4">
        <p className="text-xs text-muted-foreground">
          AI prompt input will appear here. All messages are team-visible by default.
        </p>
      </div>

      <Separator className="bg-border/30" />

      <h3 className="text-xs font-medium text-foreground">Example AI interactions</h3>
      <div className="flex flex-col gap-4">
        {EXAMPLE_SUGGESTIONS.map((s) => (
          <div key={s.id} className="rounded-lg border border-border/50 bg-card/50 p-4">
            <div className="mb-3 flex items-start gap-2">
              <Users className="mt-0.5 size-3.5 text-muted-foreground" aria-hidden="true" />
              <p className="text-xs text-foreground">{s.prompt}</p>
            </div>
            <div className="ml-5.5 flex flex-col gap-2 rounded-md bg-primary/5 p-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-3 text-primary" aria-hidden="true" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                  AI Coach
                </span>
              </div>
              <div className="grid gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
                <p><span className="font-mono font-medium text-foreground">WHY</span> {s.response.why}</p>
                <p><span className="font-mono font-medium text-foreground">WHAT</span> {s.response.what}</p>
                <p><span className="font-mono font-medium text-foreground">RISK</span> {s.response.risk}</p>
                <p><span className="font-mono font-medium text-foreground">LINKS</span> {s.response.links}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Project Folder
// ---------------------------------------------------------------------------

function ProjectFolderZone() {
  const FOLDER_STRUCTURE = [
    { path: 'frontend/', description: 'React/Next.js app, components, pages', icon: FolderTree },
    { path: 'backend/', description: 'API routes, services, database migrations', icon: FolderTree },
    { path: 'presentation/', description: 'Demo script, slides, screenshots', icon: Presentation },
    { path: 'docs/', description: 'Architecture notes, API specs, decisions', icon: FileText },
  ]

  return (
    <div className="flex flex-col gap-5">
      <ZoneHeader
        icon={FolderOpen}
        title="Project Folder"
        description="Shared file structure with threaded comments. Every artifact is organized, versioned, and visible to the team."
      />

      {/* Suggested structure */}
      <div>
        <h3 className="mb-2 text-xs font-medium text-foreground">Suggested structure</h3>
        <div className="flex flex-col gap-1.5">
          {FOLDER_STRUCTURE.map((f) => (
            <div key={f.path} className="flex items-start gap-3 rounded-md border border-border/50 bg-card/50 p-3">
              <f.icon className="mt-0.5 size-4 text-primary/60" aria-hidden="true" />
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-xs font-medium text-foreground">{f.path}</span>
                <span className="text-[11px] text-muted-foreground">{f.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-border/30" />

      {/* Threaded comment demo */}
      <div>
        <h3 className="mb-2 text-xs font-medium text-foreground">Threaded comments</h3>
        <div className="rounded-lg border border-border/50 bg-card/50 p-3">
          <div className="flex items-start gap-2 mb-2">
            <div className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">AC</div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] text-foreground">
                Should we use REST or GraphQL for the API?
              </span>
              <span className="text-[10px] text-muted-foreground">Alex Chen, 2h ago</span>
            </div>
          </div>
          <div className="ml-7 flex items-start gap-2 rounded-md bg-secondary/50 p-2">
            <div className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-accent/10 text-[9px] font-bold text-accent">SR</div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] text-foreground">
                REST for speed. We only have 32 hours and GraphQL adds setup overhead.
              </span>
              <span className="text-[10px] text-muted-foreground">Sam Rivera, 1h ago</span>
            </div>
          </div>
          {/* TODO: Wire threaded comments to POST /api/files/:fileId/comments */}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Role Workspaces
// ---------------------------------------------------------------------------

function RoleWorkspacesZone() {
  const { hackathon } = useWorkspace()
  const roles = hackathon.members.filter((m) => m.role)

  return (
    <div className="flex flex-col gap-5">
      <ZoneHeader
        icon={UserCog}
        title="Role Workspaces"
        description="Each role sees filtered tasks, relevant files, and role-specific chat. Switch perspectives to understand what each teammate is focused on."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {roles.map((m) => (
          <button
            key={m.id}
            className="flex flex-col gap-2 rounded-lg border border-border/50 bg-card/50 p-4 text-left transition-colors hover:border-primary/30 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => {
              // TODO: Open role-specific workspace view
              toast.info(`Opening ${m.role} workspace for ${m.name}.`)
            }}
          >
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-[10px]">{m.role}</Badge>
              <div className={`size-2 rounded-full ${m.status === 'online' ? 'bg-primary' : m.status === 'idle' ? 'bg-accent' : 'bg-muted-foreground/40'}`} aria-hidden="true" />
            </div>
            <span className="text-xs font-medium text-foreground">{m.name}</span>
            <div className="flex flex-col gap-1 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <FileText className="size-3" aria-hidden="true" />
                <span>3 files assigned</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageSquare className="size-3" aria-hidden="true" />
                <span>Role chat active</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {hackathon.members.filter((m) => !m.role).length > 0 && (
        <div className="rounded-md border border-dashed border-border/50 bg-card/30 p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-3.5 text-accent" aria-hidden="true" />
            <span className="text-xs text-muted-foreground">
              {hackathon.members.filter((m) => !m.role).length} member(s) have not claimed a role yet.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Live Feed
// ---------------------------------------------------------------------------

function LiveFeedZone() {
  const { activity } = useWorkspace()

  const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    'member-joined': Users,
    'commitment-saved': CheckCircle2,
    'hackathon-edited': FileText,
    'ai-suggestion': Sparkles,
  }

  return (
    <div className="flex flex-col gap-5">
      <ZoneHeader
        icon={Radio}
        title="Live Feed"
        description="Real-time stream of everything happening in this workspace. Decisions, commits, and AI insights all in one timeline."
      />

      {/* TODO: Subscribe to real-time activity events via WebSocket/Supabase Realtime */}
      <div className="flex flex-col gap-2">
        {activity.map((event) => {
          const Icon = typeIcons[event.type] || Radio
          const ago = getRelativeTime(event.timestamp)
          return (
            <div key={event.id} className="flex items-start gap-3 rounded-md border border-border/50 bg-card/50 p-3">
              <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-secondary">
                <Icon className="size-3 text-muted-foreground" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-foreground">
                  <span className="font-medium">{event.actor}</span>{' '}
                  {event.description}
                </span>
                <span className="text-[10px] text-muted-foreground">{ago}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Presentation Studio
// ---------------------------------------------------------------------------

function PresentationStudioZone() {
  return (
    <div className="flex flex-col gap-5">
      <ZoneHeader
        icon={Presentation}
        title="Presentation Studio"
        description="Build your demo script and slides. The AI Coach helps structure your narrative and identifies gaps in your story."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <ActionCard
          icon={FileText}
          label="Generate demo script"
          description="AI creates a structured walkthrough based on your current artifacts."
          onClick={() => {
            // TODO: POST /api/ai/demo-script with project artifacts
            toast.info('AI would generate a demo script from your project artifacts.')
          }}
        />
        <ActionCard
          icon={Eye}
          label="Preview presentation"
          description="Run through your slides and demo flow in presentation mode."
          onClick={() => {
            // TODO: Open presentation preview overlay
            toast.info('Presentation preview would show your slides and flow.')
          }}
        />
      </div>

      <Separator className="bg-border/30" />

      {/* Mock slide outline */}
      <div>
        <h3 className="mb-2 text-xs font-medium text-foreground">Suggested slide outline</h3>
        <div className="flex flex-col gap-1">
          {['Problem Statement', 'Our Solution', 'Live Demo', 'Tech Stack', 'What We Learned', 'Q&A'].map((slide, i) => (
            <div key={slide} className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-secondary/50">
              <span className="font-mono text-[10px] text-primary/60">{String(i + 1).padStart(2, '0')}</span>
              <span>{slide}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Submission Readiness
// ---------------------------------------------------------------------------

function SubmissionReadinessZone() {
  const { hackathon } = useWorkspace()

  const checklist = [
    { label: 'Project description written', done: true },
    { label: 'Demo video recorded or live demo ready', done: false },
    { label: 'README and documentation complete', done: false },
    { label: 'All team members listed', done: true },
    { label: 'Submission form fields filled', done: false },
    { label: 'End-to-end flow tested', done: false },
  ]

  const doneCount = checklist.filter((c) => c.done).length

  return (
    <div className="flex flex-col gap-5">
      <ZoneHeader
        icon={CheckCircle2}
        title="Submission Readiness"
        description="Track every requirement for a complete submission. Do not let a missing field cost you the hackathon."
      />

      <div className="rounded-lg border border-border/50 bg-card/50 p-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-foreground">Submission checklist</span>
          <Badge variant="outline" className="text-[10px] font-mono">
            {doneCount}/{checklist.length}
          </Badge>
        </div>
        <div className="flex flex-col gap-1.5">
          {checklist.map((item) => (
            <div key={item.label} className="flex items-center gap-2 rounded-md px-2 py-1.5">
              <div className={`size-3.5 rounded-sm border flex items-center justify-center ${item.done ? 'border-primary bg-primary/10' : 'border-border'}`}>
                {item.done && <CheckCircle2 className="size-2.5 text-primary" aria-hidden="true" />}
              </div>
              <span className={`text-xs ${item.done ? 'text-foreground' : 'text-muted-foreground'}`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <ActionCard
        icon={Shield}
        label="Run submission validator"
        description="AI checks all required fields and flags anything missing before you submit."
        onClick={() => {
          // TODO: POST /api/ai/validate-submission with project state
          toast.info('Submission validator would check all requirements.')
        }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function getRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
