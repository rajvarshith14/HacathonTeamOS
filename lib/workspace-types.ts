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

// ---------------------------------------------------------------------------
// Role Commitment — what each user fills during onboarding
// ---------------------------------------------------------------------------

export interface RoleCommitment {
  role: string                 // free-text role title, e.g. "Frontend Lead"
  deliverables: string         // what they will build
  responsibilityShare: number  // 0–100 percentage
  accepted: boolean            // user accepted responsibility
}

// ---------------------------------------------------------------------------
// Member
// ---------------------------------------------------------------------------

export interface Member {
  id: string
  name: string
  initials: string
  role: string | null          // null = unclaimed
  status: MemberStatus
  timezone: string             // IANA timezone id
  commitmentComplete: boolean
  commitment: RoleCommitment | null  // null = not committed yet
  isCurrentUser: boolean       // true for the logged-in user
}

// ---------------------------------------------------------------------------
// Hackathon context
// ---------------------------------------------------------------------------

export interface HackathonContext {
  hackathonId: string
  hackathonName: string
  teamId: string
  teamName: string
  inviteCode: string           // for sharing with teammates
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
