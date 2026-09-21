export type Rag = 'green' | 'amber' | 'red' | 'grey'

export type EvidenceLabel =
  | 'confirmed'
  | 'direct-observation'
  | 'parent-report'
  | 'child-view'
  | 'professional-opinion'
  | 'unverified'
  | 'ai-pattern'
  | 'interpretation'

export type SectionStatus =
  | 'complete'
  | 'partial'
  | 'missing'
  | 'review'
  | 'conflict'
  | 'unavailable'

export interface EvidenceItem {
  ref: string
  summary: string
  source: string
  contributorName: string
  contributorRole: string
  organisation: string
  dateTime: string
  setting: string
  observation: 'direct' | 'reported'
  frequency: string
  duration: string
  intensity: string
  crossSetting: boolean
  consent: string
  professionalConfirmed: boolean | null
  label: EvidenceLabel
}

export interface EhcpSection {
  id: string
  letter: string
  title: string
  status: SectionStatus
  summary: string
  missing: string[]
  evidenceRefs: string[]
}

export interface Need {
  id: string
  title: string
  domain: string
  evidenceRefs: string[]
  outcomeIds: string[]
  provisionIds: string[]
}

export interface SmartFlags {
  specific: boolean
  measurable: boolean
  achievable: boolean
  relevant: boolean
  timeBound: boolean
  meaningful: boolean
  aspirationLinked: boolean
}

export interface Outcome {
  id: string
  statement: string
  needId: string | null
  smart: SmartFlags
  baseline: string | null
  intendedChange: string | null
  measurementMethod: string | null
  reviewDate: string | null
  monitorPerson: string | null
  milestones: string[]
  childViewOfSuccess: string | null
  issues: string[]
  isProvisionMisclassified?: boolean
}

export type ProvisionSection = 'F' | 'G' | 'H1' | 'H2'

export interface Provision {
  id: string
  section: ProvisionSection
  description: string
  needId: string | null
  outcomeId: string | null
  responsiblePerson: string | null
  expertise: string | null
  frequency: string | null
  sessionDuration: string | null
  totalPeriod: string | null
  groupType: 'individual' | 'group' | null
  maxGroupSize: string | null
  setting: string | null
  resources: string | null
  absenceCover: string | null
  intendedOutcome: string | null
  monitoring: string | null
  reviewDate: string | null
  vagueFlags: string[]
}

export interface DeliveryRecord {
  provisionId: string
  plannedFrequency: string
  plannedDuration: string
  responsible: string
  sessionsExpected: number
  sessionsDelivered: number
  sessionsMissed: number
  reasonMissed: string
  alternative: string
  engagement: string
  observation: string
  evidenceUploaded: boolean
  followUp: string
  rag: Rag
  accounts?: { by: string; role: string; note: string; date: string }[]
}

export type ProgressTrend =
  | 'improving'
  | 'stable'
  | 'declining'
  | 'inconsistent'
  | 'not-measured'
  | 'awaiting'

export interface ProgressMeasure {
  id: string
  area: string
  baseline: string
  latest: string
  trend: ProgressTrend
  note: string
}

export type VoiceCategory = 'child' | 'parent' | 'professional' | 'ai-summary'
export type VoiceAttribution =
  | 'direct-quote'
  | 'supported-comm'
  | 'parent-interpretation'
  | 'professional-interpretation'
  | 'ai-summary-approved'

export interface VoiceEntry {
  id: string
  category: VoiceCategory
  attribution: VoiceAttribution
  text: string
  author: string
  date: string
  scale?: { label: string; value: number; max: number }
}

export interface SafeguardingAction {
  timestamp: string
  action: string
  by: string
}

export interface SafeguardingAlert {
  id: string
  severity: 'urgent' | 'serious'
  concern: string
  procedure: string
  dsl: string
  receivedBy: string | null
  actions: SafeguardingAction[]
  acknowledged: boolean
  status: 'open' | 'in-progress' | 'completed'
  completedBy: string | null
}

export interface ReviewAction {
  action: string
  responsible: string
  deadline: string
  status: 'agreed' | 'in-progress' | 'complete'
}

export interface ReviewInfo {
  lastReview: string
  nextStatutory: string
  interimDates: string[]
  outcomeProgressNote: string
  provisionAppropriate: string
  changedNeeds: string
  ineffectiveProvision: string
  undeliveredProvision: string
  newEvidence: string
  recommendedAmendments: string[]
  childView: string
  parentView: string
  professionalResponse: string
  actions: ReviewAction[]
  alerts: string[]
}

export interface AuditEntry {
  id: string
  dateTime: string
  actor: string
  role: string
  organisation: string
  action: string
  version: string
  changes: string
  reason: string
}

export interface AiApproval {
  id: string
  content: string
  approvedBy: string | null
  role: string | null
  organisation: string | null
  dateTime: string | null
  version: string
  changes: string
  reason: string
  status: 'draft' | 'approved' | 'rejected'
}

export interface ReadinessMetric {
  key: string
  label: string
  rag: Rag
  value: string
  detail: string
}

export interface CriticalFlag {
  id: string
  kind:
    | 'safeguarding'
    | 'unsupported-claim'
    | 'missing-section-f'
    | 'unidentified-source'
    | 'conflicting-evidence'
    | 'non-delivery'
  message: string
  action: string
}

export interface TestCase {
  ref: string
  profile: string
  complexity: 'Single need' | 'Multiple needs' | 'Complex'
  diagnosisStatus: string
  traceability: number
  investedFacts: number
  needsWithoutProvision: number
  vagueProvisionFlags: number
  safeguarding: 'none' | 'monitor' | 'active'
  reviewerRoles: string[]
  pass: boolean
  notes: string
}

export interface CaseData {
  reference: string
  yearGroup: string
  setting: string
  lastReview: string
  nextReview: string
  sections: EhcpSection[]
  evidence: EvidenceItem[]
  needs: Need[]
  outcomes: Outcome[]
  provisions: Provision[]
  delivery: DeliveryRecord[]
  progress: ProgressMeasure[]
  voice: VoiceEntry[]
  safeguarding: SafeguardingAlert[]
  review: ReviewInfo
  audit: AuditEntry[]
  aiApprovals: AiApproval[]
}
