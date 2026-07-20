"use client";

// Compact segmented switcher for the two zones. Lives just below the header -
// small, always reachable, never shouting over the content.
import Link from "next/link";
import { usePathname } from "next/navigation";

const zones = [
  { href: "/for-the-people", title: "For the People" },
  { href: "/by-the-people", title: "By the People" },
];

export default function ZoneBar() {
  const pathname = usePathname();

  return (
    <div className="flex justify-center">
      <div className="glass flex items-center gap-1 rounded-full p-1">
        {zones.map((z) => {
          const active = pathname?.startsWith(z.href);
          return (
            <Link
              key={z.href}
              href={z.href}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition md:text-sm ${
                active
                  ? "bg-saffron text-white"
                  : "text-paper-dim hover:bg-elevate hover:text-paper"
              }`}
            >
              {z.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
