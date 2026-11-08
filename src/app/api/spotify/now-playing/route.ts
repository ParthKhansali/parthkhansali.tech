import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface TrackResponse {
  success: boolean;
  configured: boolean;
  service: "spotify" | "ytmusic" | "demo";
  isPlaying: boolean;
  label: string;
  trackName: string;
  artistName: string;
  albumName: string;
  albumImage: string;
  url: string;
  playedAt?: string;
  progressMs?: number;
  durationMs?: number;
}

// 1. Refresh Spotify Access Token
async function getSpotifyAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;

  try {
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn("Spotify token refresh failed:", res.statusText);
      return null;
    }

    const data = await res.json();
    return data.access_token || null;
  } catch (err) {
    console.error("Spotify token error:", err);
    return null;
  }
}

// 2. Fetch Spotify Currently Playing or Recently Played
async function getSpotifyTrack(accessToken: string): Promise<TrackResponse | null> {
  try {
    // Check currently playing
    const curRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (curRes.status === 200) {
      const data = await curRes.json();
      if (data && data.item) {
        return {
          success: true,
          configured: true,
          service: "spotify",
          isPlaying: Boolean(data.is_playing),
          label: data.is_playing ? "NOW PLAYING" : "PAUSED",
          trackName: data.item.name,
          artistName: (data.item.artists || []).map((a: { name: string }) => a.name).join(", "),
          albumName: data.item.album?.name || "",
          albumImage: data.item.album?.images?.[0]?.url || data.item.album?.images?.[1]?.url || "",
          url: data.item.external_urls?.spotify || "https://open.spotify.com",
          progressMs: data.progress_ms,
          durationMs: data.item.duration_ms,
        };
      }
    }

    // Fallback: Fetch recently played
    const recRes = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (recRes.status === 200) {
      const data = await recRes.json();
      const item = data.items?.[0];
      if (item && item.track) {
        return {
          success: true,
          configured: true,
          service: "spotify",
          isPlaying: false,
          label: "LAST PLAYED",
          trackName: item.track.name,
          artistName: (item.track.artists || []).map((a: { name: string }) => a.name).join(", "),
          albumName: item.track.album?.name || "",
          albumImage: item.track.album?.images?.[0]?.url || item.track.album?.images?.[1]?.url || "",
          url: item.track.external_urls?.spotify || "https://open.spotify.com",
          playedAt: item.played_at,
          durationMs: item.track.duration_ms,
        };
      }
    }
  } catch (err) {
    console.error("Spotify player fetch error:", err);
  }
  return null;
}

// 3. Fetch YouTube Music from an optional private bridge.
// The bridge lets a desktop/mobile helper expose the current YT Music track
// without pretending that the public YouTube Data API is a playback API.
async function getYouTubeMusicBridgeTrack(): Promise<TrackResponse | null> {
  const bridgeUrl = process.env.YTMUSIC_BRIDGE_URL;
  if (!bridgeUrl) return null;

  try {
    const headers: HeadersInit = { Accept: "application/json" };
    if (process.env.YTMUSIC_BRIDGE_TOKEN) {
      headers.Authorization = `Bearer ${process.env.YTMUSIC_BRIDGE_TOKEN}`;
    }

    const res = await fetch(bridgeUrl, { headers, cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    const track = data?.track || data;
    if (!track?.trackName || !track?.artistName) return null;

    return {
      success: true,
      configured: true,
      service: "ytmusic",
      isPlaying: Boolean(track.isPlaying),
      label: track.isPlaying ? "NOW PLAYING · YOUTUBE MUSIC" : "LAST PLAYED · YOUTUBE MUSIC",
      trackName: String(track.trackName),
      artistName: String(track.artistName),
      albumName: String(track.albumName || ""),
      albumImage: String(track.albumImage || ""),
      url: String(track.url || "https://music.youtube.com"),
      playedAt: track.playedAt ? String(track.playedAt) : undefined,
      durationMs: typeof track.durationMs === "number" ? track.durationMs : undefined,
    };
  } catch (err) {
    console.warn("YouTube Music bridge fetch failed:", err);
    return null;
  }
}

// 4. Fetch YouTube Music via Last.fm Scrobbler API
async function getLastFmTrack(): Promise<TrackResponse | null> {
  const username = process.env.LASTFM_USERNAME;
  const apiKey = process.env.LASTFM_API_KEY;

  if (!username || !apiKey) return null;

  try {
    const res = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(
        username
      )}&api_key=${apiKey}&format=json&limit=1`,
      { cache: "no-store" }
    );

    if (res.ok) {
      const data = await res.json();
      const track = data?.recenttracks?.track?.[0];
      if (track) {
        const isNowPlaying = track["@attr"]?.nowplaying === "true";
        const images = track.image || [];
        const albumImage =
          images.find((img: { size: string }) => img.size === "extralarge")?.["#text"] ||
          images.find((img: { size: string }) => img.size === "large")?.["#text"] ||
          "";

        return {
          success: true,
          configured: true,
          service: "ytmusic",
          isPlaying: isNowPlaying,
           label: isNowPlaying ? "NOW PLAYING · YOUTUBE MUSIC" : "LAST PLAYED · YOUTUBE MUSIC",
          trackName: track.name,
          artistName: typeof track.artist === "object" ? track.artist["#text"] : track.artist,
          albumName: typeof track.album === "object" ? track.album["#text"] : track.album,
          albumImage,
          url: track.url || `https://music.youtube.com/search?q=${encodeURIComponent(track.name)}`,
          playedAt: track.date?.uts ? new Date(parseInt(track.date.uts, 10) * 1000).toISOString() : undefined,
        };
      }
    }
  } catch (err) {
    console.error("Last.fm fetch error:", err);
  }
  return null;
}

export async function GET() {
  // Option 1: Prefer YouTube Music because it is Parth's primary player.
  const bridgeData = await getYouTubeMusicBridgeTrack();
  if (bridgeData) {
    return NextResponse.json(bridgeData);
  }

  const lastFmData = await getLastFmTrack();
  if (lastFmData) {
    return NextResponse.json(lastFmData);
  }

  // Option 2: Spotify remains a useful fallback.
  const spotifyToken = await getSpotifyAccessToken();
  if (spotifyToken) {
    const spotifyData = await getSpotifyTrack(spotifyToken);
    if (spotifyData) {
      return NextResponse.json(spotifyData);
    }
  }

  // Option 3: Honest setup state; never show a fake track as if it were live.
  return NextResponse.json({
    success: true,
    configured: false,
    service: "demo",
    isPlaying: false,
    label: "SETUP REQUIRED",
    trackName: "Connect YouTube Music",
    artistName: "Last.fm scrobbling or a private bridge",
    albumName: "Live music desk",
    albumImage: "/icon.png",
    url: "https://music.youtube.com",
  });
}
