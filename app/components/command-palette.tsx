"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "@/lib/motion-context";
import { overlayVariants, overlayTransition } from "@/lib/motion-variants";

const RECENT_KEY = "apexui_recent_searches";
const MAX_RECENT = 5;

interface SearchResult {
  slug: string;
  name: string;
  category: string;
  description: string | null;
}

function getRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function addRecent(query: string) {
  const recent = getRecent().filter((r) => r !== query);
  recent.unshift(query);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { shouldAnimate } = useReducedMotion();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setFocusedIndex(-1);
      setRecent(getRecent());
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } finally {
        setLoading(false);
      }
    }, 80);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = useCallback(
    (slug: string, q: string) => {
      if (q.trim()) addRecent(q);
      onClose();
      router.push(`/components/${slug}`);
    },
    [onClose, router],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items =
      results.length > 0
        ? results
        : recent.map((r) => ({ slug: "", name: r, category: "", description: null }));
    const maxIndex = items.length - 1;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((i) => Math.min(i + 1, maxIndex));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      const item = items[focusedIndex];
      if ("slug" in item && item.slug) {
        handleSelect(item.slug, query);
      }
    }
  };

  const showResults = query.trim().length > 0;
  const showRecent = !showResults && recent.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(13, 14, 17, 0.8)" }}
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-[560px] bg-card border border-default"
            variants={shouldAnimate ? overlayVariants : undefined}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={shouldAnimate ? overlayTransition : { duration: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Search components"
          >
            <div className="border-b border-default">
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setFocusedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search components..."
                className="w-full bg-code text-primary text-body border-none px-4 py-3 placeholder:text-muted focus:outline-none"
              />
            </div>

            <div className="max-h-[320px] overflow-auto">
              {loading && <div className="px-4 py-3 text-small text-secondary">Searching...</div>}

              {!loading && showResults && results.length === 0 && (
                <div className="px-4 py-6 border border-default m-3">
                  <p className="text-body text-secondary">No results for &ldquo;{query}&rdquo;</p>
                  <button
                    onClick={() => {
                      onClose();
                      router.push("/");
                    }}
                    className="mt-2 text-small text-accent hover:underline"
                  >
                    Browse all components
                  </button>
                </div>
              )}

              {!loading && showResults && results.length > 0 && (
                <div>
                  {results.map((item, i) => (
                    <button
                      key={item.slug}
                      onClick={() => handleSelect(item.slug, query)}
                      onMouseEnter={() => setFocusedIndex(i)}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors duration-75 ${
                        i === focusedIndex ? "bg-code" : ""
                      }`}
                    >
                      <div>
                        <p className="text-body text-primary">{item.name}</p>
                        <p className="text-small text-secondary">{item.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {showRecent && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-small text-muted uppercase tracking-wider">
                    Recent Searches
                  </p>
                  {recent.map((r, i) => (
                    <button
                      key={r}
                      onClick={() => setQuery(r)}
                      onMouseEnter={() => setFocusedIndex(i)}
                      className={`w-full text-left px-4 py-2 text-body text-secondary transition-colors duration-75 ${
                        i === focusedIndex ? "bg-code text-primary" : ""
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export { CommandPalette };
