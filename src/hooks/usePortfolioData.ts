import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";
import { getPortfolioData } from "@/lib/portfolio";
import { loadDraftFromCookies } from "@/lib/cookie-persistence";
import { isAuthenticated } from "@/lib/auth";

export function usePortfolioData(refreshTrigger?: number) {
  const [portfolioData, setPortfolioData] = useState<any>(siteConfig.portfolio);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        if (isAuthenticated()) {
          const draftData = loadDraftFromCookies();
          if (draftData) {
            setPortfolioData(draftData);
            return;
          }
        }

        const data = await getPortfolioData();
        if (data) {
          setPortfolioData(data);
        }
      } catch (error) {
        console.error("Error loading portfolio data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [refreshTrigger]);

  return { portfolioData, isLoading };
}
