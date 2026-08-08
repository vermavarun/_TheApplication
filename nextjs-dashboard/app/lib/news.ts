export type NewsItem = {
  id: number;
  title: string;
  description: string;
};

export async function getNews(): Promise<{
  news: NewsItem[] | null;
  newsUrl: string | null;
}> {
  const apiBaseUrl = process.env.API_BASE_URL;
  const newsUrl = apiBaseUrl ? `${apiBaseUrl}/news` : null;

  if (!newsUrl) {
    return { news: null, newsUrl: null };
  }

  try {
    const response = await fetch(newsUrl, { cache: "no-store" });

    if (!response.ok) {
      return { news: null, newsUrl };
    }

    const news: NewsItem[] = await response.json();
    return { news, newsUrl };
  } catch {
    return { news: null, newsUrl };
  }
}
