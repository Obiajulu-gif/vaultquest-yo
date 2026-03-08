"use client";

import type { GlobalVaultHistoryResponse, PriceMap, SupportedChainId, TokenBalance, UserBalances, VaultStatsItem } from "@yo-protocol/core";
import type { Address } from "viem";
import { useQuery } from "@tanstack/react-query";

import { catalogClient, getYoClient } from "@/lib/yo/clients";
import type { UserPositionWithVault } from "@/lib/yo/types";

export function useVaultCatalog() {
  return useQuery<VaultStatsItem[]>({
    queryKey: ["yo", "vault-catalog"],
    queryFn: () => catalogClient.getVaults(),
    staleTime: 60_000,
  });
}

export function usePriceMap() {
  return useQuery<PriceMap>({
    queryKey: ["yo", "prices"],
    queryFn: () => catalogClient.getPrices(),
    staleTime: 60_000,
  });
}

export function useVaultActivity(limit = 6) {
  return useQuery<GlobalVaultHistoryResponse>({
    queryKey: ["yo", "vault-activity", limit],
    queryFn: () => catalogClient.getGlobalVaultHistory({ limit }),
    staleTime: 30_000,
  });
}

export function usePortfolioPositions(account?: Address, vaults?: VaultStatsItem[]) {
  return useQuery<UserPositionWithVault[]>({
    queryKey: ["yo", "portfolio-positions", account],
    queryFn: async () => {
      if (!account) {
        return [];
      }

      const positions = await catalogClient.getUserPositionsAllChains(account, vaults);
      return positions as UserPositionWithVault[];
    },
    enabled: Boolean(account),
    staleTime: 30_000,
  });
}

export function useWalletBalances(account?: Address) {
  return useQuery<UserBalances>({
    queryKey: ["yo", "wallet-balances", account],
    queryFn: () => {
      if (!account) {
        throw new Error("Wallet is not connected");
      }

      return catalogClient.getUserBalances(account);
    },
    enabled: Boolean(account),
    staleTime: 30_000,
  });
}

export function useChainTokenBalance(chainId: SupportedChainId, token?: Address, account?: Address) {
  return useQuery<TokenBalance>({
    queryKey: ["yo", "token-balance", chainId, token, account],
    queryFn: () => {
      if (!token || !account) {
        throw new Error("Missing token or wallet address");
      }

      return getYoClient(chainId).getTokenBalance(token, account);
    },
    enabled: Boolean(token && account),
    staleTime: 15_000,
  });
}

export function useDepositPreview(
  chainId: SupportedChainId,
  vaultAddress?: Address,
  assets?: bigint,
) {
  return useQuery<bigint>({
    queryKey: ["yo", "deposit-preview", chainId, vaultAddress, assets?.toString()],
    queryFn: () => {
      if (!vaultAddress || assets === undefined) {
        throw new Error("Missing vault or amount");
      }

      return getYoClient(chainId).quotePreviewDeposit(vaultAddress, assets);
    },
    enabled: Boolean(vaultAddress && assets !== undefined && assets > 0n),
    staleTime: 10_000,
  });
}

export function useWithdrawQuote(
  chainId: SupportedChainId,
  vaultAddress?: Address,
  assets?: bigint,
) {
  return useQuery<bigint>({
    queryKey: ["yo", "withdraw-quote", chainId, vaultAddress, assets?.toString()],
    queryFn: () => {
      if (!vaultAddress || assets === undefined) {
        throw new Error("Missing vault or amount");
      }

      return getYoClient(chainId).quotePreviewWithdraw(vaultAddress, assets);
    },
    enabled: Boolean(vaultAddress && assets !== undefined && assets > 0n),
    staleTime: 10_000,
  });
}
