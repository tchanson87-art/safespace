'use client'

import { CalendarClock, Check, Info } from 'lucide-react'
import type { CaseData, CriticalFlag, Rag, ReadinessMetric } from '@/lib/ehcp/types'
import { Card, Pill, RagDot, SectionTitle } from '@/components/ui'
import { cn } from '@/lib/utils'

const ragToTone: Record<Rag, 'green' | 'amber' | 'red' | 'grey'> = {
  green: 'green',
  amber: 'amber',
  red: 'red',
  grey: 'grey',
}

export function OverviewTab({
  data,
  metrics,
  readiness,
  flags,
  onNavigate,
}: {
  data: CaseData
  metrics: ReadinessMetric[]
  readiness: { band: string; rag: Rag; score: number; capped: boolean }
  flags: CriticalFlag[]
  onNavigate: (id: string) => void
}) {
  const ringColor =
    readiness.rag === 'green'
      ? 'text-rag-green'
      : readiness.rag === 'amber'
        ? 'text-rag-amber'
        : 'text-rag-red'

  return (
    <div className="space-y-4">
      <SectionTitle
        eyebrow={`Case reference ${data.reference}`}
        title="EHCP readiness dashboard"
        description="A structured view of whether the evidence is complete and reliable, whether every need connects to an outcome and provision, whether that provision is being delivered, and whether it is improving the child’s life."
      />

      {/* Readiness headline */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
              <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--muted)" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  className={ringColor}
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(readiness.score / 100) * 264} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-extrabold text-foreground">
                  {readiness.score}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground">indicative</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Overall EHCP readiness
              </p>
              <p className="text-pretty font-display text-lg font-bold text-foreground">
                {readiness.band}
              </p>
              <div className="mt-1">
                <Pill tone={ragToTone[readiness.rag]}>
                  <RagDot rag={readiness.rag} />
                  {readiness.rag === 'red'
                    ? 'Not ready'
                    : readiness.rag === 'amber'
                      ? 'In progress'
                      : 'On track'}
                </Pill>
              </div>
            </div>
          </div>

          <div className="flex-1 rounded-xl bg-muted/60 p-3">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                {readiness.capped ? (
                  <>
                    The score is capped because{' '}
                    <span className="font-semibold text-rag-red">{flags.length} critical issue(s)</span>{' '}
                    are present. Serious omissions such as a safeguarding concern, unsupported claim,
                    missing Section&nbsp;F provision or unidentified evidence source are never hidden
                    behind a single number.
                  </>
                ) : (
                  'The number is indicative only. Every underlying indicator remains visible below so that no omission is concealed.'
                )}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Review dates */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card className="flex items-center gap-3">
          <CalendarClock className="h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Last review date
            </p>
            <p className="font-display text-base font-bold text-foreground">{data.lastReview}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <CalendarClock className="h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Next review due
            </p>
            <p className="font-display text-base font-bold text-foreground">{data.nextReview}</p>
          </div>
        </Card>
      </div>

      {/* Metric grid */}
      <div>
        <h3 className="mb-2 font-display text-sm font-bold text-foreground">Assurance indicators</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((m) => (
            <Card key={m.key} className="flex flex-col gap-1.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{m.label}</p>
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                    m.rag === 'green' && 'bg-rag-green-soft',
                    m.rag === 'amber' && 'bg-rag-amber-soft',
                    m.rag === 'red' && 'bg-rag-red-soft',
                    m.rag === 'grey' && 'bg-rag-grey-soft',
                  )}
                >
                  <RagDot rag={m.rag} />
                </span>
              </div>
              <p
                className={cn(
                  'font-display text-base font-bold',
                  m.rag === 'green' && 'text-rag-green',
                  m.rag === 'amber' && 'text-rag-amber',
                  m.rag === 'red' && 'text-rag-red',
                  m.rag === 'grey' && 'text-rag-grey',
                )}
              >
                {m.value}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">{m.detail}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* The final test */}
      <Card className="border-accent/30 bg-accent-soft/50">
        <h3 className="font-display text-sm font-bold text-foreground">The test this record must pass</h3>
        <p className="mt-1 text-pretty text-sm leading-relaxed text-foreground">
          “Can another authorised professional read this record, understand the child’s needs, see
          the evidence behind every statement, know exactly what provision is required, establish
          whether it was delivered and determine whether it made a meaningful difference?”
        </p>
        <ul className="mt-3 space-y-1.5">
          {[
            { label: 'Needs understood', ok: true, to: 'sections' },
            { label: 'Evidence behind every statement', ok: flags.every((f) => f.kind !== 'unidentified-source'), to: 'traceability' },
            { label: 'Provision clearly specified', ok: !flags.some((f) => f.kind === 'missing-section-f'), to: 'provision' },
            { label: 'Delivery established', ok: !flags.some((f) => f.kind === 'non-delivery'), to: 'delivery' },
            { label: 'Meaningful difference measured', ok: false, to: 'progress' },
          ].map((row) => (
            <li key={row.label}>
              <button
                type="button"
                onClick={() => onNavigate(row.to)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-background/60 min-h-11"
              >
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                    row.ok ? 'bg-rag-green text-white' : 'bg-rag-amber text-white',
                  )}
                >
                  {row.ok ? <Check className="h-3 w-3" /> : <span className="text-xs font-bold">?</span>}
                </span>
                <span className="flex-1 text-foreground">{row.label}</span>
                <span className="text-xs font-medium text-primary">Review</span>
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
