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
// Zone definitions
// ---------------------------------------------------------------------------

interface ZoneDef {
  id: WorkspaceZone
  label: string
  shortLabel: string
  icon: React.ComponentType<{ className?: string }>
}

const ZONES: ZoneDef[] = [
  { id: 'mission-control',       label: 'Mission Control',       shortLabel: 'Mission',   icon: LayoutDashboard },
  { id: 'shared-ai',             label: 'Shared AI',             shortLabel: 'AI',        icon: Brain },
  { id: 'project-folder',        label: 'Project Folder',        shortLabel: 'Files',     icon: FolderOpen },
  { id: 'role-workspaces',       label: 'Role Workspaces',       shortLabel: 'Roles',     icon: UserCog },
  { id: 'live-feed',             label: 'Live Feed',             shortLabel: 'Feed',      icon: Radio },
  { id: 'presentation-studio',   label: 'Presentation Studio',   shortLabel: 'Present',   icon: Presentation },
  { id: 'submission-readiness',  label: 'Submission Readiness',  shortLabel: 'Submit',    icon: CheckCircle2 },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface NavRailProps {
  collapsed: boolean
  onToggle: () => void
}

export function NavRail({ collapsed, onToggle }: NavRailProps) {
  const { activeZone, setActiveZone } = useWorkspace()

  return (
    <nav
      className={cn(
        'flex flex-col border-r border-border/50 bg-card/30 transition-all duration-200',
        collapsed ? 'w-12' : 'w-48',
      )}
      role="navigation"
      aria-label="Workspace zones"
    >
      {/* Zone list */}
      <ul className="flex flex-1 flex-col gap-0.5 p-1.5" role="tablist" aria-orientation="vertical">
        {ZONES.map((zone) => {
          const isActive = activeZone === zone.id
          const Icon = zone.icon
          return (
            <li key={zone.id} role="presentation">
              <Tooltip>
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
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                      collapsed && 'justify-center px-0',
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {!collapsed && <span className="truncate">{zone.label}</span>}
                  </button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">{zone.label}</TooltipContent>
                )}
              </Tooltip>
            </li>
          )
        })}
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
