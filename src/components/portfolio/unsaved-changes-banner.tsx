import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";

import {
  clearDraftFromCookies,
  loadDraftFromCookies,
} from "@/lib/cookie-persistence";
import { savePortfolioData } from "@/lib/portfolio";

interface UnsavedChangesBannerProps {
  onDiscardChanges?: () => void;
}

/**
 * Banner component that alerts users about unsaved changes with save/discard options
 * @param props - Component props
 * @param props.onDiscardChanges - Optional callback when changes are discarded
 * @returns Unsaved changes alert banner
 */
export function UnsavedChangesBanner({
  onDiscardChanges,
}: UnsavedChangesBannerProps) {
  const handleDiscardChanges = () => {
    clearDraftFromCookies();
    if (onDiscardChanges) {
      onDiscardChanges();
    } else {
      window.location.reload();
    }
  };

  const handleSaveChanges = async () => {
    const draftData = loadDraftFromCookies();
    if (!draftData) return;

    try {
      const success = await savePortfolioData(draftData);
      if (success) {
        clearDraftFromCookies();
        if (onDiscardChanges) {
          onDiscardChanges();
        } else {
          window.location.reload();
        }
      } else {
        console.error("Failed to save portfolio data");
      }
    } catch (error) {
      console.error("Error saving portfolio data:", error);
    }
  };

  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      className="flex items-center justify-center w-full"
    >
      <Alert
        color="warning"
        description="You are viewing a preview of your changes."
        endContent={
          <div className="flex gap-3">
            <Button
              color="success"
              size="sm"
              style={{ top: 4 }}
              variant="flat"
              onPress={handleSaveChanges}
            >
              Save Changes
            </Button>
            <Button
              color="danger"
              size="sm"
              style={{ top: 4 }}
              variant="flat"
              onPress={handleDiscardChanges}
            >
              Discard Changes
            </Button>
          </div>
        }
        title="Unsaved changes"
        variant="faded"
      />
    </div>
  );
}
