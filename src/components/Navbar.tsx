"use client";

// Header keeps only identity + account actions. The two zones (For / By the
// People) are deliberately NOT here - they get their own prominent switcher
// below the hero and on the homepage.
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, loading, isAdmin, signIn, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-lg tracking-tight text-paper transition-colors hover:text-saffron-soft"
        >
          <span className="emblem h-7 w-5 shrink-0" aria-hidden />
          <span>
            The People <span className="text-saffron">of</span> India
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-5 md:flex">
          <Link
            href="/about"
            className="text-sm text-paper-dim transition-colors hover:text-paper"
          >
            About
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm text-paper-dim transition-colors hover:text-paper"
            >
              Admin
            </Link>
          )}
          <ThemeToggle />
          {user && (
            <Link
              href="/write"
              className="rounded-full bg-saffron px-4 py-1.5 text-sm font-medium text-white transition hover:bg-saffron-soft"
            >
              Write
            </Link>
          )}
          {!loading &&
            (user ? (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 text-sm text-paper-dim transition-colors hover:text-paper"
                title={`Signed in as ${user.displayName}. Click to sign out.`}
              >
                {user.photoURL && (
                  <Image
                    src={user.photoURL}
                    alt=""
                    width={26}
                    height={26}
                    className="rounded-full"
                  />
                )}
                Sign out
              </button>
            ) : (
              <button
                onClick={() => signIn()}
                className="rounded-full border border-line px-4 py-1.5 text-sm text-paper transition hover:border-saffron/60 hover:text-saffron-soft"
              >
                Sign in with Google
              </button>
            ))}
        </div>

        {/* Mobile: theme toggle stays visible, rest folds into the menu */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            className="text-paper-dim"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-line px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-paper-dim hover:text-paper"
            >
              About
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-paper-dim"
              >
                Admin
              </Link>
            )}
            {user && (
              <Link
                href="/write"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-saffron"
              >
                Write a report
              </Link>
            )}
            {!loading &&
              (user ? (
                <button
                  onClick={() => signOut()}
                  className="text-left text-sm text-paper-dim"
                >
                  Sign out
                </button>
              ) : (
                <button
                  onClick={() => {
                    signIn();
                    setMenuOpen(false);
                  }}
                  className="text-left text-sm text-saffron"
                >
                  Sign in with Google
                </button>
              ))}
          </div>
        </div>
      )}
    </header>
  );
}
