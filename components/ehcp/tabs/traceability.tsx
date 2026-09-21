'use client'

import { ArrowDown, CircleUserRound, Link2Off, MapPin } from 'lucide-react'
import type { CaseData, Need } from '@/lib/ehcp/types'
import { Card, ExpandablePanel, KeyValue, Pill, SectionTitle } from '@/components/ui'
import { evidenceLabelConfig } from '@/components/ehcp/labels'
import { cn } from '@/lib/utils'

export function TraceabilityTab({ data }: { data: CaseData }) {
  const evidenceByRef = Object.fromEntries(data.evidence.map((e) => [e.ref, e]))
  const outcomeById = Object.fromEntries(data.outcomes.map((o) => [o.id, o]))
  const provisionById = Object.fromEntries(data.provisions.map((p) => [p.id, p]))
  const deliveryByProvision = Object.fromEntries(data.delivery.map((d) => [d.provisionId, d]))

  // Orphan detection
  const linkedEvidence = new Set(data.needs.flatMap((n) => n.evidenceRefs))
  const orphanEvidence = data.evidence.filter(
    (e) => !linkedEvidence.has(e.ref) && e.label !== 'ai-pattern',
  )
  const orphanProvision = data.provisions.filter((p) => !p.needId)

  return (
    <div className="space-y-4">
      <SectionTitle
        eyebrow="Traceability"
        title="Evidence chain & register"
        description="Every statement, need, outcome and provision links back to its source. The chain runs: Evidence → Identified need → SMART outcome → Specific provision → Responsible person → Delivery record → Measured progress."
      />

      {/* Chain per need */}
      <div className="space-y-3">
        {data.needs.map((need) => (
          <NeedChain
            key={need.id}
            need={need}
            evidenceByRef={evidenceByRef}
            outcomeById={outcomeById}
            provisionById={provisionById}
            deliveryByProvision={deliveryByProvision}
            progress={data.progress}
          />
        ))}
      </div>

      {/* Orphan flags */}
      {(orphanEvidence.length > 0 || orphanProvision.length > 0) && (
        <Card className="border-rag-amber/40 bg-rag-amber-soft/50">
          <div className="flex items-center gap-2">
            <Link2Off className="h-5 w-5 text-rag-amber" />
            <h3 className="font-display text-sm font-bold text-foreground">Orphaned items</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Items not fully connected across the chain. These must be linked or resolved.
          </p>
          <ul className="mt-3 space-y-2">
            {orphanEvidence.map((e) => (
              <li key={e.ref} className="text-sm text-foreground">
                <span className="font-mono text-xs">{e.ref}</span> — evidence not connected to any
                identified need.
              </li>
            ))}
            {orphanProvision.map((p) => (
              <li key={p.id} className="text-sm text-foreground">
                <span className="font-mono text-xs">{p.id}</span> — provision not connected to an
                identified need.
              </li>
            ))}
            {data.needs
              .filter((n) => n.outcomeIds.length === 0)
              .map((n) => (
                <li key={`no-out-${n.id}`} className="text-sm text-foreground">
                  <span className="font-mono text-xs">{n.id}</span> — need has no outcome.
                </li>
              ))}
            {data.needs
              .filter((n) => n.provisionIds.length === 0)
              .map((n) => (
                <li key={`no-prov-${n.id}`} className="text-sm text-foreground">
                  <span className="font-mono text-xs">{n.id}</span> — need has no provision.
                </li>
              ))}
          </ul>
        </Card>
      )}

      {/* Evidence register */}
      <div>
        <h3 className="mb-2 font-display text-sm font-bold text-foreground">
          Evidence register ({data.evidence.length})
        </h3>
        <div className="space-y-2">
          {data.evidence.map((e) => {
            const cfg = evidenceLabelConfig[e.label]
            return (
              <ExpandablePanel
                key={e.ref}
                tone={e.label === 'unverified' ? 'red' : 'neutral'}
                summary={
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-primary">{e.ref}</span>
                    <Pill tone={cfg.tone}>{cfg.text}</Pill>
                    <span className="text-sm text-foreground">{e.summary}</span>
                  </span>
                }
              >
                <dl className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                  <KeyValue label="Source" value={e.source} />
                  <KeyValue label="Contributor" value={`${e.contributorName} (${e.contributorRole})`} />
                  <KeyValue label="Organisation" value={e.organisation} />
                  <KeyValue label="Date & time" value={e.dateTime} />
                  <KeyValue label="Setting" value={e.setting} />
                  <KeyValue
                    label="Observed or reported"
                    value={e.observation === 'direct' ? 'Directly observed' : 'Reported'}
                  />
                  <KeyValue label="Frequency" value={e.frequency} />
                  <KeyValue label="Duration" value={e.duration} />
                  <KeyValue label="Intensity / impact" value={e.intensity} />
                  <KeyValue
                    label="Occurs across settings"
                    value={e.crossSetting ? 'Yes' : 'Not established'}
                  />
                  <KeyValue label="Consent & sharing" value={e.consent} />
                  <KeyValue
                    label="Professional confirmation"
                    value={
                      e.professionalConfirmed === true
                        ? 'Confirmed by a professional'
                        : e.professionalConfirmed === false
                          ? 'Not confirmed'
                          : 'Not applicable'
                    }
                  />
                </dl>
              </ExpandablePanel>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ChainNode({
  label,
  value,
  tone = 'blue',
  icon,
  missing,
}: {
  label: string
  value: string
  tone?: 'blue' | 'teal' | 'green' | 'amber' | 'red' | 'grey'
  icon?: React.ReactNode
  missing?: boolean
}) {
  const tones: Record<string, string> = {
    blue: 'border-primary/30 bg-primary-soft',
    teal: 'border-accent/30 bg-accent-soft',
    green: 'border-rag-green/30 bg-rag-green-soft',
    amber: 'border-rag-amber/30 bg-rag-amber-soft',
    red: 'border-rag-red/40 bg-rag-red-soft',
    grey: 'border-rag-grey/30 bg-rag-grey-soft',
  }
  return (
    <div className={cn('rounded-xl border px-3 py-2', tones[missing ? 'red' : tone])}>
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className={cn('mt-0.5 text-sm', missing ? 'font-semibold text-rag-red' : 'text-foreground')}>
        {value}
      </p>
    </div>
  )
}

function NeedChain({
  need,
  evidenceByRef,
  outcomeById,
  provisionById,
  deliveryByProvision,
  progress,
}: {
  need: Need
  evidenceByRef: Record<string, CaseData['evidence'][number]>
  outcomeById: Record<string, CaseData['outcomes'][number]>
  provisionById: Record<string, CaseData['provisions'][number]>
  deliveryByProvision: Record<string, CaseData['delivery'][number]>
  progress: CaseData['progress']
}) {
  const outcome = need.outcomeIds[0] ? outcomeById[need.outcomeIds[0]] : null
  const provision = need.provisionIds[0] ? provisionById[need.provisionIds[0]] : null
  const delivery = provision ? deliveryByProvision[provision.id] : null
  const relatedProgress = progress.find((p) =>
    p.area.toLowerCase().includes(need.domain.split(' ')[0].toLowerCase()),
  )

  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-foreground px-2 py-0.5 font-mono text-xs font-semibold text-background">
          {need.id}
        </span>
        <h3 className="text-sm font-bold text-foreground">{need.title}</h3>
        <Pill tone="neutral">{need.domain}</Pill>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <ChainNode
          label="Evidence"
          value={
            need.evidenceRefs.length
              ? need.evidenceRefs.join(', ')
              : 'No supporting evidence'
          }
          tone="blue"
          missing={need.evidenceRefs.length === 0}
        />
        <div className="flex justify-center"><ArrowDown className="h-4 w-4 text-muted-foreground" /></div>
        <ChainNode
          label="Identified need"
          value={need.title}
          tone="teal"
        />
        <div className="flex justify-center"><ArrowDown className="h-4 w-4 text-muted-foreground" /></div>
        <ChainNode
          label="SMART outcome"
          value={outcome ? outcome.statement : 'No outcome linked to this need'}
          tone="green"
          missing={!outcome}
        />
        <div className="flex justify-center"><ArrowDown className="h-4 w-4 text-muted-foreground" /></div>
        <ChainNode
          label="Specific provision"
          value={provision ? provision.description : 'No Section F provision linked to this need'}
          tone="green"
          missing={!provision}
        />
        <div className="flex justify-center"><ArrowDown className="h-4 w-4 text-muted-foreground" /></div>
        <ChainNode
          label="Responsible person"
          value={provision?.responsiblePerson ?? 'No named person'}
          tone="blue"
          icon={<CircleUserRound className="h-3 w-3" />}
          missing={!provision?.responsiblePerson}
        />
        <div className="flex justify-center"><ArrowDown className="h-4 w-4 text-muted-foreground" /></div>
        <ChainNode
          label="Delivery record"
          value={
            delivery
              ? `${delivery.sessionsDelivered}/${delivery.sessionsExpected} sessions delivered`
              : 'No delivery information'
          }
          tone={delivery?.rag === 'green' ? 'green' : delivery?.rag === 'red' ? 'red' : 'grey'}
          missing={!delivery}
        />
        <div className="flex justify-center"><ArrowDown className="h-4 w-4 text-muted-foreground" /></div>
        <ChainNode
          label="Measured progress"
          value={relatedProgress ? `${relatedProgress.area}: ${relatedProgress.latest}` : 'Not yet measured'}
          tone={relatedProgress ? 'teal' : 'grey'}
          icon={<MapPin className="h-3 w-3" />}
          missing={!relatedProgress}
        />
      </div>
    </Card>
  )
}
