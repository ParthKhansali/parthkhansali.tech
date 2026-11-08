"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * localStorage as an external store.
 *
 * These games keep a personal best and the wall remembers a name. Reading
 * those inside an effect and pushing them into state would render twice on
 * every mount; reading them during render would break hydration. Treating
 * storage as an external store solves both: React uses the server snapshot
 * ("") while hydrating, then swaps in the stored value.
 */

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

let cache: { key: string; value: string } | null = null;

function read(key: string): string {
  if (cache && cache.key === key) return cache.value;
  let value = "";
  try {
    value = localStorage.getItem(key) ?? "";
  } catch {
    value = "";
  }
  cache = { key, value };
  return value;
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage is optional */
  }
  cache = { key, value };
  emit();
}

/** Current stored string for `key`, or "" on the server and first paint. */
export function useStoredValue(key: string): string {
  const getSnapshot = useCallback(() => read(key), [key]);
  const getServerSnapshot = useCallback(() => "", []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Current stored number for `key`, or 0. Used for personal bests. */
export function useStoredNumber(key: string): number {
  const raw = useStoredValue(key);
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/**
 * Keeps the highest value ever recorded under `key`.
 *
 * A best is never overwritten by a worse run, so this is safe to call on every
 * game over without checking the previous number first.
 */
export function recordBest(key: string, value: number) {
  const current = Number(read(key)) || 0;
  if (value > current) write(key, String(value));
}

export function saveStoredValue(key: string, value: string) {
  write(key, value);
}
