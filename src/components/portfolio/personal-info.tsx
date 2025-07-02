import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";

import {
  GithubIcon,
  TwitterIcon,
  LinkedInIcon,
  DiscordIcon,
  RedditIcon,
} from "@/components/icons";
import { usePortfolioData } from "@/hooks/usePortfolioData";

interface PersonalInfoProps {
  refreshTrigger?: number;
}

export function PersonalInfo({ refreshTrigger }: PersonalInfoProps) {
  const { portfolioData } = usePortfolioData(refreshTrigger);

  // Helper function to check if the current GitHub user is a contributor
  const isContributor = () => {
    const contributorUsers = ["phillipc0", "RBN-Apps", "FreakMediaLP"];
    return contributorUsers.includes(portfolioData.social.github);
  };

  return (
    <Card
      className="w-full relative"
      style={
        isContributor()
          ? {
              boxShadow: "0 0 15px 5px rgba(245, 158, 11, 1)",
              borderColor: "#F59E0B",
            }
          : {}
      }
    >
      {isContributor() && (
        <div className="absolute top-3 right-3 z-10">
          <Tooltip
            color="warning"
            content="This user is a contributor to the WA-DP GitHub Project"
          >
            <Button
              className="text-xs font-bold text-yellow-500"
              size="sm"
              style={{ borderColor: "#F59E0B" }}
              variant="bordered"
            >
              Contributor
            </Button>
          </Tooltip>
        </div>
      )}
      <CardHeader className="flex gap-3">
        <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800">
          <img
            alt={`${portfolioData.name || "User"} avatar`}
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
