'use client'

import { createContext, useContext, useMemo, useState } from 'react'

export type ProfessionalRole =
  | 'SENCO'
  | 'SEND specialist teacher'
  | 'Educational Psychologist'
  | 'Class / subject teacher'
  | 'Speech & Language Therapist'
  | 'Occupational Therapist'
  | 'Paediatrician / health'
  | 'Social Worker'
  | 'Local Authority SEND Officer'
  | 'Parent / carer'
  | 'Other authorised professional'

export const PROFESSIONAL_ROLES: ProfessionalRole[] = [
  'SENCO',
  'SEND specialist teacher',
  'Educational Psychologist',
  'Class / subject teacher',
  'Speech & Language Therapist',
  'Occupational Therapist',
  'Paediatrician / health',
  'Social Worker',
  'Local Authority SEND Officer',
  'Parent / carer',
  'Other authorised professional',
]

export type Professional = {
  name: string
  role: ProfessionalRole
  organisation: string
  signedInAt: string
}

type ProfessionalContextValue = {
  professional: Professional | null
  signIn: (p: Omit<Professional, 'signedInAt'>) => void
  signOut: () => void
  /** Formatted attribution string, e.g. "Jo Smith (SENCO, Oak Primary)". */
  attribution: string | null
}

const Ctx = createContext<ProfessionalContextValue | null>(null)

export function ProfessionalProvider({ children }: { children: React.ReactNode }) {
  const [professional, setProfessional] = useState<Professional | null>(null)

  const value = useMemo<ProfessionalContextValue>(() => {
    return {
      professional,
      signIn: (p) =>
        setProfessional({
          ...p,
          signedInAt: new Date().toLocaleString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        }),
      signOut: () => setProfessional(null),
      attribution: professional
        ? `${professional.name} (${professional.role}, ${professional.organisation})`
        : null,
    }
  }, [professional])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useProfessional() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useProfessional must be used within a ProfessionalProvider')
  return ctx
}
