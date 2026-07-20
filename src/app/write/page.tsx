"use client";

// The full-bleed "field reporter" composer. Distraction-free: the chrome
// fades away, the canvas is the whole screen, typing feels weightless.
// Drag a photo or video anywhere → it drops inline.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import type { Editor as TiptapEditor } from "@tiptap/react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import Editor from "@/components/Editor";

export default function WritePage() {
  const { user, loading, isBlocked, signIn } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [editor, setEditor] = useState<TiptapEditor | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publish = async () => {
    if (!user || !editor || publishing) return;
    const content = editor.getHTML();
    if (!title.trim()) {
      setError("Give your report a headline.");
      return;
    }
    if (editor.isEmpty) {
      setError("The report itself is empty.");
      return;
    }
    setPublishing(true);
    setError(null);
    try {
      const ref = await addDoc(collection(db, "posts"), {
        zone: "by",
        title: title.trim().slice(0, 200),
        content,
        authorId: user.uid,
        authorName: user.displayName ?? "Anonymous",
        authorEmail: user.email ?? "",
        authorPhoto: user.photoURL ?? null,
        createdAt: serverTimestamp(),
        hearts: 0,
        disagrees: 0,
        commentCount: 0,
        status: "live", // By-the-People publishes instantly - no approval gate.
      });
      router.push(`/by-the-people/${ref.id}`);
    } catch (e) {
      console.error(e);
      setError("Publishing failed. If this persists, your account may be blocked.");
      setPublishing(false);
    }
  };

  if (loading) return <div className="min-h-screen" />;

  if (!user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
        <h1 className="font-display text-3xl text-paper">The field is yours.</h1>
        <p className="mt-3 max-w-sm text-sm text-paper-dim">
          Sign in with Google to publish a ground report. Your name is your
          name - no pseudonyms.
        </p>
        <button
          onClick={() => signIn()}
          className="mt-6 rounded-full bg-saffron px-6 py-2.5 text-sm font-medium text-white transition hover:bg-saffron-soft"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5 text-center">
        <p className="max-w-sm text-sm text-paper-dim">
          Your account has been blocked from publishing. If you believe this is
          a mistake, see our <a href="/guidelines" className="text-saffron underline">guidelines</a>{" "}
          or write to{" "}
          <a href="mailto:support@thepeopleofindia.org" className="text-saffron underline">
            support@thepeopleofindia.org
          </a>.
        </p>
      </div>
    );
  }

  return (
    // Full-bleed canvas that sits above the normal page chrome.
    // z-[60] sits above the site navbar (z-50) - the composer owns the screen.
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-ink">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-3xl px-5 pb-40 pt-10 md:pt-14"
      >
        {/* Minimal top bar: leave + publish. Everything else fades away. */}
        <div className="mb-10 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-sm text-paper-faint transition-colors hover:text-paper"
          >
            ← Leave
          </button>
          <div className="flex items-center gap-4">
            {error && <span className="text-xs text-saffron">{error}</span>}
            <button
              onClick={publish}
              disabled={publishing}
              className="rounded-full bg-saffron px-6 py-2 text-sm font-medium text-white shadow-glow transition hover:bg-saffron-soft disabled:opacity-50"
            >
              {publishing ? "Publishing…" : "Publish"}
            </button>
          </div>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Headline"
          maxLength={200}
          className="w-full bg-transparent font-display text-3xl text-paper outline-none placeholder:text-paper-faint md:text-5xl"
          autoFocus
        />

        {/* Sparks - nudge people to speak up, not just scroll past */}
        {!title && (
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              "What happened to you at the protest?",
              "One thing the government should fix - and how",
              "What did you see that the news didn't show?",
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => setTitle(prompt)}
                className="rounded-full border border-line px-3.5 py-1.5 text-xs text-paper-faint transition hover:border-saffron/50 hover:text-saffron"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <p className="mt-6 text-xs leading-relaxed text-paper-faint">
          You don't have to type. Hit{" "}
          <span className="text-paper-dim">🎙 Speak</span> in the toolbar and
          your words become text, or <span className="text-paper-dim">● Rec</span>{" "}
          to attach your voice itself - an audio-only report is a report too.
        </p>

        <div className="mt-6">
          <Editor
            onReady={setEditor}
            placeholder="Report what you saw - type it, speak it, or record it. Drag a photo or video anywhere on this page."
            overlay
          />
        </div>

        <p className="mt-16 border-t border-line pt-4 text-xs leading-relaxed text-paper-faint">
          Publishing is instant, under your real name. Your views are your own -
          not the platform's. Reports that break the{" "}
          <a href="/guidelines" className="text-saffron underline">guidelines</a> can be
          hidden by the community or removed by admins.
        </p>
      </motion.div>
    </div>
  );
}
