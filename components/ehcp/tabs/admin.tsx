'use client'

import { useState } from 'react'
import { CheckCircle2, FlaskConical, ShieldAlert, XCircle } from 'lucide-react'
import { testCases } from '@/lib/ehcp/data'
import { Card, ExpandablePanel, KeyValue, Pill, SectionTitle } from '@/components/ui'
import { cn } from '@/lib/utils'

const ACCEPTANCE = [
  '100% of statements traceable to supplied evidence',
  'Zero invented facts, diagnoses or professional opinions',
  'Every Section B need linked to Section F provision',
  'Every outcome linked to a baseline and measurement method',
  'Vague provision automatically flagged',
  'Missing and contradictory evidence clearly displayed',
  'Child and parent views accurately represented',
  'Safeguarding concerns appropriately escalated',
  'AI content clearly labelled',
  'Final decisions retained by authorised humans',
]

const safeguardTone: Record<string, 'grey' | 'amber' | 'red'> = {
  none: 'grey',
  monitor: 'amber',
  active: 'red',
}

export function AdminTab() {
  const [filter, setFilter] = useState<'all' | 'safeguarding' | 'gaps'>('all')

  const filtered = testCases.filter((t) => {
    if (filter === 'safeguarding') return t.safeguarding !== 'none'
    if (filter === 'gaps') return t.needsWithoutProvision > 0 || t.vagueProvisionFlags > 0
    return true
  })

  const passCount = testCases.filter((t) => t.pass).length
  const avgTrace = Math.round(
    testCases.reduce((s, t) => s + t.traceability, 0) / testCases.length,
  )
  const invented = testCases.reduce((s, t) => s + t.investedFacts, 0)

  return (
    <div className="space-y-4">
      <SectionTitle
        eyebrow="Administrator area"
        title="Quality-testing area (anonymised cases)"
        description="The engine is tested against varied anonymised cases and independent reviews from SENCOs, SEND specialists, professionals, parents or carers and, where appropriate, young people."
      />

      {/* Aggregate stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="text-center">
          <p className="font-display text-2xl font-extrabold text-foreground">{testCases.length}</p>
          <p className="text-xs text-muted-foreground">Cases tested</p>
        </Card>
        <Card className="text-center">
          <p className="font-display text-2xl font-extrabold text-rag-green">
            {passCount}/{testCases.length}
          </p>
          <p className="text-xs text-muted-foreground">Met acceptance standards</p>
        </Card>
        <Card className="text-center">
          <p className="font-display text-2xl font-extrabold text-rag-green">{avgTrace}%</p>
          <p className="text-xs text-muted-foreground">Average traceability</p>
        </Card>
        <Card className="text-center">
          <p
            className={cn(
              'font-display text-2xl font-extrabold',
              invented === 0 ? 'text-rag-green' : 'text-rag-red',
            )}
          >
            {invented}
          </p>
          <p className="text-xs text-muted-foreground">Invented facts detected</p>
        </Card>
      </div>

      {/* Acceptance standards */}
      <Card>
        <h3 className="mb-2 font-display text-sm font-bold text-foreground">
          Minimum acceptance standards
        </h3>
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {ACCEPTANCE.map((a) => (
            <li key={a} className="flex items-start gap-2 text-sm text-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rag-green" />
              {a}
            </li>
          ))}
        </ul>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: 'all', label: `All cases (${testCases.length})` },
            { id: 'safeguarding', label: 'With safeguarding' },
            { id: 'gaps', label: 'With flagged gaps' },
          ] as const
        ).map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              'min-h-11 rounded-full px-4 text-sm font-medium',
              filter === f.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Case list */}
      <div className="space-y-2.5">
        {filtered.map((t) => (
          <ExpandablePanel
            key={t.ref}
            summary={
              <span className="flex flex-wrap items-center gap-2">
                {t.pass ? (
                  <CheckCircle2 className="h-4 w-4 text-rag-green" />
                ) : (
                  <XCircle className="h-4 w-4 text-rag-red" />
                )}
                <span className="font-mono text-xs text-muted-foreground">{t.ref}</span>
                <span className="text-sm text-foreground">{t.profile}</span>
                <Pill tone="neutral">{t.complexity}</Pill>
                {t.safeguarding !== 'none' ? (
                  <Pill tone={safeguardTone[t.safeguarding]}>
                    <ShieldAlert className="h-3 w-3" />
                    {t.safeguarding === 'active' ? 'Safeguarding active' : 'Safeguarding monitor'}
                  </Pill>
                ) : null}
              </span>
            }
          >
            <dl className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              <KeyValue label="Diagnosis status" value={t.diagnosisStatus} />
              <KeyValue label="Traceability" value={`${t.traceability}%`} />
              <KeyValue label="Invented facts" value={String(t.investedFacts)} />
              <KeyValue label="Needs without provision" value={String(t.needsWithoutProvision)} />
              <KeyValue label="Vague provision flags" value={String(t.vagueProvisionFlags)} />
              <KeyValue label="Independent reviewers" value={t.reviewerRoles.join(', ')} />
            </dl>
            <p className="mt-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-foreground">{t.notes}</p>
          </ExpandablePanel>
        ))}
      </div>

      <Card className="border-accent/30 bg-accent-soft/40">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-foreground">
          <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          Cases span autism, ADHD, speech and language needs, learning difficulties, sensory needs,
          SEMH, physical disability, multiple and complex needs, children without a confirmed
          diagnosis, conflicting home and school evidence, missing professional reports and
          escalating safeguarding concerns. All data is anonymised for testing.
        </p>
      </Card>
    </div>
  )
}
