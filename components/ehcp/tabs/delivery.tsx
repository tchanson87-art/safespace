'use client'

import { FileCheck2, MessageSquareWarning, Users } from 'lucide-react'
import type { CaseData, Rag } from '@/lib/ehcp/types'
import { Card, KeyValue, Pill, RagDot, SectionTitle } from '@/components/ui'
import { cn } from '@/lib/utils'

const ragText: Record<Rag, string> = {
  green: 'Delivered as specified',
  amber: 'Partly delivered or rearranged',
  red: 'Repeatedly missed or not delivered',
  grey: 'No delivery information recorded',
}

export function DeliveryTab({ data }: { data: CaseData }) {
  const provisionById = Object.fromEntries(data.provisions.map((p) => [p.id, p]))

  return (
    <div className="space-y-4">
      <SectionTitle
        eyebrow="Delivery"
        title="Provision delivery tracker"
        description="Promised provision is compared against what was actually delivered. Delivery percentages are shown, but the underlying detail is always retained. Parents and professionals can record differing accounts without overwriting one another."
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(['green', 'amber', 'red', 'grey'] as Rag[]).map((r) => {
          const count = data.delivery.filter((d) => d.rag === r).length
          return (
            <div key={r} className="rounded-xl border border-border bg-card px-3 py-2">
              <div className="flex items-center gap-2">
                <RagDot rag={r} />
                <span className="font-display text-lg font-bold text-foreground">{count}</span>
              </div>
              <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{ragText[r]}</p>
            </div>
          )
        })}
      </div>

      <div className="space-y-3">
        {data.delivery.map((d) => {
          const provision = provisionById[d.provisionId]
          const pct =
            d.sessionsExpected > 0
              ? Math.round((d.sessionsDelivered / d.sessionsExpected) * 100)
              : null
          return (
            <Card key={d.provisionId} className={cn(d.rag === 'red' && 'border-rag-red/40')}>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-foreground px-2 py-0.5 font-mono text-xs font-semibold text-background">
                  {d.provisionId}
                </span>
                <Pill tone={d.rag}>
                  <RagDot rag={d.rag} />
                  {ragText[d.rag]}
                </Pill>
              </div>

              {provision ? (
                <p className="text-sm leading-relaxed text-foreground">{provision.description}</p>
              ) : null}

              {/* Delivery bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground">
                    {d.sessionsDelivered} of {d.sessionsExpected || '—'} sessions delivered
                  </span>
                  <span className="font-semibold text-foreground">
                    {pct === null ? 'Not trackable' : `${pct}%`}
                  </span>
                </div>
                <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      d.rag === 'green' && 'bg-rag-green',
                      d.rag === 'amber' && 'bg-rag-amber',
                      d.rag === 'red' && 'bg-rag-red',
                      d.rag === 'grey' && 'bg-rag-grey',
                    )}
                    style={{ width: pct === null ? '100%' : `${pct}%`, opacity: pct === null ? 0.3 : 1 }}
                  />
                </div>
              </div>

              <dl className="mt-3 grid grid-cols-1 gap-x-6 border-t border-border pt-2 sm:grid-cols-2">
                <KeyValue label="Planned frequency" value={d.plannedFrequency} />
                <KeyValue label="Planned duration" value={d.plannedDuration} />
                <KeyValue label="Responsible" value={d.responsible} />
                <KeyValue label="Sessions missed" value={String(d.sessionsMissed)} />
                <KeyValue label="Reason missed" value={d.reasonMissed} />
                <KeyValue label="Alternative support" value={d.alternative} />
                <KeyValue label="Child’s engagement" value={d.engagement} />
                <KeyValue label="Outcome / observation" value={d.observation} />
                <KeyValue
                  label="Evidence uploaded"
                  value={
                    <span className="inline-flex items-center gap-1">
                      <FileCheck2
                        className={cn('h-4 w-4', d.evidenceUploaded ? 'text-rag-green' : 'text-rag-grey')}
                      />
                      {d.evidenceUploaded ? 'Yes' : 'None'}
                    </span>
                  }
                />
                <KeyValue label="Follow-up action" value={d.followUp} />
              </dl>

              {d.accounts && d.accounts.length > 0 ? (
                <div className="mt-3 rounded-lg border border-border bg-muted/40 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    Recorded accounts ({d.accounts.length})
                    {d.accounts.length > 1 ? (
                      <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-rag-amber-soft px-2 py-0.5 text-[11px] font-medium text-rag-amber">
                        <MessageSquareWarning className="h-3 w-3" /> Differing accounts preserved
                      </span>
                    ) : null}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {d.accounts.map((a, i) => (
                      <li key={i} className="rounded-md bg-card px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-foreground">
                            {a.by} · {a.role}
                          </span>
                          <span className="text-[11px] text-muted-foreground">{a.date}</span>
                        </div>
                        <p className="mt-0.5 text-sm text-foreground">“{a.note}”</p>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Conflicting records are never merged or overwritten — they are preserved and
                    flagged for review.
                  </p>
                </div>
              ) : null}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
