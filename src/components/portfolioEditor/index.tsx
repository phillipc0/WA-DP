import { Tab, Tabs } from "@heroui/tabs";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";

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
import { SKILL_LEVELS } from "@/utils/skills.ts";

/**
 * Main portfolio editor component with tabbed interface for editing portfolio data
 * @returns JSX element containing the complete portfolio editor interface
 */
export function PortfolioEditor() {
  const [activeTab, setActiveTab] = useState("basic");

  const {
    portfolioData,
    isLoading,
    newSkill,
    saveAlert,
    resetAlert,
    fileAlert,
    fileAlertMessage,
    handleBasicInfoChange,
    handleSocialChange,
    handleSocialSelectChange,
    handleAddSkill,
    handleRemoveSkill,
    handleSkillChange,
    handleSkillLevelChange,
    handleSkillNameChange,
    handleNewSkillLevelChange,
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

  const tabOptions = [
    { key: "basic", label: "Basic Information" },
    { key: "social", label: "Social Links" },
    { key: "skills", label: "Skills" },
    { key: "experience", label: "Work Experience" },
    { key: "education", label: "Education" },
    ...(isContributor(portfolioData?.social?.github)
      ? [{ key: "contributor", label: "Contributor" }]
      : []),
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <BasicInfoForm
            portfolioData={portfolioData}
            onBasicInfoChange={handleBasicInfoChange}
          />
        );
      case "social":
        return (
          <SocialLinksForm
            portfolioData={portfolioData}
            onSocialChange={handleSocialChange}
            onSocialSelectChange={handleSocialSelectChange}
          />
        );
      case "skills":
        return (
          <SkillsForm
            SKILL_LEVELS={SKILL_LEVELS}
            handleNewSkillLevelChange={handleNewSkillLevelChange}
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
        );
      case "experience":
        return (
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
        );
      case "education":
        return (
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
        );
      case "contributor":
        return (
          <ContributorForm
            portfolioData={portfolioData}
            onContributorChange={handleContributorChange}
          />
        );
      default:
        return null;
    }
  };

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

      {/* Mobile: Select dropdown */}
      <div className="mdx:hidden mb-6">
        <Select
          disallowEmptySelection
          label="Edit Section"
          placeholder="Select a section to edit"
          selectedKeys={[activeTab]}
          onSelectionChange={(keys) =>
            setActiveTab(Array.from(keys)[0] as string)
          }
        >
          {tabOptions.map((option) => (
            <SelectItem key={option.key}>{option.label}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Desktop: Traditional tabs */}
      <div className="hidden mdx:block">
        <Tabs
          aria-label="Portfolio sections"
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as string)}
        >
          {tabOptions.map((option) => (
            <Tab key={option.key} title={option.label}>
              {renderTabContent()}
            </Tab>
          ))}
        </Tabs>
      </div>

      {/* Mobile: Content area */}
      <div className="mdx:hidden">{renderTabContent()}</div>

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
