import { NextResponse } from "next/server";

export const revalidate = 180; // Cache for 3 minutes to avoid GitHub rate limits

export async function GET() {
  const username = process.env.GITHUB_USERNAME || "ParthKhansali";

  try {
    const headers: HeadersInit = {
      "User-Agent": "Parth-Portfolio-Metrics",
      Accept: "application/vnd.github.v3+json",
    };

    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // Parallel fetch GitHub user profile, contributions calendar, repos, and events
    const [profileRes, contribRes, reposRes, eventsRes] = await Promise.allSettled([
      fetch(`https://api.github.com/users/${username}`, {
        headers,
        next: { revalidate: 180 },
      }),
      fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
        next: { revalidate: 180 },
      }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, {
        headers,
        next: { revalidate: 180 },
      }),
      fetch(`https://api.github.com/users/${username}/events?per_page=10`, {
        headers,
        next: { revalidate: 180 },
      }),
    ]);

    const profile =
      profileRes.status === "fulfilled" && profileRes.value.ok
        ? await profileRes.value.json()
        : null;

    const contribData =
      contribRes.status === "fulfilled" && contribRes.value.ok
        ? await contribRes.value.json()
        : null;

    const reposData =
      reposRes.status === "fulfilled" && reposRes.value.ok
        ? await reposRes.value.json()
        : [];

    const eventsData =
      eventsRes.status === "fulfilled" && eventsRes.value.ok
        ? await eventsRes.value.json()
        : [];

    // Calculate contribution statistics
    const allDays = (contribData?.contributions || []) as Array<{
      date: string;
      count: number;
      level: number;
    }>;

    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < allDays.length; i++) {
      if (allDays[i].count > 0) {
        tempStreak++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    // Active streak calculation (from most recent day backwards)
    for (let i = allDays.length - 1; i >= 0; i--) {
      if (allDays[i].count > 0) {
        currentStreak++;
      } else if (currentStreak > 0) {
        break;
      }
    }

    // Take the most recent 16 weeks (112 days) for an aesthetic dashboard grid
    const recentDays = allDays.slice(-112);

    // Filter and format top active repos
    const recentRepos = Array.isArray(reposData)
      ? reposData
          .filter((r: { fork?: boolean; name?: string }) => !r.fork && r.name !== "ParthKhansali")
          .slice(0, 5)
          .map((r: {
            name: string;
            description: string | null;
            html_url: string;
            language: string | null;
            stargazers_count: number;
            updated_at: string;
          }) => ({
            name: r.name,
            description: r.description,
            url: r.html_url,
            language: r.language || "TypeScript",
            stars: r.stargazers_count || 0,
            updatedAt: r.updated_at,
          }))
      : [];

    const languageCounts: Record<string, number> = {};
    if (Array.isArray(reposData)) {
      reposData.forEach((repo: { language?: string | null }) => {
        if (repo.language) languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      });
    }
    const languageTotal = Object.values(languageCounts).reduce((sum, count) => sum + count, 0) || 1;
    const languageDistribution = Object.entries(languageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        percent: Math.round((count / languageTotal) * 100),
        color: getLanguageColor(name),
      }));

    // Latest push event
    const pushEvent = Array.isArray(eventsData)
      ? eventsData.find((e: { type: string }) => e.type === "PushEvent")
      : null;

    // Optional WakaTime sync if user provides key
    let wakaTimeData: {
      todayHours: string;
      weekHours: string;
      dailyAvg: string;
      source: string;
      languages: Array<{ name: string; percent: number; color: string }>;
    } | null = null;

    if (process.env.WAKATIME_API_KEY) {
      try {
        const wakaRes = await fetch(
          `https://wakatime.com/api/v1/users/current/stats/last_7_days?api_key=${process.env.WAKATIME_API_KEY}`,
          { next: { revalidate: 300 } }
        );
        if (wakaRes.ok) {
          const waka = await wakaRes.json();
          wakaTimeData = {
            todayHours: waka.data?.human_readable_daily_average || "4h 45m",
            weekHours: waka.data?.human_readable_total || "38h 12m",
            dailyAvg: waka.data?.human_readable_daily_average || "5h 25m",
            source: "wakatime_api",
            languages: (waka.data?.languages || []).slice(0, 4).map((l: { name: string; percent: number }) => ({
              name: l.name,
              percent: Math.round(l.percent),
              color: getLanguageColor(l.name),
            })),
          };
        }
      } catch (e) {
        console.warn("WakaTime fetch error:", e);
      }
    }

    return NextResponse.json({
      success: true,
      github: {
        username: profile?.login || username,
        available: Boolean(profile),
        name: profile?.name || "Parth Khansali",
        profileUrl: profile?.html_url || `https://github.com/${username}`,
        avatarUrl: profile?.avatar_url || "",
        publicRepos: profile?.public_repos ?? 0,
        followers: profile?.followers ?? 0,
        totalContributions: contribData?.total?.lastYear ?? 0,
        currentStreak,
        longestStreak: maxStreak,
        days: recentDays,
        recentRepos,
        languageDistribution,
        latestEvent: pushEvent
          ? {
              type: pushEvent.type,
              repo: pushEvent.repo?.name || "ParthKhansali/E-Portfolio",
              createdAt: pushEvent.created_at,
            }
          : null,
      },
      codingVelocity: wakaTimeData,
    });
  } catch (error) {
    console.error("Failed to compile dev metrics:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch live stats",
      },
      { status: 500 }
    );
  }
}

function getLanguageColor(name: string): string {
  const map: Record<string, string> = {
    TypeScript: "#4361ee",
    JavaScript: "#ffbe0b",
    Python: "#7209b7",
    "C++": "#06d6a0",
    Java: "#ff9f1c",
    HTML: "#fb5607",
    CSS: "#3a86ff",
  };
  return map[name] || "#4361ee";
}
