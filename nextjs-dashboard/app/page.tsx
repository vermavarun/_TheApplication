import { getHealthStatus } from "./lib/health";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const isHealthy = await getHealthStatus();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-6 py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-3xl font-semibold text-black dark:text-white">Dashboard</h1>
        <div className="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
          <span
            className={`h-3 w-3 rounded-full ${isHealthy ? "bg-green-500" : "bg-gray-400"}`}
          />
          <span>{isHealthy ? "Healthy" : "Unavailable"}</span>
        </div>
      </main>
    </div>
  );
}
