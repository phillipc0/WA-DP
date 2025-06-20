import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import { useEffect, useState } from "react";

import { GithubIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { getPortfolioData, PortfolioData } from "@/lib/portfolio";
import { loadDraftFromCookies } from "@/lib/cookie-persistence";
import { isAuthenticated } from "@/lib/auth";

export function PersonalInfo() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(
    siteConfig.portfolio,
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        // Only check for draft data if user is authenticated
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
      }
    };

    loadData();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800">
          <img
            alt={portfolioData.name}
            className="w-full h-full object-cover"
            src={portfolioData.avatar}
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{portfolioData.name}</h1>
          <p className="text-default-500">{portfolioData.title}</p>
          <div className="flex gap-2 mt-2">
            <Chip color="primary" size="sm">
              {portfolioData.location}
            </Chip>
            <Chip color="secondary" size="sm">
              {portfolioData.email}
            </Chip>
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="mb-4">{portfolioData.bio}</p>
        <div className="flex gap-3">
          <Link
            isExternal
            className="flex items-center gap-1"
            href={`https://github.com/${portfolioData.social.github}`}
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
          <Link
            isExternal
            href={`https://twitter.com/${portfolioData.social.twitter}`}
          >
            Twitter
          </Link>
          <Link
            isExternal
            href={`https://linkedin.com/in/${portfolioData.social.linkedin}`}
          >
            LinkedIn
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
