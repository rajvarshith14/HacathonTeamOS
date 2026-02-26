'use client'

import { useState } from 'react'
import {
  Eye,
  Send,
  Trash2,
  Users,
  Sparkles,
  CheckCircle2,
  FileText,
  Radio,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { useWorkspace } from '@/lib/workspace-context'
import type { MemberStatus } from '@/lib/workspace-types'
import { toast } from 'sonner'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function statusColor(s: MemberStatus): string {
  if (s === 'online') return 'bg-primary'
  if (s === 'idle') return 'bg-accent'
  return 'bg-muted-foreground/40'
}

function statusLabel(s: MemberStatus): string {
  if (s === 'online') return 'Online'
  if (s === 'idle') return 'Idle'
  return 'Offline'
}

function formatLocalTime(timezone: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    }).format(new Date())
  } catch {
    return ''
  }
}

function getRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CollabPanel() {
  const { hackathon, notes, addNote, deleteNote, activity } = useWorkspace()
  const [noteText, setNoteText] = useState('')

  const handleSubmitNote = () => {
    const trimmed = noteText.trim()
    if (!trimmed) return
    addNote(trimmed)
    setNoteText('')
  }

  const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    'member-joined': Users,
    'commitment-saved': CheckCircle2,
    'hackathon-edited': FileText,
    'ai-suggestion': Sparkles,
  }

  return (
    <aside
      className="flex w-64 flex-col border-l border-border/50 bg-card/30"
      aria-label="Team collaboration panel"
    >
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-3">
          {/* Team presence */}
          <section aria-labelledby="presence-heading">
            <h3 id="presence-heading" className="mb-2 text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
              Team ({hackathon.members.filter((m) => m.status === 'online').length} online)
            </h3>
            <div className="flex flex-col gap-1.5">
              {hackathon.members.map((member) => (
                <div key={member.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-secondary/50">
                  <div className="relative">
                    <Avatar className="size-6">
                      <AvatarFallback className="text-[9px] font-bold bg-secondary text-secondary-foreground">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-card ${statusColor(member.status)}`}
                      aria-label={statusLabel(member.status)}
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-[11px] font-medium text-foreground leading-tight">{member.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatLocalTime(member.timezone)}
                    </span>
                  </div>
                  {/* Follow affordance */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="text-muted-foreground/50 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                        aria-label={`Follow ${member.name}'s activity`}
                        onClick={() => {
                          // TODO: Subscribe to member's realtime activity stream
                          toast.info(`Following ${member.name}'s activity.`)
                        }}
                      >
                        <Eye className="size-3" aria-hidden="true" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{'Follow ' + member.name}</TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>
          </section>

          <Separator className="bg-border/30" />

          {/* Quick notes */}
          <section aria-labelledby="notes-heading">
            <h3 id="notes-heading" className="mb-2 text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
              Quick notes
            </h3>
            <div className="flex flex-col gap-2">
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Jot down a quick note..."
                className="min-h-[60px] resize-none text-xs"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault()
                    handleSubmitNote()
                  }
                }}
                aria-label="Quick note input"
              />
              <Button
                size="sm"
                className="h-7 self-end bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleSubmitNote}
                disabled={!noteText.trim()}
              >
                <Send className="size-3" aria-hidden="true" />
                <span className="text-[11px]">Save note</span>
              </Button>

              {notes.length > 0 && (
                <div className="flex flex-col gap-1 mt-1">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="group flex items-start gap-2 rounded-md border border-border/50 bg-card/50 px-2.5 py-2"
                    >
                      <p className="flex-1 text-[11px] leading-relaxed text-foreground whitespace-pre-wrap">
                        {note.text}
                      </p>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="mt-0.5 shrink-0 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                        aria-label="Delete note"
                      >
                        <Trash2 className="size-3" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <Separator className="bg-border/30" />

          {/* Recent activity */}
          <section aria-labelledby="activity-heading">
            <h3 id="activity-heading" className="mb-2 text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
              Recent activity
            </h3>
            {/* TODO: Subscribe to realtime activity events to update this feed live */}
            {activity.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {activity.slice(0, 5).map((event) => {
                  const Icon = typeIcons[event.type] || Radio
                  return (
                    <div key={event.id} className="flex items-start gap-2 rounded-md px-2 py-1.5">
                      <Icon className="mt-0.5 size-3 shrink-0 text-muted-foreground/60" aria-hidden="true" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] text-foreground leading-tight">
                          <span className="font-medium">{event.actor}</span>{' '}
                          <span className="text-muted-foreground">{event.description}</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground/60">{getRelativeTime(event.timestamp)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground/60 py-2">
                No activity yet. Events will appear here as your team takes action.
              </p>
            )}
          </section>
        </div>
      </ScrollArea>
    </aside>
  )
}
