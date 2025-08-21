import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { siteConfig } from "@/config/site.ts";
import { isAuthenticated, migrateOldAuth, validateToken } from "@/lib/auth.ts";
import { getPortfolioData, savePortfolioData } from "@/lib/portfolio.ts";
import {
  clearDraftFromCookies,
  loadDraftFromCookies,
  saveDraftToCookies,
} from "@/lib/cookie-persistence.ts";
import { Education, Experience } from "@/types";

type Skill = { name: string; level: number };

export function usePortfolioEditor() {
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newSkill, setNewSkill] = useState<Skill>({ name: "", level: 50 });
  const [saveAlert, setSaveAlert] = useState(false);
  const [resetAlert, setResetAlert] = useState(false);
  const [fileAlert, setFileAlert] = useState(false);
  const [fileAlertMessage, setFileAlertMessage] = useState("");

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

  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(
    new Set([]),
  );

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
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFileAlertMessage(
        "Image is too large. Please select an image under 5MB.",
      );
      setFileAlert(true);
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target?.result) return;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;

        let width = img.width;
        let height = img.height;

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

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const resizedImage = canvas.toDataURL("image/jpeg", 0.7);

        setPortfolioData((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            avatar: resizedImage,
          };
        });
      };

      img.src = event.target.result as string;
    };

    reader.readAsDataURL(file);
  };

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

  const handleSocialSelectChange = (field: string, value: string) => {
    setPortfolioData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        social: {
          ...prev.social,
          [field]: value,
        },
      };
    });
  };

  const handleAddSkill = () => {
    if (newSkill.name.trim() === "") return;

    setPortfolioData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        skills: [...prev.skills, { ...newSkill }],
      };
    });

    setNewSkill({ name: "", level: 50 });
  };

  const handleRemoveSkill = (index: number) => {
    setPortfolioData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        skills: prev.skills.filter((_: any, i: any) => i !== index),
      };
    });
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewSkill((prev) => ({
      ...prev,
      [name]: name === "level" ? Number(value) : value,
    }));
  };

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

  const handleReset = () => {
    setResetAlert(true);
  };

  const confirmReset = () => {
    setPortfolioData(siteConfig.portfolio);
    setResetAlert(false);
  };

  const handleSave = async () => {
    if (!portfolioData) return;

    try {
      const success = await savePortfolioData(portfolioData);
      if (success) {
        clearDraftFromCookies();
        setSaveAlert(true);
      } else {
        console.error("Failed to save portfolio data");
      }
    } catch (error) {
      console.error("Error saving portfolio data:", error);
    }
  };

  //CV drag and drop
  const handleExperienceDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    e.currentTarget.classList.add("opacity-50");
  };

  const handleExperienceDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-default-100");
  };

  const handleExperienceDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-default-100");
  };

  const handleExperienceDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-default-100");

    if (!portfolioData) return;

    const sourceIndex = Number(e.dataTransfer.getData("text/plain"));

    if (sourceIndex === targetIndex) return;

    const updatedExperiences = [...(portfolioData.cv || [])];
    const [movedExperience] = updatedExperiences.splice(sourceIndex, 1);

    updatedExperiences.splice(targetIndex, 0, movedExperience);

    setPortfolioData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        cv: updatedExperiences,
      };
    });
  };

  const handleExperienceDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50");
  };

  const handleEducationDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    e.currentTarget.classList.add("opacity-50");
  };

  const handleEducationDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-default-100");
  };

  const handleEducationDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-default-100");
  };

  const handleEducationDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-default-100");

    if (!portfolioData) return;

    const sourceIndex = Number(e.dataTransfer.getData("text/plain"));

    if (sourceIndex === targetIndex) return;

    const updatedEducation = [...(portfolioData.education || [])];
    const [movedEducation] = updatedEducation.splice(sourceIndex, 1);

    updatedEducation.splice(targetIndex, 0, movedEducation);

    setPortfolioData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        education: updatedEducation,
      };
    });
  };

  const handleEducationDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50");
  };

  // CV Management Functions
  const handleAddExperience = () => {
    if (
      newExperience.company.trim() === "" ||
      newExperience.position.trim() === ""
    )
      return;

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

  const handleRemoveExperience = (index: number) => {
    setPortfolioData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        cv: prev.cv?.filter((_: any, i: any) => i !== index) || [],
      };
    });
  };

  const handleEditExperience = (index: number) => {
    if (!portfolioData?.cv) return;

    const experience = portfolioData.cv[index];
    setNewExperience(experience);
    setSelectedSkills(new Set(experience.technologies || []));

    handleRemoveExperience(index);
  };

  const handleExperienceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewExperience((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemoveSelectedSkill = (skillName: string) => {
    setSelectedSkills((prev) => {
      const newSet = new Set(prev);
      newSet.delete(skillName);
      return newSet;
    });
  };

  const handleAddEducation = () => {
    if (
      newEducation.institution.trim() === "" ||
      newEducation.degree.trim() === ""
    )
      return;

    setPortfolioData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        education: [...(prev.education || []), { ...newEducation }],
      };
    });

    setNewEducation({
      institution: "",
      degree: "",
      duration: "",
      location: "",
      description: "",
    });
  };

  const handleRemoveEducation = (index: number) => {
    setPortfolioData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        education:
          prev.education?.filter((_: any, i: any) => i !== index) || [],
      };
    });
  };

  const handleEditEducation = (index: number) => {
    if (!portfolioData?.education) return;

    const education = portfolioData.education[index];
    setNewEducation(education);

    handleRemoveEducation(index);
  };

  const handleEducationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewEducation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContributorChange = (field: string, value: boolean) => {
    setPortfolioData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        contributor: {
          ...prev.contributor,
          [field]: value,
        },
      };
    });
  };

  const handleImportPortfolioData = (data: any) => {
    setPortfolioData(data);
    clearDraftFromCookies();
  };

  return {
    portfolioData,
    isLoading,
    newSkill,
    saveAlert,
    resetAlert,
    fileAlert,
    fileAlertMessage,
    handleBasicInfoChange,
    handleFileSelect,
    handleSocialChange,
    handleSocialSelectChange,
    handleAddSkill,
    handleRemoveSkill,
    handleSkillChange,
    handleSkillLevelChange,
    handleSkillNameChange,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    handleReset,
    confirmReset,
    handleSave,
    setSaveAlert,
    setResetAlert,
    setFileAlert,
    // CV state
    newExperience,
    setNewExperience,
    newEducation,
    setNewEducation,
    selectedSkills,
    setSelectedSkills,
    // CV Experience functions
    handleAddExperience,
    handleRemoveExperience,
    handleEditExperience,
    handleExperienceChange,
    handleExperienceDragStart,
    handleExperienceDragOver,
    handleExperienceDragLeave,
    handleExperienceDrop,
    handleExperienceDragEnd,
    handleRemoveSelectedSkill,
    // CV Education functions
    handleAddEducation,
    handleRemoveEducation,
    handleEditEducation,
    handleEducationChange,
    handleEducationDragStart,
    handleEducationDragOver,
    handleEducationDragLeave,
    handleEducationDrop,
    handleEducationDragEnd,
    // Contributor functions
    handleContributorChange,
    // Import/Export
    handleImportPortfolioData,
  };
}
