import type {
  CaseData,
  CriticalFlag,
  Rag,
  ReadinessMetric,
} from './types'

export const VAGUE_PHRASES = [
  'access to support',
  'access to',
  'regular help',
  'regular',
  'opportunities to',
  'as required',
  'when necessary',
  'would benefit from',
  'small-group work',
  'adult support',
  'differentiation',
  'staff will encourage',
]

function smartCount(smart: Record<string, boolean>) {
  const values = Object.values(smart)
  return { passed: values.filter(Boolean).length, total: values.length }
}

export function computeMetrics(data: CaseData): ReadinessMetric[] {
  const totalSections = data.sections.length
  const completeSections = data.sections.filter((s) => s.status === 'complete').length
  const partialSections = data.sections.filter((s) => s.status === 'partial').length

  // Evidence completeness: needs, outcomes and provision present per need
  const needsWithEvidence = data.needs.filter((n) => n.evidenceRefs.length > 0).length
  const needsWithOutcome = data.needs.filter((n) => n.outcomeIds.length > 0).length
  const needsWithProvision = data.needs.filter((n) => n.provisionIds.length > 0).length

  const confirmed = data.evidence.filter(
    (e) => e.label === 'confirmed' || e.label === 'direct-observation',
  ).length
  const unverified = data.evidence.filter((e) => e.label === 'unverified').length
  const unidentifiedSource = data.evidence.filter(
    (e) => e.organisation === 'Unknown' || e.contributorRole === 'Unknown',
  ).length

  const childVoice = data.voice.filter((v) => v.category === 'child').length
  const parentVoice = data.voice.filter((v) => v.category === 'parent').length

  const smartOutcomes = data.outcomes.filter((o) => {
    const { passed, total } = smartCount(o.smart)
    return passed === total && !o.isProvisionMisclassified
  }).length

  const specificProvision = data.provisions.filter((p) => p.vagueFlags.length === 0).length
  const orphanProvision = data.provisions.filter((p) => !p.needId).length

  const professionalContribs = new Set(
    data.evidence
      .filter((e) => e.professionalConfirmed === true)
      .map((e) => e.contributorRole),
  ).size

  const missingSections = data.sections.filter(
    (s) => s.status === 'missing' || s.status === 'unavailable',
  ).length

  const conflicting = data.sections.filter((s) => s.status === 'conflict').length

  const deliveredWell = data.delivery.filter((d) => d.rag === 'green').length
  const deliveryProblem = data.delivery.filter((d) => d.rag === 'red' || d.rag === 'grey').length

  const improving = data.progress.filter((p) => p.trend === 'improving').length
  const declining = data.progress.filter(
    (p) => p.trend === 'declining' || p.trend === 'not-measured',
  ).length

  const safeguardingOpen = data.safeguarding.filter((s) => s.status !== 'completed').length

  const rag = (good: boolean, warn: boolean): Rag =>
    good ? 'green' : warn ? 'amber' : 'red'

  return [
    {
      key: 'completeness',
      label: 'Evidence completeness',
      rag: rag(completeSections >= totalSections * 0.75, completeSections + partialSections >= totalSections * 0.6),
      value: `${completeSections}/${totalSections} sections complete`,
      detail: `${partialSections} partial, ${missingSections} missing or unavailable.`,
    },
    {
      key: 'quality',
      label: 'Evidence quality',
      rag: rag(unverified === 0 && unidentifiedSource === 0, unverified <= 1),
      value: `${confirmed} confirmed / ${data.evidence.length} items`,
      detail: `${unverified} unverified, ${unidentifiedSource} with an unidentified source.`,
    },
    {
      key: 'voice',
      label: 'Child and parent voice',
      rag: rag(childVoice > 0 && parentVoice > 0, childVoice > 0 || parentVoice > 0),
      value: `${childVoice} child, ${parentVoice} parent entries`,
      detail: 'Recorded separately and clearly attributed.',
    },
    {
      key: 'needs',
      label: 'Needs identified',
      rag: rag(needsWithEvidence === data.needs.length, needsWithEvidence >= data.needs.length - 1),
      value: `${data.needs.length} needs`,
      detail: `${needsWithEvidence} supported by evidence.`,
    },
    {
      key: 'outcomes',
      label: 'Outcomes quality',
      rag: rag(smartOutcomes === data.outcomes.length, smartOutcomes >= data.outcomes.length - 1),
      value: `${smartOutcomes}/${data.outcomes.length} fully SMART`,
      detail: `${needsWithOutcome}/${data.needs.length} needs have an outcome.`,
    },
    {
      key: 'provision',
      label: 'Provision specificity',
      rag: rag(specificProvision === data.provisions.length, specificProvision >= data.provisions.length - 1),
      value: `${specificProvision}/${data.provisions.length} specific`,
      detail: `${data.provisions.length - specificProvision} contain vague wording.`,
    },
    {
      key: 'matching',
      label: 'Needs-to-provision matching',
      rag: rag(needsWithProvision === data.needs.length && orphanProvision === 0, needsWithProvision >= data.needs.length - 1),
      value: `${needsWithProvision}/${data.needs.length} needs covered`,
      detail: `${orphanProvision} orphaned provision item(s).`,
    },
    {
      key: 'professional',
      label: 'Professional contributions',
      rag: rag(professionalContribs >= 3, professionalContribs >= 1),
      value: `${professionalContribs} professional role(s)`,
      detail: 'Education input present; health and social care outstanding.',
    },
    {
      key: 'missing',
      label: 'Missing evidence',
      rag: rag(missingSections === 0, missingSections <= 2),
      value: `${missingSections} section(s)`,
      detail: 'Missing or unavailable sources remain visible.',
    },
    {
      key: 'conflict',
      label: 'Conflicting evidence',
      rag: rag(conflicting === 0, conflicting <= 1),
      value: `${conflicting} area(s)`,
      detail: 'Conflicts preserved for human review, never merged.',
    },
    {
      key: 'delivery',
      label: 'Provision delivery',
      rag: rag(deliveryProblem === 0, deliveredWell > deliveryProblem),
      value: `${deliveredWell} on track / ${deliveryProblem} at risk`,
      detail: 'Delivery compared against what was promised.',
    },
    {
      key: 'progress',
      label: 'Progress towards outcomes',
      rag: rag(declining === 0 && improving > 0, improving >= declining),
      value: `${improving} improving / ${declining} declining or unmeasured`,
      detail: 'Measured against the child’s own baseline.',
    },
    {
      key: 'safeguarding',
      label: 'Safeguarding concerns',
      rag: safeguardingOpen > 0 ? 'red' : 'green',
      value: safeguardingOpen > 0 ? `${safeguardingOpen} open` : 'None open',
      detail: safeguardingOpen > 0 ? 'Open concern awaiting authorised completion.' : 'No open concerns.',
    },
  ]
}

/**
 * Overall readiness is reported as a band, never a single number that could
 * hide a serious omission. Any critical flag caps the band at "Not ready".
 */
export function computeReadiness(
  metrics: ReadinessMetric[],
  flags: CriticalFlag[],
): { band: string; rag: Rag; score: number; capped: boolean } {
  const weights: Record<Rag, number> = { green: 1, amber: 0.5, red: 0, grey: 0.25 }
  const raw =
    metrics.reduce((sum, m) => sum + weights[m.rag], 0) / metrics.length
  const score = Math.round(raw * 100)

  const hasCritical = flags.length > 0
  if (hasCritical) {
    return { band: 'Not ready — critical gaps present', rag: 'red', score, capped: true }
  }
  if (score >= 85) return { band: 'Approaching ready for review', rag: 'green', score, capped: false }
  if (score >= 60) return { band: 'Developing — evidence incomplete', rag: 'amber', score, capped: false }
  return { band: 'Early stage — significant gaps', rag: 'red', score, capped: false }
}

export function computeCriticalFlags(data: CaseData): CriticalFlag[] {
  const flags: CriticalFlag[] = []

  data.safeguarding
    .filter((s) => s.status !== 'completed')
    .forEach((s) =>
      flags.push({
        id: `flag-sg-${s.id}`,
        kind: 'safeguarding',
        message: `Open safeguarding concern (${s.id}): ${s.concern}`,
        action: `Refer to ${s.dsl}. This remains visible until an authorised person records completion.`,
      }),
    )

  // Missing Section F provision for any identified need
  data.needs
    .filter((n) => n.provisionIds.length === 0)
    .forEach((n) =>
      flags.push({
        id: `flag-f-${n.id}`,
        kind: 'missing-section-f',
        message: `Need ${n.id} (${n.title}) has no Section F provision.`,
        action: 'Add specific, quantified provision linked to this need, or record why none is required.',
      }),
    )

  // Unidentified evidence source
  data.evidence
    .filter((e) => e.organisation === 'Unknown' || e.contributorRole === 'Unknown')
    .forEach((e) =>
      flags.push({
        id: `flag-src-${e.ref}`,
        kind: 'unidentified-source',
        message: `Evidence ${e.ref} has an unidentified source and cannot be relied upon.`,
        action: 'Identify the contributor, organisation and date, or mark the evidence as unverified and exclude it from conclusions.',
      }),
    )

  // Unsupported claim: an outcome misclassified as provision, or need on a single unverified source
  data.outcomes
    .filter((o) => o.isProvisionMisclassified)
    .forEach((o) =>
      flags.push({
        id: `flag-claim-${o.id}`,
        kind: 'unsupported-claim',
        message: `Outcome ${o.id} describes a service, not a measurable outcome.`,
        action: 'Rewrite as a child-centred outcome with a baseline, intended change and measurement method.',
      }),
    )

  // Non-delivery
  data.delivery
    .filter((d) => d.rag === 'red')
    .forEach((d) =>
      flags.push({
        id: `flag-del-${d.provisionId}`,
        kind: 'non-delivery',
        message: `Provision ${d.provisionId} is repeatedly not being delivered (${d.sessionsDelivered}/${d.sessionsExpected} sessions).`,
        action: 'Escalate at interim review; record the reason and any alternative support.',
      }),
    )

  // Conflicting evidence sections
  data.sections
    .filter((s) => s.status === 'conflict')
    .forEach((s) =>
      flags.push({
        id: `flag-conf-${s.id}`,
        kind: 'conflicting-evidence',
        message: `Section ${s.letter} contains conflicting evidence.`,
        action: 'Preserve both accounts and refer for professional review — do not merge or overwrite.',
      }),
    )

  return flags
}
