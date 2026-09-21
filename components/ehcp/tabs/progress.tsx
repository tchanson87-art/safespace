'use client'

import { Minus, TrendingDown, TrendingUp, HelpCircle, Activity } from 'lucide-react'
import type { CaseData, ProgressTrend } from '@/lib/ehcp/types'
import { Card, Pill, SectionTitle } from '@/components/ui'
import { trendConfig } from '@/components/ehcp/labels'

const trendIcon: Record<ProgressTrend, React.ComponentType<{ className?: string }>> = {
  improving: TrendingUp,
  stable: Minus,
  declining: TrendingDown,
  inconsistent: Activity,
  'not-measured': HelpCircle,
  awaiting: HelpCircle,
}

export function ProgressTab({ data }: { data: CaseData }) {
  return (
    <div className="space-y-4">
      <SectionTitle
        eyebrow="Progress & impact"
        title="Progress and impact monitoring"
        description="Progress is measured against the child’s own individual baseline, never against other children. The system does not claim that any one intervention caused an improvement unless the evidence supports it."
      />

      <div className="space-y-2.5">
        {data.progress.map((m) => {
          const cfg = trendConfig[m.trend]
          const Icon = trendIcon[m.trend]
          return (
            <Card key={m.id} className="flex items-start gap-3">
              <span
                className={
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full ' +
                  (cfg.rag === 'green'
                    ? 'bg-rag-green-soft text-rag-green'
                    : cfg.rag === 'red'
                      ? 'bg-rag-red-soft text-rag-red'
                      : cfg.rag === 'amber'
                        ? 'bg-rag-amber-soft text-rag-amber'
                        : 'bg-rag-grey-soft text-rag-grey')
                }
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-foreground">{m.area}</h3>
                  <Pill tone={cfg.tone}>{cfg.text}</Pill>
                </div>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded-lg bg-muted/60 px-3 py-1.5">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Individual baseline
                    </p>
                    <p className="text-sm text-foreground">{m.baseline}</p>
                  </div>
                  <div className="rounded-lg bg-muted/60 px-3 py-1.5">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Latest
                    </p>
                    <p className="text-sm text-foreground">{m.latest}</p>
                  </div>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{m.note}</p>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="border-accent/30 bg-accent-soft/40">
        <p className="text-xs leading-relaxed text-foreground">
          Measures available for monitoring include attendance, engagement, exclusions and removals
          from lessons, emotional regulation and recovery time, communication, sensory needs,
          independence, relationships, academic progress, crisis or safeguarding incidents, use of
          reasonable adjustments, preparation for adulthood, and child-reported and parent-reported
          wellbeing.
        </p>
      </Card>
    </div>
  )
}
