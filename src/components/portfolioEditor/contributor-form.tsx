import { Card, CardBody, CardHeader } from "@heroui/card";
import { Switch } from "@heroui/switch";

interface ContributorFormProps {
  portfolioData: any;
  onContributorChange: (field: string, value: boolean) => void;
}

export function ContributorForm({
  portfolioData,
  onContributorChange,
}: ContributorFormProps) {
  const contributorSettings = portfolioData?.contributor || {
    enableContributorStatus: false,
    showGoldenBoxShadow: false,
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <h2 className="text-xl font-bold">Contributor Settings</h2>
      </CardHeader>
      <CardBody className="gap-6">
        <p className="text-default-600">
          These settings allow you to customize the contributor features of your
          portfolio.
        </p>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-medium font-medium">
              Enable Contributor Status
            </h3>
            <p className="text-small text-default-500">
              Show the contributor button on your profile
            </p>
          </div>
          <Switch
            isSelected={contributorSettings.enableContributorStatus}
            onValueChange={(value) => {
              if (value) {
                onContributorChange("showGoldenBoxShadow", true);
              } else {
                onContributorChange("showGoldenBoxShadow", false);
              }
              onContributorChange("enableContributorStatus", value);
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-medium font-medium">Show Golden Box Shadow</h3>
            <p className="text-small text-default-500">
              Display the golden box shadow around your profile card
            </p>
          </div>
          <Switch
            isDisabled={!contributorSettings.enableContributorStatus}
            isSelected={
              contributorSettings.showGoldenBoxShadow &&
              contributorSettings.enableContributorStatus
            }
            onValueChange={(value) =>
              onContributorChange("showGoldenBoxShadow", value)
            }
          />
        </div>
      </CardBody>
    </Card>
  );
}
