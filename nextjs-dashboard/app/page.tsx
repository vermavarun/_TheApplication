import { getHealthStatus } from "./lib/health";
import { getNews } from "./lib/news";
import { LiveStatusDashboard } from "./components/live-status-dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { healthy, healthUrl } = await getHealthStatus();
  const { news } = await getNews();
  const initialNews = news ?? [];
  const sseUrl = "/api/status/stream";

  return (
    <LiveStatusDashboard
      initialHealthy={healthy}
      initialNews={initialNews}
      healthUrl={healthUrl}
      sseUrl={sseUrl}
    />
  );
}
