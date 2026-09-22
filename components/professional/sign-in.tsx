'use client'

import { useState } from 'react'
import { AlertTriangle, LogIn, ShieldCheck } from 'lucide-react'
import { PROFESSIONAL_ROLES, useProfessional, type ProfessionalRole } from '@/lib/professional/context'

export function SignIn() {
  const { signIn } = useProfessional()
  const [name, setName] = useState('')
  const [role, setRole] = useState<ProfessionalRole | ''>('')
  const [organisation, setOrganisation] = useState('')

  const valid = name.trim().length > 1 && role !== '' && organisation.trim().length > 1

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    signIn({ name: name.trim(), role: role as ProfessionalRole, organisation: organisation.trim() })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
        <div className="mb-6 flex flex-col items-center text-center">
          <img
            src="/social-innovation-cic-logo.jpeg"
            alt="Social Innovation CIC — NeuroPathway Safe Space and MediSense"
            className="h-40 w-40 rounded-full object-contain"
          />
          <p className="mt-3 font-display text-lg font-bold leading-tight text-foreground">
            NeuroPathway
          </p>
          <p className="text-xs text-muted-foreground">
            Social Innovation CIC · ehcpcollection.org
          </p>
        </div>

        <h1 className="text-balance font-display text-2xl font-bold text-foreground">
          Professional &amp; parent access
        </h1>
        <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
          Identify yourself before opening a child&apos;s record. Your name, role and organisation are
          attached to everything you acknowledge, approve or record, so every action stays
          accountable and traceable.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="pro-name" className="mb-1 block text-sm font-medium text-foreground">
              Full name
            </label>
            <input
              id="pro-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="e.g. Jordan Smith"
              className="min-h-11 w-full rounded-lg border border-input bg-background px-3 text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="pro-role" className="mb-1 block text-sm font-medium text-foreground">
              Role
            </label>
            <select
              id="pro-role"
              value={role}
              onChange={(e) => setRole(e.target.value as ProfessionalRole)}
              className="min-h-11 w-full rounded-lg border border-input bg-background px-3 text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="" disabled>
                Select your role
              </option>
              {PROFESSIONAL_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="pro-org" className="mb-1 block text-sm font-medium text-foreground">
              Organisation
            </label>
            <input
              id="pro-org"
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
              autoComplete="organization"
              placeholder="e.g. Oak Primary School / County SEND team"
              className="min-h-11 w-full rounded-lg border border-input bg-background px-3 text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            disabled={!valid}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
          >
            <LogIn className="h-4 w-4" /> Open my caseload
          </button>

          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            Only access records you are authorised to see. This is a professional record-keeping
            tool — respect the consent and sharing status attached to each piece of evidence.
          </p>
        </form>

        <div className="mt-8 flex items-start gap-3 rounded-[var(--radius-card)] border border-primary/20 bg-primary-soft px-4 py-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-pretty text-xs leading-relaxed text-foreground">
            NeuroPathway supports evidence gathering and professional decision-making. It does not
            diagnose conditions, determine eligibility or issue an Education, Health and Care Plan.
            EHCP decisions remain the responsibility of the relevant local authority and authorised
            professionals.
          </p>
        </div>
      </div>
    </div>
  )
}
