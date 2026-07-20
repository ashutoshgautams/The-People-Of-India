"use client";

// The living agree/disagree meter. One horizontal bar: saffron fills for
// agreement, muted grey for disagreement, rebalancing with a spring as votes
// land in real time. Sentiment is shown as a *ratio*, never a raw disagree
// count - a disturbing-but-true report shouldn't look "disliked".
import { motion } from "framer-motion";

interface Props {
  hearts: number;
  disagrees: number;
  compact?: boolean;
}

export default function LivingMeter({ hearts, disagrees, compact }: Props) {
  const total = hearts + disagrees;
  // With no votes, rest at balance.
  const agreeShare = total === 0 ? 0.5 : hearts / total;

  return (
    <div className={compact ? "w-full" : "w-full max-w-md"}>
      <div
        className={`relative w-full overflow-hidden rounded-full bg-[#2A2A2E] ${
          compact ? "h-1" : "h-1.5"
        }`}
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(agreeShare * 100)}
        aria-label="Reader sentiment: share of agreement"
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-saffron"
          style={{ boxShadow: "0 0 12px rgba(232,135,58,0.45)" }}
          initial={false}
          animate={{ width: `${agreeShare * 100}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
      {!compact && (
        <div className="mt-1.5 flex justify-between text-[11px] text-paper-faint">
          <span>
            {total === 0
              ? "No signals yet"
              : `${Math.round(agreeShare * 100)}% agree`}
          </span>
          {total > 0 && <span>{total} signal{total === 1 ? "" : "s"}</span>}
        </div>
      )}
    </div>
  );
}
