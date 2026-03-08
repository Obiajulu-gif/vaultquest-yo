"use client";

import type {
  GlobalVaultHistoryItem,
  PriceMap,
  SupportedChainId,
  VaultStatsItem,
} from "@yo-protocol/core";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  BadgeDollarSign,
  DatabaseZap,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet2,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useChainId, useSwitchChain } from "wagmi";

import { SavingsActionModal } from "@/components/savings/action-modal";
import { RiskPanel } from "@/components/savings/risk-panel";
import { Button } from "@/components/ui/button";
import {
  usePortfolioPositions,
  usePriceMap,
  useVaultActivity,
  useVaultCatalog,
  useWalletBalances,
} from "@/hooks/use-yo-data";
import {
  chainMeta,
  getChainLabel,
  getExplorerTxUrl,
  isSupportedAppChain,
  supportedChainIds,
} from "@/lib/chains";
import {
  cn,
  formatCompactNumber,
  formatPercent,
  formatUsd,
  safeNumber,
  timeAgo,
  truncateAddress,
} from "@/lib/utils";
import { flattenVaults, type UserPositionWithVault, type VaultVenue } from "@/lib/yo/types";

type ChainFilter = "all" | SupportedChainId;

type ActionState = {
  mode: "deposit" | "redeem";
  venue: VaultVenue;
} | null;

export function SavingsDashboard() {
  const [search, setSearch] = useState("");
  const [chainFilter, setChainFilter] = useState<ChainFilter>("all");
  const [actionState, setActionState] = useState<ActionState>(null);

  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const { switchChainAsync, isPending: isSwitchingChain } = useSwitchChain();

  const vaultCatalog = useVaultCatalog();
  const priceMap = usePriceMap();
  const activity = useVaultActivity(6);
  const portfolio = usePortfolioPositions(address, vaultCatalog.data);
  const walletBalances = useWalletBalances(address);

  const venues = useMemo(() => flattenVaults(vaultCatalog.data ?? []), [vaultCatalog.data]);

  const filteredVenues = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return venues
      .filter((venue) => (chainFilter === "all" ? true : venue.chain.id === chainFilter))
      .filter((venue) => {
        if (!needle) {
          return true;
        }

        return [venue.name, venue.asset.symbol, venue.chain.name, venue.route]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      })
      .sort((left, right) => {
        const yieldDelta = safeNumber(right.yield["30d"]) - safeNumber(left.yield["30d"]);
        if (yieldDelta !== 0) {
          return yieldDelta;
        }

        return left.chain.id - right.chain.id;
      });
  }, [venues, search, chainFilter]);

  const positionsByVaultAddress = useMemo(() => {
    return new Map(
      (portfolio.data ?? []).map((item) => [item.vault.contracts.vaultAddress.toLowerCase(), item]),
    );
  }, [portfolio.data]);

  const portfolioSummary = useMemo(() => {
    return summarizePortfolio(portfolio.data ?? [], priceMap.data ?? {});
  }, [portfolio.data, priceMap.data]);

  const unsupportedChain = Boolean(isConnected && !isSupportedAppChain(chainId));

  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <section className="space-y-6">
        <div className="glass-panel overflow-hidden p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="eyebrow">Smart savings dashboard</div>
              <h1 className="mt-4 font-display text-4xl text-white sm:text-5xl">
                Deposit into live YO vaults with chain context that stays visible.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/65">
                Wallet state, chain routing, deposit approvals, redeem confirmations, and risk notes all live on one screen.
                Judges can connect, browse, deposit, and redeem without touching a mock flow.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <QuickStat label="Live vault venues" value={formatCompactNumber(venues.length || 0)} icon={DatabaseZap} />
              <QuickStat
                label="Connected chain"
                value={unsupportedChain ? "Unsupported" : getChainLabel(chainId)}
                icon={Wallet2}
              />
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {supportedChainIds.map((supportedId) => (
              <button
                key={supportedId}
                type="button"
                onClick={() => void switchChainAsync?.({ chainId: supportedId })}
                disabled={isSwitchingChain}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-left transition hover:border-white/20 hover:bg-white/8 disabled:opacity-50"
              >
                <div className="text-xs uppercase tracking-[0.22em] text-[#94cdb7]">
                  {chainMeta[supportedId].label}
                </div>
                <div className="mt-1 text-sm text-white/70">{chainMeta[supportedId].blurb}</div>
              </button>
            ))}
          </div>
        </div>

        {unsupportedChain ? (
          <div className="rounded-[28px] border border-[#ff8a7a]/25 bg-[#ff8a7a]/10 p-5 text-[#ffd2cc]">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0" />
              <div>
                <div className="font-display text-xl text-white">Unsupported chain connected</div>
                <p className="mt-2 text-sm leading-7 text-[#ffd2cc]">
                  VaultQuest only allows transactions on Base, Ethereum, or Arbitrum. Switch to one of those networks before trying to deposit or redeem.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="glass-panel p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              <ChainFilterButton active={chainFilter === "all"} onClick={() => setChainFilter("all")}>
                All chains
              </ChainFilterButton>
              {supportedChainIds.map((supportedId) => (
                <ChainFilterButton
                  key={supportedId}
                  active={chainFilter === supportedId}
                  onClick={() => setChainFilter(supportedId)}
                >
                  {chainMeta[supportedId].label}
                </ChainFilterButton>
              ))}
            </div>
            <label className="relative block w-full max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by vault, asset, or route"
                className="field-shell pl-11"
              />
            </label>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {vaultCatalog.isLoading
            ? Array.from({ length: 4 }).map((_, index) => <VaultSkeleton key={index} />)
            : filteredVenues.map((venue) => (
                <VaultCard
                  key={venue.key}
                  venue={venue}
                  position={positionsByVaultAddress.get(venue.contracts.vaultAddress.toLowerCase())}
                  prices={priceMap.data ?? {}}
                  disabled={!isConnected || unsupportedChain}
                  onDeposit={() => setActionState({ mode: "deposit", venue })}
                  onRedeem={() => setActionState({ mode: "redeem", venue })}
                />
              ))}
        </div>

        {!vaultCatalog.isLoading && filteredVenues.length === 0 ? (
          <div className="glass-panel p-8 text-center">
            <div className="font-display text-2xl text-white">
              {chainFilter === 42161
                ? "No live YO vault venues are exposed on Arbitrum right now."
                : "No vaults matched this filter."}
            </div>
            <p className="mt-3 text-sm leading-7 text-white/60">
              {chainFilter === 42161
                ? "Arbitrum remains supported in the wallet and chain handling layer, but the live YO catalog currently surfaces Base and Ethereum venues."
                : "Try a different chain filter or search term."}
            </p>
          </div>
        ) : null}
      </section>

      <aside className="space-y-6">
        <PortfolioPanel
          address={address}
          isConnected={isConnected}
          totalSuppliedUsd={portfolioSummary.totalSuppliedUsd}
          activePositions={portfolioSummary.activePositions}
          chainExposure={portfolioSummary.chainExposure}
          idleWalletUsd={safeNumber(walletBalances.data?.totalBalanceUsd ?? 0)}
          trackedAssets={walletBalances.data?.assets.length ?? 0}
        />
        <RiskPanel compact />
        <ActivityPanel items={activity.data?.items ?? []} isLoading={activity.isLoading} />
      </aside>

      <SavingsActionModal
        open={Boolean(actionState)}
        mode={actionState?.mode ?? "deposit"}
        venue={actionState?.venue ?? null}
        position={actionState ? positionsByVaultAddress.get(actionState.venue.contracts.vaultAddress.toLowerCase()) : undefined}
        onClose={() => setActionState(null)}
        onCompleted={() => {
          void vaultCatalog.refetch();
          void portfolio.refetch();
          void walletBalances.refetch();
          void activity.refetch();
        }}
      />
    </div>
  );
}

function QuickStat({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Sparkles }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/45">
        <Icon className="h-4 w-4 text-[#94cdb7]" />
        {label}
      </div>
      <div className="mt-3 font-display text-2xl text-white">{value}</div>
    </div>
  );
}

function ChainFilterButton({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition",
        active
          ? "border-[#b9ffdf]/35 bg-[#b9ffdf]/12 text-white"
          : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/8",
      )}
    >
      {children}
    </button>
  );
}

function VaultCard({
  venue,
  position,
  prices,
  disabled,
  onDeposit,
  onRedeem,
}: {
  venue: VaultVenue;
  position?: UserPositionWithVault;
  prices: PriceMap;
  disabled: boolean;
  onDeposit: () => void;
  onRedeem: () => void;
}) {
  const assetPrice = venue.asset.coingeckoId ? safeNumber(prices[venue.asset.coingeckoId]) : 0;
  const tvlUsd = assetPrice
    ? safeNumber(venue.tvl.raw) / 10 ** venue.asset.decimals * assetPrice
    : 0;
  const userAssets = position?.position.assets ?? 0n;
  const userShares = position?.position.shares ?? 0n;

  return (
    <article className="glass-panel p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/45">
            <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-[#94cdb7]">{venue.chain.name}</span>
            <span>{venue.route}</span>
          </div>
          <h2 className="mt-4 font-display text-3xl text-white">{venue.name}</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Save {venue.asset.symbol} with a live YO vault route on {venue.chain.name}. Review the network before signing.
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-[0.22em] text-white/45">30d yield</div>
          <div className="mt-2 font-display text-3xl text-[#b9ffdf]">{formatPercent(venue.yield["30d"])}</div>
          <div className="mt-1 text-xs text-white/45">7d {formatPercent(venue.yield["7d"], 1)}</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <MetricCard label="TVL" value={`${venue.tvl.formatted} ${venue.asset.symbol}`} secondary={tvlUsd ? formatUsd(tvlUsd) : "Live onchain value"} />
        <MetricCard label="Share price" value={venue.sharePrice.formatted} secondary={venue.shareAsset.symbol} />
        <MetricCard label="Vault cap" value={venue.cap.formatted} secondary={venue.asset.symbol} />
        <MetricCard
          label="Reward boost"
          value={venue.merklRewardYield ? `${venue.merklRewardYield}%` : "N/A"}
          secondary="Additional incentives"
        />
      </div>

      <div className="mt-5 rounded-[22px] border border-white/8 bg-[#081a15] p-4">
        <div className="flex items-center justify-between gap-4 text-sm text-white/55">
          <span>Your position</span>
          <span>{disabled ? "Connect on a supported chain" : `${venue.shareAsset.symbol} balance`}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-white/40">Assets</div>
            <div className="mt-1 text-lg font-medium text-white">
              {position ? `${Number(formatUnits(userAssets, venue.asset.decimals)).toFixed(4)} ${venue.asset.symbol}` : "0.0000"}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-white/40">Shares</div>
            <div className="mt-1 text-lg font-medium text-white">
              {position ? `${Number(formatUnits(userShares, venue.shareAsset.decimals)).toFixed(4)} ${venue.shareAsset.symbol}` : "0.0000"}
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs leading-6 text-white/45">
          Live onchain vault. Verify chain, asset, amount, and gas before submitting.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button className="flex-1 gap-2" disabled={disabled} onClick={onDeposit}>
          <ArrowUpFromLine className="h-4 w-4" />
          Deposit
        </Button>
        <Button
          variant="secondary"
          className="flex-1 gap-2"
          disabled={disabled || userAssets <= 0n}
          onClick={onRedeem}
        >
          <ArrowDownToLine className="h-4 w-4" />
          Redeem
        </Button>
      </div>
    </article>
  );
}

function MetricCard({ label, value, secondary }: { label: string; value: string; secondary: string }) {
  return (
    <div className="rounded-[20px] border border-white/8 bg-white/5 px-4 py-3">
      <div className="text-white/40">{label}</div>
      <div className="mt-2 font-medium text-white">{value}</div>
      <div className="mt-1 text-xs text-white/45">{secondary}</div>
    </div>
  );
}

function PortfolioPanel({
  address,
  isConnected,
  totalSuppliedUsd,
  activePositions,
  chainExposure,
  idleWalletUsd,
  trackedAssets,
}: {
  address?: string;
  isConnected: boolean;
  totalSuppliedUsd: number;
  activePositions: number;
  chainExposure: string[];
  idleWalletUsd: number;
  trackedAssets: number;
}) {
  return (
    <section className="glass-panel p-6">
      <div className="flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-[#94cdb7]">
        <BadgeDollarSign className="h-4 w-4" />
        Portfolio snapshot
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <MetricCard label="Total supplied" value={isConnected ? formatUsd(totalSuppliedUsd) : "$0"} secondary="Across active YO positions" />
        <MetricCard label="Active positions" value={String(activePositions)} secondary={isConnected ? "Live position count" : "Connect wallet to load"} />
        <MetricCard label="Idle wallet balance" value={isConnected ? formatUsd(idleWalletUsd) : "$0"} secondary={`${trackedAssets} tracked wallet assets`} />
        <MetricCard label="Wallet" value={truncateAddress(address)} secondary={isConnected ? "Connected" : "Disconnected"} />
      </div>
      <div className="mt-5 rounded-[20px] border border-white/8 bg-[#081a15] px-4 py-4 text-sm text-white/65">
        <div className="text-xs uppercase tracking-[0.22em] text-white/40">Chain exposure</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {chainExposure.length > 0 ? (
            chainExposure.map((chain) => (
              <span key={chain} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                {chain}
              </span>
            ))
          ) : (
            <span>No vault exposure loaded yet.</span>
          )}
        </div>
      </div>
    </section>
  );
}

function ActivityPanel({ items, isLoading }: { items: GlobalVaultHistoryItem[]; isLoading: boolean }) {
  return (
    <section className="glass-panel p-6">
      <div className="flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-[#94cdb7]">
        <ShieldCheck className="h-4 w-4" />
        Live vault activity
      </div>
      <div className="mt-5 space-y-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-[20px] border border-white/8 bg-[#081a15] p-4">
                <div className="h-4 w-20 rounded-full bg-white/10" />
                <div className="mt-3 h-4 w-40 rounded-full bg-white/10" />
              </div>
            ))
          : items.map((item) => (
              <a
                key={`${item.transactionHash}-${item.createdAt}`}
                href={getExplorerTxUrl(resolveChainId(item.network), item.transactionHash) ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="block rounded-[20px] border border-white/8 bg-[#081a15] p-4 transition hover:border-white/15 hover:bg-white/6"
              >
                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.2em] text-white/40">
                  <span>{item.type}</span>
                  <span>{timeAgo(item.createdAt)}</span>
                </div>
                <div className="mt-2 text-sm font-medium text-white">
                  {item.assets.formatted} on {item.network}
                </div>
                <div className="mt-1 text-xs text-white/45">{truncateAddress(item.transactionHash, 8, 6)}</div>
              </a>
            ))}
        {!isLoading && items.length === 0 ? (
          <div className="rounded-[20px] border border-white/8 bg-[#081a15] p-4 text-sm text-white/60">
            No recent vault activity returned by the YO API.
          </div>
        ) : null}
      </div>
    </section>
  );
}

function VaultSkeleton() {
  return (
    <div className="glass-panel p-6">
      <div className="h-4 w-24 rounded-full bg-white/10" />
      <div className="mt-4 h-8 w-40 rounded-full bg-white/10" />
      <div className="mt-6 grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-20 rounded-[20px] bg-white/10" />
        ))}
      </div>
      <div className="mt-5 h-24 rounded-[22px] bg-white/10" />
    </div>
  );
}

function summarizePortfolio(positions: UserPositionWithVault[], prices: PriceMap) {
  const totalSuppliedUsd = positions.reduce((total, item) => {
    const amount = Number(formatUnits(item.position.assets, item.vault.asset.decimals));
    const price = item.vault.asset.coingeckoId ? safeNumber(prices[item.vault.asset.coingeckoId]) : 0;
    return total + amount * price;
  }, 0);

  const chainExposure = Array.from(
    new Set(
      positions.map((item) => {
        const chain = item.vault.chain.name;
        return chain.charAt(0).toUpperCase() + chain.slice(1);
      }),
    ),
  );

  return {
    totalSuppliedUsd,
    activePositions: positions.length,
    chainExposure,
  };
}

function resolveChainId(network: string | undefined) {
  if (network === "ethereum") return 1;
  if (network === "base") return 8453;
  if (network === "arbitrum") return 42161;
  return undefined;
}
