"use client";

// Cookie/consent notice. Compact, bottom-left corner - informs without
// sitting on top of the masthead. Dismissal is remembered locally.
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const KEY = "tpi-consent-v1";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(KEY, "accepted");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26, delay: 1.5 }}
          className="fixed bottom-4 left-4 z-50 max-w-[15rem] rounded-xl glass p-3.5 shadow-card"
        >
          <p className="text-[11px] leading-relaxed text-paper-dim">
            Only essential cookies - sign-in and preferences. No ads, no
            trackers, nothing sold.{" "}
            <Link
              href="/privacy"
              className="text-saffron underline underline-offset-2"
            >
              Privacy
            </Link>
          </p>
          <button
            onClick={accept}
            className="mt-2 w-full rounded-full bg-saffron px-3 py-1 text-[11px] font-medium text-white transition hover:bg-saffron-soft"
          >
            Understood
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
