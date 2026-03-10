"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, ExternalLink, LogOut, Wallet } from "lucide-react";
import { useAccount, useChainId, useConnect, useConnectors, useDisconnect } from "wagmi";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { getChainLabel, isSupportedAppChain } from "@/lib/chains";
import { truncateAddress } from "@/lib/utils";
import { useHydrated } from "@/hooks/use-hydrated";

const walletDetectionMs = 4_000;

type ConnectorScanState = "idle" | "checking" | "ready" | "empty";

export function WalletControls() {
  const hydrated = useHydrated();
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const connectors = useConnectors();
  const { connectAsync, error, isPending, reset } = useConnect();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pendingConnectorId, setPendingConnectorId] = useState<string | null>(null);
  const [connectorScanState, setConnectorScanState] = useState<ConnectorScanState>("idle");
  const [detectedConnectorUids, setDetectedConnectorUids] = useState<string[]>([]);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setCopied(false), 1200);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const connectorCandidates = useMemo(
    () => connectors.filter((connector) => connector.type !== "safe"),
    [connectors],
  );

  useEffect(() => {
    if (!open || isConnected || connectorScanState !== "checking") {
      return undefined;
    }

    let cancelled = false;
    const timeout = window.setTimeout(() => {
      if (cancelled) {
        return;
      }

      setDetectedConnectorUids([]);
      setConnectorScanState("empty");
    }, walletDetectionMs);

    void (async () => {
      const detected = await Promise.all(
        connectorCandidates.map(async (connector) => {
          try {
            const provider = await connector.getProvider();
            return provider ? connector.uid : null;
          } catch {
            return null;
          }
        }),
      );

      if (cancelled) {
        return;
      }

      window.clearTimeout(timeout);
      const nextDetectedConnectorUids = detected.filter((uid): uid is string => Boolean(uid));

      setDetectedConnectorUids(nextDetectedConnectorUids);
      setConnectorScanState(nextDetectedConnectorUids.length > 0 ? "ready" : "empty");
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [connectorCandidates, connectorScanState, isConnected, open]);

  const availableConnectors = useMemo(() => {
    const detectedConnectorUidSet = new Set(detectedConnectorUids);
    const detectedConnectors = connectorCandidates.filter((connector) => detectedConnectorUidSet.has(connector.uid));

    if (detectedConnectors.length <= 1) {
      return detectedConnectors;
    }

    const hasNamedInjectedConnector = detectedConnectors.some(
      (connector) => connector.type === "injected" && connector.id !== "injected",
    );

    return hasNamedInjectedConnector
      ? detectedConnectors.filter((connector) => connector.id !== "injected")
      : detectedConnectors;
  }, [connectorCandidates, detectedConnectorUids]);

  const handleOpen = () => {
    reset();
    setPendingConnectorId(null);
    setDetectedConnectorUids([]);
    setConnectorScanState("checking");
    setOpen(true);
  };

  const handleClose = () => {
    reset();
    setPendingConnectorId(null);
    setDetectedConnectorUids([]);
    setConnectorScanState("idle");
    setOpen(false);
  };

  const handleConnect = async (connector: (typeof connectorCandidates)[number]) => {
    setPendingConnectorId(connector.uid);
    reset();

    try {
      await connectAsync({ connector });
      handleClose();
    } catch {
      setPendingConnectorId(null);
    }
  };

  if (!hydrated) {
    return (
      <Button variant="secondary" className="min-w-[148px] justify-center" disabled>
        Loading wallet
      </Button>
    );
  }

  if (!isConnected || !address) {
    return (
      <>
        <Button onClick={handleOpen} className="min-w-[148px] justify-center gap-2">
          <Wallet className="h-4 w-4" />
          Connect wallet
        </Button>
        <Modal
          open={open && !isConnected}
          onClose={handleClose}
          title="Connect your wallet"
          subtitle="Use a supported wallet to access live YO deposit and redeem flows."
        >
          <div className="space-y-3">
            {connectorScanState !== "ready" ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                {connectorScanState === "empty"
                  ? "No browser wallet was detected in this session. Open VaultQuest in a browser with MetaMask, Rabby, Coinbase Wallet, or another injected extension."
                  : "Looking for supported browser wallets..."}
              </div>
            ) : null}
            {availableConnectors.map((connector) => (
              <button
                key={connector.uid}
                type="button"
                onClick={() => void handleConnect(connector)}
                disabled={isPending}
                className="flex w-full items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-left text-white transition hover:border-white/20 hover:bg-white/8"
              >
                <div>
                  <div className="font-medium">{formatConnectorLabel(connector.name, connector.id)}</div>
                  <div className="text-sm text-white/55">
                    {connector.type === "injected" ? "Detected in this browser" : "Wallet connector"}
                  </div>
                </div>
                {isPending && pendingConnectorId === connector.uid ? (
                  <span className="text-sm text-[#b9ffdf]">Connecting...</span>
                ) : (
                  <ExternalLink className="h-4 w-4 text-white/45" />
                )}
              </button>
            ))}
            {error ? (
              <div className="rounded-2xl border border-[#ff8a7a]/25 bg-[#ff8a7a]/10 px-4 py-3 text-sm text-[#ffd2cc]">
                {error.message}
              </div>
            ) : null}
          </div>
        </Modal>
      </>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-right">
        <div className="text-xs uppercase tracking-[0.22em] text-white/45">
          {isSupportedAppChain(chainId) ? getChainLabel(chainId) : "Unsupported chain"}
        </div>
        <div className="mt-1 text-sm font-medium text-white">{truncateAddress(address)}</div>
      </div>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(address);
            setCopied(true);
          } catch {
            setCopied(false);
          }
        }}
        className={`rounded-full border p-3 transition ${
          copied
            ? "border-[#b9ffdf]/30 bg-[#b9ffdf]/12 text-[#b9ffdf]"
            : "border-white/10 text-white/70 hover:border-white/20 hover:text-white"
        }`}
        aria-label="Copy wallet address"
      >
        <Copy className="h-4 w-4" />
      </button>
      <Button variant="secondary" onClick={() => disconnect()} className="gap-2">
        <LogOut className="h-4 w-4" />
        Disconnect
      </Button>
    </div>
  );
}

function formatConnectorLabel(name: string, id: string) {
  if (name === "Injected" || id === "injected") {
    return "Browser wallet";
  }

  return name;
}
