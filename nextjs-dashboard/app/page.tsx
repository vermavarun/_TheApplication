import { getHealthStatus } from "./lib/health";
import { getNews } from "./lib/news";
import type { NewsItem } from "./lib/news";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { healthy, healthUrl } = await getHealthStatus();
  const { news } = await getNews();
  const dbHealthy = news !== null;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8 lg:px-10 lg:py-10">
      {/* Dotnet APIs */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Dotnet APIs</p>
        <div className="mt-3 flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${healthy ? "bg-emerald-500" : "bg-red-500"}`} />
          <span className="text-sm font-semibold text-zinc-900 dark:text-white">
            {healthy ? "Healthy" : "Unhealthy"}
          </span>
        </div>
        {healthUrl && (
          <p className="mt-2 break-all font-mono text-xs text-zinc-500 dark:text-zinc-400">{healthUrl}</p>
        )}
      </section>

      {/* SQL Server */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">SQL Server</p>
        <div className="mt-3 flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${dbHealthy ? "bg-emerald-500" : "bg-red-500"}`} />
          <span className="text-sm font-semibold text-zinc-900 dark:text-white">
            {dbHealthy ? "Healthy" : "Unhealthy"}
          </span>
        </div>
        {dbHealthy && news && (
          <ul className="mt-4 flex flex-col gap-2">
            {news.map((item: NewsItem) => (
              <li
                key={item.id}
                className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{item.title}</p>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{item.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
