'use client'

import { useState } from 'react'
import { TopSummary } from './top-summary'
import { NavRail } from './nav-rail'
import { ZoneContent } from './zone-content'
import { CollabPanel } from './collab-panel'
import { useIsMobile } from '@/hooks/use-mobile'

/**
 * WorkspaceShell — the persistent 3-region layout:
 * left nav rail | central content zone | right collaboration panel.
 *
 * The top summary bar sits above all three regions.
 * On mobile, the nav rail collapses and the collab panel stacks below.
 */
export function WorkspaceShell() {
  const [navCollapsed, setNavCollapsed] = useState(false)
  const isMobile = useIsMobile()

  // Auto-collapse nav on mobile
  const effectiveCollapsed = isMobile || navCollapsed

  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      {/* Top summary bar */}
      <TopSummary />

      {/* Main workspace area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left nav rail */}
        <NavRail
          collapsed={effectiveCollapsed}
          onToggle={() => setNavCollapsed((prev) => !prev)}
        />

        {/* Central content zone */}
        <ZoneContent />

        {/* Right collaboration panel — hidden on mobile, toggleable later */}
        {!isMobile && <CollabPanel />}
      </div>

      {/* Mobile: stacked collab panel */}
      {isMobile && (
        <div className="border-t border-border/50 max-h-[40vh] overflow-auto">
          <CollabPanel />
        </div>
      )}
    </div>
  )
}
