// Reaction writes. One reaction per user per post/comment, toggled in a
// transaction that keeps the denormalized counters honest and applies the
// auto-hide rule for By-the-People posts.
//
// NOTE on server-side rate limiting: if reaction spam ever becomes a problem,
// the right place to throttle is a Cloud Function (or App Check + per-uid
// counters in Firestore) - not the client. Left out of v1 deliberately.
import {
  doc,
  runTransaction,
  type DocumentReference,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  AUTO_HIDE_DISAGREE_RATIO,
  AUTO_HIDE_MIN_REACTIONS,
  type ReactionType,
} from "./types";

interface CounterDoc {
  hearts: number;
  disagrees: number;
  zone?: "for" | "by";
  status?: string;
}

/**
 * Toggle/switch a user's reaction on a post or comment.
 * - Same reaction again → removed.
 * - Other reaction → switched.
 * After counting, a By-the-People post that crosses the community threshold
 * (≥15 reactions, ≥70% disagrees) is moved into the hidden review queue.
 */
export async function toggleReaction(
  targetRef: DocumentReference,
  uid: string,
  type: ReactionType,
  opts: { isPost: boolean } = { isPost: true }
) {
  const reactionRef = doc(targetRef, "reactions", uid);

  await runTransaction(db, async (tx) => {
    const [targetSnap, reactionSnap] = await Promise.all([
      tx.get(targetRef),
      tx.get(reactionRef),
    ]);
    if (!targetSnap.exists()) return;

    const data = targetSnap.data() as CounterDoc;
    let hearts = data.hearts ?? 0;
    let disagrees = data.disagrees ?? 0;
    const previous = reactionSnap.exists()
      ? (reactionSnap.data().type as ReactionType)
      : null;

    if (previous === type) {
      // Toggle off.
      tx.delete(reactionRef);
      if (type === "heart") hearts = Math.max(0, hearts - 1);
      else disagrees = Math.max(0, disagrees - 1);
    } else {
      if (previous === "heart") hearts = Math.max(0, hearts - 1);
      if (previous === "disagree") disagrees = Math.max(0, disagrees - 1);
      tx.set(reactionRef, { type, uid });
      if (type === "heart") hearts += 1;
      else disagrees += 1;
    }

    const update: Record<string, unknown> = { hearts, disagrees };

    // Auto-moderation applies ONLY to By-the-People posts, never editorial.
    if (opts.isPost && data.zone === "by" && data.status === "live") {
      const total = hearts + disagrees;
      if (
        total >= AUTO_HIDE_MIN_REACTIONS &&
        disagrees / total >= AUTO_HIDE_DISAGREE_RATIO
      ) {
        update.status = "hidden";
        update.autoHidden = true;
      }
    }

    tx.update(targetRef, update);
  });
}
