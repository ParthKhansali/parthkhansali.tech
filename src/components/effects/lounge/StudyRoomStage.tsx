"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarClock,
  Flame,
  Headphones,
  ListRestart,
  MessageCircle,
  Play,
  Radio,
  Sparkles,
  Trophy,
  VolumeX,
} from "lucide-react";
import { sounds } from "@/lib/soundFx";
import { VisitorProfile } from "./types";

type AmbientMode = "quiet" | "rain" | "campfire";

interface StudyVisitor {
  id: string;
  name: string;
  avatar: string;
  activity?: string;
}

interface StudyRoomStageProps {
  profile: VisitorProfile;
  visitors: StudyVisitor[];
  ambientMode: AmbientMode;
  onAmbientChange: (mode: AmbientMode) => void;
  onOpenScribble: () => void;
  onOpenArcade: () => void;
  onOpenRankings: () => void;
}

const ROOM_NOTES = [
  "ship one thoughtful thing",
  "read the source before the tutorial",
  "make the invisible legible",
];

export default function StudyRoomStage({
  profile,
  visitors,
  ambientMode,
  onAmbientChange,
  onOpenScribble,
  onOpenArcade,
  onOpenRankings,
}: StudyRoomStageProps) {
  const [pomodoroMode, setPomodoroMode] = useState<"focus" | "break">("focus");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isTournamentReady, setIsTournamentReady] = useState(false);
  const [noteIndex, setNoteIndex] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          setIsRunning(false);
          sounds.playAchievement();
          return pomodoroMode === "focus" ? 5 * 60 : 25 * 60;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRunning, pomodoroMode]);

  const displayTime = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(
    secondsLeft % 60
  ).padStart(2, "0")}`;

  const roomVisitors = useMemo(() => {
    const self = { id: profile.id, name: profile.name, avatar: profile.avatar, activity: "in the room" };
    return [self, ...visitors.filter((visitor) => visitor.id !== profile.id)].slice(0, 6);
  }, [profile, visitors]);

  const changeAmbient = (mode: AmbientMode) => {
    sounds.playMinecraftPop();
    onAmbientChange(mode);
  };

  const togglePomodoro = () => {
    sounds.playClick(520, 0.04);
    setIsRunning((value) => !value);
  };

  const resetPomodoro = () => {
    sounds.playMinecraftPop();
    setIsRunning(false);
    setSecondsLeft(pomodoroMode === "focus" ? 25 * 60 : 5 * 60);
  };

  const switchPomodoroMode = (mode: "focus" | "break") => {
    sounds.playClick(620, 0.03);
    setPomodoroMode(mode);
    setIsRunning(false);
    setSecondsLeft(mode === "focus" ? 25 * 60 : 5 * 60);
  };

  return (
    <div className="study-room-stage flex h-full min-h-0 flex-col overflow-y-auto bg-[#11100e] text-[#f4eee4]">
      <div className="flex items-center justify-between border-b border-[#3d3429] bg-[#1b1814] px-4 py-2 text-[10px] font-mono text-[#a69d8e]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#9fb7a2] shadow-[0_0_10px_rgba(159,183,162,0.7)]" />
          <span>PARTH_OS / STUDY_ROOM.exe</span>
        </div>
        <span className="hidden sm:inline">Doon Valley · {roomVisitors.length} connected</span>
      </div>

      <div className="grid flex-1 gap-3 p-3 sm:p-4 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="study-room-scene relative min-h-[390px] overflow-hidden rounded-xl border border-[#5c4935] bg-[#1b1712] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:min-h-[470px]">
          <div className="study-room-sky" aria-hidden="true" />
          <div className="study-room-window" aria-hidden="true">
            <span className="study-room-moon" />
            <span className="study-room-mountain study-room-mountain-back" />
            <span className="study-room-mountain study-room-mountain-front" />
            <span className="study-room-rain" />
          </div>

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <p className="section-kicker !text-[#e2b66d]">The late-night room</p>
              <h2 className="mt-2 max-w-md font-display text-2xl font-bold leading-tight text-[#f8efe3] sm:text-3xl">
                A quiet corner for people who like making things.
              </h2>
              <p className="mt-2 max-w-md text-xs leading-relaxed text-[#c2b9aa]">
                Put on an atmosphere, start a focus sprint, draw something in the whiteboard, or wait for the next tiny tournament.
              </p>
            </div>
            <div className="hidden rounded-lg border border-[#c89455]/30 bg-[#1b1712]/80 px-2 py-1 text-right font-mono text-[9px] text-[#e2b66d] sm:block">
              <span className="block text-[#8a7864]">ROOM STATUS</span>
              <span className="mt-0.5 block">OPEN / FRIENDLY</span>
            </div>
          </div>

          <div className="study-room-desk absolute inset-x-5 bottom-7 z-10 rounded-[1.6rem] border border-[#7a5137]/60 bg-[#4a2e24] p-3 shadow-[0_20px_40px_rgba(0,0,0,0.35)] sm:inset-x-10">
            <div className="flex items-end justify-between gap-3">
              <div className="study-room-lamp hidden sm:block" aria-hidden="true">
                <span className="study-room-lamp-glow" />
                <span className="study-room-lamp-shade" />
                <span className="study-room-lamp-stem" />
              </div>

              <div className="study-room-monitor flex-1 rounded-lg border border-[#2c3e3c] bg-[#0c1718] p-2 shadow-[0_0_30px_rgba(60,190,170,0.16)]">
                <div className="flex items-center justify-between border-b border-[#234244] pb-1 font-mono text-[8px] text-[#7bc6bc]">
                  <span>focus://parth-craft</span>
                  <span>● LIVE</span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-1.5 font-mono text-[8px]">
                  <span className="rounded bg-[#143133] px-2 py-1 text-[#9be0d2]">notes/{noteIndex + 1}</span>
                  <span className="rounded bg-[#2b2517] px-2 py-1 text-[#e2b66d]">pomodoro/{displayTime}</span>
                  <span className="rounded bg-[#202238] px-2 py-1 text-[#a8b7e1]">visitors/{roomVisitors.length}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-[#c2d7d2]">
                  <span className="text-[#e2b66d]">&gt;</span>
                  <span className="truncate">{ROOM_NOTES[noteIndex]}</span>
                  <span className="h-3 w-1 animate-pulse bg-[#7bc6bc]" />
                </div>
              </div>

              <div className="study-room-campfire relative h-16 w-16 shrink-0" aria-hidden="true">
                <span className={`study-room-flame ${ambientMode === "campfire" ? "is-lit" : ""}`} />
                <span className="study-room-log study-room-log-one" />
                <span className="study-room-log study-room-log-two" />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-5 bottom-3 z-20 flex items-center justify-between font-mono text-[9px] text-[#a88d75] sm:inset-x-10">
            <span>CLICK A CONTROL · MAKE YOUR OWN WEATHER</span>
            <span>{ambientMode === "quiet" ? "SILENT" : ambientMode.toUpperCase()}</span>
          </div>
        </section>

        <aside className="flex flex-col gap-3">
          <section className="rounded-xl border border-[#4a4033] bg-[#1b1814] p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones className="h-3.5 w-3.5 text-[#e2b66d]" />
                <h3 className="text-xs font-semibold text-[#f4eee4]">Room atmosphere</h3>
              </div>
              <span className="font-mono text-[9px] text-[#766958]">ORIGINAL AUDIO</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { mode: "quiet" as const, label: "Quiet", icon: VolumeX },
                { mode: "rain" as const, label: "Rain", icon: Radio },
                { mode: "campfire" as const, label: "Fire", icon: Flame },
              ].map(({ mode, label, icon: Icon }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => changeAmbient(mode)}
                  className={`flex min-h-10 flex-col items-center justify-center gap-1 rounded-lg border text-[10px] transition-colors ${
                    ambientMode === mode
                      ? "border-[#e2b66d]/60 bg-[#e2b66d]/15 text-[#f4eee4]"
                      : "border-[#3d3429] bg-[#15130f] text-[#9a8d7d] hover:border-[#7c674c] hover:text-[#f4eee4]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-[#766958]">
              A small procedural soundscape. It only starts after you choose it.
            </p>
          </section>

          <section className="rounded-xl border border-[#4a4033] bg-[#1b1814] p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-3.5 w-3.5 text-[#9fb7a2]" />
                <h3 className="text-xs font-semibold text-[#f4eee4]">Focus loop</h3>
              </div>
              <button
                type="button"
                onClick={resetPomodoro}
                title="Reset Pomodoro"
                className="rounded p-1 text-[#766958] transition-colors hover:bg-[#e2b66d]/10 hover:text-[#e2b66d]"
              >
                <ListRestart className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div>
                <div className="font-mono text-3xl font-semibold tracking-tight text-[#f4eee4]">{displayTime}</div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-[#8a7864]">{pomodoroMode} session</div>
              </div>
              <button
                type="button"
                onClick={togglePomodoro}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#e2b66d] px-3 py-2 text-[11px] font-semibold text-[#17130f] transition-colors hover:bg-[#f0c987]"
              >
                <Play className="h-3 w-3 fill-current" />
                {isRunning ? "Pause" : "Start"}
              </button>
            </div>
            <div className="mt-3 flex gap-1.5">
              {(["focus", "break"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => switchPomodoroMode(mode)}
                  className={`rounded-md px-2.5 py-1 text-[10px] capitalize transition-colors ${
                    pomodoroMode === mode ? "bg-[#9fb7a2]/20 text-[#cde1cf]" : "text-[#766958] hover:text-[#c2b9aa]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[#4a4033] bg-[#1b1814] p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#d37458]" />
                <h3 className="text-xs font-semibold text-[#f4eee4]">People in the room</h3>
              </div>
              <span className="font-mono text-[9px] text-[#8a7864]">{roomVisitors.length}/6</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {roomVisitors.map((visitor) => (
                <div key={visitor.id} className="group flex items-center gap-1.5 rounded-full border border-[#3d3429] bg-[#15130f] px-2 py-1" title={visitor.activity || "Browsing"}>
                  <span className="text-sm">{visitor.avatar}</span>
                  <span className="max-w-[78px] truncate text-[10px] text-[#c2b9aa]">{visitor.name}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#9fb7a2]" />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[#4a4033] bg-[#1b1814] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-3.5 w-3.5 text-[#e2b66d]" />
                  <h3 className="text-xs font-semibold text-[#f4eee4]">Tiny tournament lobby</h3>
                </div>
                <p className="mt-1 text-[10px] leading-relaxed text-[#8a7864]">
                  Next bracket: Foothills Dash · casual · {Math.max(2, roomVisitors.length)} seats.
                </p>
              </div>
              <span className="rounded-full border border-[#9fb7a2]/30 bg-[#9fb7a2]/10 px-2 py-0.5 font-mono text-[9px] text-[#bcd7bf]">
                {isTournamentReady ? "READY" : "OPEN"}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              <button type="button" onClick={() => { setIsTournamentReady((value) => !value); sounds.playMinecraftPop(); }} className="rounded-lg border border-[#3d3429] bg-[#15130f] px-2 py-2 text-[10px] text-[#c2b9aa] transition-colors hover:border-[#e2b66d]/50">
                {isTournamentReady ? "Leave lobby" : "Ready up"}
              </button>
              <button type="button" onClick={onOpenArcade} className="rounded-lg border border-[#3d3429] bg-[#15130f] px-2 py-2 text-[10px] text-[#c2b9aa] transition-colors hover:border-[#e2b66d]/50">Play games</button>
              <button type="button" onClick={onOpenRankings} className="rounded-lg border border-[#3d3429] bg-[#15130f] px-2 py-2 text-[10px] text-[#c2b9aa] transition-colors hover:border-[#e2b66d]/50">Brackets</button>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={onOpenScribble} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#3d3429] bg-[#211c17] px-3 py-2 text-[10px] font-medium text-[#c2b9aa] transition-colors hover:border-[#e2b66d]/50 hover:text-[#f4eee4]">
              <BookOpen className="h-3 w-3" />
              Open whiteboard
            </button>
            <button type="button" onClick={() => setNoteIndex((value) => (value + 1) % ROOM_NOTES.length)} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#3d3429] bg-[#211c17] px-3 py-2 text-[10px] font-medium text-[#c2b9aa] transition-colors hover:border-[#d37458]/50 hover:text-[#f4eee4]">
              <MessageCircle className="h-3 w-3" />
              Change note
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
