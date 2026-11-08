"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Activity } from "lucide-react";
import { siteConfig } from "@/data/site";

interface RepoItem {
  id?: number;
  name: string;
  url: string;
  language: string | null;
  description: string | null;
  updatedAt: string;
}

interface UserProfile {
  username: string;
  login: string;
  profileUrl: string;
  publicRepos: number;
  followers: number;
}

interface LanguageDistribution {
  name: string;
  percent: number;
  color: string;
}

interface MetricsResponse {
  success: boolean;
  github?: UserProfile & {
    available: boolean;
    recentRepos: RepoItem[];
    languageDistribution: LanguageDistribution[];
    latestEvent: { createdAt: string } | null;
  };
}

export default function DevMetrics() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [languages, setLanguages] = useState<LanguageDistribution[]>([]);
  const [daysSincePush, setDaysSincePush] = useState<number | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchLiveMetrics() {
      try {
        const res = await fetch("/api/dev-metrics", { cache: "no-store" });
        if (!res.ok) throw new Error(`Metrics request failed: ${res.status}`);
        const data: MetricsResponse = await res.json();

        if (!isMounted) return;
        if (data.success && data.github?.available) {
          setProfile({
            username: data.github.username,
            login: data.github.username,
            profileUrl: data.github.profileUrl,
            publicRepos: data.github.publicRepos,
            followers: data.github.followers,
          });
          setRepos(data.github.recentRepos || []);
          setLanguages(data.github.languageDistribution || []);
          setIsLive(true);
          if (data.github.latestEvent?.createdAt) {
            const diffMs = Date.now() - new Date(data.github.latestEvent.createdAt).getTime();
            setDaysSincePush(Math.max(0, Math.round(diffMs / 86400000)));
          } else {
            setDaysSincePush(null);
          }
        } else {
          setProfile(null);
          setRepos([]);
          setLanguages([]);
          setDaysSincePush(null);
          setIsLive(false);
        }
      } catch (err) {
        console.warn("GitHub fetch fallback:", err);
        if (isMounted) {
          setProfile(null);
          setRepos([]);
          setLanguages([]);
          setDaysSincePush(null);
          setIsLive(false);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchLiveMetrics();
    const interval = setInterval(fetchLiveMetrics, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="rounded-xl border border-[#f0ece4]/[0.06] bg-[#171714] p-5 sm:p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#d4a843]" />
          <span className="text-sm font-semibold text-[#f0ece4]">GitHub</span>
          <span className="text-[11px] text-[#6a6a5e]">
            {isLive ? "live" : profile ? "cached" : "offline"}
          </span>
        </div>

        <a
           href={profile?.profileUrl || siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1 text-xs text-[#8a8a7a] transition-colors hover:text-[#f0ece4]"
        >
          <span>@{profile?.login || "ParthKhansali"}</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Stats row */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-[#f0ece4]/[0.04] bg-[#0f0f0d] p-3 text-center">
          <span className="text-[10px] text-[#6a6a5e] block">Repos</span>
          <span className="mt-1 block text-lg font-bold text-[#f0ece4] tabular-nums">
            {isLoading ? "..." : profile?.publicRepos ?? "—"}
          </span>
        </div>

        <div className="rounded-lg border border-[#f0ece4]/[0.04] bg-[#0f0f0d] p-3 text-center">
          <span className="text-[10px] text-[#6a6a5e] block">Followers</span>
          <span className="mt-1 block text-lg font-bold text-[#d4a843] tabular-nums">
            {isLoading ? "..." : profile?.followers ?? "—"}
          </span>
        </div>

        <div className="rounded-lg border border-[#f0ece4]/[0.04] bg-[#0f0f0d] p-3 text-center">
          <span className="text-[10px] text-[#6a6a5e] block">Last push</span>
          <span className="mt-1 block text-lg font-bold text-[#8fb573] tabular-nums">
            {isLoading ? "..." : daysSincePush !== null ? `${daysSincePush}d` : "—"}
          </span>
        </div>
      </div>

      {/* Languages */}
      <div className="mb-5">
        <span className="text-[11px] text-[#6a6a5e] block mb-2.5">Languages</span>
        {/* Stacked bar */}
        {languages.length > 0 ? (
          <>
            <div className="mb-2 flex h-2 w-full overflow-hidden rounded-full bg-[#0f0f0d]">
              {languages.map((lang) => (
                <div key={lang.name} className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-700" style={{ width: `${lang.percent}%`, backgroundColor: lang.color }} />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {languages.map((lang) => (
                <span key={lang.name} className="flex items-center gap-1.5 text-[11px] text-[#8a8a7a]">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: lang.color }} />
                  {lang.name} {lang.percent}%
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="text-[11px] leading-relaxed text-[#6a6a5e]">Live language data will appear when the GitHub endpoint is reachable.</p>
        )}
      </div>

      {/* Recent repos */}
      <div>
        <span className="text-[11px] text-[#6a6a5e] block mb-2">Recent</span>
        <div className="space-y-1">
          {repos.map((repo) => (
            <a
              key={repo.id || repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs text-[#b5b0a1] transition-all hover:bg-[#1e1e1a] hover:text-[#f0ece4]"
            >
              <span className="truncate font-medium">{repo.name}</span>
              <span className="text-[10px] text-[#6a6a5e] flex-shrink-0">
                {repo.language || "Code"}
              </span>
            </a>
          ))}
          {repos.length === 0 && (
            <div className="rounded-lg border border-[#f0ece4]/[0.04] bg-[#0f0f0d] px-2.5 py-2 text-[11px] leading-relaxed text-[#6a6a5e]">
              GitHub metrics are unavailable right now. The profile link above still works.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
