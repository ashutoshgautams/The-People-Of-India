"use client";

// The masthead. A small saffron emblem descends, the title reveals word by
// word, a creed cycles beneath it, and on both flanks the country keeps
// typing: living columns of citizen voices (For the People on the left,
// By the People on the right). On scroll the masthead hands over cleanly to
// the latest headline - the title is fully gone before the headline arrives.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { db } from "@/lib/firebase";
import type { Post } from "@/lib/types";
import VoiceTicker, { VOICES_BY, VOICES_FOR } from "./VoiceTicker";

const TAGLINES = [
  "Neither left, nor right.",
  "Not for sale. To anyone.",
  "The people, right at the centre.",
  "What Godi media never shows.",
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [latest, setLatest] = useState<Post | null>(null);
  const [tagline, setTagline] = useState(0);

  // Live latest headline across both zones.
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("status", "==", "live"),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    return onSnapshot(
      q,
      (snap) => {
        const d = snap.docs[0];
        setLatest(d ? ({ id: d.id, ...d.data() } as Post) : null);
      },
      () => setLatest(null)
    );
  }, []);

  // Rotate the creed.
  useEffect(() => {
    const t = setInterval(() => setTagline((i) => (i + 1) % TAGLINES.length), 3200);
    return () => clearInterval(t);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Clean hand-over: masthead is fully faded before the headline fades in.
  const titleY = useTransform(scrollYProgress, [0, 0.6], ["0%", "22%"]);
  const titleScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.95]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const headlineY = useTransform(scrollYProgress, [0.45, 0.75], ["36px", "0px"]);
  const headlineOpacity = useTransform(scrollYProgress, [0.48, 0.72], [0, 1]);
  const meshOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.25]);
  const voicesOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const voicesLeftY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const voicesRightY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  const latestHref = latest
    ? `/${latest.zone === "for" ? "for-the-people" : "by-the-people"}/${latest.id}`
    : "#";

  return (
    <section ref={ref} className="relative min-h-[135vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <motion.div
          style={{ opacity: meshOpacity }}
          className="gradient-mesh absolute inset-0"
          aria-hidden
        />
        <div className="hero-vignette absolute inset-0" aria-hidden />

        {/* Quiet voice columns, tucked up near the header (desktop) */}
        <motion.div
          style={{ opacity: voicesOpacity, y: voicesLeftY }}
          className="absolute left-[3%] top-24 z-[1] hidden lg:block"
        >
          <VoiceTicker label="For the People" quotes={VOICES_FOR} side="left" />
        </motion.div>
        <motion.div
          style={{ opacity: voicesOpacity, y: voicesRightY }}
          className="absolute right-[3%] top-24 z-[1] hidden lg:block"
        >
          <VoiceTicker label="By the People" quotes={VOICES_BY} side="right" />
        </motion.div>

        <motion.div
          style={{ y: titleY, scale: titleScale, opacity: titleOpacity }}
          className="relative z-[2] -mt-14 px-5 text-center md:-mt-20"
        >
          {/* Soft halo glowing behind the headline */}
          <div className="headline-halo absolute left-1/2 top-1/2 -z-10 h-[130%] w-[130vw] -translate-x-1/2 -translate-y-1/2 md:w-[60vw]" aria-hidden />

          {/* Emblem descends into place above the title */}
          <motion.span
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="emblem mx-auto mb-6 block h-16 w-11 text-saffron md:h-20 md:w-14"
            aria-hidden
          />

          {/* Word-by-word title reveal */}
          <h1 className="font-display text-[13vw] leading-[0.95] tracking-tight text-paper md:text-[8.5vw]">
            <span className="sr-only">The People of India</span>
            <span aria-hidden className="block">
              <Word word="The" delay={0.25} accent={false} />
              <Word word="People" delay={0.39} accent={false} />
            </span>
            <span aria-hidden className="block">
              <Word word="of" delay={0.55} accent />
              <Word word="India" delay={0.69} accent={false} />
            </span>
          </h1>

          {/* Rotating creed */}
          <div className="mt-7 h-7 md:h-8" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.p
                key={tagline}
                initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
                transition={{ duration: 0.45 }}
                className="font-display text-lg italic text-paper-dim md:text-xl"
              >
                {TAGLINES[tagline]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mx-auto mt-4 max-w-xl text-balance text-sm leading-relaxed text-paper-faint md:text-base"
          >
            Independent, non-profit, open-source journalism - on-ground
            reporting of what's really happening to real people.
          </motion.p>
        </motion.div>

        {/* Latest headline - takes the stage only after the masthead has left */}
        {latest && (
          <motion.div
            style={{ y: headlineY, opacity: headlineOpacity }}
            className="absolute inset-x-0 top-[36%] z-[2] mx-auto max-w-2xl px-5 text-center"
          >
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-saffron">
              Latest from the ground
            </p>
            <Link
              href={latestHref}
              className="font-display text-2xl leading-snug text-paper transition-colors hover:text-saffron-soft md:text-4xl"
            >
              {latest.title}
            </Link>
            <p className="mt-3 text-xs text-paper-faint">
              {latest.zone === "for" ? "For the People" : "By the People"} ·{" "}
              {latest.authorName}
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="absolute bottom-8 z-[2] text-paper-faint"
          aria-hidden
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            ↓
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/** One word of the masthead, rising from behind a clip edge. */
function Word({
  word,
  delay,
  accent,
}: {
  word: string;
  delay: number;
  accent: boolean;
}) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`inline-block ${accent ? "text-saffron" : ""}`}
      >
        {word}
      </motion.span>
      <span className="inline-block w-[0.22em]" />
    </span>
  );
}
