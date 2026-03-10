import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  DatabaseZap,
  Radar,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { RiskPanel } from "@/components/savings/risk-panel";
import { VaultPreviewStrip } from "@/components/savings/vault-preview-strip";
import { Button } from "@/components/ui/button";

const heroStats = [
  {
    value: "3",
    label: "supported chains",
  },
  {
    value: "Live",
    label: "YO vault inventory",
  },
  {
    value: "Explicit",
    label: "wallet approval states",
  },
];

const valueProps = [
  {
    icon: Wallet,
    title: "Wallet-aware entry",
    description: "VaultQuest now surfaces detected browser wallets cleanly so connection feels intentional instead of blind injected roulette.",
  },
  {
    icon: DatabaseZap,
    title: "Live vault inventory",
    description: "Browse real YO venues, compare chain context, and inspect route details without swapping into a mock catalog.",
  },
  {
    icon: ShieldCheck,
    title: "Visible transaction posture",
    description: "Approvals, submissions, confirmations, chain switches, and failure states stay visible before and after signing.",
  },
];

const transactionStages = ["Detect wallet", "Review route", "Approve", "Confirm"];

const heroNotes = [
  {
    title: "No mock receipts",
    description: "The core path is a real wallet, real chain handling, and live YO data.",
  },
  {
    title: "Risk stays in frame",
    description: "Warnings, chain context, and trust notes remain visible while the user moves.",
  },
];

const steps = [
  {
    title: "Connect on a supported chain",
    description: "Bring in a browser wallet on Base, Ethereum, or Arbitrum and keep the connected chain visible from the header onward.",
  },
  {
    title: "Review the live venue before acting",
    description: "Check the asset, route, share price, yield, and vault chain without leaving the dashboard or guessing which network the action uses.",
  },
  {
    title: "Deposit or redeem with explicit feedback",
    description: "The flow reports approvals, chain switching, submission, and confirmation so users are never left reading a spinner with no context.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <SiteHeader showDashboardLink={false} />
      <main>
        <section className="relative mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 lg:px-8 lg:pt-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[540px] bg-[radial-gradient(circle_at_12%_18%,rgba(118,228,188,0.2),transparent_32%),radial-gradient(circle_at_88%_12%,rgba(255,213,161,0.16),transparent_24%)]" />
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-3xl">
              <div className="eyebrow">YO SDK hackathon build</div>
              <h1 className="mt-5 font-display text-5xl leading-[0.95] text-white sm:text-6xl lg:text-7xl">
                Live DeFi savings with a wallet flow calm enough to trust.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
                VaultQuest turns YO vault access into a consumer savings account surface: detected wallet connection,
                clear network handling, and live deposit or redeem flows with risk messaging that never disappears.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/app">
                  <Button size="lg" className="gap-2">
                    Launch dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="secondary" size="lg" className="gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    See the trust model
                  </Button>
                </a>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {heroStats.map((item, index) => (
                  <div
                    key={item.label}
                    className="glass-panel p-5 animate-fade-up"
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <div className="text-xs uppercase tracking-[0.22em] text-white/45">{item.label}</div>
                    <div className="mt-3 font-display text-3xl text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="glass-panel relative overflow-hidden p-7 lg:p-8">
                <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(185,255,223,0.7),transparent)]" />
                <div className="flex items-center justify-between gap-3 text-[#b9ffdf]">
                  <div className="flex items-center gap-3">
                    <Radar className="h-5 w-5" />
                    <span className="eyebrow">Wallet-aware savings flow</span>
                  </div>
                  <span className="rounded-full border border-[#b9ffdf]/20 bg-[#b9ffdf]/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[#b9ffdf]">
                    live
                  </span>
                </div>
                <h2 className="mt-5 font-display text-3xl text-white">
                  One screen for connection, route review, and onchain execution.
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  The product story stays tight: detect a browser wallet, inspect a real YO venue, then move through explicit approval and confirmation states without UI drift.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {["Base", "Ethereum", "Arbitrum"].map((chain) => (
                    <div key={chain} className="rounded-[22px] border border-white/10 bg-[#081a15] px-4 py-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-[#94cdb7]">Supported</div>
                      <div className="mt-2 font-display text-xl text-white">{chain}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-white/45">Transaction states</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {transactionStages.map((stage) => (
                      <span
                        key={stage}
                        className="rounded-full border border-white/10 bg-[#081a15] px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/70"
                      >
                        {stage}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {heroNotes.map((note, index) => (
                  <div key={note.title} className="glass-panel p-5 animate-fade-up" style={{ animationDelay: `${index * 140}ms` }}>
                    <div className="flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-[#94cdb7]">
                      {index === 0 ? <Sparkles className="h-4 w-4" /> : <BadgeDollarSign className="h-4 w-4" />}
                      {note.title}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-white/62">{note.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-3">
            {valueProps.map((item, index) => (
              <div
                key={item.title}
                className="glass-panel p-6 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3 text-[#b9ffdf]">
                  <item.icon className="h-5 w-5" />
                  <span className="eyebrow">0{index + 1}</span>
                </div>
                <h2 className="mt-4 font-display text-2xl text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/60">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <VaultPreviewStrip />
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="glass-panel p-8">
              <div className="eyebrow">How it works</div>
              <h2 className="section-title mt-4">A savings product story instead of a protocol maze.</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/65">
                VaultQuest is intentionally opinionated: fewer screens, fewer abstractions, and no invisible state changes.
                The app keeps the user focused on the minimum set of facts required to trust a live onchain action.
              </p>
              <div className="mt-8 space-y-4">
                {steps.map((step, index) => (
                  <div key={step.title} className="flex gap-4 rounded-[24px] border border-white/8 bg-[#081a15] p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#b9ffdf]/12 font-semibold text-[#b9ffdf]">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-display text-xl text-white">{step.title}</div>
                      <p className="mt-2 text-sm leading-7 text-white/65">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-8">
              <RiskPanel compact />
              <div className="glass-panel p-8">
                <div className="flex items-center gap-3 text-[#b9ffdf]">
                  <DatabaseZap className="h-5 w-5" />
                  <span className="eyebrow">Demo posture</span>
                </div>
                <h2 className="mt-4 font-display text-3xl text-white">
                  Built to make a live judge walkthrough feel short and credible.
                </h2>
                <div className="mt-6 space-y-3">
                  {[
                    "Connection, chain status, live vault data, and portfolio context all land in one route.",
                    "Unsupported chains are explicit, so the app blocks the wrong action instead of pretending everything is fine.",
                    "Deposit and redeem flows report what the wallet is asking for before and after the signature.",
                  ].map((note) => (
                    <div
                      key={note}
                      className="rounded-[22px] border border-white/8 bg-[#081a15] px-4 py-4 text-sm leading-7 text-white/65"
                    >
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
          <div className="glass-panel relative overflow-hidden p-8 sm:p-10">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(118,228,188,0.12),transparent_62%)]" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="eyebrow">Ready to test</div>
                <h2 className="section-title mt-4">Open the dashboard and run the live YO savings flow.</h2>
                <p className="mt-4 text-base leading-8 text-white/65">
                  Connect a supported browser wallet, inspect the live catalog, and walk through deposit or redeem with explicit chain guidance.
                </p>
              </div>
              <Link href="/app">
                <Button size="lg" className="gap-2">
                  Open dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
