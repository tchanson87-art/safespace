'use client'

import { useMemo } from 'react'
import { AlertTriangle, CalendarClock, ChevronRight, FolderOpen, LogOut, ShieldAlert } from 'lucide-react'
import { caseload, type CaseSummary } from '@/lib/ehcp/caseload'
import { sampleCase } from '@/lib/ehcp/data'
import { computeCriticalFlags, computeMetrics, computeReadiness } from '@/lib/ehcp/scoring'
import { useProfessional } from '@/lib/professional/context'
import { Card, Pill, RagDot } from '@/components/ui'

export function Caseload({ onOpen }: { onOpen: (reference: string) => void }) {
  const { professional, signOut } = useProfessional()

  const detailed = useMemo(() => {
    const metrics = computeMetrics(sampleCase)
    const flags = computeCriticalFlags(sampleCase)
    const readiness = computeReadiness(metrics, flags)
    return { readiness, flags }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <img
            src="/social-innovation-cic-logo.jpeg"
            alt="Social Innovation CIC"
            className="h-9 w-9 shrink-0 rounded-full object-contain"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-bold leading-tight text-foreground">
              NeuroPathway
            </p>
            <p className="truncate text-xs text-muted-foreground">Professional caseload</p>
          </div>
          {professional ? (
            <div className="flex items-center gap-2">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold text-foreground">{professional.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {professional.role} · {professional.organisation}
                </p>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-4">
        {professional ? (
          <p className="mb-4 text-sm text-muted-foreground">
            Signed in as{' '}
            <span className="font-semibold text-foreground">{professional.name}</span> —{' '}
            {professional.role}, {professional.organisation}. Signed in {professional.signedInAt}.
          </p>
        ) : null}

        <h1 className="text-balance font-display text-2xl font-bold text-foreground">
          Children &amp; young people
        </h1>
        <p className="mt-1 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
          Select a record to open the EHCP Evidence &amp; Assurance engine. Only one record below is
          fully populated in this demonstration; the others honestly show as referrals awaiting
          evidence, so nothing is implied that the record does not hold.
        </p>

        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {caseload.map((c) => (
            <li key={c.reference}>
              <CaseCard
                summary={c}
                readinessBand={c.populated ? detailed.readiness.band : null}
                readinessRag={c.populated ? detailed.readiness.rag : null}
                safeguardingCount={
                  c.populated ? detailed.flags.filter((f) => f.kind === 'safeguarding').length : 0
                }
                onOpen={() => onOpen(c.reference)}
              />
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-start gap-3 rounded-[var(--radius-card)] border border-primary/20 bg-primary-soft px-4 py-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-pretty text-xs leading-relaxed text-foreground">
            NeuroPathway supports evidence gathering and professional decision-making. It does not
            diagnose conditions, determine eligibility or issue an Education, Health and Care Plan.
            EHCP decisions remain the responsibility of the relevant local authority and authorised
            professionals.
          </p>
        </div>
      </main>
    </div>
  )
}

function CaseCard({
  summary,
  readinessBand,
  readinessRag,
  safeguardingCount,
  onOpen,
}: {
  summary: CaseSummary
  readinessBand: string | null
  readinessRag: 'green' | 'amber' | 'red' | 'grey' | null
  safeguardingCount: number
  onOpen: () => void
}) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-xs text-muted-foreground">{summary.reference}</p>
          <p className="mt-0.5 font-display text-base font-bold text-foreground">
            {summary.yearGroup}
          </p>
          <p className="text-xs text-muted-foreground">{summary.setting}</p>
        </div>
        {summary.populated && readinessRag ? (
          <Pill tone={readinessRag}>
            <RagDot rag={readinessRag} /> {readinessBand}
          </Pill>
        ) : (
          <Pill tone="grey">Awaiting evidence</Pill>
        )}
      </div>

      <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-foreground">
        {summary.focus}
      </p>

      {summary.note ? (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{summary.note}</p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {safeguardingCount > 0 ? (
          <Pill tone="red">
            <ShieldAlert className="h-3 w-3" /> Safeguarding alert
          </Pill>
        ) : null}
        {summary.nextReview ? (
          <Pill tone="neutral">
            <CalendarClock className="h-3 w-3" /> Review due {summary.nextReview}
          </Pill>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
      >
        {summary.populated ? (
          <>
            <FolderOpen className="h-4 w-4" /> Open record
          </>
        ) : (
          <>
            Start evidence gathering <ChevronRight className="h-4 w-4" />
          </>
        )}
      </button>
    </Card>
  )
}
