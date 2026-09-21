'use client'

import { BadgeCheck, Bot, FileDown, History, ShieldQuestion, UserCheck } from 'lucide-react'
import type { CaseData, CriticalFlag, Rag } from '@/lib/ehcp/types'
import { Card, ExpandablePanel, KeyValue, Pill, SectionTitle } from '@/components/ui'

const REPORTS = [
  { id: 1, name: 'EHCP Evidence Summary', body: 'A structured summary of all supplied evidence, grouped by need and clearly labelled by type and reliability.' },
  { id: 2, name: 'EHCP Readiness Report', body: 'The overall readiness band with every underlying indicator and all outstanding critical issues.' },
  { id: 3, name: 'Missing Evidence Report', body: 'Every section, need, outcome and provision with information that is missing, unavailable or requires professional review.' },
  { id: 4, name: 'Needs-to-Provision Map', body: 'The full chain from evidence to measured progress for each identified need, highlighting any orphaned item.' },
  { id: 5, name: 'Section F Specificity Report', body: 'Each provision item checked for quantified detail, with vague or unenforceable wording flagged.' },
  { id: 6, name: 'Provision Delivery Report', body: 'Promised versus delivered provision, delivery percentages, missed sessions and any differing accounts.' },
  { id: 7, name: 'Outcome Progress Report', body: 'Progress against each individual baseline, showing whether measures are improving, stable, declining or not yet measured.' },
  { id: 8, name: 'Annual Review Evidence Pack', body: 'A consolidated pack for the statutory annual review, including findings, amendments and agreed actions.' },
  { id: 9, name: 'Parent and Child Voice Report', body: 'Separately attributed contributions from the child, parents or carers, professionals and approved AI summaries.' },
  { id: 10, name: 'Professional Contribution Report', body: 'Every professional contribution with role, organisation, date and whether it was directly observed or reported.' },
  { id: 11, name: 'Safeguarding Audit Report', body: 'All safeguarding concerns, who received them, actions, timestamps and completion status.' },
  { id: 12, name: 'Complete Audit Trail', body: 'A full, tamper-evident record of every addition and change, including all AI involvement and human approvals.' },
]

export function ReportsTab({
  data,
  readiness,
  flags,
}: {
  data: CaseData
  readiness: { band: string; rag: Rag; score: number; capped: boolean }
  flags: CriticalFlag[]
}) {
  const contributors = Array.from(
    new Set(data.evidence.map((e) => `${e.contributorRole}`)),
  ).join(', ')

  const unresolvedConflicts = data.sections
    .filter((s) => s.status === 'conflict')
    .map((s) => `Section ${s.letter}`)
    .join(', ')

  const missingCount = data.sections.filter(
    (s) => s.status === 'missing' || s.status === 'unavailable',
  ).length

  return (
    <div className="space-y-4">
      <SectionTitle
        eyebrow="Reports & exports"
        title="Reports and exports"
        description="Twelve report types can be generated. Every report carries the same integrity footer: report date, reporting period, data sources, contributors, limitations, unresolved conflicts, missing information, AI involvement, human reviewer and version number."
      />

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {REPORTS.map((r) => (
          <ExpandablePanel
            key={r.id}
            summary={
              <span className="flex items-center gap-2">
                <FileDown className="h-4 w-4 text-primary" />
                <span className="font-mono text-xs text-muted-foreground">
                  {String(r.id).padStart(2, '0')}
                </span>
                {r.name}
              </span>
            }
          >
            <p className="text-sm leading-relaxed text-foreground">{r.body}</p>
            <div className="mt-3 rounded-lg bg-muted/50 p-3">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Report integrity footer
              </p>
              <dl className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                <KeyValue label="Report date" value="21 September 2026" />
                <KeyValue label="Reporting period" value="14 Mar 2026 – 21 Sep 2026" />
                <KeyValue label="Data sources" value={`${data.evidence.length} evidence records`} />
                <KeyValue label="Contributors" value={contributors} />
                <KeyValue
                  label="Limitations"
                  value="Health and social-care advice outstanding; one need unconfirmed."
                />
                <KeyValue
                  label="Unresolved conflicts"
                  value={unresolvedConflicts || 'None recorded'}
                />
                <KeyValue label="Missing information" value={`${missingCount} section(s)`} />
                <KeyValue
                  label="AI involvement"
                  value="Pattern support and draft wording only, clearly labelled."
                />
                <KeyValue label="Human reviewer" value="SENCO (awaiting sign-off on amendments)" />
                <KeyValue label="Version" value="v1.0" />
              </dl>
            </div>
            <button
              type="button"
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-primary/30 bg-primary-soft px-4 text-sm font-semibold text-primary"
            >
              <FileDown className="h-4 w-4" /> Generate {r.name}
            </button>
          </ExpandablePanel>
        ))}
      </div>

      {/* AI & human accountability */}
      <Card>
        <div className="mb-2 flex items-center gap-2">
          <Bot className="h-5 w-5 text-accent" />
          <h3 className="font-display text-sm font-bold text-foreground">
            AI involvement & human accountability
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-rag-green/25 bg-rag-green-soft/40 p-3">
            <p className="text-xs font-semibold text-rag-green">AI may</p>
            <ul className="mt-1 space-y-1 text-xs text-foreground">
              <li>• Organise supplied evidence</li>
              <li>• Identify missing information</li>
              <li>• Highlight possible patterns</li>
              <li>• Check structural completeness</li>
              <li>• Suggest questions and draft labelled wording</li>
              <li>• Identify possible contradictions</li>
            </ul>
          </div>
          <div className="rounded-lg border border-rag-red/25 bg-rag-red-soft/40 p-3">
            <p className="text-xs font-semibold text-rag-red">AI must not</p>
            <ul className="mt-1 space-y-1 text-xs text-foreground">
              <li>• Diagnose or determine eligibility</li>
              <li>• Make final safeguarding decisions</li>
              <li>• Approve, refuse provision or choose placement</li>
              <li>• Replace professional assessment</li>
              <li>• Change original evidence</li>
              <li>• Present an inference as verified fact</li>
            </ul>
          </div>
        </div>

        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Human approval log
        </p>
        <div className="mt-2 space-y-2">
          {data.aiApprovals.map((a) => (
            <div key={a.id} className="rounded-lg border border-border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs text-muted-foreground">{a.id}</span>
                <Pill
                  tone={a.status === 'approved' ? 'green' : a.status === 'rejected' ? 'red' : 'amber'}
                >
                  {a.status === 'approved' ? (
                    <BadgeCheck className="h-3 w-3" />
                  ) : a.status === 'rejected' ? (
                    <ShieldQuestion className="h-3 w-3" />
                  ) : (
                    <UserCheck className="h-3 w-3" />
                  )}
                  {a.status === 'approved'
                    ? 'Approved by human'
                    : a.status === 'rejected'
                      ? 'Rejected'
                      : 'Awaiting human review'}
                </Pill>
              </div>
              <p className="mt-1 text-sm text-foreground">{a.content}</p>
              <dl className="mt-2 grid grid-cols-1 gap-x-6 border-t border-border pt-2 sm:grid-cols-2">
                <KeyValue label="Approved by" value={a.approvedBy ?? 'Not yet approved'} />
                <KeyValue
                  label="Role / organisation"
                  value={a.role ? `${a.role}, ${a.organisation}` : '—'}
                />
                <KeyValue label="Date & time" value={a.dateTime ?? '—'} />
                <KeyValue label="Version" value={a.version} />
                <KeyValue label="Changes" value={a.changes} />
                <KeyValue label="Reason" value={a.reason} />
              </dl>
            </div>
          ))}
        </div>
      </Card>

      {/* Complete audit trail */}
      <Card>
        <div className="mb-2 flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h3 className="font-display text-sm font-bold text-foreground">Complete audit trail</h3>
        </div>
        <ol className="relative space-y-3 border-l border-border pl-4">
          {data.audit.map((a) => (
            <li key={a.id} className="relative">
              <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{a.action}</p>
                <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
                  {a.version}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {a.dateTime} · {a.actor} ({a.role}), {a.organisation}
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Change:</span> {a.changes} ·{' '}
                <span className="font-medium text-foreground">Reason:</span> {a.reason}
              </p>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  )
}
