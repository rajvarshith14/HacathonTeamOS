// ---------------------------------------------------------------------------
// Workspace domain types — shared across all workspace components
// ---------------------------------------------------------------------------

export type Phase = 'planning' | 'build' | 'submission' | 'presentation'

export type OnboardingState =
  | 'solo-mode'
  | 'team-forming'
  | 'commitments-in-progress'
  | 'onboarding-complete'

export type MemberStatus = 'online' | 'idle' | 'offline'

export interface Member {
  id: string
  name: string
  initials: string
  role: string | null          // null = unclaimed
  status: MemberStatus
  timezone: string             // IANA timezone id
  commitmentComplete: boolean
}

export interface HackathonContext {
  hackathonId: string
  hackathonName: string
  teamId: string
  teamName: string
  startTime: string            // ISO-8601
  endTime: string              // ISO-8601
  timezone: string             // IANA timezone id
  phase: Phase
  onboardingState: OnboardingState
  members: Member[]
  isOwner: boolean
}

export type WorkspaceZone =
  | 'mission-control'
  | 'shared-ai'
  | 'project-folder'
  | 'role-workspaces'
  | 'live-feed'
  | 'presentation-studio'
  | 'submission-readiness'

export interface QuickNote {
  id: string
  text: string
  createdAt: string            // ISO-8601
}

export interface ActivityEvent {
  id: string
  type: 'member-joined' | 'commitment-saved' | 'hackathon-edited' | 'ai-suggestion'
  actor: string
  description: string
  timestamp: string            // ISO-8601
}
