import { authenticatedFetch } from "./auth";

//TODO: remove this? (create dynamically)
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

export const getPortfolioData = async (): Promise<PortfolioData | null> => {
  try {
    const response = await fetch("/portfolio.json", {
      method: "GET",
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch portfolio data:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return null;
  }
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
