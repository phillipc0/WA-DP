import type { Skill } from "@/types";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";

import { ApiSettingsModal } from "./api-settings-modal";

import { getAuthHeaders } from "@/lib/auth";
import { SettingsIcon } from "@/components/icons";


interface AIBioGeneratorProps {
  name: string;
  title: string;
  skills: Skill[];
  onBioGenerated: (bio: string) => void;
}

/**
 * Component for generating AI-powered professional bio based on user information
 * @param props - Component props
 * @param props.name - User's full name
 * @param props.title - User's professional title
 * @param props.skills - Array of user's skills with names and proficiency levels
 * @param props.onBioGenerated - Callback function called when bio is successfully generated
 * @returns AI bio generator component with settings modal
 */
export function AIBioGenerator({
  name,
  title,
  skills,
  onBioGenerated,
}: AIBioGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const generateBio = async () => {
    setError(null);

    // Validate required fields
    if (!name?.trim()) {
      setError("Name is required to generate a bio");
      return;
    }

    if (!title?.trim()) {
      setError("Professional title is required to generate a bio");
      return;
    }

    if (!skills || skills.length === 0) {
      setError("At least one skill is required to generate a bio");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-bio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          name,
          title,
          skills: skills.map((skill) => ({
            name: skill.name,
            level: skill.level,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to generate bio");
      }

      const data = await response.json();
      onBioGenerated(data.bio);
    } catch (err) {
      console.error("Error generating bio:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-default-500">
        Generates a professional bio based on your name, title, and skills
      </p>
      <div className="flex gap-2">
        <Button
          className="flex-1"
          color="primary"
          disabled={isLoading}
          variant="flat"
          onPress={generateBio}
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2" size="sm" />
              Generating...
            </>
          ) : (
            "Generate AI Bio"
          )}
        </Button>
        <Button
          isIconOnly
          color="default"
          variant="flat"
          onPress={() => setIsSettingsOpen(true)}
        >
          <SettingsIcon size={16} />
        </Button>
      </div>
      {error && <p className="text-sm text-danger-500 mt-1">Error: {error}</p>}

      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
