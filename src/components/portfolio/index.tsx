import { useEffect, useState } from "react";

import { PersonalInfo } from "./personal-info";
import { Skills } from "./skills";
import { GithubIntegration } from "./github-integration";
import { UnsavedChangesBanner } from "./unsaved-changes-banner";

import { isAuthenticated } from "@/lib/auth";
import {
  clearDraftFromCookies,
  hasDraftChanges,
} from "@/lib/cookie-persistence";

export function Portfolio() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  useEffect(() => {
    const userIsAuthenticated = isAuthenticated();
    setIsUserAuthenticated(userIsAuthenticated);

    if (userIsAuthenticated) {
      setHasUnsavedChanges(hasDraftChanges());
    } else {
      clearDraftFromCookies();
      setHasUnsavedChanges(false);
    }
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
