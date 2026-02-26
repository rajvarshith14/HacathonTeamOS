/**
 * Workspace data generators.
 *
 * These functions produce the initial HackathonContext from the information
 * gathered during the Create / Join flow. No fake teammates are generated —
 * only the real current user is present.
 *
 * TODO: Replace with real API calls that persist in a database.
 */

import type { HackathonContext, Member } from './workspace-types'

// ---------------------------------------------------------------------------
// Create a hackathon — returns context with the creator as the only member
// ---------------------------------------------------------------------------

export function createHackathonContext(params: {
  teamName: string
  hackathonName: string
  startTime: string
  endTime: string
  timezone: string
  inviteCode: string
  userName: string
}): HackathonContext {
  const initials = params.userName
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const me: Member = {
    id: crypto.randomUUID(),
    name: params.userName,
    initials,
    role: null,
    status: 'online',
    timezone: params.timezone,
    commitmentComplete: false,
    commitment: null,
    isCurrentUser: true,
  }

  return {
    hackathonId: crypto.randomUUID(),
    hackathonName: params.hackathonName,
    teamId: crypto.randomUUID(),
    teamName: params.teamName,
    inviteCode: params.inviteCode,
    startTime: params.startTime,
    endTime: params.endTime,
    timezone: params.timezone,
    phase: 'planning',
    onboardingState: 'solo-mode',
    members: [me],
    isOwner: true,
  }
}

// ---------------------------------------------------------------------------
// Join a hackathon — returns context with just the current user
// (other real members would be fetched from the server in production)
// ---------------------------------------------------------------------------

export function joinHackathonContext(params: {
  teamName: string
  hackathonName: string
  teamId: string
  inviteCode: string
  userName: string
}): HackathonContext {
  const now = Date.now()

  const initials = params.userName
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const me: Member = {
    id: crypto.randomUUID(),
    name: params.userName,
    initials,
    role: null,
    status: 'online',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    commitmentComplete: false,
    commitment: null,
    isCurrentUser: true,
  }

  return {
    hackathonId: crypto.randomUUID(),
    hackathonName: params.hackathonName,
    teamId: params.teamId,
    teamName: params.teamName,
    inviteCode: params.inviteCode,
    startTime: new Date(now - 2 * 3600_000).toISOString(),
    endTime: new Date(now + 34 * 3600_000).toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    phase: 'planning',
    onboardingState: 'team-forming',
    members: [me],
    isOwner: false,
  }
}
