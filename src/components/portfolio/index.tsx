import { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";

import { PersonalInfo } from "./personal-info";
import { Skills } from "./skills";
import { GithubIntegration } from "./github-integration";

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
    clearDraftFromCookies();
    setHasUnsavedChanges(false);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {isUserAuthenticated && hasUnsavedChanges && (
        <Card className="border-warning-200 bg-warning-50 dark:bg-warning-50/10">
          <CardBody className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Chip color="warning" size="sm" variant="dot">
                  Unsaved changes
                </Chip>
                <span className="text-sm text-default-600">
                  You have unsaved changes that haven&#39;t been saved to the
                  server yet.
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  color="warning"
                  size="sm"
                  variant="flat"
                  onPress={handleDiscardChanges}
                >
                  Discard Changes
                </Button>
                <Button as="a" color="warning" href="/generator" size="sm">
                  Go to Editor
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
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

// Export individual components for direct use if needed
export { PersonalInfo } from "./personal-info";
export { Skills } from "./skills";
export { GithubIntegration } from "./github-integration";
