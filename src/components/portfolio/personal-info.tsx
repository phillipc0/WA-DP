import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";

import {
  GithubIcon,
  TwitterIcon,
  LinkedInIcon,
  DiscordIcon,
  RedditIcon,
} from "@/components/icons";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { isContributor } from "@/utils/contributor";

interface PersonalInfoProps {
  refreshTrigger?: number;
}

export function PersonalInfo({ refreshTrigger }: PersonalInfoProps) {
  const { portfolioData } = usePortfolioData(refreshTrigger);

  // Get contributor settings from portfolio data
  const contributorSettings = portfolioData?.contributor || {
    enableContributorStatus: false,
    showGoldenBoxShadow: false,
  };

  // Determine if contributor features should be shown
  const shouldShowContributor =
    isContributor(portfolioData.social.github) &&
    contributorSettings.enableContributorStatus;
  const shouldShowGoldenShadow =
    isContributor(portfolioData.social.github) &&
    contributorSettings.showGoldenBoxShadow;

  return (
    <Card
      className="w-full relative"
      style={
        shouldShowGoldenShadow
          ? {
              boxShadow: "0 0 15px 5px rgba(245, 165, 11, 1.5)",
            }
          : {}
      }
    >
      <CardHeader className="flex flex-col sm:flex-row sm:justify-between items-start gap-4">
        <div className="flex gap-3">
          <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800">
            <img
              alt={`${portfolioData.name || "User"} avatar`}
              className="w-full h-full object-cover rounded-full bg-white"
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
        </div>
        {shouldShowContributor && (
          <Tooltip
            closeDelay={125}
            color="warning"
            content="This user is a contributor to the WA-DP GitHub project"
            showArrow={true}
          >
            <Button
              className="text-xs font-bold text-yellow-600 dark:text-yellow-500"
              size="sm"
              style={{ borderColor: "#F59E0B" }}
              variant="ghost"
            >
              Contributor
            </Button>
          </Tooltip>
        )}
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
