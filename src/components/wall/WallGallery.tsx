"use client";

import { useState } from "react";
import { type WallPin } from "@/data/wallPins";

interface WallGalleryProps {
  pins: WallPin[];
}

function formatRelativeTime(stamp: number): string {
  if (!stamp) return "Recently";
  const diff = Date.now() - stamp;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return new Date(stamp).toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function WallGallery({ pins }: WallGalleryProps) {
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});

  const handleLike = (id: string, initialLikes: number) => {
    setUserLiked((prev) => {
      const currentlyLiked = prev[id];
      const newStatus = !currentlyLiked;

      setLikes((currentLikes) => {
        const count = currentLikes[id] ?? initialLikes;
        return {
          ...currentLikes,
          [id]: count + (newStatus ? 1 : -1),
        };
      });

      return { ...prev, [id]: newStatus };
    });
  };

  // Divide into 3 columns for stable masonry layout
  const col1: WallPin[] = [];
  const col2: WallPin[] = [];
  const col3: WallPin[] = [];

  pins.forEach((pin, i) => {
    if (i % 3 === 0) col1.push(pin);
    else if (i % 3 === 1) col2.push(pin);
    else col3.push(pin);
  });

  const renderCard = (pin: WallPin) => {
    const currentLikes = likes[pin.id] ?? pin.likes;
    const isLiked = Boolean(userLiked[pin.id]);

    return (
      <article
        key={pin.id}
        className={`wall-pin-card ${pin.drawing ? "is-sketch" : "is-memo"}`}
        style={{
          ["--pin-rotation" as string]: `${pin.rotation}deg`,
        }}
      >
        {/* Scotch Tape Accent */}
        <div className="wall-pin-tape" aria-hidden="true" />

        {/* Card Header: Author Profile */}
        <div className="wall-pin-header">
          <div className="wall-pin-author-badge">
            {pin.avatar ? (
              <img
                src={pin.avatar}
                alt=""
                className="wall-pin-avatar"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="wall-pin-avatar-fallback">
                {pin.name.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="wall-pin-author-info">
              <span className="wall-pin-name">{pin.name}</span>
              <span className="wall-pin-role">{pin.role}</span>
            </div>
          </div>

          <span className="wall-pin-date">{formatRelativeTime(pin.createdAt)}</span>
        </div>

        {/* Polaroid Drawing Frame if sketch */}
        {pin.drawing && (
          <div className="wall-pin-drawing-wrap">
            <img
              src={pin.drawing}
              alt={`Whiteboard sketch by ${pin.name}`}
              className="wall-pin-drawing-img"
              loading="lazy"
            />
          </div>
        )}

        {/* Note / Caption Content */}
        {pin.text && (
          <p className="wall-pin-text">{pin.text}</p>
        )}

        {/* Card Footer: Tag & Interactive Reaction */}
        <div className="wall-pin-footer">
          <span className="wall-pin-tag">#{pin.tag}</span>

          <button
            type="button"
            className={`wall-pin-like-btn ${isLiked ? "is-liked" : ""}`}
            onClick={() => handleLike(pin.id, pin.likes)}
            aria-label={`Like this pin, currently ${currentLikes} likes`}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill={isLiked ? "#00ef4e" : "none"}
              stroke={isLiked ? "#00ef4e" : "currentColor"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>{currentLikes}</span>
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className="wall-masonry-gallery">
      <div className="wall-masonry-col">{col1.map(renderCard)}</div>
      <div className="wall-masonry-col">{col2.map(renderCard)}</div>
      <div className="wall-masonry-col">{col3.map(renderCard)}</div>
    </div>
  );
}

