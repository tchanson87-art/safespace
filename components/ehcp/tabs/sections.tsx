'use client'

import { AlertCircle, FileWarning } from 'lucide-react'
import type { CaseData } from '@/lib/ehcp/types'
import { Card, ExpandablePanel, Pill, RagDot, SectionTitle } from '@/components/ui'
import { sectionStatusConfig } from '@/components/ehcp/labels'

export function SectionsTab({ data }: { data: CaseData }) {
  return (
    <div className="space-y-4">
      <SectionTitle
        eyebrow="Sections A to K"
        title="EHCP section validation"
        description="Every statutory section is checked against the supplied evidence. Click any warning to see exactly what information is missing or requires professional review."
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {(['complete', 'partial', 'missing', 'review', 'conflict', 'unavailable'] as const).map(
          (status) => {
            const cfg = sectionStatusConfig[status]
            const count = data.sections.filter((s) => s.status === status).length
            return (
              <div
                key={status}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2"
              >
                <RagDot rag={cfg.rag} />
                <span className="text-xs font-medium text-muted-foreground">{cfg.text}</span>
                <span className="ml-auto font-display text-sm font-bold text-foreground">{count}</span>
              </div>
            )
          },
        )}
      </div>

      <div className="space-y-3">
        {data.sections.map((section) => {
          const cfg = sectionStatusConfig[section.status]
          const hasWarnings = section.missing.length > 0
          return (
            <Card key={section.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft font-display text-base font-extrabold text-primary">
                  {section.letter}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-pretty text-sm font-bold text-foreground">{section.title}</h3>
                  <div className="mt-1.5">
                    <Pill tone={cfg.tone}>
                      <RagDot rag={cfg.rag} />
                      {cfg.text}
                    </Pill>
                  </div>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">{section.summary}</p>

              {section.evidenceRefs.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Linked evidence:</span>
                  {section.evidenceRefs.map((ref) => (
                    <span
                      key={ref}
                      className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground"
                    >
                      {ref}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-medium text-rag-grey">No evidence linked to this section.</p>
              )}

              {hasWarnings ? (
                <ExpandablePanel
                  tone={section.status === 'conflict' || section.status === 'missing' ? 'red' : 'amber'}
                  summary={
                    <span className="flex items-center gap-2">
                      <FileWarning className="h-4 w-4 text-rag-amber" />
                      {`See what is missing (${section.missing.length})`}
                    </span>
                  }
                >
                  <ul className="space-y-2">
                    {section.missing.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rag-red" />
                        <span className="text-sm text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </ExpandablePanel>
              ) : (
                <p className="text-xs font-medium text-rag-green">
                  No outstanding information for this section.
                </p>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
