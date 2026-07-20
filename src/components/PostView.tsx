"use client";

// Full post page, shared by both zones. Live document listener - the meter,
// counts, and comments all tick in real time while you read.
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import type { Post, Zone } from "@/lib/types";
import { fullDate } from "@/lib/format";
import { useAuth } from "@/lib/AuthContext";
import LivingMeter from "./LivingMeter";
import ReactionBar from "./ReactionBar";
import Comments from "./Comments";
import ReportButton from "./ReportButton";

export default function PostView({ id, zone }: { id: string; zone: Zone }) {
  const { isAdmin } = useAuth();
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    return onSnapshot(
      doc(db, "posts", id),
      (snap) =>
        setPost(snap.exists() ? ({ id: snap.id, ...snap.data() } as Post) : null),
      () => setPost(null)
    );
  }, [id]);

  if (post === undefined) {
    return (
      <div className="mx-auto max-w-3xl animate-pulse px-5 py-16">
        <div className="h-10 w-3/4 rounded bg-ink-2" />
        <div className="mt-6 h-64 rounded-2xl bg-ink-2" />
      </div>
    );
  }

  // Hidden posts are only visible to admins (rules enforce this server-side too).
  if (post === null || post.zone !== zone || (post.status !== "live" && !isAdmin)) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="font-display text-3xl text-paper">Post unavailable</h1>
        <p className="mt-3 text-sm text-paper-faint">
          It may have been removed, or is under review.
        </p>
      </div>
    );
  }

  const postRef = doc(db, "posts", id);

  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      {post.status === "hidden" && (
        <p className="mb-6 rounded-xl border border-saffron/30 bg-saffron/5 p-3 text-xs text-saffron">
          Admin view - this post is hidden and in the review queue.
        </p>
      )}

      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-saffron">
          {zone === "for" ? "For the People" : "By the People"}
        </p>
        <h1 className="mt-3 font-display text-3xl leading-tight text-paper md:text-5xl">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-paper-faint">
          <span className="text-paper-dim">{post.authorName}</span>
          <span aria-hidden>·</span>
          <time>{fullDate(post.createdAt)}</time>
        </div>
      </motion.header>

      {/* Author's-own-views disclaimer - persistent on every By-the-People post */}
      {zone === "by" && (
        <p className="mt-6 rounded-xl border border-line bg-ink-2 p-3 text-xs leading-relaxed text-paper-faint">
          The views in this report are the author's own and do not represent
          The People of India platform. Read our{" "}
          <a href="/disclaimer" className="text-saffron underline underline-offset-2">
            disclaimer
          </a>
          .
        </p>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="prose-tpi mt-8"
        // Content is authored in our Tiptap editor by signed-in users; StarterKit
        // schema constrains it to safe nodes. Rendered as HTML.
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-10 border-t border-line pt-6">
        <LivingMeter hearts={post.hearts} disagrees={post.disagrees} />
        <div className="mt-5 flex items-center justify-between">
          <ReactionBar
            targetRef={postRef}
            hearts={post.hearts}
            disagrees={post.disagrees}
            isPost
          />
          {zone === "by" && <ReportButton postId={id} postTitle={post.title} />}
        </div>
      </div>

      {/* Comments only on By-the-People. Editorial pieces take reactions only. */}
      {zone === "by" && <Comments postId={id} />}
    </article>
  );
}
