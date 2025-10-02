import { authenticatedFetch } from "./auth";

let pendingRequest: Promise<JSON | null> | null = null;

export const getPortfolioData = async (): Promise<JSON | null> => {
  if (pendingRequest) {
    return pendingRequest;
  }

  pendingRequest = (async () => {
    try {
      const portfolioUrl = `/api/portfolio?_t=${Date.now()}`;
      const response = await fetch(portfolioUrl, {
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
    } finally {
      pendingRequest = null;
    }
  })();

  return pendingRequest;
};

export const savePortfolioData = async (data: any): Promise<boolean> => {
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
