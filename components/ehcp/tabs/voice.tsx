'use client'

import { Quote } from 'lucide-react'
import type { CaseData, VoiceCategory } from '@/lib/ehcp/types'
import { Card, Pill, SectionTitle } from '@/components/ui'
import { voiceAttributionConfig, voiceCategoryConfig } from '@/components/ehcp/labels'

const ORDER: VoiceCategory[] = ['child', 'parent', 'professional', 'ai-summary']

const groupHeading: Record<VoiceCategory, string> = {
  child: 'The child or young person’s own words',
  parent: 'Parent or carer views',
  professional: 'Professional observations',
  'ai-summary': 'AI-supported summaries',
}

export function VoiceTab({ data }: { data: CaseData }) {
  return (
    <div className="space-y-4">
      <SectionTitle
        eyebrow="Voice"
        title="Child and family voice"
        description="Each contribution is kept in a separate, clearly labelled section. An individual’s account is never rewritten in a way that changes its meaning, and the basis of any first-person wording is always shown."
      />

      {ORDER.map((category) => {
        const entries = data.voice.filter((v) => v.category === category)
        if (entries.length === 0) return null
        const cfg = voiceCategoryConfig[category]
        return (
          <section key={category} aria-label={groupHeading[category]}>
            <div className="mb-2 flex items-center gap-2">
              <h3 className="font-display text-sm font-bold text-foreground">
                {groupHeading[category]}
              </h3>
              <Pill tone={cfg.tone}>{cfg.text}</Pill>
            </div>
            <div className="space-y-2.5">
              {entries.map((v) => (
                <Card
                  key={v.id}
                  className={
                    category === 'child'
                      ? 'border-accent/30 bg-accent-soft/30'
                      : category === 'ai-summary'
                        ? 'border-rag-amber/30 bg-rag-amber-soft/25'
                        : undefined
                  }
                >
                  <div className="flex items-start gap-2">
                    <Quote className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <p className="text-pretty text-sm leading-relaxed text-foreground">{v.text}</p>
                  </div>

                  {v.scale ? (
                    <div className="mt-3 rounded-lg bg-card px-3 py-2">
                      <p className="text-xs font-medium text-muted-foreground">{v.scale.label}</p>
                      <div className="mt-1 flex items-center gap-1.5" aria-hidden="true">
                        {Array.from({ length: v.scale.max }).map((_, i) => (
                          <span
                            key={i}
                            className={
                              'flex h-8 w-8 items-center justify-center rounded-full text-base ' +
                              (i < v.scale!.value
                                ? 'bg-accent-soft'
                                : 'bg-muted opacity-40')
                            }
                          >
                            {['😟', '😕', '😐', '🙂', '😀'][i] ?? '•'}
                          </span>
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Rated {v.scale.value} of {v.scale.max}
                      </p>
                    </div>
                  ) : null}

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2">
                    <span className="text-xs text-muted-foreground">
                      {v.author} · {v.date}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
                      {voiceAttributionConfig[v.attribution]}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )
      })}

      <Card className="border-primary/20 bg-primary-soft/40">
        <p className="text-xs leading-relaxed text-foreground">
          Accessible methods are supported so every child can contribute: short questions, emoji and
          visual scales, audio where enabled, and recorded communication preferences. Where a
          first-person account appears, its basis — direct quotation, supported communication, a
          parent’s or professional’s interpretation, or an approved AI summary — is always shown.
        </p>
      </Card>
    </div>
  )
}
