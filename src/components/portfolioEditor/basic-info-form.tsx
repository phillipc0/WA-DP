import React, { useRef } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";

interface BasicInfoFormProps {
  portfolioData: any;
  useUrlForAvatar: boolean;
  isUploadedImage: boolean;
  onBasicInfoChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleAvatarMode: () => void;
}

export function BasicInfoForm({
  portfolioData,
  useUrlForAvatar,
  isUploadedImage,
  onBasicInfoChange,
  onFileSelect,
  onToggleAvatarMode,
}: BasicInfoFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          <textarea
            className="w-full min-h-[80px] px-3 py-2 rounded-md border border-default-200 bg-default-100 focus:outline-none focus:ring-2 focus:ring-primary"
            id="bio"
            name="bio"
            placeholder="Write a short bio about yourself"
            value={portfolioData.bio}
            onChange={onBasicInfoChange}
          />
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
            <div className="flex items-center gap-2">
              <span className="text-sm text-default-500">URL</span>
              <Switch
                checked={!useUrlForAvatar}
                onChange={onToggleAvatarMode}
              />
              <span className="text-sm text-default-500">Upload</span>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <img
              alt={`${portfolioData.name || "User"} profile preview`}
              className="w-20 h-20 rounded-full bg-zinc-800"
              src={portfolioData.avatar}
            />

            {useUrlForAvatar ? (
              <Input
                className="flex-1"
                description="Enter a URL to your profile image"
                label="Avatar URL"
                name="avatar"
                placeholder="URL to your profile picture"
                value={isUploadedImage ? "" : portfolioData.avatar}
                onChange={onBasicInfoChange}
              />
            ) : (
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  accept="image/*"
                  aria-label="Select profile picture image file"
                  className="hidden"
                  type="file"
                  onChange={onFileSelect}
                />
                <Button
                  className="mb-2"
                  onPress={() => fileInputRef.current?.click()}
                >
                  Select Image
                </Button>
                <p className="text-sm text-default-500">
                  Select an image to upload for your profile picture
                </p>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
