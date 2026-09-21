import type {
  EvidenceLabel,
  ProgressTrend,
  Rag,
  SectionStatus,
  VoiceAttribution,
  VoiceCategory,
} from '@/lib/ehcp/types'

type Tone = 'green' | 'amber' | 'red' | 'grey' | 'neutral' | 'blue' | 'teal'

export const evidenceLabelConfig: Record<EvidenceLabel, { text: string; tone: Tone }> = {
  confirmed: { text: 'Confirmed evidence', tone: 'green' },
  'direct-observation': { text: 'Direct observation', tone: 'green' },
  'parent-report': { text: 'Parent or carer report', tone: 'blue' },
  'child-view': { text: 'Child or young person’s view', tone: 'teal' },
  'professional-opinion': { text: 'Professional opinion', tone: 'blue' },
  unverified: { text: 'Unverified report', tone: 'red' },
  'ai-pattern': { text: 'AI-supported pattern', tone: 'amber' },
  interpretation: { text: 'Interpretation — human review needed', tone: 'amber' },
}

export const sectionStatusConfig: Record<SectionStatus, { text: string; tone: Tone; rag: Rag }> = {
  complete: { text: 'Complete', tone: 'green', rag: 'green' },
  partial: { text: 'Partially complete', tone: 'amber', rag: 'amber' },
  missing: { text: 'Missing', tone: 'red', rag: 'red' },
  review: { text: 'Requires professional review', tone: 'amber', rag: 'amber' },
  conflict: { text: 'Conflicting evidence found', tone: 'red', rag: 'red' },
  unavailable: { text: 'Evidence source unavailable', tone: 'grey', rag: 'grey' },
}

export const trendConfig: Record<ProgressTrend, { text: string; tone: Tone; rag: Rag }> = {
  improving: { text: 'Improving', tone: 'green', rag: 'green' },
  stable: { text: 'Stable', tone: 'blue', rag: 'green' },
  declining: { text: 'Declining', tone: 'red', rag: 'red' },
  inconsistent: { text: 'Inconsistent', tone: 'amber', rag: 'amber' },
  'not-measured': { text: 'Not measured', tone: 'grey', rag: 'grey' },
  awaiting: { text: 'Awaiting sufficient evidence', tone: 'grey', rag: 'grey' },
}

export const voiceCategoryConfig: Record<VoiceCategory, { text: string; tone: Tone }> = {
  child: { text: 'Child or young person', tone: 'teal' },
  parent: { text: 'Parent or carer', tone: 'blue' },
  professional: { text: 'Professional', tone: 'blue' },
  'ai-summary': { text: 'AI-supported summary', tone: 'amber' },
}

export const voiceAttributionConfig: Record<VoiceAttribution, string> = {
  'direct-quote': 'Direct quotation',
  'supported-comm': 'Supported communication',
  'parent-interpretation': 'Parent’s interpretation',
  'professional-interpretation': 'Professional’s interpretation',
  'ai-summary-approved': 'AI-generated summary, approved by the person',
}
