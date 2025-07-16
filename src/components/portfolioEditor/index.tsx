import { Tab, Tabs } from "@heroui/tabs";
import { Button } from "@heroui/button";

import { Alert } from "./alert";
import { BasicInfoForm } from "./basic-info-form";
import { SocialLinksForm } from "./social-links-form";
import { SkillsForm } from "./skills-form";
import WorkExperienceForm from "./work-experience-form";
import EducationForm from "./education-form";
import { ImportExportControls } from "./import-export-controls";
import { ContributorForm } from "./contributor-form";

import { usePortfolioEditor } from "@/lib/use-portfolio-editor.ts";
import { subtitle, title } from "@/components/primitives";
import { isContributor } from "@/utils/contributor";

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
    handleSocialSelectChange,
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
    // CV state
    newExperience,
    newEducation,
    selectedSkills,
    setSelectedSkills,
    // CV Experience functions
    handleAddExperience,
    handleRemoveExperience,
    handleEditExperience,
    handleExperienceChange,
    handleExperienceDragStart,
    handleExperienceDragOver,
    handleExperienceDragLeave,
    handleExperienceDrop,
    handleExperienceDragEnd,
    handleRemoveSelectedSkill,
    // CV Education functions
    handleAddEducation,
    handleRemoveEducation,
    handleEditEducation,
    handleEducationChange,
    handleEducationDragStart,
    handleEducationDragOver,
    handleEducationDragLeave,
    handleEducationDrop,
    handleEducationDragEnd,
    // Contributor functions
    handleContributorChange,
    // Import/Export
    handleImportPortfolioData,
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
            onSocialSelectChange={handleSocialSelectChange}
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

        <Tab key="experience" title="Work Experience">
          <WorkExperienceForm
            handleAddExperience={handleAddExperience}
            handleEditExperience={handleEditExperience}
            handleExperienceChange={handleExperienceChange}
            handleExperienceDragEnd={handleExperienceDragEnd}
            handleExperienceDragLeave={handleExperienceDragLeave}
            handleExperienceDragOver={handleExperienceDragOver}
            handleExperienceDragStart={handleExperienceDragStart}
            handleExperienceDrop={handleExperienceDrop}
            handleRemoveExperience={handleRemoveExperience}
            handleRemoveSelectedSkill={handleRemoveSelectedSkill}
            newExperience={newExperience}
            portfolioData={portfolioData}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
          />
        </Tab>

        <Tab key="education" title="Education">
          <EducationForm
            handleAddEducation={handleAddEducation}
            handleEditEducation={handleEditEducation}
            handleEducationChange={handleEducationChange}
            handleEducationDragEnd={handleEducationDragEnd}
            handleEducationDragLeave={handleEducationDragLeave}
            handleEducationDragOver={handleEducationDragOver}
            handleEducationDragStart={handleEducationDragStart}
            handleEducationDrop={handleEducationDrop}
            handleRemoveEducation={handleRemoveEducation}
            newEducation={newEducation}
            portfolioData={portfolioData}
          />
        </Tab>

        {isContributor(portfolioData?.social?.github) && (
          <Tab key="contributor" title="Contributor">
            <ContributorForm
              portfolioData={portfolioData}
              onContributorChange={handleContributorChange}
            />
          </Tab>
        )}
      </Tabs>

      <div className="flex flex-wrap justify-between items-center gap-3 mt-6">
        <div className="flex flex-wrap gap-3">
          <Button color="danger" variant="flat" onPress={handleReset}>
            Reset to Defaults
          </Button>
          <ImportExportControls
            portfolioData={portfolioData}
            onImport={handleImportPortfolioData}
          />
        </div>
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
