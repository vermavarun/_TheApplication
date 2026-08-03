import { getHealthStatus } from "./lib/health";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { healthy, healthUrl } = await getHealthStatus();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-10 lg:py-10">
        <header className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                Application dashboard
              </p>
              <h1 className="text-3xl font-semibold text-zinc-950 dark:text-white">
                System overview
              </h1>
            </div>

            <div className="flex items-center gap-3 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
              <span
                className={`h-3 w-3 rounded-full ${healthy ? "bg-emerald-500" : "bg-zinc-400"}`}
              />
              <span>{healthy ? "Healthy" : "Unavailable"}</span>
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Health check target
                </p>
                <h2 className="mt-1 text-lg font-semibold text-zinc-950 dark:text-white">
                  Backend service probe
                </h2>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              <p className="font-medium text-zinc-500 dark:text-zinc-400">URL being hit</p>
              <p className="mt-2 break-all font-mono text-sm text-zinc-900 dark:text-white">
                {healthUrl ?? "API_BASE_URL is not configured"}
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Service status
            </p>
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
              <span
                className={`h-3 w-3 rounded-full ${healthy ? "bg-emerald-500" : "bg-zinc-400"}`}
              />
              <span className="text-base font-semibold text-zinc-900 dark:text-white">
                {healthy ? "Backend is responding" : "Backend is not reachable"}
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-zinc-200 p-4 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
              This page checks the configured backend health endpoint from the Next.js server side so the call stays out of the browser.
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
