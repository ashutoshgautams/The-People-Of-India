"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Post } from "@/lib/types";
import { excerpt, firstImage, timeAgo } from "@/lib/format";
import LivingMeter from "./LivingMeter";

interface Props {
  post: Post;
  index?: number;
}

export default function PostCard({ post, index = 0 }: Props) {
  const href = `/${post.zone === "for" ? "for-the-people" : "by-the-people"}/${post.id}`;
  const cover = post.cover ?? firstImage(post.content);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.4 }}
      whileHover={{ y: -3 }}
      className="group overflow-hidden rounded-2xl border border-line bg-ink-2 shadow-card transition-colors hover:border-saffron/25"
    >
      <Link href={href} className="block">
        {cover && (
          <div className="relative h-44 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-2/70 to-transparent" />
          </div>
        )}
        <div className="p-6 pb-0">
          <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-paper-faint">
            <span
              className={
                post.zone === "for"
                  ? "rounded-full bg-saffron/10 px-2.5 py-0.5 text-saffron"
                  : "rounded-full bg-elevate px-2.5 py-0.5 text-paper-dim"
              }
            >
              {post.zone === "for" ? "For the People" : "By the People"}
            </span>
            <span>{post.authorName}</span>
            <span aria-hidden>·</span>
            <time>{timeAgo(post.createdAt)}</time>
          </div>
          <h2 className="font-display text-xl leading-snug text-paper transition-colors group-hover:text-saffron-soft md:text-2xl">
            {post.title}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-paper-dim">
            {excerpt(post.content)}
          </p>
        </div>
      </Link>
      <div className="flex items-center justify-between gap-6 p-6 pt-4">
        <LivingMeter hearts={post.hearts} disagrees={post.disagrees} compact />
        <span className="shrink-0 text-xs text-paper-faint">
          {post.zone === "by" &&
            `${post.commentCount} comment${post.commentCount === 1 ? "" : "s"}`}
        </span>
      </div>
    </motion.article>
  );
}
