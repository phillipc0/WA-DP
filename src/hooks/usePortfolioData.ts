import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";
import { getPortfolioData, PortfolioData } from "@/lib/portfolio";
import { loadDraftFromCookies } from "@/lib/cookie-persistence";
import { isAuthenticated } from "@/lib/auth";

export function usePortfolioData() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(
    siteConfig.portfolio,
  );
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
  }, []);

  return { portfolioData, isLoading };
}
