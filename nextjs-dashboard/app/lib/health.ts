export async function getHealthStatus() {
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!apiBaseUrl) {
    return false;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/health`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
