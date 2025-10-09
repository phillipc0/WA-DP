import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

interface SocialLinksFormProps {
  portfolioData: any;
  onSocialChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSocialSelectChange?: (field: string, value: string) => void;
}

/**
 * Form component for managing social media profile links
 * @param props - Component props
 * @param props.portfolioData - Portfolio data containing social media information
 * @param props.onSocialChange - Function to handle social media input changes
 * @param props.onSocialSelectChange - Optional function to handle social platform selection changes
 * @returns JSX element containing social media links form
 */
export function SocialLinksForm({
  portfolioData,
  onSocialChange,
  onSocialSelectChange,
}: SocialLinksFormProps) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <h2 className="text-xl font-bold">Social Media Profiles</h2>
      </CardHeader>
      <CardBody className="gap-4">
        <Input
          label="GitHub Username"
          name="github"
          placeholder="Your GitHub username"
          startContent={
            <span className="text-default-400 whitespace-nowrap">
              github.com/
            </span>
          }
          value={portfolioData.social.github}
          onChange={onSocialChange}
        />
        <div className="flex gap-2">
          <Select
            className="w-32"
            label="Platform"
            selectedKeys={[portfolioData.social.twitterPlatform || "twitter"]}
            onSelectionChange={(keys) => {
              const selectedPlatform = Array.from(keys)[0] as string;
              onSocialSelectChange?.("twitterPlatform", selectedPlatform);
            }}
          >
            <SelectItem key="twitter">Twitter</SelectItem>
            <SelectItem key="x">X</SelectItem>
          </Select>
          <Input
            className="flex-1"
            label={`${portfolioData.social.twitterPlatform === "x" ? "X" : "Twitter"} Username`}
            name="twitter"
            placeholder={`Your ${portfolioData.social.twitterPlatform === "x" ? "X" : "Twitter"} username`}
            startContent={
              <span className="text-default-400 whitespace-nowrap">
                {portfolioData.social.twitterPlatform === "x"
                  ? "x.com/"
                  : "twitter.com/"}
              </span>
            }
            value={portfolioData.social.twitter}
            onChange={onSocialChange}
          />
        </div>
        <Input
          label="LinkedIn Username"
          name="linkedin"
          placeholder="Your LinkedIn username"
          startContent={
            <span className="text-default-400 whitespace-nowrap">
              linkedin.com/in/
            </span>
          }
          value={portfolioData.social.linkedin}
          onChange={onSocialChange}
        />
        <Input
          label="Discord User-ID"
          name="discord"
          placeholder="000000000000000000"
          startContent={
            <span className="text-default-400 whitespace-nowrap">
              discord.com/users/
            </span>
          }
          value={portfolioData.social.discord}
          onChange={onSocialChange}
        />
        <Input
          label="Reddit Username"
          name="reddit"
          placeholder="Your Reddit username"
          startContent={
            <span className="text-default-400 whitespace-nowrap">
              reddit.com/user/
            </span>
          }
          value={portfolioData.social.reddit}
          onChange={onSocialChange}
        />
        <Input
          label="YouTube Username"
          name="youtube"
          placeholder="Your YouTube username"
          startContent={
            <span className="text-default-400 whitespace-nowrap">
              youtube.com/@
            </span>
          }
          value={portfolioData.social.youtube}
          onChange={onSocialChange}
        />
        <Input
          label="Steam ID"
          name="steam"
          placeholder="76561197984767093"
          startContent={
            <span className="text-default-400 whitespace-nowrap">
              steamcommunity.com/profiles/
            </span>
          }
          value={portfolioData.social.steam}
          onChange={onSocialChange}
        />
      </CardBody>
    </Card>
  );
}
