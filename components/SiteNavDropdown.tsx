"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/quotes", label: "Quotes Discovery" },
  { href: "/iaffirmations", label: "I - Affirmations" },
  { href: "/you-affirmations", label: "You - Affirmations" },
];

export default function SiteNavDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="fixed top-4 right-4 z-50 text-sm font-semibold text-gray-700"
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-gray-200 shadow-sm hover:bg-white transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        Navigate
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M5 7l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          className="mt-2 w-48 rounded-xl bg-white/95 border border-gray-200 shadow-lg backdrop-blur"
          role="listbox"
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block px-4 py-2 hover:bg-purple-50 rounded-xl transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


