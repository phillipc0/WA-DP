import { authenticatedFetch } from "./auth";

export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  avatar: string;
  social: {
    github: string;
    twitter: string;
    linkedin: string;
    discord?: string;
    reddit?: string;
  };
  skills: Array<{
    name: string;
    level: number;
  }>;
}

let portfolioDataCache: PortfolioData | null = null;
let cacheTimestamp: number | null = null;
let pendingRequest: Promise<PortfolioData | null> | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getPortfolioData = async (): Promise<PortfolioData | null> => {
  if (pendingRequest) {
    return pendingRequest;
  }

  if (
    portfolioDataCache &&
    cacheTimestamp &&
    Date.now() - cacheTimestamp < CACHE_DURATION
  ) {
    return portfolioDataCache;
  }

  pendingRequest = (async () => {
    try {
      const response = await fetch("/api/portfolio", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        portfolioDataCache = data;
        cacheTimestamp = Date.now();
        return data;
      } else {
        console.error("Failed to fetch portfolio data:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
      return null;
    } finally {
      pendingRequest = null;
    }
  })();

  return pendingRequest;
};

export const clearPortfolioDataCache = () => {
  portfolioDataCache = null;
  cacheTimestamp = null;
  pendingRequest = null;
};

export const savePortfolioData = async (
  data: PortfolioData,
): Promise<boolean> => {
  try {
    const response = await authenticatedFetch("/api/portfolio", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      clearPortfolioDataCache();
      return true;
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      console.error("Failed to save portfolio data:", errorData.error);
      return false;
    }
  } catch (error) {
    console.error("Error saving portfolio data:", error);
    return false;
  }
};

export const migratePortfolioData = async (): Promise<void> => {
  const localData = localStorage.getItem("portfolioData");

  if (!localData) {
    return;
  }

  try {
    const portfolioData = JSON.parse(localData) as PortfolioData;

    const success = await savePortfolioData(portfolioData);

    if (success) {
      localStorage.removeItem("portfolioData");
    }
  } catch (error) {
    console.error("Failed to migrate portfolio data:", error);
  }
};
