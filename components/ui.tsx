'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Card({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-card)] border border-border bg-card p-4 shadow-[0_1px_2px_rgba(16,36,62,0.04)] sm:p-5',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description?: string
}) {
  return (
    <div className="mb-4">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">{eyebrow}</p>
      ) : null}
      <h2 className="text-pretty text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
      {description ? (
        <p className="mt-1 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export function Pill({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: 'green' | 'amber' | 'red' | 'grey' | 'neutral' | 'blue' | 'teal'
  children: React.ReactNode
  className?: string
}) {
  const tones: Record<string, string> = {
    green: 'bg-rag-green-soft text-rag-green',
    amber: 'bg-rag-amber-soft text-rag-amber',
    red: 'bg-rag-red-soft text-rag-red',
    grey: 'bg-rag-grey-soft text-rag-grey',
    neutral: 'bg-muted text-muted-foreground',
    blue: 'bg-primary-soft text-primary',
    teal: 'bg-accent-soft text-accent',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold leading-none',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function RagDot({ rag }: { rag: 'green' | 'amber' | 'red' | 'grey' }) {
  const colors: Record<string, string> = {
    green: 'bg-rag-green',
    amber: 'bg-rag-amber',
    red: 'bg-rag-red',
    grey: 'bg-rag-grey',
  }
  return (
    <span className="inline-flex items-center" aria-hidden="true">
      <span className={cn('h-2.5 w-2.5 rounded-full', colors[rag])} />
    </span>
  )
}

export function ExpandablePanel({
  summary,
  children,
  defaultOpen = false,
  tone = 'neutral',
}: {
  summary: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  tone?: 'neutral' | 'red' | 'amber'
}) {
  const [open, setOpen] = useState(defaultOpen)
  const borders: Record<string, string> = {
    neutral: 'border-border',
    red: 'border-rag-red/40',
    amber: 'border-rag-amber/40',
  }
  return (
    <div className={cn('rounded-xl border bg-card', borders[tone])}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left min-h-11"
      >
        <span className="flex-1 text-sm font-medium text-foreground">{summary}</span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
        />
      </button>
      {open ? <div className="border-t border-border px-4 py-3 text-sm">{children}</div> : null}
    </div>
  )
}

export function KeyValue({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-1.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  )
}
