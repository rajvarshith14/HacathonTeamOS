import { Terminal } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Terminal className="size-5 text-primary" />
          <span className="font-mono text-sm font-bold tracking-wider text-foreground">
            hackathon<span className="text-primary">OS</span>
          </span>
        </div>

        <span className="font-mono text-xs tracking-wider text-muted-foreground">
          Any hackathon. Any team.
        </span>
      </div>
    </header>
  )
}
