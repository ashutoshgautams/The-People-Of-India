"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import Feed from "@/components/Feed";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Content sheet: slides up as one solid surface over the fading hero */}
      <div className="relative z-10 -mt-[12vh] rounded-t-[2.5rem] border-t border-line bg-ink shadow-[0_-24px_60px_rgba(0,0,0,0.12)]">
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-16">
        <div className="grid items-stretch gap-12 lg:grid-cols-2">
          <section className="flex flex-col">
            <ZoneHeader
              href="/for-the-people"
              title="For the People"
              blurb="The editorial desk. Reported, checked, published by the platform."
            />
            <div className="flex-1">
              <Feed zone="for" max={3} />
            </div>
          </section>
          <section className="flex flex-col">
            <ZoneHeader
              href="/by-the-people"
              title="By the People"
              blurb="Open ground reports from anyone, anywhere in India."
            />
            <div className="flex-1">
              <Feed zone="by" max={3} />
            </div>
          </section>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mt-24 overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-saffron/[0.07] to-transparent p-10 text-center md:p-16"
        >
          <span
            className="emblem absolute -right-6 -top-10 h-56 w-36 rotate-12 text-paper opacity-[0.05]"
            aria-hidden
          />
          <h2 className="font-display text-3xl text-paper md:text-4xl">
            Saw something? <span className="text-saffron">Say something.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-paper-dim">
            No editors between you and the page. Sign in with Google and your
            report goes live - for the people, by the people.
          </p>
          <Link
            href="/write"
            className="mt-8 inline-block rounded-full bg-saffron px-8 py-3 font-medium text-white shadow-glow transition hover:bg-saffron-soft"
          >
            Write a ground report
          </Link>
        </motion.div>
        </div>
      </div>
    </>
  );
}

function ZoneHeader({
  href,
  title,
  blurb,
}: {
  href: string;
  title: string;
  blurb: string;
}) {
  return (
    <div className="mb-6">
      <Link href={href} className="group inline-block">
        <h2 className="font-display text-2xl text-paper transition-colors group-hover:text-saffron-soft md:text-3xl">
          {title}{" "}
          <span className="inline-block text-saffron transition-transform group-hover:translate-x-1">
            →
          </span>
        </h2>
      </Link>
      <p className="mt-1 text-sm text-paper-faint">{blurb}</p>
    </div>
  );
}
