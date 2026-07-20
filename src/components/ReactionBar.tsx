"use client";

// Heart (agree) + Disagree. Two distinct signals - deliberately NOT a
// like/dislike pair. The tooltip on Disagree spells out the difference so a
// disturbing-but-agreed-with report isn't penalized.
import { useEffect, useState } from "react";
import { doc, onSnapshot, type DocumentReference } from "firebase/firestore";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { toggleReaction } from "@/lib/reactions";
import type { ReactionType } from "@/lib/types";

interface Props {
  targetRef: DocumentReference;
  hearts: number;
  disagrees: number;
  isPost?: boolean;
  size?: "sm" | "md";
}

export default function ReactionBar({
  targetRef,
  hearts,
  disagrees,
  isPost = true,
  size = "md",
}: Props) {
  const { user, isBlocked, signIn } = useAuth();
  const [mine, setMine] = useState<ReactionType | null>(null);
  const [busy, setBusy] = useState(false);

  // Live listener on my own reaction doc so the toggle state is always honest.
  useEffect(() => {
    if (!user) {
      setMine(null);
      return;
    }
    return onSnapshot(
      doc(targetRef, "reactions", user.uid),
      (snap) => setMine(snap.exists() ? (snap.data().type as ReactionType) : null),
      () => setMine(null)
    );
  }, [user, targetRef]);

  const react = async (type: ReactionType) => {
    if (!user) {
      await signIn();
      return;
    }
    if (isBlocked || busy) return;
    setBusy(true);
    try {
      await toggleReaction(targetRef, user.uid, type, { isPost });
    } catch (e) {
      console.error("Reaction failed:", e);
    } finally {
      setBusy(false);
    }
  };

  const base =
    size === "sm"
      ? "gap-1 px-2.5 py-1 text-xs"
      : "gap-1.5 px-3.5 py-1.5 text-sm";

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => react("heart")}
        disabled={isBlocked}
        aria-pressed={mine === "heart"}
        title="Agree - I stand with this"
        className={`flex items-center rounded-full border transition ${base} ${
          mine === "heart"
            ? "border-saffron/70 bg-saffron/15 text-saffron"
            : "border-line text-paper-dim hover:border-saffron/40 hover:text-saffron-soft"
        } disabled:opacity-40`}
      >
        <motion.span
          key={hearts}
          initial={{ scale: 1.4 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          aria-hidden
        >
          ♥
        </motion.span>
        <span>{hearts}</span>
      </motion.button>

      <div className="group relative">
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => react("disagree")}
          disabled={isBlocked}
          aria-pressed={mine === "disagree"}
          className={`flex items-center rounded-full border transition ${base} ${
            mine === "disagree"
              ? "border-paper-dim/60 bg-elevate text-paper"
              : "border-line text-paper-dim hover:border-line-strong hover:text-paper"
          } disabled:opacity-40`}
        >
          <span aria-hidden>⊘</span>
          <span>Disagree</span>
        </motion.button>
        {/* Tooltip: disagree ≠ dislike */}
        <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-lg glass p-3 text-xs leading-relaxed text-paper-dim opacity-0 shadow-card transition-opacity duration-200 group-hover:opacity-100">
          <span className="text-paper">Disagree, not dislike.</span> Use this
          when you dispute what's reported - not because it's uncomfortable to
          read.
        </div>
      </div>
    </div>
  );
}
