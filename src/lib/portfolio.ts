import { authenticatedFetch } from "./auth";

let pendingRequest: Promise<JSON | null> | null = null;

export const getPortfolioData = async (): Promise<JSON | null> => {
  if (pendingRequest) {
    return pendingRequest;
  }

  pendingRequest = (async () => {
    try {
      const response = await fetch("/portfolio.json", {
        method: "GET",
      });

      const content = await response.text();
      if (content?.toLowerCase().startsWith("<!doctype html>")) {
        return null; // Case: No portfolio.json available, browser supplies index.html
      }
      if (response.ok) {
        return await JSON.parse(content);
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
