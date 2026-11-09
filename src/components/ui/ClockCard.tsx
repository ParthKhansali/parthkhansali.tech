"use client";

import { useEffect, useState } from "react";

type Time = { h: number; m: number; s: number };

/**
 * A small analog clock showing Dehradun time.
 *
 * The server has no idea what time it is for the reader, so it renders an
 * ornamental 10:10 face and a dash. The client fills in the real IST time after
 * hydration — no mismatch, and nothing the page claims depends on it.
 */
export default function ClockCard() {
  const [time, setTime] = useState<Time | null>(null);

  useEffect(() => {
    const read = () => {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).formatToParts(new Date());

      const value = (type: string) =>
        Number(parts.find((part) => part.type === type)?.value ?? 0);

      setTime({ h: value("hour") % 24, m: value("minute"), s: value("second") });
    };

    read();
    const timer = window.setInterval(read, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hours = time?.h ?? 10;
  const minutes = time?.m ?? 10;
  const seconds = time?.s ?? 0;

  const hourAngle = (hours % 12) * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const secondAngle = seconds * 6;

  const digital = time
    ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
    : "--:--";

  return (
    <article className="card clock-card">
      <div className="clock-card__face">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="94" className="clock-face" />
          <circle cx="100" cy="100" r="82" className="clock-face__inner" />
          {Array.from({ length: 12 }, (_, index) => (
            <line
              key={index}
              x1="100"
              y1="18"
              x2="100"
              y2={index % 3 === 0 ? "29" : "24"}
              className="clock-tick"
              transform={`rotate(${index * 30} 100 100)`}
            />
          ))}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="56"
            className="clock-hand clock-hand--hour"
            transform={`rotate(${hourAngle} 100 100)`}
          />
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="38"
            className="clock-hand clock-hand--minute"
            transform={`rotate(${minuteAngle} 100 100)`}
          />
          <line
            x1="100"
            y1="112"
            x2="100"
            y2="34"
            className="clock-hand clock-hand--second"
            transform={`rotate(${secondAngle} 100 100)`}
          />
          <circle cx="100" cy="100" r="4" className="clock-pivot" />
        </svg>
      </div>

      <div className="clock-card__meta">
        <p className="card-kicker">Local time</p>
        <p className="clock-card__digital">
          {digital} <span>IST</span>
        </p>
        <p className="clock-card__zone">Dehradun, India · GMT+5:30</p>
      </div>
    </article>
  );
}
