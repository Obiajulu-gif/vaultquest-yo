import Link from "next/link";
import { ArrowRight, ShieldCheck, Wallet } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { RiskPanel } from "@/components/savings/risk-panel";
import { VaultPreviewStrip } from "@/components/savings/vault-preview-strip";
import { Button } from "@/components/ui/button";

const valueProps = [
  {
    title: "Live YO vault access",
    description: "Browse live vault inventory, not mocked cards, with chain-aware deposit routes.",
  },
  {
    title: "Savings-first UX",
    description: "Deposit, monitor, and redeem from a single trust-focused dashboard without product clutter.",
  },
  {
    title: "Clear transaction state",
    description: "Every action surfaces approval, submission, confirmation, and error states before and after signing.",
  },
];

const steps = [
  "Connect a wallet on Base, Ethereum, or Arbitrum.",
  "Pick a live YO vault and verify the asset, chain, and estimated yield.",
  "Deposit idle assets or redeem an existing position with explicit transaction feedback.",
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader showDashboardLink={false} />
      <main>
        <section className="mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 lg:px-8 lg:pt-20">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-3xl">
              <div className="eyebrow">YO SDK hackathon build</div>
              <h1 className="mt-5 font-display text-5xl leading-[0.95] text-white sm:text-6xl lg:text-7xl">
                Smart DeFi savings that feels calm enough to trust.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
                VaultQuest turns YO vault access into a consumer savings account: real wallet connection,
                clear network handling, and live deposit or redeem flows with risk messaging that stays visible.
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
                {valueProps.map((item, index) => (
                  <div key={item.title} className="glass-panel p-5 animate-fade-up" style={{ animationDelay: `${index * 120}ms` }}>
                    <div className="text-sm uppercase tracking-[0.22em] text-[#94cdb7]">0{index + 1}</div>
                    <h2 className="mt-3 font-display text-xl text-white">{item.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-white/60">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-panel p-7 lg:p-8">
              <div className="flex items-center gap-3 text-[#b9ffdf]">
                <Wallet className="h-5 w-5" />
                <span className="eyebrow">Savings flow</span>
              </div>
              <div className="mt-5 space-y-5">
                {steps.map((step, index) => (
                  <div key={step} className="flex gap-4 rounded-[24px] border border-white/8 bg-[#081a15] p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#b9ffdf]/12 font-semibold text-[#b9ffdf]">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-7 text-white/70">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <VaultPreviewStrip />
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="glass-panel p-8">
              <div className="eyebrow">Why this product exists</div>
              <h2 className="section-title mt-4">Idle assets should be productive without forcing people through unclear DeFi flows.</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/65">
                VaultQuest centers the product on savings instead of distractions, with a dashboard focused on
                live YO vaults, transparent chain context, and simple consumer actions. The app is intentionally
                opinionated: fewer screens, fewer abstractions, and no fake transaction states.
              </p>
            </div>
            <RiskPanel compact />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
