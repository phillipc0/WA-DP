import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Tab, Tabs } from "@heroui/tabs";
import { Divider } from "@heroui/divider";
import { Tooltip } from "@heroui/tooltip";
import { Switch } from "@heroui/switch";

import { siteConfig } from "@/config/site";
import DefaultLayout from "@/layouts/default";
import { subtitle, title } from "@/components/primitives";

// Custom Alert Component
interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}

function Alert({
  isOpen,
  onClose,
  title,
  message,
  type,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  onConfirm,
}: AlertProps) {
  if (!isOpen) return null;

  const bgColors = {
    success: "bg-success-100",
    warning: "bg-warning-100",
    error: "bg-danger-100",
    info: "bg-primary-100",
  };

  const iconColors = {
    success: "text-success",
    warning: "text-warning",
    error: "text-danger",
    info: "text-primary",
  };

  const icons = {
    success: "✓",
    warning: "⚠",
    error: "✕",
    info: "ℹ",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div
        className={`w-full max-w-md p-6 rounded-lg shadow-lg ${bgColors[type]} border border-default-200`}
      >
        <div className="flex items-start mb-4">
          <div className={`text-2xl mr-3 ${iconColors[type]}`}>
            {icons[type]}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-default-700">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          {onConfirm && (
            <Button color="default" variant="flat" onPress={onClose}>
              {cancelLabel}
            </Button>
          )}
          <Button
            color={
              type === "error"
                ? "danger"
                : type === "warning"
                  ? "warning"
                  : type === "success"
                    ? "success"
                    : "primary"
            }
            onPress={() => {
              if (onConfirm) onConfirm();
              else onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Define the portfolio data structure
type PortfolioData = typeof siteConfig.portfolio;
type Skill = { name: string; level: number };

// No image cropper component needed anymore

export default function GeneratorPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (!isAdmin) {
      navigate("/");
    }
  }, [navigate]);
  // Initialize state with data from localStorage or default from siteConfig
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() => {
    const savedData = localStorage.getItem("portfolioData");

    return savedData ? JSON.parse(savedData) : siteConfig.portfolio;
  });

  // State for skills management
  const [newSkill, setNewSkill] = useState<Skill>({ name: "", level: 50 });

  // State for avatar management
  const [useUrlForAvatar, setUseUrlForAvatar] = useState(true);
  const [isUploadedImage, setIsUploadedImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for alert dialogs
  const [saveAlert, setSaveAlert] = useState(false);
  const [resetAlert, setResetAlert] = useState(false);
  const [fileAlert, setFileAlert] = useState(false);
  const [fileAlertMessage, setFileAlertMessage] = useState("");

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
  }, [portfolioData]);

  // Check if avatar is a data URL (uploaded image) when component mounts or portfolioData changes
  useEffect(() => {
    // Check if avatar starts with "data:" which indicates it's a data URL (uploaded image)
    setIsUploadedImage(portfolioData.avatar.startsWith("data:"));
  }, [portfolioData.avatar]);

  // Handle input changes for basic info
  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setPortfolioData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If avatar URL is changed manually, mark it as not an uploaded image
    if (name === "avatar") {
      setIsUploadedImage(false);
    }
  };

  // Handle file selection for avatar
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check file size - limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setFileAlertMessage(
        "Image is too large. Please select an image under 5MB.",
      );
      setFileAlert(true);

      return;
    }

    // Create an image element to resize the image if needed
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target?.result) return;

      img.onload = () => {
        // Create canvas for resizing
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        // Set maximum dimensions
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;

        let width = img.width;
        let height = img.height;

        // Resize if needed
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        // Set canvas dimensions and draw resized image
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Get resized image as data URL with reduced quality
        const resizedImage = canvas.toDataURL("image/jpeg", 0.7);

        // Update state with resized image
        setPortfolioData((prev) => ({
          ...prev,
          avatar: resizedImage,
        }));

        // Mark as uploaded image
        setIsUploadedImage(true);
      };

      img.src = event.target.result as string;
    };

    reader.readAsDataURL(file);
  };

  // Handle input changes for social links
  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPortfolioData((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [name]: value,
      },
    }));
  };

  // Handle adding a new skill
  const handleAddSkill = () => {
    if (newSkill.name.trim() === "") return;

    setPortfolioData((prev) => ({
      ...prev,
      skills: [...prev.skills, { ...newSkill }],
    }));

    // Reset new skill input
    setNewSkill({ name: "", level: 50 });
  };

  // Handle removing a skill
  const handleRemoveSkill = (index: number) => {
    setPortfolioData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // Handle skill input change
  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewSkill((prev) => ({
      ...prev,
      [name]: name === "level" ? Number(value) : value,
    }));
  };

  // Handle skill level change for existing skills
  const handleSkillLevelChange = (index: number, level: number) => {
    const updatedSkills = [...portfolioData.skills];

    updatedSkills[index] = { ...updatedSkills[index], level };

    setPortfolioData((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  };

  // Handle skill name change for existing skills
  const handleSkillNameChange = (index: number, name: string) => {
    const updatedSkills = [...portfolioData.skills];

    updatedSkills[index] = { ...updatedSkills[index], name };

    setPortfolioData((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  };

  // Handle drag and drop for skills reordering
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-default-100");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-default-100");
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-default-100");

    const sourceIndex = Number(e.dataTransfer.getData("text/plain"));

    if (sourceIndex === targetIndex) return;

    const updatedSkills = [...portfolioData.skills];
    const [movedSkill] = updatedSkills.splice(sourceIndex, 1);

    updatedSkills.splice(targetIndex, 0, movedSkill);

    setPortfolioData((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50");
  };

  // Reset all data to defaults
  const handleReset = () => {
    setResetAlert(true);
  };

  // Handle actual reset after confirmation
  const confirmReset = () => {
    setPortfolioData(siteConfig.portfolio);
    setIsUploadedImage(false);
    setResetAlert(false);
  };

  // Handle save action
  const handleSave = () => {
    setSaveAlert(true);
  };

  return (
    <DefaultLayout>
      <div className="py-8 md:py-10">
        <div className="text-center mb-8">
          <h1 className={title()}>Portfolio Generator</h1>
          <p className={subtitle({ class: "mt-4" })}>
            Customize your portfolio information
          </p>
        </div>

        <Tabs aria-label="Portfolio sections">
          <Tab key="basic" title="Basic Information">
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
                  onChange={handleBasicInfoChange}
                />
                <Input
                  label="Professional Title"
                  name="title"
                  placeholder="e.g. Full Stack Developer"
                  value={portfolioData.title}
                  onChange={handleBasicInfoChange}
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
                    onChange={handleBasicInfoChange}
                  />
                </div>
                <Input
                  label="Location"
                  name="location"
                  placeholder="e.g. New York, USA"
                  value={portfolioData.location}
                  onChange={handleBasicInfoChange}
                />
                <Input
                  label="Email"
                  name="email"
                  placeholder="your.email@example.com"
                  type="email"
                  value={portfolioData.email}
                  onChange={handleBasicInfoChange}
                />
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Profile Picture</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-default-500">URL</span>
                      <Switch
                        checked={!useUrlForAvatar}
                        onChange={() => setUseUrlForAvatar(!useUrlForAvatar)}
                      />
                      <span className="text-sm text-default-500">Upload</span>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <img
                      alt="Profile Preview"
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
                        onChange={handleBasicInfoChange}
                      />
                    ) : (
                      <div className="flex-1">
                        <input
                          ref={fileInputRef}
                          accept="image/*"
                          className="hidden"
                          type="file"
                          onChange={handleFileSelect}
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
          </Tab>

          <Tab key="social" title="Social Links">
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
                    <span className="text-default-400">github.com/</span>
                  }
                  value={portfolioData.social.github}
                  onChange={handleSocialChange}
                />
                <Input
                  label="Twitter Username"
                  name="twitter"
                  placeholder="Your Twitter username"
                  startContent={
                    <span className="text-default-400">twitter.com/</span>
                  }
                  value={portfolioData.social.twitter}
                  onChange={handleSocialChange}
                />
                <Input
                  label="LinkedIn Username"
                  name="linkedin"
                  placeholder="Your LinkedIn username"
                  startContent={
                    <span className="text-default-400">linkedin.com/in/</span>
                  }
                  value={portfolioData.social.linkedin}
                  onChange={handleSocialChange}
                />
              </CardBody>
            </Card>
          </Tab>

          <Tab key="skills" title="Skills">
            <Card className="mt-4">
              <CardHeader>
                <h2 className="text-xl font-bold">Your Skills</h2>
              </CardHeader>
              <CardBody>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Add New Skill</h3>
                  <div className="flex gap-2 items-end">
                    <Input
                      className="flex-1"
                      label="Skill Name"
                      name="name"
                      placeholder="e.g. React"
                      value={newSkill.name}
                      onChange={handleSkillChange}
                    />
                    <Input
                      className="w-32"
                      label="Proficiency Level (0-100)"
                      max={100}
                      min={0}
                      name="level"
                      type="number"
                      // @ts-ignore
                      value={newSkill.level}
                      onChange={handleSkillChange}
                    />
                    <Button color="primary" onPress={handleAddSkill}>
                      Add Skill
                    </Button>
                  </div>
                </div>

                <Divider className="my-4" />

                <div>
                  <h3 className="text-lg font-medium mb-4">Current Skills</h3>
                  {portfolioData.skills.length === 0 ? (
                    <p className="text-default-500">No skills added yet.</p>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-default-500 mb-2">
                        Drag and drop skills to reorder them
                      </p>
                      {portfolioData.skills.map((skill, index) => (
                        <div
                          key={index}
                          draggable
                          className="flex items-center gap-2 p-2 border border-default-200 rounded-md"
                          onDragEnd={handleDragEnd}
                          onDragLeave={handleDragLeave}
                          onDragOver={handleDragOver}
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDrop={(e) => handleDrop(e, index)}
                        >
                          <div
                            className="cursor-move p-1 text-default-400 hover:text-default-600"
                            title="Drag to reorder"
                          >
                            ⋮⋮
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-2">
                              <Input
                                className="max-w-[70%]"
                                placeholder="Skill name"
                                size="sm"
                                value={skill.name}
                                onChange={(e) =>
                                  handleSkillNameChange(index, e.target.value)
                                }
                              />
                              <span>{skill.level}%</span>
                            </div>
                            <Input
                              className="mt-1"
                              max={100}
                              min={0}
                              type="range"
                              // @ts-ignore
                              value={skill.level}
                              onChange={(e) =>
                                handleSkillLevelChange(
                                  index,
                                  Number(e.target.value),
                                )
                              }
                            />
                          </div>
                          <Tooltip content="Remove skill">
                            <Button
                              isIconOnly
                              color="danger"
                              variant="light"
                              onPress={() => handleRemoveSkill(index)}
                            >
                              ✕
                            </Button>
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>

        <div className="flex justify-between mt-6">
          <Button color="danger" variant="flat" onPress={handleReset}>
            Reset to Defaults
          </Button>
          <Button color="success" onPress={handleSave}>
            Save Changes
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-default-500">
            Your changes are automatically saved to your browser&#39;s local
            storage.
            <br />
            Visit the{" "}
            <a className="text-primary" href="/">
              Home page
            </a>{" "}
            to see your updated portfolio.
          </p>
        </div>
      </div>

      {/* Alert for successful save */}
      <Alert
        confirmLabel="OK"
        isOpen={saveAlert}
        message="Your portfolio data has been saved successfully!"
        title="Success"
        type="success"
        onClose={() => setSaveAlert(false)}
      />

      {/* Alert for reset confirmation */}
      <Alert
        cancelLabel="Cancel"
        confirmLabel="Reset"
        isOpen={resetAlert}
        message="Are you sure you want to reset all data to defaults? This action cannot be undone."
        title="Confirm Reset"
        type="warning"
        onClose={() => setResetAlert(false)}
        onConfirm={confirmReset}
      />

      {/* Alert for file upload errors */}
      <Alert
        confirmLabel="OK"
        isOpen={fileAlert}
        message={fileAlertMessage}
        title="File Upload Error"
        type="error"
        onClose={() => setFileAlert(false)}
      />
    </DefaultLayout>
  );
}
