import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";

import {
  AvatarPlaceholderIcon,
  DiscordIcon,
  GithubIcon,
  LinkedInIcon,
  RedditIcon,
  TwitterIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { isContributor } from "@/utils/contributor";
import { PersonalInfoSkeleton } from "@/components/ui/skeleton";

interface PersonalInfoProps {
  refreshTrigger?: number;
}

export function PersonalInfo({ refreshTrigger }: PersonalInfoProps) {
  const { portfolioData, isLoading } = usePortfolioData(refreshTrigger);

  if (isLoading || !portfolioData) {
    return <PersonalInfoSkeleton />;
  }

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
          <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
            {portfolioData.avatar && portfolioData.avatar.trim() !== "" ? (
              <img
                alt={`${portfolioData.name || "User"} avatar`}
                className="w-full h-full object-cover rounded-full bg-white"
                src={portfolioData.avatar}
              />
            ) : (
              <AvatarPlaceholderIcon
                aria-label={`${portfolioData.name || "User"} avatar`}
                className="w-10 h-10 text-zinc-400"
                role="img"
              />
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">{portfolioData.name}</h1>
            <p className="text-default-500">{portfolioData.title}</p>
            <div className="flex gap-2 mt-2">
              <Chip
                className="transition-all duration-200 hover:scale-105 hover:shadow-md cursor-default"
                color="primary"
                size="sm"
              >
                {portfolioData.location}
              </Chip>
              <Chip
                className="transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer"
                color="secondary"
                size="sm"
                onClick={() =>
                  (window.location.href = `mailto:${portfolioData.email}`)
                }
              >
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

        <div className="flex flex-wrap gap-3">
          {portfolioData.social.github && (
            <Link
              isExternal
              className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-200 hover:shadow-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              href={`https://github.com/${portfolioData.social.github}`}
            >
              <GithubIcon
                className="group-hover:scale-110 transition-transform duration-200 text-gray-700 dark:text-gray-300"
                size={20}
              />

              <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                GitHub
              </span>
            </Link>
          )}
          {portfolioData.social.twitter && (
            <Link
              isExternal
              className={`group flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md ${
                portfolioData.social.twitterPlatform === "x"
                  ? "border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  : "border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-300"
              }`}
              href={`https://${portfolioData.social.twitterPlatform === "x" ? "x.com" : "twitter.com"}/${portfolioData.social.twitter}`}
            >
              {portfolioData.social.twitterPlatform === "x" ? (
                <XIcon
                  className="group-hover:scale-110 transition-transform duration-200"
                  size={20}
                />
              ) : (
                <TwitterIcon
                  className="group-hover:scale-110 transition-transform duration-200"
                  size={20}
                />
              )}

              <span className="font-medium text-sm">
                {portfolioData.social.twitterPlatform === "x" ? "X" : "Twitter"}
              </span>
            </Link>
          )}
          {portfolioData.social.linkedin && (
            <Link
              isExternal
              className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800 hover:border-blue-600 dark:hover:border-blue-400 transition-all duration-200 hover:shadow-md bg-blue-600/10 dark:bg-blue-900/20 hover:bg-blue-600/20 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-300"
              href={`https://linkedin.com/in/${portfolioData.social.linkedin}`}
            >
              <LinkedInIcon
                className="group-hover:scale-110 transition-transform duration-200"
                size={20}
              />

              <span className="font-medium text-sm">LinkedIn</span>
            </Link>
          )}
          {portfolioData.social.discord && (
            <Link
              isExternal
              className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-200 hover:shadow-md bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-800/30 text-indigo-700 dark:text-indigo-300"
              href={`https://discord.com/users/${portfolioData.social.discord}`}
            >
              <DiscordIcon
                className="group-hover:scale-110 transition-transform duration-200"
                size={20}
              />

              <span className="font-medium text-sm">Discord</span>
            </Link>
          )}
          {portfolioData.social.reddit && (
            <Link
              isExternal
              className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-200 hover:shadow-md bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-800/30 text-orange-700 dark:text-orange-300"
              href={`https://reddit.com/user/${portfolioData.social.reddit}`}
            >
              <RedditIcon
                className="group-hover:scale-110 transition-transform duration-200"
                size={20}
              />

              <span className="font-medium text-sm">Reddit</span>
            </Link>
          )}
          {portfolioData.social.youtube && (
            <Link
              isExternal
              className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-500 transition-all duration-200 hover:shadow-md bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-800/30 text-red-700 dark:text-red-300"
              href={`https://youtube.com/@${portfolioData.social.youtube}`}
            >
              <YouTubeIcon
                className="group-hover:scale-110 transition-transform duration-200"
                size={20}
              />

              <span className="font-medium text-sm">YouTube</span>
            </Link>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
