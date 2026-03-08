import { type SupportedChainId, createYoClient } from "@yo-protocol/core";

export const yoClients = {
  1: createYoClient({ chainId: 1 }),
  8453: createYoClient({ chainId: 8453 }),
  42161: createYoClient({ chainId: 42161 }),
} as const;

export function getYoClient(chainId: SupportedChainId) {
  return yoClients[chainId];
}

export const catalogClient = yoClients[8453];
