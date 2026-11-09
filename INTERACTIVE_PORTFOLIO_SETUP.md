# Interactive Portfolio Setup

This portfolio now treats the lounge as a small social product inside the portfolio: a study room, ambient sound desk, Pomodoro timer, visitor avatars, whiteboard, arcade shelf, and rankings.

## Public URL and launch order

The currently verified deployment is `https://www.parthkhansali.tech`.

```env
NEXT_PUBLIC_SITE_URL=https://parthkhansali-dev.vercel.app
```

If you later connect the custom domain, change the value and redeploy. The metadata, sitemap, robots file, and structured data all read from this one input.

### Link audit completed on 24 October 2026

- Portfolio deployment: `https://parthkhansali-dev.vercel.app` — responds successfully.
- Custom domain: `https://www.parthkhansali.tech` is the active canonical production domain.
- GitHub profile and confirmed repositories — reachable.
- GEHU Connect demo — responds successfully.
- ARANYA demo and repository — reachable and linked.
- ForgeFlow, ORVESS-PAT, Resume Screener, and AutoHire — kept visibly unpublished until a real public repository URL is supplied.

## What works without extra credentials

- The study-room interface and Windows/desktop-inspired shell.
- Unique visitor avatar and handle stored locally in the visitor's browser.
- Live visitor presence through the existing lounge heartbeat route.
- Chat, quick shouts, the whiteboard, game screens, score submission, and rankings in the current runtime.
- Original procedural rain and campfire ambience through Web Audio. It starts only after the visitor clicks an atmosphere control.
- A small campfire ritual in the workbench section lets visitors click the animated fire to toggle the procedural background ambience, with a separate mute control.
- Pomodoro focus and break timers.

## Inputs for live GitHub metrics

The dashboard now calls the server-side `/api/dev-metrics` route rather than calling GitHub directly from the browser. The route uses the public GitHub API and becomes more reliable when this optional environment variable is configured:

```env
GITHUB_TOKEN=github_pat_...
```

The route reads `GITHUB_USERNAME` when present and otherwise uses `ParthKhansali`.

Use a least-privilege token. Never put the token in a `NEXT_PUBLIC_*` variable.

If GitHub is unavailable, the dashboard shows an honest offline state instead of invented repository counts or fake activity.

## Inputs for YouTube Music

The official YouTube Data API supports authorized access to user data and video metadata, but it is not a public personal playback-state API. The music desk therefore supports three honest modes:

### Option A — private bridge (most accurate)

Set:

```env
YTMUSIC_BRIDGE_URL=https://your-private-bridge.example/now-playing
YTMUSIC_BRIDGE_TOKEN=optional_bearer_token
```

The bridge should return JSON in this shape:

```json
{
  "trackName": "Song title",
  "artistName": "Artist",
  "albumName": "Album",
  "albumImage": "https://...",
  "url": "https://music.youtube.com/watch?v=...",
  "isPlaying": true,
  "playedAt": "2026-10-24T12:00:00.000Z",
  "durationMs": 240000
}
```

This is the mode to use if you want **actually playing now** rather than only the last scrobble.

### Option B — Last.fm scrobbling

If YouTube Music is scrobbled to Last.fm, set:

```env
LASTFM_API_KEY=your_lastfm_api_key
LASTFM_USERNAME=your_lastfm_username
```

The music desk will show the current scrobble or last played track and label it as YouTube Music.

### Option C — Spotify fallback

Spotify remains supported as a fallback:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
```

If none of the integrations are configured, the site shows **Connect YouTube Music** instead of pretending a demo song is live.

### What you need to provide

| Feature | Required input | Where it comes from |
| --- | --- | --- |
| Correct canonical URL | `NEXT_PUBLIC_SITE_URL` | Your deployed Vercel/custom-domain URL |
| GitHub metrics | Optional `GITHUB_TOKEN` | A least-privilege GitHub fine-grained token |
| Google guestbook | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` or Firebase values | Google Cloud/Firebase project |
| YouTube Music now-playing | `YTMUSIC_BRIDGE_URL` and optional token | A private helper you control |
| YouTube Music last-played | `LASTFM_API_KEY` + `LASTFM_USERNAME` | Last.fm account and scrobbling setup |
| WakaTime panel | `WAKATIME_API_KEY` | WakaTime API settings |
| Durable lounge multiplayer | Firebase project, Auth, database, Rules/App Check | Firebase console and deployment environment |

The portfolio intentionally leaves a feature in a visible setup/offline state when its input is missing. That is preferable to inventing a song, repository count, visitor, or deployment status.

## Real multiplayer tournaments: production path

The UI is tournament-ready, but the current `/api/lounge` room state is still an in-memory prototype. That is fine for a local Node server or a single long-running instance, but it is not a durable multiplayer backend across multiple serverless instances.

For production tournaments, connect the room to a shared realtime store:

1. Firebase Realtime Database or Firestore for visitors, chat, room state, brackets, and leaderboard writes.
2. Firebase Auth or anonymous auth for stable player IDs.
3. App Check and Security Rules to reduce spam and score tampering.
4. A server-side score validation step for games where the client cannot be trusted.
5. A tournament document with `status`, `players`, `round`, `game`, `startedAt`, and `results` fields.

The current visual design intentionally keeps the social layer fun without claiming that client-submitted scores are cheat-proof.

## Audio note

The ambience is procedural and original: filtered noise for rain, low filtered noise plus short generated crackles for the fire. This avoids shipping copied Minecraft audio and keeps the portfolio lightweight.
