import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";

import { clearDraftFromCookies, loadDraftFromCookies } from "@/lib/cookie-persistence";
import { savePortfolioData } from "@/lib/portfolio";

interface UnsavedChangesBannerProps {
  onDiscardChanges?: () => void;
}

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
    <Card className="border-warning-200 bg-warning-50 dark:bg-warning-50/10">
      <CardBody className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Chip color="warning" size="sm" variant="dot">
              Unsaved changes
            </Chip>
            <span className="text-sm text-default-600">
              You are viewing a preview of your changes.
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
            <Button color="success" size="sm" onPress={handleSaveChanges}>
              Save Changes
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
