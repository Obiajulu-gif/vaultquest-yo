interface RiskPanelProps {
  compact?: boolean;
}

const notes = [
  "VaultQuest is a frontend for live onchain YO vaults. You still approve and sign every action in your wallet.",
  "Gas fees, slippage, and chain selection matter. Review the vault network and token before submitting.",
  "Yield is variable. Vault performance is not guaranteed and smart contract risk still exists.",
  "Redeems may be instant or queued depending on vault liquidity and protocol conditions.",
];

export function RiskPanel({ compact = false }: RiskPanelProps) {
  return (
    <section className={`glass-panel h-full ${compact ? "panel-pad-compact" : "panel-pad"}`}>
      <div className="eyebrow">Risk and trust</div>
      <h2 className={`font-display text-white ${compact ? "mt-3 text-2xl sm:text-3xl" : "mt-4 text-4xl"}`}>
        Tasteful warnings, not buried disclaimers.
      </h2>
      <div className={compact ? "mt-5 space-y-2.5" : "mt-6 space-y-3"}>
        {notes.map((note) => (
          <div
            key={note}
            className={`rounded-[22px] border border-white/8 bg-[#081a15] text-sm text-white/65 ${compact ? "px-4 py-3 leading-6" : "px-4 py-4 leading-7"}`}
          >
            {note}
          </div>
        ))}
      </div>
    </section>
  );
}
