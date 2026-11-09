"use client";

import { useState, useEffect, useRef } from "react";
import CodeSnake from "./CodeSnake";
import PixelPong from "./PixelPong";
import LatencyReflex from "./LatencyReflex";

type ActiveApp = "arcade" | "chat" | "jam" | "cinema" | null;
type ArcadeGame = "snake" | "pong" | "reflex";

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  role?: string;
}

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    sender: "Aarav_CSE",
    avatar: "👾",
    text: "Anyone tested the sub-pixel centroid on ORVESS-PAT? Looks wild.",
    time: "23:42",
    role: "SIH Team",
  },
  {
    id: "2",
    sender: "Priya.dev",
    avatar: "⚡",
    text: "GEHU Connect feed running smooth on campus Wi-Fi today!",
    time: "23:44",
    role: "Campus",
  },
  {
    id: "3",
    sender: "RetroBot",
    avatar: "🤖",
    text: "Channel 04 online. 4 visitors currently vibe-synced in the lounge.",
    time: "23:47",
    role: "System",
  },
];

const TRACKS = [
  { title: "Dehradun Midnight Rain", artist: "Lofi CSE", duration: "2:48", bpm: "84 BPM" },
  { title: "Packet Sniffer Synth", artist: "Netwich Wave", duration: "3:15", bpm: "92 BPM" },
  { title: "Optical Centroid Orbit", artist: "PAT Simulation", duration: "2:30", bpm: "78 BPM" },
];

export default function RetroCrtStation() {
  const [isOn, setIsOn] = useState(true);
  const [activeApp, setActiveApp] = useState<ActiveApp>("arcade");
  const [activeGame, setActiveGame] = useState<ArcadeGame>("snake");
  const [isGlitching, setIsGlitching] = useState(false);
  const [hasScanlines, setHasScanlines] = useState(true);
  const [volume, setVolume] = useState(80);
  const [channel, setChannel] = useState(4);

  // Chat Room State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState("");

  // Music Jam State
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrackIdx, setActiveTrackIdx] = useState(0);
  const [playbackProgress, setPlaybackProgress] = useState(35);

  // Cinema State
  const [cinemaStatus, setCinemaStatus] = useState<"playing" | "buffering">("playing");

  // Degauss / Glitch trigger
  const triggerDegauss = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 900);
  };

  // Chat message send
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "You (Visitor)",
      avatar: "👤",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      role: "Guest",
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput("");
  };

  return (
    <div className="crt-station-wrapper">
      {/* Outer Retro CRT Cabinet Frame */}
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
            <span />
            <span />
          </div>
          <div className="crt-cabinet__badge">
            <span className="crt-badge__logo">⚡ PARTH-OS</span>
            <span className="crt-badge__model">CRT-1994 PRO · COLOR MONITOR</span>
          </div>
          <div className="crt-cabinet__vents" aria-hidden="true">
            <span />
            <span />
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
          {/* Bezel and Glass Tube Monitor */}
          <div className="crt-bezel">
            <div className="crt-screen">
              {/* Raster Scanline Overlay */}
              {hasScanlines && <div className="crt-overlay-scanlines" aria-hidden="true" />}

              {/* Glass Curvature and Vignette */}
              <div className="crt-overlay-vignette" aria-hidden="true" />

              {/* Phosphor RGB Glitch displacement */}
              <div className="crt-overlay-glitch" aria-hidden="true" />

              {/* Actual CRT Screen Content */}
              {isOn ? (
                <div className="crt-desktop">
                  {/* Retro Desktop Menu Bar / Header */}
                  <div className="crt-menubar">
                    <div className="crt-menubar__left">
                      <span className="crt-apple-icon"></span>
                      <span className="crt-menubar__title">PARTH LOUNGE OS 2.4</span>
                      <span className="crt-menubar__channel">CH-0{channel}</span>
                    </div>
                    <div className="crt-menubar__right">
                      <span className="crt-menubar__live">
                        <span className="crt-status-dot" /> LIVE
                      </span>
                      <span className="crt-menubar__clock">23:59:42 IST</span>
                    </div>
                  </div>

                  {/* Desktop Work Area */}
                  <div className="crt-workspace">
                    {/* Retro App Dock / Desktop Icons */}
                    <div className="crt-dock">
                      <button
                        type="button"
                        className={`crt-icon-tile ${activeApp === "arcade" ? "is-active" : ""}`}
                        onClick={() => {
                          setActiveApp("arcade");
                          setChannel(1);
                        }}
                      >
                        <span className="crt-icon-graphic">🕹️</span>
                        <span className="crt-icon-name">arcade.exe</span>
                        <span className="crt-icon-hint">Games</span>
                      </button>

                      <button
                        type="button"
                        className={`crt-icon-tile ${activeApp === "chat" ? "is-active" : ""}`}
                        onClick={() => {
                          setActiveApp("chat");
                          setChannel(2);
                        }}
                      >
                        <span className="crt-icon-graphic">💬</span>
                        <span className="crt-icon-name">live_chat.net</span>
                        <span className="crt-icon-hint">Chatroom</span>
                      </button>

                      <button
                        type="button"
                        className={`crt-icon-tile ${activeApp === "jam" ? "is-active" : ""}`}
                        onClick={() => {
                          setActiveApp("jam");
                          setChannel(3);
                        }}
                      >
                        <span className="crt-icon-graphic">🎵</span>
                        <span className="crt-icon-name">jam_beats.wav</span>
                        <span className="crt-icon-hint">Lofi Stream</span>
                      </button>

                      <button
                        type="button"
                        className={`crt-icon-tile ${activeApp === "cinema" ? "is-active" : ""}`}
                        onClick={() => {
                          setActiveApp("cinema");
                          setChannel(4);
                        }}
                      >
                        <span className="crt-icon-graphic">🎬</span>
                        <span className="crt-icon-name">cinema_feed.mp4</span>
                        <span className="crt-icon-hint">Watch Party</span>
                      </button>
                    </div>

                    {/* Window Container */}
                    <div className="crt-window-frame">
                      {/* Window Header */}
                      <div className="crt-window-titlebar">
                        <div className="crt-titlebar-buttons">
                          <button
                            type="button"
                            className="crt-titlebar-btn close"
                            onClick={() => setActiveApp(null)}
                            title="Close Window"
                            aria-label="Close"
                          />
                          <button
                            type="button"
                            className="crt-titlebar-btn minimize"
                            onClick={triggerDegauss}
                            title="Degauss"
                            aria-label="Degauss"
                          />
                          <button
                            type="button"
                            className="crt-titlebar-btn maximize"
                            title="Channel Toggle"
                            onClick={() => setChannel((prev) => (prev % 4) + 1)}
                            aria-label="Toggle Channel"
                          />
                        </div>

                        <div className="crt-titlebar-title">
                          {activeApp === "arcade" && `RETRO ARCADE // ${activeGame.toUpperCase()}`}
                          {activeApp === "chat" && "CAMPUS DISPATCH // LIVE CHATROOM (PORT 8080)"}
                          {activeApp === "jam" && "LOFI JAM SESSION // SYNCED AUDIO STREAM"}
                          {activeApp === "cinema" && "MIDNIGHT CINEMA // SIMULATED SCREENING ROOM"}
                          {!activeApp && "PARTH-OS // DESKTOP IDLE"}
                        </div>

                        <span className="crt-titlebar-sig">640x480</span>
                      </div>

                      {/* Window Body: App Specific Interfaces */}
                      <div className="crt-window-body">
                        {/* 1. ARCADE CENTER */}
                        {activeApp === "arcade" && (
                          <div className="crt-app-arcade">
                            {/* Game Selector Tabs */}
                            <div className="crt-game-tabs">
                              <button
                                type="button"
                                className={`crt-tab-btn ${activeGame === "snake" ? "is-active" : ""}`}
                                onClick={() => setActiveGame("snake")}
                              >
                                🐍 Code Snake
                              </button>
                              <button
                                type="button"
                                className={`crt-tab-btn ${activeGame === "pong" ? "is-active" : ""}`}
                                onClick={() => setActiveGame("pong")}
                              >
                                🏓 Pixel Pong
                              </button>
                              <button
                                type="button"
                                className={`crt-tab-btn ${activeGame === "reflex" ? "is-active" : ""}`}
                                onClick={() => setActiveGame("reflex")}
                              >
                                ⚡ Latency Reflex
                              </button>
                            </div>

                            {/* Render Active Game */}
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
                                <span className="crt-chat-status">● CONNECTED</span>
                                <span className="crt-chat-roomname"> #general-campus-lobby</span>
                              </div>
                              <span className="crt-chat-users">3 online</span>
                            </div>

                            {/* Message Feed */}
                            <div className="crt-chat-feed">
                              {chatMessages.map((msg) => (
                                <div key={msg.id} className="crt-chat-row">
                                  <span className="crt-chat-time">[{msg.time}]</span>
                                  <span className="crt-chat-avatar">{msg.avatar}</span>
                                  <span className="crt-chat-sender">{msg.sender}:</span>
                                  <span className="crt-chat-text">{msg.text}</span>
                                </div>
                              ))}
                            </div>

                            {/* Chat Input */}
                            <form className="crt-chat-form" onSubmit={handleSendChat}>
                              <span className="crt-chat-prompt">&gt;</span>
                              <input
                                type="text"
                                className="crt-chat-input"
                                placeholder="Type a message into the live terminal..."
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                              />
                              <button type="submit" className="crt-chat-send">
                                SEND [↵]
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
                                  <p className="crt-jam-artist">{TRACKS[activeTrackIdx].artist} · {TRACKS[activeTrackIdx].bpm}</p>
                                </div>
                              </div>

                              {/* Animated Graphic Equalizer */}
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

                            {/* Player Controls */}
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
                                  |◄ PREV
                                </button>
                                <button
                                  type="button"
                                  className={`crt-btn-retro ${isPlaying ? "is-active-btn" : ""}`}
                                  onClick={() => setIsPlaying((p) => !p)}
                                >
                                  {isPlaying ? "❚❚ PAUSE" : "► PLAY"}
                                </button>
                                <button
                                  type="button"
                                  className="crt-btn-retro"
                                  onClick={() =>
                                    setActiveTrackIdx((prev) => (prev + 1) % TRACKS.length)
                                  }
                                >
                                  NEXT ►|
                                </button>
                              </div>

                              <div className="crt-jam-sync-status">
                                <span className="pulse" />
                                <span>3 listeners listening together</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 4. MIDNIGHT CINEMA */}
                        {activeApp === "cinema" && (
                          <div className="crt-app-cinema">
                            <div className="crt-cinema-screen">
                              <div className="crt-cinema-film">
                                <div className="crt-cinema-curtain left" />
                                <div className="crt-cinema-projector">
                                  <div className="crt-projector-beam" />
                                  <div className="crt-cinema-visual">
                                    <span className="crt-cinema-reel">🎥 16MM ANALOG FEED</span>
                                    <p className="crt-cinema-caption">
                                      Late Night Computer Science &amp; Cyber Cinema
                                    </p>
                                    <span className="crt-cinema-counter">01:42:09 // TRACKING OK</span>
                                  </div>
                                </div>
                                <div className="crt-cinema-curtain right" />
                              </div>
                            </div>

                            <div className="crt-cinema-footer">
                              <div className="crt-cinema-meta">
                                <span className="crt-cinema-badge">ROOM #04</span>
                                <span>Showing: "Silicon Dreams &amp; Satellite Trajectories"</span>
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
                            <div className="crt-idle-logo"> PARTH-OS</div>
                            <p>Select any application icon from the left sidebar to launch.</p>
                            <div className="crt-idle-quicklinks">
                              <button type="button" onClick={() => setActiveApp("arcade")}>
                                [ Launch Arcade ]
                              </button>
                              <button type="button" onClick={() => setActiveApp("chat")}>
                                [ Open Chatroom ]
                              </button>
                              <button type="button" onClick={() => setActiveApp("jam")}>
                                [ Start Lofi Jam ]
                              </button>
                              <button type="button" onClick={() => setActiveApp("cinema")}>
                                [ Cinema Stream ]
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* CRT Power Off Tube Screen */
                <div className="crt-screen-off">
                  <div className="crt-screen-off__dot" />
                </div>
              )}
            </div>
          </div>

          {/* Right Side Control Panel: Knobs, Dials, Power & LED */}
          <div className="crt-controls">
            <div className="crt-controls__brand">
              <span>SONY / TRINITRON</span>
              <span className="crt-serial">NO. 884-PK</span>
            </div>

            {/* Power Switch and Green Glow LED */}
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

            {/* Rotating Channel Dial Knob */}
            <div className="crt-control-group">
              <span className="crt-label">VHF / CH</span>
              <div
                className="crt-knob-dial"
                style={{ transform: `rotate(${(channel - 1) * 90}deg)` }}
                onClick={() => setChannel((prev) => (prev % 4) + 1)}
                title="Click to change channel"
              >
                <span className="crt-knob-indicator" />
              </div>
              <span className="crt-knob-val">CH 0{channel}</span>
            </div>

            {/* Degauss / Glitch Button */}
            <div className="crt-control-group">
              <span className="crt-label">DEGAUSS</span>
              <button
                type="button"
                className="crt-btn-round"
                onClick={triggerDegauss}
                title="Trigger CRT Degauss Effect"
              >
                ⚡
              </button>
            </div>

            {/* Scanlines Toggle */}
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

            {/* Speaker Grille */}
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

