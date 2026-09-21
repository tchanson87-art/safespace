'use client'

import { AlertOctagon, ShieldAlert } from 'lucide-react'
import type { CriticalFlag } from '@/lib/ehcp/types'

const kindLabels: Record<CriticalFlag['kind'], string> = {
  safeguarding: 'Safeguarding',
  'unsupported-claim': 'Unsupported claim',
  'missing-section-f': 'Missing Section F provision',
  'unidentified-source': 'Unidentified evidence source',
  'conflicting-evidence': 'Conflicting evidence',
  'non-delivery': 'Provision not delivered',
}

export function CriticalFlagsBanner({
  flags,
  onOpenSafeguarding,
}: {
  flags: CriticalFlag[]
  onOpenSafeguarding: () => void
}) {
  if (flags.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-[var(--radius-card)] border border-rag-green/30 bg-rag-green-soft px-4 py-3">
        <ShieldAlert className="h-5 w-5 shrink-0 text-rag-green" />
        <p className="text-sm font-medium text-foreground">
          No critical omissions detected. Continue to review evidence quality below.
        </p>
      </div>
    )
  }

  const hasSafeguarding = flags.some((f) => f.kind === 'safeguarding')

  return (
    <section
      aria-label="Critical assurance flags"
      className="rounded-[var(--radius-card)] border-2 border-rag-red/40 bg-rag-red-soft"
    >
      <div className="flex items-start gap-3 border-b border-rag-red/20 px-4 py-3">
        <AlertOctagon className="mt-0.5 h-5 w-5 shrink-0 text-rag-red" />
        <div className="flex-1">
          <h2 className="text-sm font-bold text-rag-red">
            {flags.length} critical {flags.length === 1 ? 'issue' : 'issues'} must be resolved
          </h2>
          <p className="text-xs leading-relaxed text-foreground">
            These remain visible regardless of the overall readiness score. A high score can never
            conceal a serious omission.
          </p>
        </div>
        {hasSafeguarding ? (
          <button
            type="button"
            onClick={onOpenSafeguarding}
            className="hidden shrink-0 rounded-full bg-rag-red px-3 py-2 text-xs font-semibold text-white sm:inline-flex"
          >
            Open safeguarding
          </button>
        ) : null}
      </div>
      <ul className="divide-y divide-rag-red/15">
        {flags.map((flag) => (
          <li key={flag.id} className="flex flex-col gap-1 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-rag-red px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                {kindLabels[flag.kind]}
              </span>
            </div>
            <p className="text-sm text-foreground">{flag.message}</p>
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Action required: </span>
              {flag.action}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
