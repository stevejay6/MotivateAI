'use client';

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useEffect, useRef, useState, type ComponentType } from "react";

type NavLink = {
  href: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
};

const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/quotes', label: 'Quotes Discovery' },
  { href: '/iaffirmations', label: 'I - Affirmations' },
  { href: '/you-affirmations', label: 'You - Affirmations' },
  { href: '/ai-journal', label: 'AI Journal' },
  { href: '/my-inspirations', label: 'My Inspirations' },
  { href: '/journal', label: 'Journal' },
  { href: '/emotional-coach', label: 'Emotional Coach' },
  { href: '/ai-kick-in-the-pants', label: 'AI Kick in the Pants', icon: BookOpen },
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
          className="mt-2 w-52 rounded-xl bg-white/95 border border-gray-200 shadow-lg backdrop-blur"
          role="listbox"
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 hover:bg-purple-50 rounded-xl transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.icon && <link.icon className="h-4 w-4 text-gray-600" />}
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


