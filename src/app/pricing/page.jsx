"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAuth } from "@/hooks/useAuth";

function formatLimit(val) {
  if (val === -1) return "∞ Unlimited";
  return val.toLocaleString();
}

export default function PricingPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [llm, setLlm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getPricingPlans(),
      api.getLlmPricing().catch(() => ({ byok_price: 0, platform_price: 0.50 })),
    ]).then(([p, l]) => { setPlans(p); setLlm(l); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState variant="default" />;

  return (
    <div className="min-h-screen bg-app-bg">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-hairline bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="text-sm font-semibold text-ink">SRP D&amp;M Assistant</Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm font-medium text-primary">Pricing</Link>
            {user ? (
              <Link href="/dashboard"><Button variant="primary" className="text-xs">Dashboard</Button></Link>
            ) : (
              <Link href="/login"><Button variant="primary" className="text-xs">Sign in</Button></Link>
            )}
          </div>
        </div>
      </nav>

      <main className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex rounded border border-primary/20 bg-primary/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-primary">
              Pricing
            </div>
            <h1 className="text-3xl font-semibold leading-tight text-ink md:text-4xl">
              Simple, transparent pricing for higher education
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-body-muted">
              Choose the plan that fits your institution. All plans include AI pre-review, rubric system, supervisor matching, and priority support.
            </p>
          </div>

          {/* Plan cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <Card key={plan.id} className={`flex flex-col ${plan.featured ? "border-primary ring-1 ring-primary/20" : ""}`}>
                <CardContent className="flex flex-col gap-4 p-6">
                  <div>
                    <h2 className="text-base font-semibold text-ink">{plan.name}</h2>
                    {plan.featured && <span className="mt-1 inline-flex rounded bg-primary px-2 py-0.5 text-[10px] font-medium text-white">Popular</span>}
                  </div>

                  <div>
                    <div className="text-3xl font-semibold text-ink">
                      ${plan.annual_license.toLocaleString()}
                      <span className="text-base font-normal text-body-muted">/yr</span>
                    </div>
                    <p className="mt-1 text-xs text-body-muted">
                      +${plan.setup_fee.toLocaleString()} setup fee
                      <span className="block text-[10px] text-muted">(first year only)</span>
                    </p>
                  </div>

                  <ul className="space-y-2 text-sm text-body-muted">
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-success flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>
                      {formatLimit(plan.max_users)} users
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-success flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>
                      {formatLimit(plan.max_proposals)} proposals
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-success flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>
                      AI pre-review &amp; rubric
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-success flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>
                      Supervisor matching
                    </li>
                  </ul>

                  {plan.is_custom ? (
                    <a href="mailto:sales@researchplatform.edu" className="mt-auto inline-flex items-center justify-center rounded border border-hairline px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-subdued">Contact us</a>
                  ) : (
                    <span className="mt-auto inline-flex items-center justify-center rounded border border-dashed border-hairline bg-subdued/50 px-4 py-2.5 text-xs text-muted">Demo — no purchasing available</span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How pricing works */}
          <div className="mt-12 rounded border border-hairline bg-canvas p-6 md:p-8">
            <h2 className="text-lg font-semibold text-ink">How pricing works</h2>
            <div className="mt-4 grid gap-6 md:grid-cols-3">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info-bg text-info text-sm font-bold">1</div>
                <h3 className="mt-3 text-sm font-medium text-ink">First year</h3>
                <p className="mt-1 text-xs leading-6 text-body-muted">
                  You pay the <strong>setup fee</strong> + <strong>annual license</strong>. The setup fee covers tenant creation, domain configuration, and initial admin provisioning.
                </p>
                <p className="mt-2 text-xs font-medium text-primary">
                  Example: {plans[0]?.name || "Research Lab"} = ${(plans[0]?.setup_fee || 1000) + (plans[0]?.annual_license || 500).toLocaleString()}
                </p>
              </div>
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-bg text-success text-sm font-bold">2</div>
                <h3 className="mt-3 text-sm font-medium text-ink">From year 2</h3>
                <p className="mt-1 text-xs leading-6 text-body-muted">
                  You only pay the <strong>annual license</strong>. No additional setup fees. Your data and configuration remain intact.
                </p>
                <p className="mt-2 text-xs font-medium text-success">
                  Example: {plans[0]?.name || "Research Lab"} = ${(plans[0]?.annual_license || 500).toLocaleString()}/year
                </p>
              </div>
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-bg text-warning text-sm font-bold">3</div>
                <h3 className="mt-3 text-sm font-medium text-ink">Everything included</h3>
                <p className="mt-1 text-xs leading-6 text-body-muted">
                  All plans include AI pre-review, rubric-based human review, explainable supervisor matching, academic workflow tracking, and priority support.
                </p>
              </div>
            </div>
          </div>

          {/* LLM options */}
          <div className="mt-10">
            <h2 className="mb-6 text-center text-lg font-semibold text-ink">LLM API Key Options</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-dashed">
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold text-ink">Bring Your Own Key</h3>
                  <div className="mt-2 text-2xl font-semibold text-primary">${(llm?.byok_price || 0).toFixed(2)}<span className="text-sm font-normal text-body-muted"> / 1K requests</span></div>
                  <p className="mt-2 text-sm text-body-muted">Use your OpenAI, Anthropic, or local LLM key. No per-request fees.</p>
                </CardContent>
              </Card>
              <Card className="border-dashed">
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold text-ink">Platform-managed</h3>
                  <div className="mt-2 text-2xl font-semibold text-primary">${(llm?.platform_price || 0.50).toFixed(2)}<span className="text-sm font-normal text-body-muted"> / 1K requests</span></div>
                  <p className="mt-2 text-sm text-body-muted">OpenAI &amp; open-source models included. Pay per usage — no commitment.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact section */}
          <div className="mt-12 rounded border border-hairline bg-canvas p-8 text-center">
            <h2 className="text-xl font-semibold text-ink">Get started</h2>
            <p className="mt-2 text-sm text-body-muted">
              This is a demo environment. Contact us to schedule a demo or request an enterprise quote.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a href="mailto:sales@researchplatform.edu" className="inline-flex items-center gap-2 rounded bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-light">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                sales@researchplatform.edu
              </a>
              <div className="flex items-center gap-2 text-sm text-body-muted">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                +1 (555) 123-4567
              </div>
            </div>
            {!user && (
              <div className="mt-6">
                <Link href="/register" className="text-sm text-primary hover:underline">Create a student account to explore the platform →</Link>
              </div>
            )}
          </div>

          {/* Demo banner */}
          <div className="mt-6 rounded border border-dashed border-warning/30 bg-warning-bg/50 px-5 py-3 text-center text-xs text-warning">
            <strong>Demo environment.</strong> No actual purchasing available. The pricing displayed is for demonstration purposes only.
          </div>
        </div>
      </main>

      <footer className="border-t border-hairline bg-primary px-6 py-8 text-center text-sm text-white/50">
        <p>© 2026 SRP D&amp;M Assistant. Academic research proposal platform.</p>
        <div className="mt-2 flex items-center justify-center gap-4 text-xs text-white/30">
          <Link href="/" className="hover:text-white/60">Home</Link>
          <Link href="/pricing" className="hover:text-white/60">Pricing</Link>
          <Link href="/login" className="hover:text-white/60">Sign in</Link>
        </div>
      </footer>
    </div>
  );
}
