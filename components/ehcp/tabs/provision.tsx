'use client'

import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { CaseData, Provision } from '@/lib/ehcp/types'
import { Card, KeyValue, Pill, SectionTitle } from '@/components/ui'
import { VAGUE_PHRASES } from '@/lib/ehcp/scoring'
import { cn } from '@/lib/utils'

const REQUIRED_FIELDS: { key: keyof Provision; label: string }[] = [
  { key: 'description', label: 'What support is delivered' },
  { key: 'needId', label: 'Which need it addresses' },
  { key: 'responsiblePerson', label: 'Who delivers it' },
  { key: 'expertise', label: 'Training / expertise required' },
  { key: 'frequency', label: 'Frequency' },
  { key: 'sessionDuration', label: 'Duration of each session' },
  { key: 'totalPeriod', label: 'Total period of support' },
  { key: 'groupType', label: 'Individual or group' },
  { key: 'maxGroupSize', label: 'Maximum group size' },
  { key: 'setting', label: 'Setting / location' },
  { key: 'resources', label: 'Resources & adjustments' },
  { key: 'absenceCover', label: 'Arrangements during staff absence' },
  { key: 'intendedOutcome', label: 'Intended outcome' },
  { key: 'monitoring', label: 'Monitoring arrangements' },
  { key: 'reviewDate', label: 'Review date' },
]

export function ProvisionTab({ data }: { data: CaseData }) {
  const fProvisions = data.provisions.filter((p) => p.section === 'F')
  return (
    <div className="space-y-4">
      <SectionTitle
        eyebrow="Section F"
        title="Provision specificity checker"
        description="Special educational provision must be detailed, specific and normally quantified. Each item is checked for the required detail and scanned for vague, unenforceable wording."
      />

      <Card className="border-primary/20 bg-primary-soft/40">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Phrases automatically flagged
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {VAGUE_PHRASES.map((phrase) => (
            <span
              key={phrase}
              className="rounded-full bg-rag-amber-soft px-2 py-0.5 text-xs font-medium text-rag-amber"
            >
              “{phrase}”
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          These may need replacing with measurable, enforceable detail — who, how often, for how
          long, in what group size, and how it is monitored.
        </p>
      </Card>

      <div className="space-y-3">
        {fProvisions.map((p) => {
          const missing = REQUIRED_FIELDS.filter(({ key }) => {
            const v = p[key]
            return v === null || v === undefined || v === ''
          })
          const specific = p.vagueFlags.length === 0 && missing.length === 0
          return (
            <Card
              key={p.id}
              className={cn(!specific && 'border-rag-amber/40')}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-foreground px-2 py-0.5 font-mono text-xs font-semibold text-background">
                  {p.id}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  for need {p.needId ?? '—'}
                </span>
                {specific ? (
                  <Pill tone="green">
                    <CheckCircle2 className="h-3 w-3" /> Specific & quantified
                  </Pill>
                ) : (
                  <Pill tone="amber">
                    <AlertTriangle className="h-3 w-3" /> Needs strengthening
                  </Pill>
                )}
              </div>

              <p className="text-sm leading-relaxed text-foreground">{p.description}</p>

              {p.vagueFlags.length > 0 ? (
                <div className="mt-3 rounded-lg bg-rag-amber-soft/70 px-3 py-2">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-rag-amber">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Vague wording detected
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {p.vagueFlags.map((f) => (
                      <span
                        key={f}
                        className="rounded-full bg-rag-amber px-2 py-0.5 text-xs font-medium text-white"
                      >
                        “{f}”
                      </span>
                    ))}
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Replace with measurable, enforceable detail before this can be relied upon.
                  </p>
                </div>
              ) : null}

              {missing.length > 0 ? (
                <div className="mt-3 rounded-lg bg-rag-red-soft/60 px-3 py-2">
                  <p className="text-xs font-semibold text-rag-red">
                    Missing required detail ({missing.length})
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {missing.map((m) => (
                      <span
                        key={m.key as string}
                        className="rounded-full bg-rag-red-soft px-2 py-0.5 text-xs font-medium text-rag-red"
                      >
                        {m.label}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <dl className="mt-3 grid grid-cols-1 gap-x-6 border-t border-border pt-2 sm:grid-cols-2">
                <KeyValue label="Delivered by" value={p.responsiblePerson ?? '— not recorded'} />
                <KeyValue label="Expertise required" value={p.expertise ?? '— not recorded'} />
                <KeyValue label="Frequency" value={p.frequency ?? '— not recorded'} />
                <KeyValue label="Session duration" value={p.sessionDuration ?? '— not recorded'} />
                <KeyValue label="Total period" value={p.totalPeriod ?? '— not recorded'} />
                <KeyValue
                  label="Group size"
                  value={
                    p.groupType
                      ? `${p.groupType === 'individual' ? 'Individual' : 'Group'}${
                          p.maxGroupSize && p.maxGroupSize !== 'n/a' ? ` — max ${p.maxGroupSize}` : ''
                        }`
                      : '— not recorded'
                  }
                />
                <KeyValue label="Setting" value={p.setting ?? '— not recorded'} />
                <KeyValue label="Resources / adjustments" value={p.resources ?? '— not recorded'} />
                <KeyValue label="Staff absence cover" value={p.absenceCover ?? '— not recorded'} />
                <KeyValue label="Monitoring" value={p.monitoring ?? '— not recorded'} />
                <KeyValue label="Review date" value={p.reviewDate ?? '— not recorded'} />
              </dl>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
