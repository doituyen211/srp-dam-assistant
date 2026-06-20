"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

const features = [
  {
    title: "Proposal Drafting Workspace",
    description:
      "Structured 11-section editor with academic guidance, character targets, and inline health checks for each section.",
    icon: (
      <path d="M7.75 8.25h8.5M7.75 12h8.5M7.75 15.75h5M5.25 3.75h13.5v16.5H5.25z" />
    ),
  },
  {
    title: "AI Pre-review",
    description:
      "Automated advisory analysis of proposal completeness, strengths, and areas for improvement. AI suggests — humans decide.",
    icon: (
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
  },
  {
    title: "Rubric-based Human Review",
    description:
      "Reviewers evaluate proposals against 8 academic criteria with transparent scoring, AI observations, and reviewer comments.",
    icon: (
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    ),
  },
  {
    title: "Explainable Supervisor Matching",
    description:
      "Multi-factor matching (topic, expertise, capacity, prior supervision) with transparent score breakdowns and admin approval.",
    icon: (
      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    ),
  },
  {
    title: "Academic Workflow Tracking",
    description:
      "10-stage pipeline from draft through completion with clear stage ownership, transition rules, and milestone tracking.",
    icon: <path d="M12 6v6l4 2M12 3a9 9 0 100 18 9 9 0 000-18z" />,
  },
  {
    title: "Admin Operations Dashboard",
    description:
      "Real-time view of proposal pipeline, bottlenecks, reviewer workload, lecturer capacity, and system audit log.",
    icon: <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />,
  },
];

const roles = [
  {
    title: "For Students",
    items: [
      "Write structured proposals with section guidance",
      "Receive AI pre-review before submission",
      "Track proposal status through the workflow",
      "View reviewer feedback and rubric scores",
    ],
  },
  {
    title: "For Reviewers",
    items: [
      "Triage proposals with AI risk indicators",
      "Evaluate using 8-criterion rubric",
      "Make accountable decisions with required comments",
      "Track review queue and deadlines",
    ],
  },
  {
    title: "For Administrators",
    items: [
      "Monitor full workflow pipeline health",
      "Detect bottlenecks and capacity risks",
      "Manage supervisor assignments",
      "Access complete system audit log",
    ],
  },
  {
    title: "For Lecturers",
    items: [
      "View assigned and suggested proposals",
      "See explainable match scores with breakdown",
      "Track supervision load and milestones",
      "Indicate interest in potential matches",
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-hairline bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <div>
            <h1 className="text-sm font-semibold tracking-[0.04em]">
              SRP D&amp;M Assistant
            </h1>
            <p className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-muted sm:block">
              Student Research Proposal Platform
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="hidden text-sm font-medium text-body-muted transition-colors hover:text-ink sm:block">Pricing</Link>
            <Link href="/login">
              <Button variant="primary">Try Demo</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="px-5 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex rounded border border-primary/20 bg-primary/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-primary">
                AI-assisted academic workflow platform
              </div>
              <h2 className="text-4xl font-semibold leading-[1.1] tracking-[-0.02em] text-ink md:text-5xl">
                From draft to completion — <br />
                <span className="text-primary">
                  a structured research proposal workflow
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-body-muted">
                SRP D&amp;M Assistant helps students write stronger proposals,
                reviewers evaluate faster with rubric support, administrators
                monitor pipeline health, and lecturers find suitable matches.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/login">
                  <Button
                    variant="primary"
                    className="w-full px-8 py-3 sm:w-auto"
                  >
                    Try the Demo
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="secondary"
                    className="w-full px-8 py-3 sm:w-auto"
                  >
                    Explore as a Role
                  </Button>
                </Link>
              </div>
            </div>

            {/* Role cards */}
            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {roles.map((role) => (
                <Card key={role.title} className="border-hairline">
                  <CardContent className="p-5">
                    <h3 className="mb-3 text-sm font-semibold text-ink">
                      {role.title}
                    </h3>
                    <ul className="space-y-2">
                      {role.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs leading-5 text-body-muted"
                        >
                          <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Problem section */}
        <section className="border-y border-hairline bg-app-bg px-5 py-16 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                  The Challenge
                </p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight text-ink">
                  Research proposals need structure, not just templates.
                </h3>
              </div>
              <div className="space-y-4 text-sm leading-7 text-body-muted">
                <p>
                  Students struggle to frame clear research problems, align
                  methodology with objectives, and present feasible plans.
                  Reviewers lack structured criteria and spend excessive time on
                  poorly formatted proposals.
                </p>
                <p>
                  SRP D&amp;M Assistant integrates drafting, AI-assisted
                  pre-review, rubric-based human evaluation, explainable
                  supervisor matching, and workflow tracking into a single
                  academic platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-5 py-20 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                Platform capabilities
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-ink">
                Everything you need to manage research proposals
              </h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-app-bg">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded border border-hairline bg-canvas text-primary">
                      <svg
                        aria-hidden="true"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {feature.icon}
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-ink">
                      {feature.title}
                    </h4>
                    <p className="mt-2 text-xs leading-6 text-body-muted">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trust section */}
        <section className="border-y border-hairline bg-app-bg px-5 py-16 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                Design principles
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-ink">
                Built for academic integrity
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-5 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-info-bg text-info">
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-ink">
                    AI Advisory Only
                  </h4>
                  <p className="mt-1.5 text-xs leading-5 text-body-muted">
                    AI provides suggestions and analysis. It never approves,
                    rejects, or assigns.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success-bg text-success">
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-ink">
                    Human Final Decision
                  </h4>
                  <p className="mt-1.5 text-xs leading-5 text-body-muted">
                    Every decision requires a named human reviewer with a
                    recorded comment.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-warning-bg text-warning">
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-ink">
                    Transparent Rubric
                  </h4>
                  <p className="mt-1.5 text-xs leading-5 text-body-muted">
                    All criteria scores and reviewer comments visible to
                    students and administrators.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple/10 text-purple">
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-ink">
                    Audit-friendly Workflow
                  </h4>
                  <p className="mt-1.5 text-xs leading-5 text-body-muted">
                    Every status change and decision is recorded with timestamp
                    and user identity.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary px-5 py-16 text-white md:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
              Competition Demo
            </p>
            <h3 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
              Ready to see it in action?
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70">
              Try the full demo with four role accounts. No installation, no
              sign-up — just click and explore.
            </p>
            <div className="mt-8">
              <Link href="/login">
                <Button className="bg-white px-8 py-3 !text-primary hover:bg-white/90">
                  Launch Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline bg-primary px-6 py-8 text-center text-sm text-white/50">
        <p>© 2026 SRP D&amp;M Assistant. Academic research proposal platform.</p>
        <div className="mt-2 flex items-center justify-center gap-4 text-xs text-white/30">
          <Link href="/pricing" className="hover:text-white/60">Pricing</Link>
          <Link href="/login" className="hover:text-white/60">Sign in</Link>
        </div>
        <p className="mt-1 text-xs text-white/30">
          AI-assisted workflow · Human-in-the-loop · Built for university research offices
        </p>
      </footer>
    </div>
  );
}
