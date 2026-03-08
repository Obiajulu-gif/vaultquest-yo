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
    <section className="glass-panel h-full p-8">
      <div className="eyebrow">Risk and trust</div>
      <h2 className={`mt-4 font-display text-white ${compact ? "text-3xl" : "text-4xl"}`}>
        Tasteful warnings, not buried disclaimers.
      </h2>
      <div className="mt-6 space-y-3">
        {notes.map((note) => (
          <div key={note} className="rounded-[22px] border border-white/8 bg-[#081a15] px-4 py-4 text-sm leading-7 text-white/65">
            {note}
          </div>
        ))}
      </div>
    </section>
  );
}
