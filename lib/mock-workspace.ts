/**
 * Mock workspace data — used for demo and development.
 *
 * TODO: Replace with real API call (GET /api/workspace/:teamId) that
 * fetches the full HackathonContext including members, phase, and
 * onboarding state from the database.
 */

import type { HackathonContext } from './workspace-types'

export function getMockHackathon(): HackathonContext {
  const now = Date.now()
  return {
    hackathonId: 'h-demo-001',
    hackathonName: 'TreeHacks 2026',
    teamId: 't-demo-001',
    teamName: 'Quantum Quokkas',
    startTime: new Date(now - 4 * 3600_000).toISOString(),
    endTime: new Date(now + 32 * 3600_000).toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    phase: 'build',
    onboardingState: 'commitments-in-progress',
    members: [
      {
        id: 'm1',
        name: 'Alex Chen',
        initials: 'AC',
        role: 'Frontend Lead',
        status: 'online',
        timezone: 'America/Los_Angeles',
        commitmentComplete: true,
      },
      {
        id: 'm2',
        name: 'Sam Rivera',
        initials: 'SR',
        role: 'Backend Lead',
        status: 'online',
        timezone: 'America/New_York',
        commitmentComplete: true,
      },
      {
        id: 'm3',
        name: 'Jordan Kim',
        initials: 'JK',
        role: 'Design',
        status: 'idle',
        timezone: 'Europe/London',
        commitmentComplete: false,
      },
      {
        id: 'm4',
        name: 'Morgan Tao',
        initials: 'MT',
        role: null,
        status: 'offline',
        timezone: 'Asia/Tokyo',
        commitmentComplete: false,
      },
    ],
    isOwner: true,
  }
}
