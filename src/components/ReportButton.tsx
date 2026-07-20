"use client";

// Report button on By-the-People posts → feeds the admin reports queue.
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";

export default function ReportButton({
  postId,
  postTitle,
}: {
  postId: string;
  postTitle: string;
}) {
  const { user, isBlocked, signIn } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!user || !reason.trim() || busy) return;
    setBusy(true);
    try {
      await addDoc(collection(db, "reports"), {
        postId,
        postTitle,
        reason: reason.trim().slice(0, 1000),
        reporterId: user.uid,
        reporterEmail: user.email ?? "",
        createdAt: serverTimestamp(),
        status: "open",
      });
      setDone(true);
      setTimeout(() => setOpen(false), 1500);
    } finally {
      setBusy(false);
    }
  };

  if (isBlocked) return null;

  return (
    <>
      <button
        onClick={() => (user ? setOpen(true) : signIn())}
        className="text-xs text-paper-faint underline-offset-2 transition-colors hover:text-paper-dim hover:underline"
      >
        Report this post
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/80 p-5 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-2xl glass p-6 shadow-card"
              onClick={(e) => e.stopPropagation()}
            >
              {done ? (
                <p className="text-center text-sm text-paper">
                  Report received. An admin will review it.
                </p>
              ) : (
                <>
                  <h3 className="font-display text-lg text-paper">
                    Report this post
                  </h3>
                  <p className="mt-1 text-xs text-paper-faint">
                    Reports go straight to the admin queue. Use this for
                    misinformation, abuse, or content that breaks the{" "}
                    <a href="/guidelines" className="text-saffron underline">
                      guidelines
                    </a>
                    - not for disagreement (that's what the Disagree button is
                    for).
                  </p>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="What's wrong with this post?"
                    rows={4}
                    className="mt-4 w-full rounded-xl border border-line bg-ink p-3 text-sm text-paper outline-none placeholder:text-paper-faint focus:border-saffron/50"
                  />
                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      onClick={() => setOpen(false)}
                      className="rounded-full px-4 py-1.5 text-sm text-paper-dim hover:text-paper"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submit}
                      disabled={!reason.trim() || busy}
                      className="rounded-full bg-saffron px-4 py-1.5 text-sm font-medium text-white transition hover:bg-saffron-soft disabled:opacity-40"
                    >
                      {busy ? "Sending…" : "Submit report"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
