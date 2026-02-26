/**
 * Mock API layer for Hackathon OS.
 *
 * Every function here simulates a backend call with configurable latency,
 * success, and failure modes. Replace each function body with a real fetch()
 * or SDK call when the backend is ready.
 *
 * Scenario control:
 *   - Default: returns success after a realistic delay.
 *   - To demo error handling, pass a team/hackathon name containing "error"
 *     (case-insensitive) or an invite code of "000000".
 *   - To demo slow responses, pass a name containing "slow".
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreateTeamPayload {
  teamName: string
  hackathonName: string
  startTime: string      // ISO-8601
  endTime: string        // ISO-8601
  timezone: string       // IANA timezone identifier
  teamSize: number
}

export interface CreateTeamResponse {
  id: string
  inviteCode: string
  teamName: string
  hackathonName: string
}

export interface JoinTeamPayload {
  inviteCode: string
}

export interface JoinTeamResponse {
  teamId: string
  teamName: string
  hackathonName: string
  memberCount: number
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

// ---------------------------------------------------------------------------
// Mock endpoints
// ---------------------------------------------------------------------------

/**
 * POST /api/teams — create a new hackathon team.
 *
 * TODO: Replace with a real API call to your backend.
 * The real endpoint should persist the team in the database, generate a
 * unique invite code, and return the full team object.
 */
export async function createTeam(
  payload: CreateTeamPayload
): Promise<CreateTeamResponse> {
  // Simulate network latency
  const isSlowMode = payload.teamName.toLowerCase().includes('slow')
  await delay(isSlowMode ? 4000 : 1200)

  // Simulate server error
  if (payload.teamName.toLowerCase().includes('error')) {
    throw new Error('Server error: could not create team. Please try again.')
  }

  // TODO: Replace with real POST /api/teams — this should authenticate the
  // user, validate payload server-side, and persist to the database.
  return {
    id: generateId(),
    inviteCode: generateInviteCode(),
    teamName: payload.teamName,
    hackathonName: payload.hackathonName,
  }
}

/**
 * POST /api/teams/join — join an existing team via invite code.
 *
 * TODO: Replace with a real API call to your backend.
 * The real endpoint should look up the invite code, add the user to the
 * team roster, and return the team summary.
 */
export async function joinTeam(
  payload: JoinTeamPayload
): Promise<JoinTeamResponse> {
  // Simulate network latency
  await delay(1000)

  // Simulate invalid code
  if (payload.inviteCode === '000000') {
    throw new Error('Invalid invite code. Please check with your team lead.')
  }

  // Simulate expired code
  if (payload.inviteCode.toLowerCase() === 'expire') {
    throw new Error('This invite code has expired.')
  }

  // TODO: Replace with real POST /api/teams/join — this should authenticate
  // the user, validate the invite code, and add them to the team.
  return {
    teamId: generateId(),
    teamName: 'Team ' + payload.inviteCode,
    hackathonName: 'Demo Hackathon',
    memberCount: 3,
  }
}
