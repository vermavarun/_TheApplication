"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type NewsItem = {
  id: number;
  title: string;
  description: string;
};

type SseConnectionState = "connecting" | "connected" | "reconnecting" | "disconnected";

type RawNewsItem = {
  id?: number;
  Id?: number;
  title?: string;
  Title?: string;
  description?: string;
  Description?: string;
};

function normalizeNews(items: unknown): NewsItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item, index) => {
    const raw = (item ?? {}) as RawNewsItem;

    return {
      id: raw.id ?? raw.Id ?? index,
      title: raw.title ?? raw.Title ?? "",
      description: raw.description ?? raw.Description ?? "",
    };
  });
}

type LiveStatusDashboardProps = {
  initialHealthy: boolean;
  initialNews: NewsItem[];
  healthUrl: string | null;
  sseUrl: string;
};

export function LiveStatusDashboard({
  initialHealthy,
  initialNews,
  healthUrl,
  sseUrl,
}: LiveStatusDashboardProps) {
  const [healthy, setHealthy] = useState(initialHealthy);
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [dbHealthy, setDbHealthy] = useState(initialNews.length > 0);
  const [connectionState, setConnectionState] = useState<SseConnectionState>("connecting");
  const lastEventAtRef = useRef<number>(0);
  const mountedAtRef = useRef<number>(0);

  const checkApiHealth = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/health", { cache: "no-store" });
      if (!response.ok) {
        return false;
      }

      const payload: { healthy?: boolean } = await response.json();
      return Boolean(payload.healthy);
    } catch {
      return false;
    }
  }, []);

  const connectionBadgeStyles: Record<SseConnectionState, { dot: string; label: string }> = {
    connecting: { dot: "bg-amber-500", label: "Connecting" },
    connected: { dot: "bg-emerald-500", label: "Connected" },
    reconnecting: { dot: "bg-amber-500", label: "Reconnecting" },
    disconnected: { dot: "bg-red-500", label: "Disconnected" },
  };

  const connectionBadge = connectionBadgeStyles[connectionState];

  useEffect(() => {
    mountedAtRef.current = Date.now();
    let stopped = false;
    let eventSource: EventSource | null = null;
    let reconnectTimer: number | null = null;

    const clearReconnectTimer = () => {
      if (reconnectTimer !== null) {
        window.clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    const syncSnapshot = async () => {
      try {
        const [healthRes, newsRes] = await Promise.all([
          fetch("/api/health", { cache: "no-store" }),
          fetch("/api/news", { cache: "no-store" }),
        ]);

        const healthJson: { healthy?: boolean } = await healthRes.json();
        const newsJson: unknown = await newsRes.json();

        lastEventAtRef.current = Date.now();
        setHealthy(Boolean(healthJson.healthy));
        setDbHealthy(newsRes.ok);
        setNews(normalizeNews(newsJson));
      } catch {
        // Keep existing state; the stale watchdog handles prolonged outages.
      }
    };

    const connect = () => {
      if (stopped) {
        return;
      }

      eventSource = new EventSource(sseUrl);

      eventSource.onopen = () => {
        setConnectionState("connected");
        void syncSnapshot();
      };

      eventSource.onmessage = (event) => {
        try {
          const payload: {
            healthy?: boolean;
            dbHealthy?: boolean;
            news?: unknown;
          } = JSON.parse(event.data);

          setConnectionState("connected");
          lastEventAtRef.current = Date.now();
          setHealthy(Boolean(payload.healthy));
          setDbHealthy(Boolean(payload.dbHealthy));
          setNews(normalizeNews(payload.news));
        } catch {
          // Ignore malformed event payloads and preserve the last known state.
        }
      };

      eventSource.onerror = () => {
        setConnectionState("reconnecting");
        eventSource?.close();

        clearReconnectTimer();
        reconnectTimer = window.setTimeout(() => {
          connect();
        }, 1500);
      };
    };

    connect();

    return () => {
      stopped = true;
      clearReconnectTimer();
      eventSource?.close();
      setConnectionState("disconnected");
    };
  }, [sseUrl]);

  useEffect(() => {
    const staleAfterMs = 9000;
    const timer = window.setInterval(() => {
      const lastSeenAt = lastEventAtRef.current || mountedAtRef.current;
      const stale = Date.now() - lastSeenAt > staleAfterMs;

      if (stale) {
        setDbHealthy(false);
        void (async () => {
          const apiHealthy = await checkApiHealth();

          setHealthy(apiHealthy);
          if (apiHealthy) {
            // Prevent repeated fallback checks while stream is reconnecting.
            lastEventAtRef.current = Date.now();
          }
        })();
      }
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [checkApiHealth]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8 lg:px-10 lg:py-10">
      {/* Dotnet APIs */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Dotnet APIs</p>
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
            <span className={`h-2 w-2 rounded-full ${connectionBadge.dot}`} />
            <span>{connectionBadge.label}</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${healthy ? "bg-emerald-500" : "bg-red-500"}`} />
          <span className="text-sm font-semibold text-zinc-900 dark:text-white">
            {healthy ? "Healthy" : "Unhealthy"}
          </span>
        </div>
        {healthUrl && (
          <p className="mt-2 break-all font-mono text-xs text-zinc-500 dark:text-zinc-400">{healthUrl}</p>
        )}

        {/* SQL Server child */}
        <div className="mt-5 rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">SQL Server</p>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
              <span className={`h-2 w-2 rounded-full ${dbHealthy ? "bg-emerald-500" : "bg-red-500"}`} />
              <span>{dbHealthy ? "Connected" : "Disconnected"}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${dbHealthy ? "bg-emerald-500" : "bg-red-500"}`} />
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
              {dbHealthy ? "Healthy" : "Unhealthy"}
            </span>
          </div>

          {dbHealthy && news.length > 0 && (
            <ul className="mt-4 flex flex-col gap-2">
              {news.map((item) => (
                <li
                  key={item.id}
                  className="rounded-lg border border-zinc-100 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">{item.title}</p>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{item.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
