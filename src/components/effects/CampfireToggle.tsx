"use client";

import { useEffect, useState } from "react";
import { Flame, Volume2, VolumeX } from "lucide-react";
import { sounds } from "@/lib/soundFx";

type AmbientMode = "quiet" | "rain" | "campfire";

export default function CampfireToggle() {
  const [isLit, setIsLit] = useState(() => sounds.getAmbientMode() === "campfire");
  const [isMuted, setIsMuted] = useState(() => sounds.getMuted());

  useEffect(() => {
    const syncAmbient = (event: Event) => {
      const mode = (event as CustomEvent<{ mode?: AmbientMode }>).detail?.mode;
      setIsLit(mode === "campfire");
    };
    const syncMute = (event: Event) => {
      const muted = (event as CustomEvent<{ muted?: boolean }>).detail?.muted;
      if (typeof muted === "boolean") setIsMuted(muted);
    };

    window.addEventListener("ambient-mode-change", syncAmbient);
    window.addEventListener("sound-mute-change", syncMute);
    return () => {
      window.removeEventListener("ambient-mode-change", syncAmbient);
      window.removeEventListener("sound-mute-change", syncMute);
    };
  }, []);

  const toggleFire = () => {
    if (isLit) {
      sounds.stopAmbient();
      return;
    }

    sounds.startAmbient("campfire");
  };

  const toggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className={`campfire-note ${isLit ? "is-lit" : ""}`}>
      {isLit && (
        <div className="campfire-ambient-wash" aria-hidden="true">
          {Array.from({ length: 7 }, (_, index) => (
            <span key={index} style={{ "--ember-index": index } as React.CSSProperties} />
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={toggleFire}
          aria-pressed={isLit}
          aria-label={isLit ? "Extinguish campfire and stop ambience" : "Light campfire and start ambience"}
          className="campfire-button group"
        >
          <span className="campfire-visual" aria-hidden="true">
            <span className={`campfire-flame ${isLit ? "is-lit" : ""}`} />
            <span className="campfire-log campfire-log-one" />
            <span className="campfire-log campfire-log-two" />
          </span>
          <span className="sr-only">{isLit ? "Fire is lit" : "Fire is unlit"}</span>
        </button>

        <div className="min-w-[12rem] flex-1">
          <div className="flex items-center gap-2">
            <Flame className={`h-3.5 w-3.5 ${isLit ? "text-[#ef9b52]" : "text-[#8a7864]"}`} />
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#e2b66d]">
              {isLit ? "Campfire is lit" : "A small late-night ritual"}
            </p>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[#a69d8e]">
            {isLit ? "Rain on the window, warm crackle in the room." : "Light it when the build gets interesting."}
          </p>
        </div>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute portfolio ambience" : "Mute portfolio ambience"}
          title={isMuted ? "Unmute portfolio ambience" : "Mute portfolio ambience"}
          className="campfire-mute"
        >
          {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
