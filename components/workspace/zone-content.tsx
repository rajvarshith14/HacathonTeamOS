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
  Users,
  FileText,
  MessageSquare,
  FolderTree,
  Shield,
} from 'lucide-react'
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
  const isSolo = hackathon.members.length <= 1
  const allCommitted = committed === hackathon.members.length

  return (
    <div className="flex flex-col gap-5">
      <ZoneHeader
        icon={LayoutDashboard}
        title="Mission Control"
        description="Your team's live status. Everything here reflects real activity — nothing is simulated."
      />

      {/* Team status */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1 rounded-lg border border-border/50 bg-card/50 p-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Team members
          </span>
          <span className="text-lg font-bold text-foreground">
            {online} <span className="text-sm font-normal text-muted-foreground">online</span>
            <span className="text-sm font-normal text-muted-foreground"> / {hackathon.members.length} total</span>
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border/50 bg-card/50 p-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Commitments
          </span>
          {allCommitted ? (
            <span className="text-lg font-bold text-primary">All complete</span>
          ) : (
            <span className="text-lg font-bold text-foreground">
              {committed}<span className="text-sm font-normal text-muted-foreground"> of {hackathon.members.length} complete</span>
            </span>
          )}
        </div>
      </div>

      {/* Solo mode notice */}
      {isSolo && (
        <div className="rounded-lg border border-dashed border-border/50 bg-card/30 p-4">
          <div className="flex items-start gap-3">
            <Users className="mt-0.5 size-4 text-muted-foreground" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-foreground">You are working solo</span>
              <span className="text-[11px] leading-relaxed text-muted-foreground">
                You can invite teammates anytime by sharing your team invite code. The workspace works fine solo — collaboration features will activate when others join.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Team roster */}
      <div>
        <h3 className="mb-2 text-xs font-medium text-foreground">Team roster</h3>
        <div className="flex flex-col gap-1.5">
          {hackathon.members.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-md border border-border/50 bg-card/30 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`size-2 rounded-full ${m.status === 'online' ? 'bg-primary' : m.status === 'idle' ? 'bg-accent' : 'bg-muted-foreground/40'}`}
                  aria-hidden="true"
                />
                <span className="text-xs text-foreground">{m.name}</span>
                {m.role ? (
                  <Badge variant="secondary" className="text-[10px]">{m.role}</Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">No role yet</Badge>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {m.commitmentComplete ? (
                  <CheckCircle2 className="size-3.5 text-primary" aria-label="Commitment complete" />
                ) : (
                  <span className="text-[10px] text-muted-foreground">Commitment pending</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Getting started guidance — only show when workspace is fresh */}
      {!allCommitted && (
        <div className="rounded-lg border border-border/50 bg-card/50 p-4">
          <h3 className="mb-2 text-xs font-medium text-foreground">Getting started</h3>
          <div className="flex flex-col gap-2 text-[11px] leading-relaxed text-muted-foreground">
            <p>This workspace becomes more useful as your team takes action. Here is what contributes to team readiness:</p>
            <ul className="flex flex-col gap-1.5 ml-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-3 shrink-0 text-muted-foreground/60" aria-hidden="true" />
                <span>Each member claims a role and completes their commitment</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-3 shrink-0 text-muted-foreground/60" aria-hidden="true" />
                <span>Project artifacts are added to the Project Folder</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-3 shrink-0 text-muted-foreground/60" aria-hidden="true" />
                <span>The AI Coach observes enough activity to offer meaningful suggestions</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Shared AI
// ---------------------------------------------------------------------------

function SharedAIZone() {
  return (
    <div className="flex flex-col gap-5">
      <ZoneHeader
        icon={Brain}
        title="Shared AI"
        description="Every prompt and response is visible to the whole team. The AI Coach builds on everyone's thinking — no siloed conversations."
      />

      {/* AI Coach introduction */}
      <div className="rounded-lg border border-border/50 bg-card/50 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                AI Coach
              </span>
              <Badge variant="outline" className="text-[10px] text-muted-foreground">Observing</Badge>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              I am your team's AI Coach. Right now I am observing your workspace to build context. Once I see enough real activity — commits, decisions, role assignments, file changes — I will start offering targeted suggestions.
            </p>
            <Separator className="bg-border/30" />
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-medium text-foreground">What I watch for:</span>
              <ul className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Eye className="size-3 shrink-0 text-muted-foreground/60" aria-hidden="true" />
                  <span>Team structure — who has claimed roles and committed</span>
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="size-3 shrink-0 text-muted-foreground/60" aria-hidden="true" />
                  <span>Time pressure — how deadlines relate to remaining work</span>
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="size-3 shrink-0 text-muted-foreground/60" aria-hidden="true" />
                  <span>Gaps and risks — missing artifacts, blocked teammates, unclear priorities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Prompt input placeholder */}
      {/* TODO: Wire real AI chat input — POST /api/ai/message with team context */}
      <div className="rounded-lg border border-dashed border-border/50 bg-card/30 p-4">
        <p className="text-xs text-muted-foreground">
          You can ask the AI Coach anything here. All messages are shared with the entire team — there are no private conversations.
        </p>
      </div>

      {/* Empty conversation state */}
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <Brain className="size-6 text-muted-foreground/30" aria-hidden="true" />
        <p className="text-xs text-muted-foreground">No conversations yet. The AI Coach will surface insights as your team works.</p>
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

      {/* Threaded comments — empty state */}
      <div>
        <h3 className="mb-2 text-xs font-medium text-foreground">Threaded comments</h3>
        <div className="rounded-lg border border-dashed border-border/50 bg-card/30 p-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <MessageSquare className="size-5 text-muted-foreground/30" aria-hidden="true" />
            <p className="text-[11px] text-muted-foreground">
              No comments yet. As your team adds files, threaded conversations will appear here for each artifact.
            </p>
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

      {roles.length > 0 ? (
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
              <span className="text-[11px] text-muted-foreground">
                {m.commitmentComplete ? 'Commitment complete' : 'Commitment pending'}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border/50 bg-card/30 p-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <UserCog className="size-5 text-muted-foreground/30" aria-hidden="true" />
            <p className="text-[11px] text-muted-foreground">
              No roles claimed yet. Once team members select their roles, their dedicated workspaces will appear here.
            </p>
          </div>
        </div>
      )}

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
      {activity.length > 0 ? (
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
      ) : (
        <div className="rounded-lg border border-dashed border-border/50 bg-card/30 p-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <Radio className="size-5 text-muted-foreground/30" aria-hidden="true" />
            <p className="text-xs text-muted-foreground">No activity yet. Events will appear here as your team takes actions — joining, committing, editing, and building.</p>
          </div>
        </div>
      )}
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

  // These items track real states derived from workspace data
  const hasAllRoles = hackathon.members.every((m) => m.role !== null)
  const hasAllCommitments = hackathon.members.every((m) => m.commitmentComplete)

  const checklist = [
    { label: 'All team members have claimed a role', done: hasAllRoles },
    { label: 'All commitments completed', done: hasAllCommitments },
    { label: 'Demo video recorded or live demo ready', done: false },
    { label: 'README and documentation complete', done: false },
    { label: 'Submission form fields filled', done: false },
    { label: 'End-to-end flow tested', done: false },
  ]

  const doneCount = checklist.filter((c) => c.done).length

  return (
    <div className="flex flex-col gap-5">
      <ZoneHeader
        icon={CheckCircle2}
        title="Submission Readiness"
        description="Track every requirement for a complete submission. Items here reflect your actual workspace state."
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

      {doneCount === 0 && (
        <div className="rounded-lg border border-dashed border-border/50 bg-card/30 p-4">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            No submission items complete yet. This checklist will update automatically as your team progresses. Focus on building first — come back here before the deadline.
          </p>
        </div>
      )}

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
