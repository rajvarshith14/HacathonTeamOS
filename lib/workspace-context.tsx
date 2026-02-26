'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type {
  HackathonContext,
  WorkspaceZone,
  QuickNote,
  ActivityEvent,
  RoleCommitment,
  Member,
} from './workspace-types'

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

interface WorkspaceCtx {
  hackathon: HackathonContext
  activeZone: WorkspaceZone
  setActiveZone: (zone: WorkspaceZone) => void
  notes: QuickNote[]
  addNote: (text: string) => void
  deleteNote: (id: string) => void
  activity: ActivityEvent[]
  /** Save a role commitment for the current user */
  saveCommitment: (commitment: RoleCommitment) => void
  /** Skip commitment — marks as "Joined — No Commitment" */
  skipCommitment: () => void
  /** Whether the current user has completed (or skipped) commitment */
  currentUserCommitted: boolean
  /** The current user member object */
  currentUser: Member | undefined
}

const WorkspaceContext = createContext<WorkspaceCtx | null>(null)

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error('useWorkspace must be used inside WorkspaceProvider')
  return ctx
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface WorkspaceProviderProps {
  hackathon: HackathonContext
  children: ReactNode
}

export function WorkspaceProvider({ hackathon: initialHackathon, children }: WorkspaceProviderProps) {
  const [hackathon, setHackathon] = useState<HackathonContext>(initialHackathon)
  const [activeZone, setActiveZone] = useState<WorkspaceZone>('mission-control')
  const [notes, setNotes] = useState<QuickNote[]>([])
  const [activity, setActivity] = useState<ActivityEvent[]>([])

  // Derive current user
  const currentUser = hackathon.members.find((m) => m.isCurrentUser)
  const currentUserCommitted = currentUser?.commitmentComplete ?? false

  // Seed initial activity event for the user joining
  useEffect(() => {
    if (currentUser) {
      setActivity([{
        id: crypto.randomUUID(),
        type: 'member-joined',
        actor: currentUser.name,
        description: 'joined the team',
        timestamp: new Date().toISOString(),
      }])
    }
    // Run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addActivityEvent = useCallback((event: Omit<ActivityEvent, 'id' | 'timestamp'>) => {
    setActivity((prev) => [{
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    }, ...prev])
  }, [])

  const saveCommitment = useCallback((commitment: RoleCommitment) => {
    setHackathon((prev) => {
      const members = prev.members.map((m) =>
        m.isCurrentUser
          ? {
              ...m,
              role: commitment.role,
              commitment,
              commitmentComplete: true,
            }
          : m
      )
      const allComplete = members.every((m) => m.commitmentComplete)
      return {
        ...prev,
        members,
        onboardingState: allComplete ? 'onboarding-complete' : prev.onboardingState,
      }
    })

    addActivityEvent({
      type: 'commitment-saved',
      actor: currentUser?.name ?? 'You',
      description: `committed as ${commitment.role} — "${commitment.deliverables}"`,
    })
  }, [currentUser?.name, addActivityEvent])

  const skipCommitment = useCallback(() => {
    setHackathon((prev) => {
      const members = prev.members.map((m) =>
        m.isCurrentUser
          ? {
              ...m,
              role: 'Joined — No Commitment',
              commitment: null,
              commitmentComplete: true,
            }
          : m
      )
      const allComplete = members.every((m) => m.commitmentComplete)
      return {
        ...prev,
        members,
        onboardingState: allComplete ? 'onboarding-complete' : prev.onboardingState,
      }
    })

    addActivityEvent({
      type: 'member-joined',
      actor: currentUser?.name ?? 'You',
      description: 'joined without a role commitment',
    })
  }, [currentUser?.name, addActivityEvent])

  const addNote = useCallback((text: string) => {
    const note: QuickNote = {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date().toISOString(),
    }
    setNotes((prev) => [note, ...prev])
  }, [])

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return (
    <WorkspaceContext.Provider
      value={{
        hackathon,
        activeZone,
        setActiveZone,
        notes,
        addNote,
        deleteNote,
        activity,
        saveCommitment,
        skipCommitment,
        currentUserCommitted,
        currentUser,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}
