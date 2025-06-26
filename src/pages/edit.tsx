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
import { subtitle, title } from "@/components/primitives.tsx";
import { isAuthenticated, migrateOldAuth, validateToken } from "@/lib/auth";
import { getPortfolioData, savePortfolioData } from "@/lib/portfolio";
import {
  clearDraftFromCookies,
  loadDraftFromCookies,
  saveDraftToCookies,
} from "@/lib/cookie-persistence";
import { Experience, Education } from "@/types";

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

type Skill = { name: string; level: number };

export default function EditPage() {
  const navigate = useNavigate();

  const [portfolioData, setPortfolioData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      migrateOldAuth();

      if (!isAuthenticated()) {
        navigate("/");
        return;
      }

      const isValidToken = await validateToken();
      if (!isValidToken) {
        navigate("/");
      }
    };

    checkAuthentication();
  }, [navigate]);

  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        setIsLoading(true);

        // Check for draft data first
        const draftData = loadDraftFromCookies();
        if (draftData) {
          setPortfolioData(draftData);
          setIsLoading(false);
          return;
        }

        const data = await getPortfolioData();

        if (data) {
          setPortfolioData(data);
        } else {
          setPortfolioData(siteConfig.portfolio);
        }
      } catch (error) {
        console.error("Error loading portfolio data:", error);
        setPortfolioData(siteConfig.portfolio);
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolioData();
  }, []);

  const [newSkill, setNewSkill] = useState<Skill>({ name: "", level: 50 });

  // CV state
  const [newExperience, setNewExperience] = useState<Experience>({
    company: "",
    position: "",
    duration: "",
    location: "",
    description: "",
    technologies: [],
  });
  
  const [newEducation, setNewEducation] = useState<Education>({
    institution: "",
    degree: "",
    duration: "",
    location: "",
    description: "",
  });

  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set([]));

  const [useUrlForAvatar, setUseUrlForAvatar] = useState(true);
  const [isUploadedImage, setIsUploadedImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saveAlert, setSaveAlert] = useState(false);
  const [resetAlert, setResetAlert] = useState(false);
  const [fileAlert, setFileAlert] = useState(false);
  const [fileAlertMessage, setFileAlertMessage] = useState("");

  useEffect(() => {
    if (portfolioData?.avatar) {
      setIsUploadedImage(portfolioData.avatar.startsWith("data:"));
    }
  }, [portfolioData?.avatar]);

  // Save portfolio data to cookies whenever it changes
  useEffect(() => {
    if (portfolioData && !isLoading) {
      saveDraftToCookies(portfolioData);
    }
  }, [portfolioData, isLoading]);

  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setPortfolioData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value,
      };
    });

    if (name === "avatar") {
      setIsUploadedImage(false);
    }
  };

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
        setPortfolioData((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            avatar: resizedImage,
          };
        });

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

    setPortfolioData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        social: {
          ...prev.social,
          [name]: value,
        },
      };
    });
  };

  // Handle adding a new skill
  const handleAddSkill = () => {
    if (newSkill.name.trim() === "") return;

    setPortfolioData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        skills: [...prev.skills, { ...newSkill }],
      };
    });

    // Reset new skill input
    setNewSkill({ name: "", level: 50 });
  };

  // Handle removing a skill
  const handleRemoveSkill = (index: number) => {
    setPortfolioData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        skills: prev.skills.filter((_: any, i: any) => i !== index),
      };
    });
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
    if (!portfolioData) return;

    const updatedSkills = [...portfolioData.skills];
    updatedSkills[index] = { ...updatedSkills[index], level };

    setPortfolioData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        skills: updatedSkills,
      };
    });
  };

  // Handle skill name change for existing skills
  const handleSkillNameChange = (index: number, name: string) => {
    if (!portfolioData) return;

    const updatedSkills = [...portfolioData.skills];
    updatedSkills[index] = { ...updatedSkills[index], name };

    setPortfolioData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        skills: updatedSkills,
      };
    });
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

    if (!portfolioData) return;

    const sourceIndex = Number(e.dataTransfer.getData("text/plain"));

    if (sourceIndex === targetIndex) return;

    const updatedSkills = [...portfolioData.skills];
    const [movedSkill] = updatedSkills.splice(sourceIndex, 1);

    updatedSkills.splice(targetIndex, 0, movedSkill);

    setPortfolioData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        skills: updatedSkills,
      };
    });
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
  const handleSave = async () => {
    if (!portfolioData) return;

    try {
      const success = await savePortfolioData(portfolioData);
      if (success) {
        clearDraftFromCookies();
        setSaveAlert(true);
      } else {
        // Handle save error - could show error alert
        console.error("Failed to save portfolio data");
      }
    } catch (error) {
      console.error("Error saving portfolio data:", error);
    }
  };

  // CV Management Functions
  
  // Handle adding a new work experience
  const handleAddExperience = () => {
    if (newExperience.company.trim() === "" || newExperience.position.trim() === "") return;

    const experienceWithTechnologies = {
      ...newExperience,
      technologies: Array.from(selectedSkills),
    };

    setPortfolioData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        cv: [...(prev.cv || []), experienceWithTechnologies],
      };
    });

    // Reset new experience input
    setNewExperience({
      company: "",
      position: "",
      duration: "",
      location: "",
      description: "",
      technologies: [],
    });
    setSelectedSkills(new Set([]));
  };

  // Handle removing a work experience
  const handleRemoveExperience = (index: number) => {
    setPortfolioData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        cv: prev.cv?.filter((_: any, i: any) => i !== index) || [],
      };
    });
  };

  // Handle editing a work experience
  const handleEditExperience = (index: number) => {
    if (!portfolioData?.cv) return;

    const experience = portfolioData.cv[index];
    setNewExperience(experience);
    setSelectedSkills(new Set(experience.technologies || []));

    // Remove the experience from the list
    handleRemoveExperience(index);
  };

  // Handle experience input change
  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewExperience((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle removing a selected skill
  const handleRemoveSelectedSkill = (skillName: string) => {
    setSelectedSkills((prev) => {
      const newSet = new Set(prev);
      newSet.delete(skillName);
      return newSet;
    });
  };

  // Handle adding a new education
  const handleAddEducation = () => {
    if (newEducation.institution.trim() === "" || newEducation.degree.trim() === "") return;

    setPortfolioData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        education: [...(prev.education || []), { ...newEducation }],
      };
    });

    // Reset new education input
    setNewEducation({
      institution: "",
      degree: "",
      duration: "",
      location: "",
      description: "",
    });
  };

  // Handle removing an education
  const handleRemoveEducation = (index: number) => {
    setPortfolioData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        education: prev.education?.filter((_: any, i: any) => i !== index) || [],
      };
    });
  };

  // Handle editing an education
  const handleEditEducation = (index: number) => {
    if (!portfolioData?.education) return;

    const education = portfolioData.education[index];
    setNewEducation(education);

    // Remove the education from the list
    handleRemoveEducation(index);
  };

  // Handle education input change
  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEducation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Show loading state while data is being fetched
  if (isLoading || !portfolioData) {
    return (
      <DefaultLayout>
        <div className="py-8 md:py-10">
          <div className="text-center">
            <h1 className={title()}>Portfolio Editor</h1>
            <p className={subtitle({ class: "mt-4" })}>
              Loading portfolio data...
            </p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="py-8 md:py-10">
        <div className="text-center mb-8">
          <h1 className={title()}>Portfolio Edit Page</h1>
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
                <Input
                  label="Discord Username"
                  name="discord"
                  placeholder="Your Discord username"
                  startContent={
                    <span className="text-default-400">discord.com/users/</span>
                  }
                  value={portfolioData.social.discord}
                  onChange={handleSocialChange}
                />
                <Input
                  label="Reddit Username"
                  name="reddit"
                  placeholder="Your Reddit username"
                  startContent={
                    <span className="text-default-400">reddit.com/user/</span>
                  }
                  value={portfolioData.social.reddit}
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
                      {portfolioData.skills.map((skill: any, index: any) => (
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

          <Tab key="experience" title="Work Experience">
            <Card className="mt-4">
              <CardHeader>
                <h2 className="text-xl font-bold">Work Experience</h2>
              </CardHeader>
              <CardBody className="gap-4">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Add New Experience</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Position"
                      name="position"
                      placeholder="e.g. Software Engineer"
                      value={newExperience.position}
                      onChange={handleExperienceChange}
                    />
                    <Input
                      label="Company"
                      name="company"
                      placeholder="e.g. Tech Corp"
                      value={newExperience.company}
                      onChange={handleExperienceChange}
                    />
                    <Input
                      label="Duration"
                      name="duration"
                      placeholder="e.g. Jan 2020 - Present"
                      value={newExperience.duration}
                      onChange={handleExperienceChange}
                    />
                    <Input
                      label="Location"
                      name="location"
                      placeholder="e.g. San Francisco, CA"
                      value={newExperience.location}
                      onChange={handleExperienceChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <textarea
                      className="w-full min-h-[100px] px-3 py-2 rounded-md border border-default-200 bg-default-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      name="description"
                      placeholder="Describe your role and achievements..."
                      value={newExperience.description}
                      onChange={handleExperienceChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Technologies</label>
                    {portfolioData.skills?.length > 0 ? (
                      <div className="mb-2">
                        <p className="text-sm text-default-500 mb-2">
                          Select from your skills:
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {portfolioData.skills
                            .filter((skill: any) => !selectedSkills.has(skill.name))
                            .map((skill: any, index: number) => (
                            <Button
                              key={index}
                              size="sm"
                              variant="bordered"
                              onPress={() => setSelectedSkills(prev => new Set([...prev, skill.name]))}
                            >
                              + {skill.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-default-500 mb-2">
                        Add skills first to select technologies.
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {Array.from(selectedSkills).map((skill) => (
                        <span
                          key={skill}
                          className="text-xs rounded-full bg-primary-100 text-primary-800 px-3 py-1 flex items-center gap-1"
                        >
                          {skill}
                          <button
                            className="ml-1 text-danger hover:text-danger-600"
                            onClick={() => handleRemoveSelectedSkill(skill)}
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button color="primary" onPress={handleAddExperience}>
                    Add Experience
                  </Button>
                </div>

                <Divider className="my-4" />

                <div>
                  <h3 className="text-lg font-medium mb-4">Current Experience</h3>
                  {!portfolioData.cv || portfolioData.cv?.length === 0 ? (
                    <p className="text-default-500">No work experience added yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {portfolioData.cv?.map((experience: any, index: any) => (
                        <div
                          key={index}
                          className="p-4 border border-default-200 rounded-md"
                        >
                          <div className="flex justify-between mb-2">
                            <div>
                              <h4 className="text-md font-semibold">
                                {experience.position} at {experience.company}
                              </h4>
                              <p className="text-sm text-default-500">
                                {experience.location} • {experience.duration}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Tooltip content="Edit experience">
                                <Button
                                  isIconOnly
                                  color="primary"
                                  variant="light"
                                  onPress={() => handleEditExperience(index)}
                                >
                                  ✎
                                </Button>
                              </Tooltip>
                              <Tooltip content="Remove experience">
                                <Button
                                  isIconOnly
                                  color="danger"
                                  variant="light"
                                  onPress={() => handleRemoveExperience(index)}
                                >
                                  ✕
                                </Button>
                              </Tooltip>
                            </div>
                          </div>
                          <p className="text-default-700">{experience.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {experience.technologies?.map((tech: any, i: number) => (
                              <span
                                key={i}
                                className="text-xs rounded-full bg-default-100 px-3 py-1"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </Tab>

          <Tab key="education" title="Education">
            <Card className="mt-4">
              <CardHeader>
                <h2 className="text-xl font-bold">Education</h2>
              </CardHeader>
              <CardBody className="gap-4">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Add New Education</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Institution Name"
                      name="institution"
                      placeholder="e.g. XYZ University"
                      value={newEducation.institution}
                      onChange={handleEducationChange}
                    />
                    <Input
                      label="Degree"
                      name="degree"
                      placeholder="e.g. Bachelor of Science"
                      value={newEducation.degree}
                      onChange={handleEducationChange}
                    />
                    <Input
                      label="Duration"
                      name="duration"
                      placeholder="e.g. 2017 - 2021"
                      value={newEducation.duration}
                      onChange={handleEducationChange}
                    />
                    <Input
                      label="Location"
                      name="location"
                      placeholder="e.g. Boston, MA"
                      value={newEducation.location}
                      onChange={handleEducationChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <textarea
                      className="w-full min-h-[100px] px-3 py-2 rounded-md border border-default-200 bg-default-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      name="description"
                      placeholder="Describe your studies and achievements..."
                      value={newEducation.description}
                      onChange={handleEducationChange}
                    />
                  </div>
                  <Button color="primary" onPress={handleAddEducation}>
                    Add Education
                  </Button>
                </div>

                <Divider className="my-4" />

                <div>
                  <h3 className="text-lg font-medium mb-4">Current Education</h3>
                  {!portfolioData.education || portfolioData.education?.length === 0 ? (
                    <p className="text-default-500">No education records added yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {portfolioData.education?.map((edu: any, index: any) => (
                        <div
                          key={index}
                          className="p-4 border border-default-200 rounded-md"
                        >
                          <div className="flex justify-between mb-2">
                            <div>
                              <h4 className="text-md font-semibold">
                                {edu.degree} from {edu.institution}
                              </h4>
                              <p className="text-sm text-default-500">
                                {edu.location} • {edu.duration}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Tooltip content="Edit education">
                                <Button
                                  isIconOnly
                                  color="primary"
                                  variant="light"
                                  onPress={() => handleEditEducation(index)}
                                >
                                  ✎
                                </Button>
                              </Tooltip>
                              <Tooltip content="Remove education">
                                <Button
                                  isIconOnly
                                  color="danger"
                                  variant="light"
                                  onPress={() => handleRemoveEducation(index)}
                                >
                                  ✕
                                </Button>
                              </Tooltip>
                            </div>
                          </div>
                          <p className="text-default-700">{edu.description}</p>
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
