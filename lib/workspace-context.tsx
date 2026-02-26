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
}

const WorkspaceContext = createContext<WorkspaceCtx | null>(null)

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error('useWorkspace must be used inside WorkspaceProvider')
  return ctx
}

// ---------------------------------------------------------------------------
// localStorage helpers for quick notes
// ---------------------------------------------------------------------------

const NOTES_KEY = 'hackathon-os-quick-notes'

function loadNotes(): QuickNote[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(NOTES_KEY)
    return raw ? (JSON.parse(raw) as QuickNote[]) : []
  } catch {
    return []
  }
}

function persistNotes(notes: QuickNote[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
}

// ---------------------------------------------------------------------------
// Activity feed — starts empty; populated by real events only
// ---------------------------------------------------------------------------
// TODO: Replace with real-time activity subscription (e.g. Supabase Realtime)
// that pushes actual events as they happen in the workspace.

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface WorkspaceProviderProps {
  hackathon: HackathonContext
  children: ReactNode
}

export function WorkspaceProvider({ hackathon, children }: WorkspaceProviderProps) {
  const [activeZone, setActiveZone] = useState<WorkspaceZone>('mission-control')
  const [notes, setNotes] = useState<QuickNote[]>([])
  const [activity] = useState<ActivityEvent[]>([])

  // Load notes from localStorage on mount (client only)
  useEffect(() => {
    setNotes(loadNotes())
  }, [])

  // TODO: subscribeToRealtime() — connect to real-time presence channel
  // (e.g. Supabase Realtime or WebSocket). Will emit member-status-changed,
  // member-joined, member-left events to update the members list live.
  useEffect(() => {
    // TODO: Subscribe to realtime presence updates here
    // TODO: Subscribe to realtime activity feed events here
    // TODO: Subscribe to AI coach message stream here
    return () => {
      // TODO: Unsubscribe from all realtime channels on unmount
    }
  }, [hackathon.teamId])

  const addNote = useCallback((text: string) => {
    const note: QuickNote = {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date().toISOString(),
    }
    setNotes((prev) => {
      const next = [note, ...prev]
      persistNotes(next)
      // TODO: Sync note to server storage (e.g. POST /api/notes)
      return next
    })
  }, [])

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id)
      persistNotes(next)
      // TODO: Delete note from server storage (e.g. DELETE /api/notes/:id)
      return next
    })
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
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}
