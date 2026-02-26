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
  Eye,
  Users,
  FileText,
  MessageSquare,
  FolderTree,
  Shield,
  ArrowRight,
  Clock,
  Copy,
  Share2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  stage,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  stage?: string
}) {
  return (
    <div className="mb-5 flex flex-col gap-1.5">
      {stage && (
        <span className="text-[9px] font-mono font-medium uppercase tracking-widest text-muted-foreground/50">
          {stage}
        </span>
      )}
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
  const { hackathon, currentUser, setActiveZone } = useWorkspace()
  const online = hackathon.members.filter((m) => m.status === 'online').length
  const committed = hackathon.members.filter((m) => m.commitmentComplete).length
  const isSolo = hackathon.members.length <= 1
  const allCommitted = committed === hackathon.members.length && hackathon.members.length > 0

  // Determine the single next action
  function getNextAction(): { label: string; description: string; zone: WorkspaceZone } | null {
    if (currentUser && !currentUser.commitmentComplete) {
      return {
        label: 'Set your role commitment',
        description: 'You have not committed to a role yet. Define your role, deliverables, and responsibility.',
        zone: 'role-workspaces',
      }
    }
    if (!allCommitted && hackathon.members.length > 1) {
      return {
        label: 'Waiting for teammates',
        description: `${hackathon.members.filter((m) => !m.commitmentComplete).length} member(s) still need to complete their commitment.`,
        zone: 'role-workspaces',
      }
    }
    return null
  }

  const nextAction = getNextAction()

  const copyInviteCode = () => {
    navigator.clipboard.writeText(hackathon.inviteCode)
    toast.success('Invite code copied!')
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Mission header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="size-4 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground">Mission Control</h2>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          This is your starting point. Everything below reflects the real state of your hackathon — no simulated data.
        </p>
      </div>

      {/* Hackathon context block */}
      <div className="rounded-lg border border-border/50 bg-card/50 p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground">{hackathon.hackathonName}</span>
            <Badge variant="secondary" className="text-[10px] font-mono uppercase tracking-wider">
              {hackathon.phase}
            </Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">Team</span>
              <span className="text-xs text-foreground">{hackathon.teamName}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">Members</span>
              <span className="text-xs text-foreground">
                {online} online / {hackathon.members.length} total
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">Your Role</span>
              <span className="text-xs text-foreground">
                {currentUser?.role ?? 'Not set yet'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Invite code share */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Share2 className="size-4 text-primary" aria-hidden="true" />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-foreground">Invite teammates</span>
              <span className="text-[11px] text-muted-foreground">
                Share this code: <span className="font-mono font-bold text-primary tracking-wider">{hackathon.inviteCode}</span>
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={copyInviteCode} className="text-primary hover:text-primary">
            <Copy className="size-3.5" aria-hidden="true" />
            <span className="text-xs">Copy</span>
          </Button>
        </div>
      </div>

      {/* Solo mode notice */}
      {isSolo && (
        <div className="rounded-lg border border-dashed border-accent/30 bg-accent/5 p-4">
          <div className="flex items-start gap-3">
            <Users className="mt-0.5 size-4 text-accent" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-foreground">Solo mode</span>
              <span className="text-[11px] leading-relaxed text-muted-foreground">
                You are the only member right now. Everything works solo — invite teammates anytime using your invite code above. Collaboration features activate when others join.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Next action */}
      {nextAction && (
        <button
          onClick={() => setActiveZone(nextAction.zone)}
          className="group flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-left transition-colors hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
            <ArrowRight className="size-3.5 text-primary" aria-hidden="true" />
          </div>
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-xs font-medium text-primary">Next step: {nextAction.label}</span>
            <span className="text-[11px] leading-relaxed text-muted-foreground">{nextAction.description}</span>
          </div>
          <ArrowRight className="mt-1 size-3.5 text-primary/40 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      )}

      {/* All caught up */}
      {!nextAction && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-4 text-primary" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-primary">Ready to build</span>
              <span className="text-[11px] leading-relaxed text-muted-foreground">
                {currentUser?.commitment
                  ? `You committed as ${currentUser.role} to deliver: "${currentUser.commitment.deliverables}". Navigate to the Project Folder to start building.`
                  : 'Navigate to the Project Folder to start building, or use the AI Coach for guidance.'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Team roster — only real members */}
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
                <span className="text-xs text-foreground">
                  {m.name}
                  {m.isCurrentUser && <span className="text-muted-foreground"> (you)</span>}
                </span>
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
                  <span className="text-[10px] text-muted-foreground">Pending</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workspace flow */}
      <div className="rounded-lg border border-border/50 bg-card/50 p-4">
        <h3 className="mb-3 text-xs font-medium text-foreground">How this workspace works</h3>
        <div className="flex flex-col gap-2">
          {([
            { step: 'Orient',    desc: 'Understand the mission and current team state',          zone: 'mission-control' as WorkspaceZone },
            { step: 'Organize',  desc: 'Assign roles and complete commitments',                   zone: 'role-workspaces' as WorkspaceZone },
            { step: 'Build',     desc: 'Add project files and track progress in the live feed',   zone: 'project-folder' as WorkspaceZone },
            { step: 'Deliver',   desc: 'Prepare the demo and verify submission requirements',     zone: 'submission-readiness' as WorkspaceZone },
          ]).map((s, i) => (
            <button
              key={s.step}
              onClick={() => setActiveZone(s.zone)}
              className="flex items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-mono font-bold text-muted-foreground">
                {i + 1}
              </span>
              <div className="flex flex-col gap-0">
                <span className="text-[11px] font-medium text-foreground">{s.step}</span>
                <span className="text-[10px] text-muted-foreground">{s.desc}</span>
              </div>
            </button>
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
  return (
    <div className="flex flex-col gap-5">
      <ZoneHeader
        icon={Brain}
        title="AI Coach"
        stage="Organize"
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
              I am your team&apos;s AI Coach. Right now I am observing your workspace to build context. Once I see enough real activity — role commitments, file changes, decisions — I will start offering targeted suggestions.
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
        stage="Build"
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

      {/* Empty state */}
      <div className="rounded-lg border border-dashed border-border/50 bg-card/30 p-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <FolderOpen className="size-6 text-muted-foreground/30" aria-hidden="true" />
          <p className="text-xs text-muted-foreground">
            No files have been added yet. When your team starts building, shared project files will appear here. Use the suggested structure above as a starting point.
          </p>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Role Workspaces
// ---------------------------------------------------------------------------

function RoleWorkspacesZone() {
  const { hackathon, currentUser } = useWorkspace()
  const membersWithRoles = hackathon.members.filter((m) => m.role && m.role !== 'Joined — No Commitment')
  const membersWithoutRoles = hackathon.members.filter((m) => !m.role)

  return (
    <div className="flex flex-col gap-5">
      <ZoneHeader
        icon={UserCog}
        title="Role Workspaces"
        stage="Organize"
        description="Each role has a dedicated space showing filtered tasks, relevant files, and role-specific chat. Roles are defined during commitment."
      />

      {/* Current user commitment display */}
      {currentUser?.commitment && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary text-[10px] border-primary/20">{currentUser.role}</Badge>
              <span className="text-[10px] font-mono text-muted-foreground">
                {currentUser.commitment.responsibilityShare}% responsibility
              </span>
            </div>
            <p className="text-xs text-foreground">{currentUser.commitment.deliverables}</p>
          </div>
        </div>
      )}

      {membersWithRoles.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {membersWithRoles.map((m) => (
            <div
              key={m.id}
              className="flex flex-col gap-2 rounded-lg border border-border/50 bg-card/50 p-4"
            >
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-[10px]">{m.role}</Badge>
                <div className={`size-2 rounded-full ${m.status === 'online' ? 'bg-primary' : m.status === 'idle' ? 'bg-accent' : 'bg-muted-foreground/40'}`} aria-hidden="true" />
              </div>
              <span className="text-xs font-medium text-foreground">
                {m.name}
                {m.isCurrentUser && <span className="text-muted-foreground"> (you)</span>}
              </span>
              {m.commitment ? (
                <span className="text-[11px] text-muted-foreground">
                  Delivering: {m.commitment.deliverables}
                </span>
              ) : (
                <span className="text-[11px] text-muted-foreground">
                  {m.commitmentComplete ? 'Committed' : 'Commitment pending'}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border/50 bg-card/30 p-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <UserCog className="size-5 text-muted-foreground/30" aria-hidden="true" />
            <p className="text-[11px] text-muted-foreground">
              No roles have been claimed yet. Once team members complete their role commitment, their dedicated workspaces will appear here.
            </p>
          </div>
        </div>
      )}

      {membersWithoutRoles.length > 0 && (
        <div className="rounded-md border border-dashed border-accent/30 bg-accent/5 p-3">
          <div className="flex items-center gap-2">
            <Users className="size-3.5 text-accent" aria-hidden="true" />
            <span className="text-xs text-muted-foreground">
              {membersWithoutRoles.length} member(s) have not set a role yet.
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
        stage="Build"
        description="Real-time stream of everything happening in this workspace. Only real events appear here — no simulated activity."
      />

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
            <p className="text-xs text-muted-foreground">No activity yet. Events will appear here as your team takes actions — joining, committing, and building.</p>
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
  const { hackathon } = useWorkspace()
  const isEarlyPhase = hackathon.phase === 'planning' || hackathon.phase === 'build'

  return (
    <div className="flex flex-col gap-5">
      <ZoneHeader
        icon={Presentation}
        title="Presentation Studio"
        stage="Deliver"
        description="Build your demo script and slides. The AI Coach helps structure your narrative and identifies gaps in your story."
      />

      {isEarlyPhase && (
        <div className="rounded-lg border border-dashed border-border/50 bg-card/30 p-4">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 size-4 text-muted-foreground/60" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-foreground">Not yet — focus on building first</span>
              <span className="text-[11px] leading-relaxed text-muted-foreground">
                {'This zone becomes useful once you have project artifacts to present. You are currently in the '}
                {hackathon.phase}
                {' phase. When you are closer to the deadline, the AI Coach will help you structure a compelling demo.'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Slide outline */}
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

      {!isEarlyPhase && (
        <div className="grid gap-3 sm:grid-cols-2">
          <ActionCard
            icon={FileText}
            label="Generate demo script"
            description="AI creates a structured walkthrough based on your current artifacts."
            onClick={() => {
              toast.info('AI would generate a demo script from your project artifacts.')
            }}
          />
          <ActionCard
            icon={Eye}
            label="Preview presentation"
            description="Run through your slides and demo flow in presentation mode."
            onClick={() => {
              toast.info('Presentation preview would show your slides and flow.')
            }}
          />
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Submission Readiness
// ---------------------------------------------------------------------------

function SubmissionReadinessZone() {
  const { hackathon } = useWorkspace()

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
        stage="Deliver"
        description="Track every requirement for a complete submission. Items here reflect your actual workspace state — nothing is fabricated."
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

      {doneCount < checklist.length && (
        <div className="rounded-lg border border-dashed border-border/50 bg-card/30 p-4">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            This checklist updates automatically as your team progresses. Focus on building first — come back here before the deadline to verify everything is ready.
          </p>
        </div>
      )}

      <ActionCard
        icon={Shield}
        label="Run submission validator"
        description="AI checks all required fields and flags anything missing before you submit."
        onClick={() => {
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
