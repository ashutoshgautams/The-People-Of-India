"use client";

// The hidden/removed section: every hidden post (auto-moderated or
// admin-hidden). Restore to live, or permanently delete. Nothing here was
// ever hard-deleted automatically.
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { db } from "@/lib/firebase";
import type { Post } from "@/lib/types";
import { excerpt, timeAgo } from "@/lib/format";

export default function AdminQueue() {
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("status", "==", "hidden"),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(
      q,
      (snap) =>
        setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Post)),
      () => setPosts([]) // rules not deployed yet - fail quiet, not loud
    );
  }, []);

  const restore = async (p: Post) => {
    await updateDoc(doc(db, "posts", p.id), {
      status: "live",
      autoHidden: false,
    });
  };

  const destroy = async (p: Post) => {
    if (!confirm(`Permanently delete "${p.title}"? This cannot be undone.`)) return;
    await deleteDoc(doc(db, "posts", p.id));
  };

  if (posts === null)
    return <p className="text-sm text-paper-faint">Loading queue…</p>;

  if (posts.length === 0)
    return (
      <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-paper-faint">
        The review queue is empty. Nothing has been hidden.
      </p>
    );

  return (
    <div className="space-y-4">
      {posts.map((p) => {
        const total = p.hearts + p.disagrees;
        return (
          <div
            key={p.id}
            className="rounded-xl border border-line bg-ink-2 p-5"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className={
                  p.autoHidden
                    ? "rounded-full bg-saffron/10 px-2.5 py-0.5 text-saffron"
                    : "rounded-full bg-elevate px-2.5 py-0.5 text-paper-dim"
                }
              >
                {p.autoHidden ? "Auto-hidden by community" : "Hidden by admin"}
              </span>
              <span className="text-paper-faint">
                {p.authorName} ({p.authorEmail}) · {timeAgo(p.createdAt)}
              </span>
            </div>
            <Link
              href={`/by-the-people/${p.id}`}
              className="mt-2 block font-display text-lg text-paper hover:text-saffron-soft"
            >
              {p.title}
            </Link>
            <p className="mt-1 text-sm text-paper-dim">{excerpt(p.content, 140)}</p>
            <p className="mt-2 text-xs text-paper-faint">
              ♥ {p.hearts} · ⊘ {p.disagrees}
              {total > 0 &&
                ` · ${Math.round((p.disagrees / total) * 100)}% disagree of ${total}`}
            </p>
            <div className="mt-4 flex gap-3 text-sm">
              <button
                onClick={() => restore(p)}
                className="rounded-full border border-saffron/50 px-4 py-1 text-saffron hover:bg-saffron/10 transition"
              >
                Restore
              </button>
              <button
                onClick={() => destroy(p)}
                className="rounded-full border border-red-400/40 px-4 py-1 text-red-400/90 hover:bg-red-400/10 transition"
              >
                Delete permanently
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
