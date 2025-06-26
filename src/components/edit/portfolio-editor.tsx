import { Tab, Tabs } from "@heroui/tabs";
import { Button } from "@heroui/button";

import { Alert } from "./alert";
import { BasicInfoForm } from "./basic-info-form";
import { SocialLinksForm } from "./social-links-form";
import { SkillsForm } from "./skills-form";
import { usePortfolioEditor } from "./use-portfolio-editor";

import { title, subtitle } from "@/components/primitives";

export function PortfolioEditor() {
  const {
    portfolioData,
    isLoading,
    newSkill,
    useUrlForAvatar,
    isUploadedImage,
    saveAlert,
    resetAlert,
    fileAlert,
    fileAlertMessage,
    handleBasicInfoChange,
    handleFileSelect,
    handleSocialChange,
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
    setUseUrlForAvatar,
  } = usePortfolioEditor();

  if (isLoading || !portfolioData) {
    return (
      <div className="py-8 md:py-10">
        <div className="text-center">
          <h1 className={title()}>Portfolio Editor</h1>
          <p className={subtitle({ class: "mt-4" })}>
            Loading portfolio data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-10">
      <div className="text-center mb-8">
        <h1 className={title()}>Portfolio Edit Page</h1>
        <p className={subtitle({ class: "mt-4" })}>
          Customize your portfolio information
        </p>
      </div>

      <Tabs aria-label="Portfolio sections">
        <Tab key="basic" title="Basic Information">
          <BasicInfoForm
            isUploadedImage={isUploadedImage}
            portfolioData={portfolioData}
            useUrlForAvatar={useUrlForAvatar}
            onBasicInfoChange={handleBasicInfoChange}
            onFileSelect={handleFileSelect}
            onToggleAvatarMode={() => setUseUrlForAvatar(!useUrlForAvatar)}
          />
        </Tab>

        <Tab key="social" title="Social Links">
          <SocialLinksForm
            portfolioData={portfolioData}
            onSocialChange={handleSocialChange}
          />
        </Tab>

        <Tab key="skills" title="Skills">
          <SkillsForm
            newSkill={newSkill}
            portfolioData={portfolioData}
            onAddSkill={handleAddSkill}
            onDragEnd={handleDragEnd}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onRemoveSkill={handleRemoveSkill}
            onSkillChange={handleSkillChange}
            onSkillLevelChange={handleSkillLevelChange}
            onSkillNameChange={handleSkillNameChange}
          />
        </Tab>
      </Tabs>

      <div className="flex justify-between mt-6">
        <Button color="danger" variant="flat" onPress={handleReset}>
          Reset to Defaults
        </Button>
        <Button color="success" onPress={handleSave}>
          Save Changes
        </Button>
      </div>

      <Alert
        confirmLabel="OK"
        isOpen={saveAlert}
        message="Your portfolio data has been saved successfully!"
        title="Success"
        type="success"
        onClose={() => setSaveAlert(false)}
      />

      <Alert
        cancelLabel="Cancel"
        confirmLabel="Reset"
        isOpen={resetAlert}
        message="Are you sure you want to reset all data to defaults? This action cannot be undone."
        title="Confirm Reset"
        type="warning"
        onClose={() => setResetAlert(false)}
        onConfirm={confirmReset}
      />

      <Alert
        confirmLabel="OK"
        isOpen={fileAlert}
        message={fileAlertMessage}
        title="File Upload Error"
        type="error"
        onClose={() => setFileAlert(false)}
      />
    </div>
  );
}
