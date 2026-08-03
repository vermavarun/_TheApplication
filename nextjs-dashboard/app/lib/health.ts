export async function getHealthStatus() {
  const apiBaseUrl = process.env.API_BASE_URL;
  const healthUrl = apiBaseUrl ? `${apiBaseUrl}/health` : null;

  if (!healthUrl) {
    return {
      healthy: false,
      healthUrl: null,
    };
  }

  try {
    const response = await fetch(healthUrl, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        healthy: false,
        healthUrl,
      };
    }

    return {
      healthy: true,
      healthUrl,
    };
  } catch {
    return {
      healthy: false,
      healthUrl,
    };
  }
}
