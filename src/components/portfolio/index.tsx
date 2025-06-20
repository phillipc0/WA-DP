import { useEffect, useState } from "react";

import { PersonalInfo } from "./personal-info";
import { Skills } from "./skills";
import { GithubIntegration } from "./github-integration";
import { UnsavedChangesBanner } from "./unsaved-changes-banner";

import { isAuthenticated } from "@/lib/auth";
import {
  clearDraftFromCookies,
  hasChangesComparedToSaved,
  loadDraftFromCookies,
} from "@/lib/cookie-persistence";
import { getPortfolioData } from "@/lib/portfolio";

export function Portfolio() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  useEffect(() => {
    const checkUnsavedChanges = async () => {
      const userIsAuthenticated = isAuthenticated();
      setIsUserAuthenticated(userIsAuthenticated);

      if (userIsAuthenticated) {
        const draftData = loadDraftFromCookies();
        if (draftData) {
          try {
            const savedData = await getPortfolioData();
            if (savedData) {
              setHasUnsavedChanges(
                hasChangesComparedToSaved(draftData, savedData),
              );
            } else {
              setHasUnsavedChanges(true);
            }
          } catch (error) {
            console.error("Error checking for unsaved changes:", error);
            setHasUnsavedChanges(true);
          }
        } else {
          setHasUnsavedChanges(false);
        }
      } else {
        clearDraftFromCookies();
        setHasUnsavedChanges(false);
      }
    };

    checkUnsavedChanges();
  }, []);

  const handleDiscardChanges = () => {
    setHasUnsavedChanges(false);
  };

  return (
    <div className="space-y-6">
      {isUserAuthenticated && hasUnsavedChanges && (
        <UnsavedChangesBanner onDiscardChanges={handleDiscardChanges} />
      )}

      {/* Portfolio Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <PersonalInfo />
        </div>
        <div>
          <Skills />
        </div>
        <div>
          <GithubIntegration />
        </div>
      </div>
    </div>
  );
}

export { PersonalInfo } from "./personal-info";
export { Skills } from "./skills";
export { GithubIntegration } from "./github-integration";
