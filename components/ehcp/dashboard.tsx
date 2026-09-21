'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ClipboardCheck,
  FileText,
  GitBranch,
  HeartPulse,
  LayoutDashboard,
  ListChecks,
  LogOut,
  MessageSquareHeart,
  ScrollText,
  ShieldAlert,
  Target,
  TrendingUp,
  Truck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { sampleCase } from '@/lib/ehcp/data'
import { useProfessional } from '@/lib/professional/context'
import {
  computeCriticalFlags,
  computeMetrics,
  computeReadiness,
} from '@/lib/ehcp/scoring'
import { OverviewTab } from './tabs/overview'
import { SectionsTab } from './tabs/sections'
import { TraceabilityTab } from './tabs/traceability'
import { OutcomesTab } from './tabs/outcomes'
import { ProvisionTab } from './tabs/provision'
import { DeliveryTab } from './tabs/delivery'
import { ProgressTab } from './tabs/progress'
import { ReviewTab } from './tabs/review'
import { VoiceTab } from './tabs/voice'
import { SafeguardingTab } from './tabs/safeguarding'
import { ReportsTab } from './tabs/reports'
import { AdminTab } from './tabs/admin'
import { CriticalFlagsBanner } from './critical-flags'

const TABS = [
  { id: 'overview', label: 'Readiness', icon: LayoutDashboard },
  { id: 'sections', label: 'EHCP sections', icon: ListChecks },
  { id: 'traceability', label: 'Evidence chain', icon: GitBranch },
  { id: 'outcomes', label: 'SMART outcomes', icon: Target },
  { id: 'provision', label: 'Section F check', icon: ClipboardCheck },
  { id: 'delivery', label: 'Delivery', icon: Truck },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'review', label: 'Review', icon: ScrollText },
  { id: 'voice', label: 'Child & family voice', icon: MessageSquareHeart },
  { id: 'safeguarding', label: 'Safeguarding', icon: ShieldAlert },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'admin', label: 'Testing area', icon: HeartPulse },
] as const

type TabId = (typeof TABS)[number]['id']

export function Dashboard({ onBack }: { onBack?: () => void }) {
  const [tab, setTab] = useState<TabId>('overview')
  const { professional, signOut } = useProfessional()

  const metrics = useMemo(() => computeMetrics(sampleCase), [])
  const flags = useMemo(() => computeCriticalFlags(sampleCase), [])
  const readiness = useMemo(() => computeReadiness(metrics, flags), [metrics, flags])

  const goSafeguarding = () => setTab('safeguarding')

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to caseload"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <span className="font-display text-lg font-extrabold">N</span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-bold leading-tight text-foreground">
              {sampleCase.reference} · {sampleCase.yearGroup}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              EHCP Evidence &amp; Assurance Engine
            </p>
          </div>
          {professional ? (
            <button
              type="button"
              onClick={signOut}
              className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-muted-foreground hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          ) : (
            <span className="hidden shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent sm:inline">
              Prevention is the cure
            </span>
          )}
        </div>

        <nav aria-label="Assurance sections" className="border-t border-border">
          <div className="mx-auto max-w-6xl">
            <ul className="flex gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {TABS.map((t) => {
                const Icon = t.icon
                const active = tab === t.id
                const isSafeguard = t.id === 'safeguarding'
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => setTab(t.id)}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                        active
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted',
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {t.label}
                      {isSafeguard && flags.some((f) => f.kind === 'safeguarding') ? (
                        <span
                          className={cn(
                            'ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold',
                            active ? 'bg-primary-foreground text-primary' : 'bg-rag-red text-white',
                          )}
                        >
                          !
                        </span>
                      ) : null}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-4">
        {/* Permanent statutory notice */}
        <div className="mb-4 flex items-start gap-3 rounded-[var(--radius-card)] border border-primary/20 bg-primary-soft px-4 py-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-pretty text-xs leading-relaxed text-foreground sm:text-sm">
            NeuroPathway supports evidence gathering and professional decision-making. It does not
            diagnose conditions, determine eligibility or issue an Education, Health and Care Plan.
            EHCP decisions remain the responsibility of the relevant local authority and authorised
            professionals.
          </p>
        </div>

        {professional ? (
          <p className="mb-3 text-xs text-muted-foreground">
            Working as{' '}
            <span className="font-semibold text-foreground">{professional.name}</span> —{' '}
            {professional.role}, {professional.organisation}. Your identity is attached to every
            acknowledgement, approval and audit entry you record.
          </p>
        ) : null}

        {/* Always-visible critical flags — never concealed by the overall score */}
        <CriticalFlagsBanner flags={flags} onOpenSafeguarding={goSafeguarding} />

        <div className="mt-4">
          {tab === 'overview' && (
            <OverviewTab
              data={sampleCase}
              metrics={metrics}
              readiness={readiness}
              flags={flags}
              onNavigate={(id) => setTab(id as TabId)}
            />
          )}
          {tab === 'sections' && <SectionsTab data={sampleCase} />}
          {tab === 'traceability' && <TraceabilityTab data={sampleCase} />}
          {tab === 'outcomes' && <OutcomesTab data={sampleCase} />}
          {tab === 'provision' && <ProvisionTab data={sampleCase} />}
          {tab === 'delivery' && <DeliveryTab data={sampleCase} />}
          {tab === 'progress' && <ProgressTab data={sampleCase} />}
          {tab === 'review' && <ReviewTab data={sampleCase} />}
          {tab === 'voice' && <VoiceTab data={sampleCase} />}
          {tab === 'safeguarding' && <SafeguardingTab data={sampleCase} />}
          {tab === 'reports' && <ReportsTab data={sampleCase} readiness={readiness} flags={flags} />}
          {tab === 'admin' && <AdminTab />}
        </div>
      </main>
    </div>
  )
}
