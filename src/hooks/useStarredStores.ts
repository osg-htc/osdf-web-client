import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "osdf:starred-stores";

// Starred object stores are identified by their collection prefix (the stable
// key we already use everywhere else) and persisted in localStorage so a user's
// stars survive reloads.
function readStored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((p): p is string => typeof p === "string") : [];
  } catch {
    return [];
  }
}

export function useStarredStores() {
  const [starred, setStarred] = useState<string[]>([]);
  // We hydrate from localStorage in an effect (not lazy initial state) to keep
  // the server and first client render in agreement; `hydrated` gates the
  // persist effect so the empty initial value never clobbers stored stars.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStarred(readStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(starred));
    } catch {}
  }, [starred, hydrated]);

  const isStarred = useCallback((prefix: string) => starred.includes(prefix), [starred]);

  const toggleStar = useCallback((prefix: string) => {
    setStarred((prev) =>
      prev.includes(prefix) ? prev.filter((p) => p !== prefix) : [...prev, prefix]
    );
  }, []);

  const addStar = useCallback((prefix: string) => {
    setStarred((prev) => (prev.includes(prefix) ? prev : [...prev, prefix]));
  }, []);

  return { starred, hydrated, isStarred, toggleStar, addStar };
}
