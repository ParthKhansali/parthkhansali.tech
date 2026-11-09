"use client";

import { useSyncExternalStore } from "react";

/*
 * A clock in the visitor's browser, showing the time where Parth actually is.
 * The server has no idea what time it is for the reader, so it renders a dash
 * and the client fills the value in after hydration: no mismatch, no layout
 * shift because the string is a fixed width in a monospace face.
 */
let current = "";
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function tick() {
  current = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  if (!timer) {
    tick();
    timer = setInterval(tick, 30_000);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

const getSnapshot = () => current;
const getServerSnapshot = () => "";

export default function LocalClock() {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <span className="clock" title="Local time in Dehradun, India">
      <span className="clock__time" suppressHydrationWarning>
        {time || "--:--"}
      </span>
      <span className="clock__zone">IST</span>
    </span>
  );
}
