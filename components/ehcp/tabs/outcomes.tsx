'use client'

import { AlertTriangle, Check, X } from 'lucide-react'
import type { CaseData, Outcome } from '@/lib/ehcp/types'
import { Card, KeyValue, Pill, SectionTitle } from '@/components/ui'
import { cn } from '@/lib/utils'

const SMART_LABELS: { key: keyof Outcome['smart']; label: string }[] = [
  { key: 'specific', label: 'Specific' },
  { key: 'measurable', label: 'Measurable' },
  { key: 'achievable', label: 'Achievable' },
  { key: 'relevant', label: 'Relevant to the need' },
  { key: 'timeBound', label: 'Time-bound' },
  { key: 'meaningful', label: 'Meaningful to the child' },
  { key: 'aspirationLinked', label: 'Linked to aspirations' },
]

export function OutcomesTab({ data }: { data: CaseData }) {
  return (
    <div className="space-y-4">
      <SectionTitle
        eyebrow="Section E"
        title="SMART outcome checker"
        description="Each outcome is tested for whether it is specific, measurable, achievable, relevant, time-bound, meaningful and linked to aspirations — and whether a service has been recorded as an outcome by mistake."
      />

      <Card className="border-primary/20 bg-primary-soft/40">
        <p className="text-sm leading-relaxed text-foreground">
          A service or intervention is not an outcome. For example,{' '}
          <span className="font-semibold">“three hours of speech and language therapy”</span> is
          provision, not an outcome. Each outcome must state a baseline, the intended change, how it
          will be measured, a review date, who monitors it, shorter-term milestones and the child’s
          own view of success.
        </p>
      </Card>

      <div className="space-y-3">
        {data.outcomes.map((o) => {
          const passed = SMART_LABELS.filter(({ key }) => o.smart[key]).length
          const total = SMART_LABELS.length
          const fullySmart = passed === total && !o.isProvisionMisclassified
          return (
            <Card
              key={o.id}
              className={cn(o.isProvisionMisclassified && 'border-rag-red/40 bg-rag-red-soft/30')}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-foreground px-2 py-0.5 font-mono text-xs font-semibold text-background">
                  {o.id}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  for need {o.needId ?? '—'}
                </span>
                {fullySmart ? (
                  <Pill tone="green">
                    <Check className="h-3 w-3" /> Fully SMART
                  </Pill>
                ) : (
                  <Pill tone={o.isProvisionMisclassified ? 'red' : 'amber'}>
                    {passed}/{total} SMART criteria
                  </Pill>
                )}
              </div>

              <p className="text-sm font-medium leading-relaxed text-foreground">“{o.statement}”</p>

              {o.isProvisionMisclassified ? (
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-rag-red-soft px-3 py-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rag-red" />
                  <p className="text-sm text-foreground">
                    This entry describes provision, not an outcome. It should be moved to Section F
                    and replaced with a measurable, child-centred outcome.
                  </p>
                </div>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {SMART_LABELS.map(({ key, label }) => {
                  const ok = o.smart[key]
                  return (
                    <span
                      key={key}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                        ok ? 'bg-rag-green-soft text-rag-green' : 'bg-rag-red-soft text-rag-red',
                      )}
                    >
                      {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      {label}
                    </span>
                  )
                })}
              </div>

              <dl className="mt-3 grid grid-cols-1 gap-x-6 border-t border-border pt-2 sm:grid-cols-2">
                <KeyValue label="Baseline" value={o.baseline ?? '— not recorded'} />
                <KeyValue label="Intended change" value={o.intendedChange ?? '— not recorded'} />
                <KeyValue label="Measurement method" value={o.measurementMethod ?? '— not recorded'} />
                <KeyValue label="Review date" value={o.reviewDate ?? '— not recorded'} />
                <KeyValue label="Monitored by" value={o.monitorPerson ?? '— not recorded'} />
                <KeyValue
                  label="Child’s view of success"
                  value={o.childViewOfSuccess ?? '— not recorded'}
                />
              </dl>

              {o.milestones.length > 0 ? (
                <div className="mt-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Milestones
                  </p>
                  <ul className="mt-1 space-y-1">
                    {o.milestones.map((m, i) => (
                      <li key={i} className="text-sm text-foreground">
                        • {m}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {o.issues.length > 0 ? (
                <ul className="mt-3 space-y-1 rounded-lg bg-rag-amber-soft/60 px-3 py-2">
                  {o.issues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rag-amber" />
                      {issue}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
