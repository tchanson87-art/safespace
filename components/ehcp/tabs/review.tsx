'use client'

import { Bell, CalendarClock, CalendarDays } from 'lucide-react'
import type { CaseData } from '@/lib/ehcp/types'
import { Card, KeyValue, Pill, SectionTitle } from '@/components/ui'

const statusTone: Record<string, 'green' | 'amber' | 'blue'> = {
  complete: 'green',
  'in-progress': 'amber',
  agreed: 'blue',
}

export function ReviewTab({ data }: { data: CaseData }) {
  const r = data.review
  return (
    <div className="space-y-4">
      <SectionTitle
        eyebrow="Review"
        title="Ongoing review process"
        description="The EHCP is treated as a living record, not a one-off document. Reviews track outcome progress, whether provision remains appropriate and effective, changed needs, new evidence and agreed actions."
      />

      {/* Alerts */}
      {r.alerts.length > 0 ? (
        <Card className="border-rag-amber/40 bg-rag-amber-soft/50">
          <p className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
            <Bell className="h-4 w-4 text-rag-amber" />
            Review alerts
          </p>
          <ul className="mt-2 space-y-1.5">
            {r.alerts.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rag-amber" />
                {a}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {/* Dates */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Last review
            </p>
            <p className="font-display text-base font-bold text-foreground">{r.lastReview}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <CalendarClock className="h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Next statutory annual review
            </p>
            <p className="font-display text-base font-bold text-foreground">{r.nextStatutory}</p>
          </div>
        </Card>
      </div>

      {r.interimDates.length > 0 ? (
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Interim review dates
          </p>
          <ul className="mt-1 space-y-1">
            {r.interimDates.map((d, i) => (
              <li key={i} className="text-sm text-foreground">
                • {d}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {/* Review findings */}
      <Card>
        <h3 className="mb-1 font-display text-sm font-bold text-foreground">Review findings</h3>
        <dl className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
          <KeyValue label="Outcome progress" value={r.outcomeProgressNote} />
          <KeyValue label="Provision still appropriate?" value={r.provisionAppropriate} />
          <KeyValue label="Changed or new needs" value={r.changedNeeds} />
          <KeyValue label="Ineffective provision" value={r.ineffectiveProvision} />
          <KeyValue label="Undelivered provision" value={r.undeliveredProvision} />
          <KeyValue label="New evidence" value={r.newEvidence} />
          <KeyValue label="Child’s view" value={r.childView} />
          <KeyValue label="Parent’s view" value={r.parentView} />
          <KeyValue label="Professional response" value={r.professionalResponse} />
        </dl>
      </Card>

      {/* Recommended amendments */}
      <Card>
        <h3 className="mb-2 font-display text-sm font-bold text-foreground">
          Recommended amendments
        </h3>
        <ul className="space-y-1.5">
          {r.recommendedAmendments.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                {i + 1}
              </span>
              {a}
            </li>
          ))}
        </ul>
      </Card>

      {/* Agreed actions */}
      <Card>
        <h3 className="mb-2 font-display text-sm font-bold text-foreground">Agreed actions</h3>
        <div className="space-y-2">
          {r.actions.map((a, i) => (
            <div key={i} className="rounded-lg border border-border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{a.action}</p>
                <Pill tone={statusTone[a.status] ?? 'neutral'}>{a.status}</Pill>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                <span>
                  <span className="font-medium text-foreground">Responsible:</span> {a.responsible}
                </span>
                <span>
                  <span className="font-medium text-foreground">Deadline:</span> {a.deadline}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
