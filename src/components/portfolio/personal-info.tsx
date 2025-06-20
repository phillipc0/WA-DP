import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import { useEffect, useState } from "react";

import {
  GithubIcon,
  TwitterIcon,
  LinkedInIcon,
  DiscordIcon,
  RedditIcon,
} from "@/components/icons";
import { siteConfig } from "@/config/site";

export function PersonalInfo() {
  const [portfolioData, setPortfolioData] = useState(siteConfig.portfolio);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("portfolioData");

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);

        setPortfolioData(parsedData);
      } catch (error) {
        console.error("Error parsing portfolio data from localStorage:", error);
      }
    }
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800">
          <img
            alt={portfolioData.name}
            className="w-full h-full object-cover rounded-full"
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
          {portfolioData.social.github && (
            <Link
              isExternal
              className="flex items-center gap-1"
              href={`https://github.com/${portfolioData.social.github}`}
            >
              <GithubIcon size={20} />
              GitHub
            </Link>
          )}
          {portfolioData.social.twitter && (
            <Link
              isExternal
              className="flex items-center gap-1"
              href={`https://twitter.com/${portfolioData.social.twitter}`}
            >
              <TwitterIcon size={20} />
              Twitter
            </Link>
          )}
          {portfolioData.social.linkedin && (
            <Link
              isExternal
              className="flex items-center gap-1"
              href={`https://linkedin.com/in/${portfolioData.social.linkedin}`}
            >
              <LinkedInIcon size={20} />
              LinkedIn
            </Link>
          )}
          {portfolioData.social.discord && (
            <Link
              isExternal
              className="flex items-center gap-1"
              href={`https://discord.com/users/${portfolioData.social.discord}`}
            >
              <DiscordIcon size={20} />
              Discord
            </Link>
          )}
          {portfolioData.social.reddit && (
            <Link
              isExternal
              className="flex items-center gap-1"
              href={`https://reddit.com/user/${portfolioData.social.reddit}`}
            >
              <RedditIcon size={20} />
              Reddit
            </Link>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
