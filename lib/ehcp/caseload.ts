import { sampleCase } from './data'

export type CaseSummary = {
  reference: string
  yearGroup: string
  setting: string
  /** Generic, non-diagnostic description of the areas of need under review. */
  focus: string
  nextReview: string | null
  /** Whether a full evidence record has been opened and populated for this child. */
  populated: boolean
  /** Short note shown for records that are not yet populated. */
  note?: string
}

/**
 * A professional's caseload. Only one record (the detailed sampleCase) is fully
 * populated; the others are honestly shown as referrals where evidence gathering
 * has not yet started, so the engine never implies data it does not hold.
 */
export const caseload: CaseSummary[] = [
  {
    reference: sampleCase.reference,
    yearGroup: sampleCase.yearGroup,
    setting: sampleCase.setting,
    focus: 'Communication & interaction; social, emotional & mental health; sensory (unconfirmed)',
    nextReview: sampleCase.nextReview,
    populated: true,
  },
  {
    reference: 'NP-2304',
    yearGroup: 'Year 8 (age 12)',
    setting: 'Mainstream secondary school',
    focus: 'Referral received — areas of need not yet established',
    nextReview: null,
    populated: false,
    note: 'Consent to gather and share evidence recorded. No observations or reports supplied yet.',
  },
  {
    reference: 'NP-2312',
    yearGroup: 'Reception (age 4)',
    setting: 'Maintained nursery',
    focus: 'Referral received — areas of need not yet established',
    nextReview: null,
    populated: false,
    note: 'Awaiting initial setting observations and parent/carer voice.',
  },
  {
    reference: 'NP-2288',
    yearGroup: 'Year 11 (age 16)',
    setting: 'Mainstream secondary / preparing for adulthood',
    focus: 'Referral received — awaiting professional reports',
    nextReview: null,
    populated: false,
    note: 'Transition to post-16 flagged. No advice or reports received for Section K yet.',
  },
]
