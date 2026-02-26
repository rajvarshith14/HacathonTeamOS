'use client'

import {
  LayoutDashboard,
  Brain,
  FolderOpen,
  UserCog,
  Radio,
  Presentation,
  CheckCircle2,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { useWorkspace } from '@/lib/workspace-context'
import { cn } from '@/lib/utils'
import type { WorkspaceZone } from '@/lib/workspace-types'

// ---------------------------------------------------------------------------
// Lifecycle stages — each maps to a natural hackathon progression
// ---------------------------------------------------------------------------

interface ZoneDef {
  id: WorkspaceZone
  label: string
  shortLabel: string
  icon: React.ComponentType<{ className?: string }>
}

interface StageDef {
  label: string
  zones: ZoneDef[]
}

const STAGES: StageDef[] = [
  {
    label: 'Orient',
    zones: [
      { id: 'mission-control', label: 'Mission Control', shortLabel: 'Mission', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Organize',
    zones: [
      { id: 'role-workspaces', label: 'Role Workspaces', shortLabel: 'Roles', icon: UserCog },
      { id: 'shared-ai',       label: 'AI Coach',        shortLabel: 'AI',    icon: Brain },
    ],
  },
  {
    label: 'Build',
    zones: [
      { id: 'project-folder', label: 'Project Folder', shortLabel: 'Files', icon: FolderOpen },
      { id: 'live-feed',      label: 'Live Feed',      shortLabel: 'Feed',  icon: Radio },
    ],
  },
  {
    label: 'Deliver',
    zones: [
      { id: 'presentation-studio',  label: 'Presentation Studio',  shortLabel: 'Present', icon: Presentation },
      { id: 'submission-readiness',  label: 'Submission Readiness', shortLabel: 'Submit',  icon: CheckCircle2 },
    ],
  },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface NavRailProps {
  collapsed: boolean
  onToggle: () => void
}

export function NavRail({ collapsed, onToggle }: NavRailProps) {
  const { activeZone, setActiveZone, hackathon } = useWorkspace()

  // Determine which zones have real data to drive visual dimming
  const hasRoles = hackathon.members.some((m) => m.role !== null)
  const hasActivity = false // activity feed starts empty; will be true once wired
  const zoneHasData: Partial<Record<WorkspaceZone, boolean>> = {
    'mission-control':      true,  // always available
    'role-workspaces':      hasRoles,
    'shared-ai':            false, // no conversations yet
    'project-folder':       false, // no files yet
    'live-feed':            hasActivity,
    'presentation-studio':  false, // no slides yet
    'submission-readiness':  true,  // checklist always useful
  }

  return (
    <nav
      className={cn(
        'flex flex-col border-r border-border/50 bg-card/30 transition-all duration-200',
        collapsed ? 'w-12' : 'w-52',
      )}
      role="navigation"
      aria-label="Workspace zones"
    >
      {/* Lifecycle stages */}
      <ul className="flex flex-1 flex-col gap-0.5 p-1.5 overflow-y-auto" role="tablist" aria-orientation="vertical">
        {STAGES.map((stage) => (
          <li key={stage.label} role="presentation" className="flex flex-col gap-0.5">
            {/* Stage label */}
            {!collapsed && (
              <span className="mt-3 mb-1 px-2.5 text-[9px] font-mono font-medium uppercase tracking-widest text-muted-foreground/50 select-none first:mt-1">
                {stage.label}
              </span>
            )}
            {collapsed && (
              <div className="mt-2 mb-1 mx-auto h-px w-5 bg-border/30" aria-hidden="true" />
            )}

            {/* Zone buttons within stage */}
            {stage.zones.map((zone) => {
              const isActive = activeZone === zone.id
              const Icon = zone.icon
              const hasSomething = zoneHasData[zone.id] ?? false
              const isDimmed = !hasSomething && !isActive

              return (
                <Tooltip key={zone.id}>
                  <TooltipTrigger asChild>
                    <button
                      role="tab"
                      aria-selected={isActive}
                      aria-label={zone.label}
                      tabIndex={0}
                      onClick={() => setActiveZone(zone.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setActiveZone(zone.id)
                        }
                      }}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : isDimmed
                            ? 'text-muted-foreground/40 hover:bg-secondary/50 hover:text-muted-foreground'
                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                        collapsed && 'justify-center px-0',
                      )}
                    >
                      <Icon className={cn('size-4 shrink-0', isDimmed && !isActive && 'opacity-50')} aria-hidden="true" />
                      {!collapsed && <span className="truncate">{zone.label}</span>}
                    </button>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">{zone.label}</TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </li>
        ))}
      </ul>

      {/* Collapse toggle */}
      <div className="border-t border-border/50 p-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className={cn(
                'h-8 w-full text-muted-foreground hover:text-foreground',
                collapsed && 'px-0',
              )}
              aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            >
              {collapsed ? (
                <PanelLeft className="size-4" aria-hidden="true" />
              ) : (
                <>
                  <PanelLeftClose className="size-4" aria-hidden="true" />
                  <span className="ml-2 text-xs">Collapse</span>
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {collapsed ? 'Expand navigation' : 'Collapse navigation'}
          </TooltipContent>
        </Tooltip>
      </div>
    </nav>
  )
}
