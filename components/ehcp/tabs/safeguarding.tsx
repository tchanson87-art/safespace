'use client'

import { useState } from 'react'
import { CheckCircle2, ShieldAlert, ShieldCheck } from 'lucide-react'
import type { CaseData, SafeguardingAction, SafeguardingAlert } from '@/lib/ehcp/types'
import { Card, KeyValue, Pill, SectionTitle } from '@/components/ui'

export function SafeguardingTab({ data }: { data: CaseData }) {
  return (
    <div className="space-y-4">
      <SectionTitle
        eyebrow="Safeguarding"
        title="Safeguarding concerns"
        description="Safeguarding concerns are never hidden inside an ordinary EHCP report. They are shown immediately, routed to the designated safeguarding lead, and require human acknowledgement. The system never records that action is complete unless an authorised person confirms it."
      />

      {data.safeguarding.length === 0 ? (
        <Card className="border-rag-green/30 bg-rag-green-soft/40">
          <p className="flex items-center gap-2 text-sm text-foreground">
            <ShieldCheck className="h-5 w-5 text-rag-green" />
            No safeguarding concerns are currently recorded for this child.
          </p>
        </Card>
      ) : (
        data.safeguarding.map((alert) => <SafeguardingCard key={alert.id} alert={alert} />)
      )}
    </div>
  )
}

function SafeguardingCard({ alert }: { alert: SafeguardingAlert }) {
  const [actions, setActions] = useState<SafeguardingAction[]>(alert.actions)
  const [acknowledged, setAcknowledged] = useState(alert.acknowledged)
  const [status, setStatus] = useState(alert.status)
  const [completedBy, setCompletedBy] = useState(alert.completedBy)

  const [ackName, setAckName] = useState('')
  const [ackRole, setAckRole] = useState('')
  const [compName, setCompName] = useState('')
  const [compRole, setCompRole] = useState('')

  const now = () =>
    new Date().toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const acknowledge = () => {
    if (!ackName.trim() || !ackRole.trim()) return
    setAcknowledged(true)
    setStatus('in-progress')
    setActions((prev) => [
      ...prev,
      { timestamp: now(), action: 'Alert acknowledged by authorised person', by: `${ackName} (${ackRole})` },
    ])
  }

  const complete = () => {
    if (!compName.trim() || !compRole.trim()) return
    setStatus('completed')
    setCompletedBy(`${compName} (${compRole})`)
    setActions((prev) => [
      ...prev,
      { timestamp: now(), action: 'Safeguarding action recorded as completed', by: `${compName} (${compRole})` },
    ])
  }

  return (
    <Card className="border-2 border-rag-red/40 bg-rag-red-soft/40">
      {/* Immediate alert */}
      <div className="flex items-start gap-3 rounded-xl bg-rag-red px-4 py-3 text-white">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="text-sm font-bold uppercase tracking-wide">Safety alert: immediate safeguarding review recommended</p>
          <p className="mt-0.5 text-xs opacity-90">Reference {alert.id} · Severity: {alert.severity}</p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-foreground">{alert.concern}</p>

      <dl className="mt-3 grid grid-cols-1 gap-x-6 border-t border-rag-red/20 pt-2 sm:grid-cols-2">
        <KeyValue label="Safeguarding procedure" value={alert.procedure} />
        <KeyValue label="Designated safeguarding lead" value={alert.dsl} />
        <KeyValue label="Alert received by" value={alert.receivedBy ?? 'Not yet received'} />
        <KeyValue
          label="Current status"
          value={
            <Pill tone={status === 'completed' ? 'green' : status === 'in-progress' ? 'amber' : 'red'}>
              {status === 'completed' ? 'Completed' : status === 'in-progress' ? 'In progress' : 'Open'}
            </Pill>
          }
        />
      </dl>

      {/* Action / audit trail */}
      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Action & audit trail
        </p>
        <ol className="mt-2 space-y-2">
          {actions.map((a, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-rag-red" />
              <div>
                <p className="text-sm text-foreground">{a.action}</p>
                <p className="text-[11px] text-muted-foreground">
                  {a.timestamp} · {a.by}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Human acknowledgement */}
      {!acknowledged ? (
        <div className="mt-3 rounded-xl border border-rag-red/30 bg-card p-3">
          <p className="text-sm font-semibold text-foreground">Human acknowledgement required</p>
          <p className="text-xs text-muted-foreground">
            An authorised person must acknowledge this alert. Enter your name and role.
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              value={ackName}
              onChange={(e) => setAckName(e.target.value)}
              placeholder="Your name"
              className="min-h-11 rounded-lg border border-input bg-background px-3 text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              value={ackRole}
              onChange={(e) => setAckRole(e.target.value)}
              placeholder="Your role (e.g. DSL)"
              className="min-h-11 rounded-lg border border-input bg-background px-3 text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="button"
            onClick={acknowledge}
            disabled={!ackName.trim() || !ackRole.trim()}
            className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-lg bg-rag-red px-4 text-sm font-semibold text-white disabled:opacity-40"
          >
            <ShieldCheck className="h-4 w-4" /> Acknowledge alert
          </button>
        </div>
      ) : status !== 'completed' ? (
        <div className="mt-3 rounded-xl border border-rag-amber/30 bg-card p-3">
          <p className="text-sm font-semibold text-foreground">Record completion (authorised person only)</p>
          <p className="text-xs text-muted-foreground">
            The system will not mark this as complete unless an authorised person records it here.
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              value={compName}
              onChange={(e) => setCompName(e.target.value)}
              placeholder="Authorised person name"
              className="min-h-11 rounded-lg border border-input bg-background px-3 text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              value={compRole}
              onChange={(e) => setCompRole(e.target.value)}
              placeholder="Role"
              className="min-h-11 rounded-lg border border-input bg-background px-3 text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="button"
            onClick={complete}
            disabled={!compName.trim() || !compRole.trim()}
            className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-lg bg-rag-amber px-4 text-sm font-semibold text-white disabled:opacity-40"
          >
            <CheckCircle2 className="h-4 w-4" /> Record as completed
          </button>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-rag-green/30 bg-rag-green-soft px-4 py-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-rag-green" />
          <p className="text-sm text-foreground">
            Recorded as completed by <span className="font-semibold">{completedBy}</span>. The full
            audit trail above is preserved.
          </p>
        </div>
      )}
    </Card>
  )
}
