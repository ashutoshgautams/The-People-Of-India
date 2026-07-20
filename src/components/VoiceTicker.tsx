"use client";

// A quiet column of citizen voices for the hero. Whole sentences surface one
// at a time - rising softly out of a blur - and only the last three stay,
// like remarks left on a wall the country keeps writing on.
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MAX_VISIBLE = 3;

interface Props {
  label: string;
  quotes: string[];
  side: "left" | "right";
}

export default function VoiceTicker({ label, quotes, side }: Props) {
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    // `cancelled` guards against overlapping chains from StrictMode/Fast
    // Refresh re-runs, and random ids keep keys unique across those re-runs.
    let cancelled = false;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const next = () => {
      if (cancelled) return;
      const text = quotes[i % quotes.length];
      i += 1;
      setItems((s) =>
        [...s, { id: crypto.randomUUID(), text }].slice(-MAX_VISIBLE)
      );
      timer = setTimeout(next, 3400);
    };
    // Desync the two columns so they don't move in lockstep.
    timer = setTimeout(next, side === "left" ? 600 : 2300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [quotes, side]);

  return (
    <div
      className={`w-36 xl:w-44 ${side === "left" ? "text-left" : "text-right"}`}
      aria-hidden
    >
      <p className="mb-2.5 text-[9px] uppercase tracking-[0.3em] text-saffron/70">
        {label}
      </p>
      <div className="flex flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {items.map((q, idx) => (
            <motion.p
              key={q.id}
              layout
              initial={{ opacity: 0, y: 14, filter: "blur(5px)" }}
              animate={{
                // Older lines recede; the newest reads clearest.
                opacity: idx === items.length - 1 ? 0.9 : 0.35 + idx * 0.15,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.5 } }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[11px] italic leading-snug text-paper-dim xl:text-xs"
            >
              “{q.text}”
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Voices about power - deliberately even-handed. They indict whoever governs.
export const VOICES_FOR = [
  "Eight years, three governments. Same pothole.",
  "The inauguration had cameras. The maintenance never does.",
  "Ask who signed the file, not who cut the ribbon.",
  "Every party finds the poor two months before the vote.",
  "Question the throne, whoever sits on it.",
  "A free press costs nothing. A silent one costs everything.",
  "Neither their left hand nor their right feeds us.",
  "The manifesto is new. The promises are second-hand.",
];

export const VOICES_BY = [
  "Our ration shop opens twice a month. The queue starts at 4 a.m.",
  "One teacher, four classrooms. My daughter teaches herself.",
  "The relief list still has my grandfather's name. He died in 2019.",
  "Electricity reached the village. The bill arrived first.",
  "The health centre has a building now. Still no doctor.",
  "The new road ends where the minister's village does.",
  "The borewell went two hundred feet deeper this year.",
  "They cleared the vendor line at dawn. The fine was a week's earnings.",
];
