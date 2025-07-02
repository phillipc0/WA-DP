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
    <div className="space-y-6">
      <div className="bg-default-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Contributor Settings</h2>
        <p className="text-default-600 mb-6">
          These settings allow you to customize the contributor features of your
          portfolio.
        </p>

        <div className="space-y-6">
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
              onValueChange={(value) =>
                onContributorChange("enableContributorStatus", value)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-medium font-medium">
                Show Golden Box Shadow
              </h3>
              <p className="text-small text-default-500">
                Display the golden box shadow around your profile card
              </p>
            </div>
            <Switch
              isSelected={contributorSettings.showGoldenBoxShadow}
              onValueChange={(value) =>
                onContributorChange("showGoldenBoxShadow", value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
