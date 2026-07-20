"use client";

// Real-time comment thread for By-the-People posts. onSnapshot listener -
// new comments appear live. Comments carry their own heart/disagree signals.
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import type { Comment } from "@/lib/types";
import { timeAgo } from "@/lib/format";
import ReactionBar from "./ReactionBar";

export default function Comments({ postId }: { postId: string }) {
  const { user, isBlocked, signIn } = useAuth();
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );
    return onSnapshot(
      q,
      (snap) =>
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Comment)),
      () => {} // rules not deployed yet - fail quiet, not loud
    );
  }, [postId]);

  const submit = async () => {
    if (!user || !text.trim() || busy) return;
    setBusy(true);
    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        authorId: user.uid,
        authorName: user.displayName ?? "Anonymous",
        authorPhoto: user.photoURL ?? null,
        text: text.trim().slice(0, 3000),
        createdAt: serverTimestamp(),
        hearts: 0,
        disagrees: 0,
      });
      // Denormalized count on the post for feed cards.
      await updateDoc(doc(db, "posts", postId), {
        commentCount: increment(1),
      });
      setText("");
    } catch (e) {
      console.error("Comment failed:", e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl text-paper">
        Voices{" "}
        <span className="text-sm font-body text-paper-faint">
          {comments ? `· ${comments.length}` : ""}
        </span>
      </h2>

      {/* Composer */}
      <div className="mt-5">
        {user ? (
          isBlocked ? (
            <p className="rounded-xl border border-line p-4 text-sm text-paper-faint">
              Your account is currently blocked from participating.
            </p>
          ) : (
            <div className="flex gap-3">
              {user.photoURL && (
                <Image
                  src={user.photoURL}
                  alt=""
                  width={34}
                  height={34}
                  className="h-[34px] rounded-full"
                />
              )}
              <div className="flex-1">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Add your voice…"
                  rows={3}
                  className="w-full rounded-xl border border-line bg-ink-2 p-3 text-sm text-paper outline-none placeholder:text-paper-faint focus:border-saffron/50"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={submit}
                    disabled={!text.trim() || busy}
                    className="rounded-full bg-saffron px-4 py-1.5 text-sm font-medium text-white transition hover:bg-saffron-soft disabled:opacity-40"
                  >
                    {busy ? "Posting…" : "Comment"}
                  </button>
                </div>
              </div>
            </div>
          )
        ) : (
          <button
            onClick={() => signIn()}
            className="w-full rounded-xl border border-dashed border-line p-4 text-sm text-paper-faint transition hover:border-saffron/40 hover:text-paper-dim"
          >
            Sign in with Google to join the conversation
          </button>
        )}
      </div>

      {/* Thread */}
      <div className="mt-8 space-y-6">
        <AnimatePresence initial={false}>
          {comments?.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              {c.authorPhoto ? (
                <Image
                  src={c.authorPhoto}
                  alt=""
                  width={34}
                  height={34}
                  className="h-[34px] rounded-full"
                />
              ) : (
                <div className="h-[34px] w-[34px] shrink-0 rounded-full bg-ink-3" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 text-xs">
                  <span className="font-medium text-paper">{c.authorName}</span>
                  <time className="text-paper-faint">{timeAgo(c.createdAt)}</time>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-paper/90">
                  {c.text}
                </p>
                <div className="mt-2">
                  <ReactionBar
                    targetRef={doc(db, "posts", postId, "comments", c.id)}
                    hearts={c.hearts}
                    disagrees={c.disagrees}
                    isPost={false}
                    size="sm"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {comments?.length === 0 && (
          <p className="text-sm text-paper-faint">
            No comments yet. Yours could be the first.
          </p>
        )}
      </div>
    </section>
  );
}
