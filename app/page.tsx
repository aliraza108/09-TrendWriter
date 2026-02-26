"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, CalendarClock, Lightbulb, LineChart, Sparkles, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageWrapper } from '@/components/layout/PageWrapper'

const features = [
  { title: 'Trend Detection', icon: Lightbulb },
  { title: 'AI Content Gen', icon: Sparkles },
  { title: 'Smart Scheduling', icon: CalendarClock },
  { title: 'Analytics', icon: BarChart3 },
  { title: 'Strategy AI', icon: LineChart },
  { title: 'Multi-Account', icon: Users },
]

export default function LandingPage() {
  return (
    <PageWrapper>
      <main className="min-h-screen">
        <section className="relative overflow-hidden bg-brand-gradient px-6 py-20 text-white md:px-10">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">Turn Trends Into Viral LinkedIn Posts Automatically</h1>
              <p className="mt-4 max-w-xl text-lg text-blue-100">AI-powered content generation, scheduling and growth analytics.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/dashboard"><Button variant="secondary" className="bg-white">Get Started Free</Button></Link>
                <Button variant="ghost" className="border border-white text-white hover:bg-white/10">Watch Demo</Button>
              </div>
              <p className="mt-8 text-sm text-blue-100">10,000+ posts generated | 500% avg engagement increase | 2min setup</p>
            </div>
            <div className="relative h-72">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 }}
                  className="glass absolute w-full rounded-card p-4 shadow-lg"
                  style={{ top: i * 70, left: i * 10 }}
                >
                  <p className="text-sm">LinkedIn Post Idea #{i + 1}</p>
                  <p className="mt-2 text-xs text-blue-100">Use personal story + data-backed insight + CTA.</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div key={feature.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                  <Card className="p-5">
                    <Icon className="text-primary" />
                    <h3 className="mt-3 text-lg font-semibold text-textDark">{feature.title}</h3>
                    <p className="mt-1 text-sm text-textGray">Purpose-built workflows to publish faster and improve engagement.</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </section>

        <section className="bg-offWhite px-6 py-16 md:px-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h2 className="text-3xl font-bold text-textDark">Start Growing Today</h2>
              <p className="mt-2 text-textGray">Automate your content engine in minutes.</p>
            </div>
            <Link href="/dashboard">
              <Button className="gap-2">Launch Dashboard <ArrowRight size={16} /></Button>
            </Link>
          </div>
        </section>
      </main>
    </PageWrapper>
  )
}