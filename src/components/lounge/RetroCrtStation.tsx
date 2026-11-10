"use client";

import { useState, useEffect } from "react";
import CodeSnake from "./CodeSnake";
import PixelPong from "./PixelPong";
import LatencyReflex from "./LatencyReflex";
import {
  IconActivity,
  IconAppleMark,
  IconCpu,
  IconFilm,
  IconGamepad,
  IconMessageSquare,
  IconMusic,
  IconPause,
  IconPlay,
  IconSkipBack,
  IconSkipForward,
  IconTerminal,
  IconUser,
  IconVideo,
  IconZap,
} from "@/components/ui/Icons";

type ActiveApp = "arcade" | "chat" | "jam" | "cinema" | null;
type ArcadeGame = "snake" | "pong" | "reflex";

interface ChatMessage {
  id: string;
  sender: string;
  kind: "guest" | "dev" | "system";
  text: string;
  time: string;
}

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    sender: "Aarav_CSE",
    kind: "dev",
    text: "Anyone tested the sub-pixel centroid on ORVESS-PAT? Looks crisp.",
    time: "23:42",
  },
  {
    id: "2",
    sender: "Priya.dev",
    kind: "guest",
    text: "GEHU Connect feed running smooth on campus Wi-Fi today.",
    time: "23:44",
  },
  {
    id: "3",
    sender: "LoungeHost",
    kind: "system",
    text: "Channel 01 to 04 online. Switch apps on the dock or dial knob.",
    time: "23:47",
  },
];

const TRACKS = [
  { title: "Dehradun Midnight Rain", artist: "Lofi CSE", duration: "2:48", bpm: "84 BPM" },
  { title: "Packet Sniffer Synth", artist: "Netwich Wave", duration: "3:15", bpm: "92 BPM" },
  { title: "Optical Centroid Orbit", artist: "PAT Simulation", duration: "2:30", bpm: "78 BPM" },
];

const CHANNEL_APPS: ActiveApp[] = ["arcade", "chat", "jam", "cinema"];

export default function RetroCrtStation() {
  const [isOn, setIsOn] = useState(true);
  const [activeApp, setActiveApp] = useState<ActiveApp>("arcade");
  const [activeGame, setActiveGame] = useState<ArcadeGame>("snake");
  const [isGlitching, setIsGlitching] = useState(false);
  const [hasScanlines, setHasScanlines] = useState(true);
  const [channel, setChannel] = useState(1);
  const [istClock, setIstClock] = useState("LIVE IST");

  // Chat Room State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState("");

  // Music Jam State
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrackIdx, setActiveTrackIdx] = useState(0);

  // Cinema State
  const [cinemaStatus, setCinemaStatus] = useState<"playing" | "buffering">("playing");

  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date());
        setIstClock(`${formatted} IST`);
      } catch {
        setIstClock("IST");
      }
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerDegauss = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 900);
  };

  const selectChannel = (nextChannel: number) => {
    setChannel(nextChannel);
    const mappedApp = CHANNEL_APPS[nextChannel - 1] ?? "arcade";
    setActiveApp(mappedApp);
  };

  const cycleChannel = () => {
    const nextChannel = (channel % 4) + 1;
    selectChannel(nextChannel);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "You",
      kind: "guest",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput("");
  };

  const renderChatIcon = (kind: ChatMessage["kind"]) => {
    if (kind === "system") return <IconCpu size={13} />;
    if (kind === "dev") return <IconTerminal size={13} />;
    return <IconUser size={13} />;
  };

  return (
    <div className="crt-station-wrapper">
      <div className={`crt-cabinet ${!isOn ? "is-powered-off" : ""} ${isGlitching ? "is-glitching" : ""}`}>
        {/* Top Cabinet Air Vents & Brand Label */}
        <div className="crt-cabinet__top-bar">
          <div className="crt-cabinet__vents" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="crt-cabinet__badge">
            <span className="crt-badge__logo">
              <IconZap size={12} />
              <span>PARTH-OS</span>
            </span>
            <span className="crt-badge__model">CRT-94 WORKSTATION</span>
          </div>
          <div className="crt-cabinet__vents" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        {/* Main Workstation Body: CRT Screen + Analog Controls */}
        <div className="crt-cabinet__main">
          <div className="crt-bezel">
            <div className="crt-screen">
              {hasScanlines && <div className="crt-overlay-scanlines" aria-hidden="true" />}
              <div className="crt-overlay-vignette" aria-hidden="true" />
              <div className="crt-overlay-glitch" aria-hidden="true" />

              {isOn ? (
                <div className="crt-desktop">
                  {/* Retro Desktop Menu Bar */}
                  <div className="crt-menubar">
                    <div className="crt-menubar__left">
                      <IconAppleMark size={13} className="crt-apple-icon" />
                      <span className="crt-menubar__title">LOUNGE OS 2.4</span>
                      <span className="crt-menubar__channel">CH-0{channel}</span>
                    </div>
                    <div className="crt-menubar__right">
                      <span className="crt-menubar__live">
                        <span className="crt-status-dot" /> LIVE
                      </span>
                      <span className="crt-menubar__clock">{istClock}</span>
                    </div>
                  </div>

                  {/* Desktop Work Area */}
                  <div className="crt-workspace">
                    {/* Retro App Dock */}
                    <div className="crt-dock">
                      <button
                        type="button"
                        className={`crt-icon-tile ${activeApp === "arcade" ? "is-active" : ""}`}
                        onClick={() => selectChannel(1)}
                      >
                        <span className="crt-icon-graphic">
                          <IconGamepad size={20} />
                        </span>
                        <span className="crt-icon-name">Arcade</span>
                        <span className="crt-icon-hint">Games</span>
                      </button>

                      <button
                        type="button"
                        className={`crt-icon-tile ${activeApp === "chat" ? "is-active" : ""}`}
                        onClick={() => selectChannel(2)}
                      >
                        <span className="crt-icon-graphic">
                          <IconMessageSquare size={20} />
                        </span>
                        <span className="crt-icon-name">Chat</span>
                        <span className="crt-icon-hint">Lobby</span>
                      </button>

                      <button
                        type="button"
                        className={`crt-icon-tile ${activeApp === "jam" ? "is-active" : ""}`}
                        onClick={() => selectChannel(3)}
                      >
                        <span className="crt-icon-graphic">
                          <IconMusic size={20} />
                        </span>
                        <span className="crt-icon-name">Lofi Jam</span>
                        <span className="crt-icon-hint">Audio</span>
                      </button>

                      <button
                        type="button"
                        className={`crt-icon-tile ${activeApp === "cinema" ? "is-active" : ""}`}
                        onClick={() => selectChannel(4)}
                      >
                        <span className="crt-icon-graphic">
                          <IconFilm size={20} />
                        </span>
                        <span className="crt-icon-name">Cinema</span>
                        <span className="crt-icon-hint">Stream</span>
                      </button>
                    </div>

                    {/* Window Container */}
                    <div className="crt-window-frame">
                      <div className="crt-window-titlebar">
                        <div className="crt-titlebar-buttons">
                          <button
                            type="button"
                            className="crt-titlebar-btn close"
                            onClick={() => setActiveApp(null)}
                            title="Close Window"
                            aria-label="Close window"
                          />
                          <button
                            type="button"
                            className="crt-titlebar-btn minimize"
                            onClick={triggerDegauss}
                            title="Degauss"
                            aria-label="Trigger degauss"
                          />
                          <button
                            type="button"
                            className="crt-titlebar-btn maximize"
                            title="Next Channel"
                            onClick={cycleChannel}
                            aria-label="Switch channel"
                          />
                        </div>

                        <div className="crt-titlebar-title">
                          {activeApp === "arcade" && `RETRO ARCADE // ${activeGame.toUpperCase()}`}
                          {activeApp === "chat" && "LIVE CHATROOM // LOBBY"}
                          {activeApp === "jam" && "LOFI JAM // AUDIO STREAM"}
                          {activeApp === "cinema" && "MIDNIGHT CINEMA // SCREENING ROOM"}
                          {!activeApp && "PARTH-OS // DESKTOP IDLE"}
                        </div>

                        <span className="crt-titlebar-sig">640x480</span>
                      </div>

                      <div className="crt-window-body">
                        {/* 1. ARCADE CENTER */}
                        {activeApp === "arcade" && (
                          <div className="crt-app-arcade">
                            <div className="crt-game-tabs">
                              <button
                                type="button"
                                className={`crt-tab-btn ${activeGame === "snake" ? "is-active" : ""}`}
                                onClick={() => setActiveGame("snake")}
                              >
                                <IconTerminal size={13} />
                                <span>Code Snake</span>
                              </button>
                              <button
                                type="button"
                                className={`crt-tab-btn ${activeGame === "pong" ? "is-active" : ""}`}
                                onClick={() => setActiveGame("pong")}
                              >
                                <IconGamepad size={13} />
                                <span>Pixel Pong</span>
                              </button>
                              <button
                                type="button"
                                className={`crt-tab-btn ${activeGame === "reflex" ? "is-active" : ""}`}
                                onClick={() => setActiveGame("reflex")}
                              >
                                <IconActivity size={13} />
                                <span>Latency Reflex</span>
                              </button>
                            </div>

                            <div className="crt-game-stage">
                              {activeGame === "snake" && <CodeSnake />}
                              {activeGame === "pong" && <PixelPong />}
                              {activeGame === "reflex" && <LatencyReflex />}
                            </div>
                          </div>
                        )}

                        {/* 2. LIVE CHATROOM */}
                        {activeApp === "chat" && (
                          <div className="crt-app-chat">
                            <div className="crt-chat-header">
                              <div>
                                <span className="crt-chat-status">CONNECTED</span>
                                <span className="crt-chat-roomname"> #general-campus-lobby</span>
                              </div>
                              <span className="crt-chat-users">Room preview</span>
                            </div>

                            <div className="crt-chat-feed">
                              {chatMessages.map((msg) => (
                                <div key={msg.id} className="crt-chat-row">
                                  <span className="crt-chat-time">[{msg.time}]</span>
                                  <span className="crt-chat-avatar" aria-hidden="true">
                                    {renderChatIcon(msg.kind)}
                                  </span>
                                  <span className="crt-chat-sender">{msg.sender}:</span>
                                  <span className="crt-chat-text">{msg.text}</span>
                                </div>
                              ))}
                            </div>

                            <form className="crt-chat-form" onSubmit={handleSendChat}>
                              <span className="crt-chat-prompt">&gt;</span>
                              <input
                                type="text"
                                className="crt-chat-input"
                                placeholder="Type a message..."
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                              />
                              <button type="submit" className="crt-chat-send">
                                SEND
                              </button>
                            </form>
                          </div>
                        )}

                        {/* 3. MUSIC JAM SESSION */}
                        {activeApp === "jam" && (
                          <div className="crt-app-jam">
                            <div className="crt-jam-top">
                              <div className="crt-jam-deck">
                                <div className="crt-jam-cassette">
                                  <div className={`crt-cassette-spool left ${isPlaying ? "is-spinning" : ""}`} />
                                  <div className="crt-cassette-window">
                                    <span className="crt-cassette-label">
                                      {TRACKS[activeTrackIdx].title}
                                    </span>
                                  </div>
                                  <div className={`crt-cassette-spool right ${isPlaying ? "is-spinning" : ""}`} />
                                </div>

                                <div className="crt-jam-trackinfo">
                                  <span className="crt-jam-badge">LOFI TAPE 0{activeTrackIdx + 1}</span>
                                  <h4 className="crt-jam-title">{TRACKS[activeTrackIdx].title}</h4>
                                  <p className="crt-jam-artist">
                                    {TRACKS[activeTrackIdx].artist} · {TRACKS[activeTrackIdx].bpm}
                                  </p>
                                </div>
                              </div>

                              <div className="crt-equalizer" aria-hidden="true">
                                {[65, 40, 85, 30, 95, 70, 50, 90, 60, 45, 80, 55].map((h, i) => (
                                  <div
                                    key={i}
                                    className={`crt-eq-bar ${isPlaying ? "is-pulsing" : ""}`}
                                    style={{
                                      height: isPlaying ? `${h}%` : "15%",
                                      animationDelay: `${i * 0.08}s`,
                                    }}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="crt-jam-controls">
                              <div className="crt-jam-buttons">
                                <button
                                  type="button"
                                  className="crt-btn-retro"
                                  onClick={() =>
                                    setActiveTrackIdx(
                                      (prev) => (prev - 1 + TRACKS.length) % TRACKS.length
                                    )
                                  }
                                >
                                  <IconSkipBack size={11} />
                                  <span>PREV</span>
                                </button>
                                <button
                                  type="button"
                                  className={`crt-btn-retro ${isPlaying ? "is-active-btn" : ""}`}
                                  onClick={() => setIsPlaying((p) => !p)}
                                >
                                  {isPlaying ? <IconPause size={11} /> : <IconPlay size={11} />}
                                  <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
                                </button>
                                <button
                                  type="button"
                                  className="crt-btn-retro"
                                  onClick={() =>
                                    setActiveTrackIdx((prev) => (prev + 1) % TRACKS.length)
                                  }
                                >
                                  <span>NEXT</span>
                                  <IconSkipForward size={11} />
                                </button>
                              </div>

                              <div className="crt-jam-sync-status">
                                <span className="pulse" />
                                <span>Live sync preview</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 4. MIDNIGHT CINEMA */}
                        {activeApp === "cinema" && (
                          <div className="crt-app-cinema">
                            <div className="crt-cinema-screen">
                              <div className="crt-cinema-film">
                                <div className="crt-cinema-projector">
                                  <div className="crt-cinema-visual">
                                    <span className="crt-cinema-reel">
                                      <IconVideo size={13} />
                                      <span>16MM ANALOG FEED</span>
                                    </span>
                                    <p className="crt-cinema-caption">
                                      Late Night Computer Science &amp; Cyber Cinema
                                    </p>
                                    <span className="crt-cinema-counter">TRACKING OK // SCREENING PREVIEW</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="crt-cinema-footer">
                              <div className="crt-cinema-meta">
                                <span className="crt-cinema-badge">ROOM #04</span>
                                <span>Showing: &quot;Silicon Dreams &amp; Satellite Trajectories&quot;</span>
                              </div>
                              <button
                                type="button"
                                className="crt-btn-retro"
                                onClick={() =>
                                  setCinemaStatus((prev) =>
                                    prev === "playing" ? "buffering" : "playing"
                                  )
                                }
                              >
                                {cinemaStatus === "playing" ? "PAUSE STREAM" : "RESUME"}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* IDLE DESKTOP */}
                        {!activeApp && (
                          <div className="crt-app-idle">
                            <div className="crt-idle-logo">
                              <IconAppleMark size={18} />
                              <span>PARTH-OS</span>
                            </div>
                            <p>Select any application icon from the dock to launch.</p>
                            <div className="crt-idle-quicklinks">
                              <button type="button" className="crt-btn-retro" onClick={() => selectChannel(1)}>
                                Launch Arcade
                              </button>
                              <button type="button" className="crt-btn-retro" onClick={() => selectChannel(2)}>
                                Open Chatroom
                              </button>
                              <button type="button" className="crt-btn-retro" onClick={() => selectChannel(3)}>
                                Start Lofi Jam
                              </button>
                              <button type="button" className="crt-btn-retro" onClick={() => selectChannel(4)}>
                                Cinema Stream
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="crt-screen-off">
                  <div className="crt-screen-off__dot" />
                </div>
              )}
            </div>
          </div>

          {/* Right Side Control Panel: Knobs, Dials, Power & LED */}
          <div className="crt-controls">
            <div className="crt-controls__brand">
              <span>STUDIO / CRT-94</span>
              <span className="crt-serial">MODEL 884-PK</span>
            </div>

            <div className="crt-control-group">
              <span className="crt-label">POWER</span>
              <div className="crt-power-row">
                <button
                  type="button"
                  className={`crt-switch-btn ${isOn ? "is-on" : ""}`}
                  onClick={() => setIsOn((p) => !p)}
                  aria-label="Power Switch"
                >
                  <span className="crt-switch-toggle" />
                </button>
                <span className={`crt-led ${isOn ? "is-lit" : ""}`} />
              </div>
            </div>

            <div className="crt-control-group">
              <span className="crt-label">VHF / CH</span>
              <button
                type="button"
                className="crt-knob-dial"
                style={{ transform: `rotate(${(channel - 1) * 90}deg)` }}
                onClick={cycleChannel}
                title="Click to change channel"
                aria-label="Switch channel"
              >
                <span className="crt-knob-indicator" />
              </button>
              <span className="crt-knob-val">CH 0{channel}</span>
            </div>

            <div className="crt-control-group">
              <span className="crt-label">DEGAUSS</span>
              <button
                type="button"
                className="crt-btn-round"
                onClick={triggerDegauss}
                title="Trigger CRT Degauss Effect"
                aria-label="Trigger CRT degauss"
              >
                <IconZap size={14} />
              </button>
            </div>

            <div className="crt-control-group">
              <span className="crt-label">SCANLINES</span>
              <button
                type="button"
                className={`crt-btn-toggle ${hasScanlines ? "is-active" : ""}`}
                onClick={() => setHasScanlines((s) => !s)}
              >
                {hasScanlines ? "CRT ON" : "FLAT"}
              </button>
            </div>

            <div className="crt-speaker-grille" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
