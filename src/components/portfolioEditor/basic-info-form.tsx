import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";

import { AvatarPlaceholderIcon } from "@/components/icons";

import { AIBioGenerator } from "./ai-bio-generator";

interface BasicInfoFormProps {
  portfolioData: any;
  onBasicInfoChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

/**
 * Form component for editing basic portfolio information
 * @param props - Component props
 * @param props.portfolioData - Current portfolio data
 * @param props.onBasicInfoChange - Handler for basic info changes
 * @returns Basic info form component
 */
export function BasicInfoForm({
  portfolioData,
  onBasicInfoChange,
}: BasicInfoFormProps) {
  const handleBioGenerated = (bio: string) => {
    // Create a synthetic event to update the bio field
    const event = {
      target: {
        name: "bio",
        value: bio,
      },
    } as React.ChangeEvent<HTMLTextAreaElement>;

    onBasicInfoChange(event);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <h2 className="text-xl font-bold">Personal Information</h2>
      </CardHeader>
      <CardBody className="gap-4">
        <Input
          label="Name"
          name="name"
          placeholder="Your full name"
          value={portfolioData.name}
          onChange={onBasicInfoChange}
        />
        <Input
          label="Professional Title"
          name="title"
          placeholder="e.g. Full Stack Developer"
          value={portfolioData.title}
          onChange={onBasicInfoChange}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="bio">
            Bio
          </label>
          <div className="flex gap-2">
            <textarea
              className="w-full min-h-[80px] px-3 py-2 rounded-md border border-default-200 bg-default-100 focus:outline-none focus:ring-2 focus:ring-primary"
              id="bio"
              name="bio"
              placeholder="Write a short bio about yourself"
              value={portfolioData.bio}
              onChange={onBasicInfoChange}
            />
            <AIBioGenerator
              name={portfolioData.name}
              skills={portfolioData.skills || []}
              title={portfolioData.title}
              onBioGenerated={handleBioGenerated}
            />
          </div>
        </div>
        <Input
          label="Location"
          name="location"
          placeholder="e.g. New York, USA"
          value={portfolioData.location}
          onChange={onBasicInfoChange}
        />
        <Input
          label="Email"
          name="email"
          placeholder="your.email@example.com"
          type="email"
          value={portfolioData.email}
          onChange={onBasicInfoChange}
        />
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Profile Picture</span>
          </div>

          <div className="flex gap-4 items-start">
            {portfolioData.avatar && portfolioData.avatar.trim() !== "" ? (
              <img
                alt={`${portfolioData.name || "User"} profile preview`}
                className="w-20 h-20 rounded-full bg-zinc-800 object-cover"
                src={portfolioData.avatar}
              />
            ) : (
              <div
                aria-label={`${portfolioData.name || "User"} profile preview`}
                className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400"
                role="img"
              >
                <AvatarPlaceholderIcon className="w-10 h-10" />
              </div>
            )}

            <Input
              className="flex-1"
              description="Enter a URL to your profile image"
              label="Avatar URL"
              name="avatar"
              placeholder="URL to your profile picture"
              value={portfolioData.avatar}
              onChange={onBasicInfoChange}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
