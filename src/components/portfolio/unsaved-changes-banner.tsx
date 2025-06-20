import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";

import { clearDraftFromCookies } from "@/lib/cookie-persistence";

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
      // Default behavior: reload the page to show saved data
      window.location.reload();
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
              You have unsaved changes that haven&#39;t been saved to the server
              yet.
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
  );
}
