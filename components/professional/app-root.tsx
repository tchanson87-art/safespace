'use client'

import { useState } from 'react'
import { ArrowLeft, ClipboardList } from 'lucide-react'
import { ProfessionalProvider, useProfessional } from '@/lib/professional/context'
import { caseload } from '@/lib/ehcp/caseload'
import { sampleCase } from '@/lib/ehcp/data'
import { SignIn } from './sign-in'
import { Caseload } from './caseload'
import { Dashboard } from '@/components/ehcp/dashboard'

function Screens() {
  const { professional } = useProfessional()
  const [selected, setSelected] = useState<string | null>(null)

  if (!professional) return <SignIn />
  if (!selected) return <Caseload onOpen={setSelected} />

  const summary = caseload.find((c) => c.reference === selected)
  if (summary?.populated) {
    return <Dashboard onBack={() => setSelected(null)} />
  }
  return <EmptyRecord reference={selected} onBack={() => setSelected(null)} />
}

function EmptyRecord({ reference, onBack }: { reference: string; onBack: () => void }) {
  const summary = caseload.find((c) => c.reference === reference)
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border px-3 text-sm font-medium text-muted-foreground hover:bg-muted"
      >
        <ArrowLeft className="h-4 w-4" /> Back to caseload
      </button>
      <div className="rounded-[var(--radius-card)] border border-border bg-card p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
          <ClipboardList className="h-6 w-6 text-muted-foreground" />
        </div>
        <h1 className="mt-3 font-display text-xl font-bold text-foreground">
          {reference} — evidence gathering not yet started
        </h1>
        <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
          {summary?.note ??
            'No observations, reports or voice have been supplied for this child yet.'}{' '}
          The assurance engine only shows findings once real evidence is recorded — it never invents
          content to fill an empty record.
        </p>
        <p className="mx-auto mt-3 max-w-md text-pretty text-sm leading-relaxed text-foreground">
          Open{' '}
          <span className="font-mono text-xs">{sampleCase.reference}</span> from the caseload to see
          a fully populated record with the complete validation, delivery and outcomes toolkit.
        </p>
      </div>
    </div>
  )
}

export function AppRoot() {
  return (
    <ProfessionalProvider>
      <Screens />
    </ProfessionalProvider>
  )
}
