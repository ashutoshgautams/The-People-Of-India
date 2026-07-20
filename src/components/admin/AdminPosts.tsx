"use client";

// Every post on the platform, both zones, any status. Admin override is
// absolute: hide or permanently delete anything, regardless of reactions.
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import { db } from "@/lib/firebase";
import type { Post } from "@/lib/types";
import { timeAgo } from "@/lib/format";

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snap) =>
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Post)),
      () => {} // rules not deployed yet - fail quiet, not loud
    );
  }, []);

  const visible = posts.filter(
    (p) =>
      !filter ||
      p.title.toLowerCase().includes(filter.toLowerCase()) ||
      p.authorEmail.toLowerCase().includes(filter.toLowerCase())
  );

  const hide = async (p: Post) => {
    await updateDoc(doc(db, "posts", p.id), { status: "hidden", autoHidden: false });
  };

  const destroy = async (p: Post) => {
    if (!confirm(`Permanently delete "${p.title}"? This cannot be undone.`)) return;
    await deleteDoc(doc(db, "posts", p.id));
  };

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter by title or author email…"
        className="mb-5 w-full max-w-sm rounded-xl border border-line bg-ink-2 px-4 py-2 text-sm text-paper outline-none placeholder:text-paper-faint focus:border-saffron/50"
      />
      <div className="space-y-2">
        {visible.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-line bg-ink-2 px-4 py-3"
          >
            <div className="min-w-0">
              <Link
                href={`/${p.zone === "for" ? "for-the-people" : "by-the-people"}/${p.id}`}
                className="block truncate text-sm text-paper hover:text-saffron-soft"
              >
                {p.title}
              </Link>
              <p className="text-xs text-paper-faint">
                {p.zone === "for" ? "For" : "By"} · {p.authorName} ·{" "}
                {timeAgo(p.createdAt)} · ♥ {p.hearts} ⊘ {p.disagrees} ·{" "}
                <span className={p.status === "live" ? "text-green-400/80" : "text-saffron"}>
                  {p.status}
                </span>
              </p>
            </div>
            <div className="flex shrink-0 gap-3 text-xs">
              {p.status === "live" && (
                <button onClick={() => hide(p)} className="text-paper-dim hover:text-paper">
                  Hide
                </button>
              )}
              <button onClick={() => destroy(p)} className="text-red-400/80 hover:text-red-400">
                Delete
              </button>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <p className="text-sm text-paper-faint">No posts match.</p>
        )}
      </div>
    </div>
  );
}
