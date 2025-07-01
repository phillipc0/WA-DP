import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";

interface SocialLinksFormProps {
  portfolioData: any;
  onSocialChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SocialLinksForm({
  portfolioData,
  onSocialChange,
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
        <Input
          label="Twitter Username"
          name="twitter"
          placeholder="Your Twitter username"
          startContent={
            <span className="text-default-400 whitespace-nowrap">
              twitter.com/
            </span>
          }
          value={portfolioData.social.twitter}
          onChange={onSocialChange}
        />
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
          label="Discord Username"
          name="discord"
          placeholder="Your Discord username"
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
      </CardBody>
    </Card>
  );
}
