import { Tab, Tabs } from "@heroui/tabs";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tooltip } from "@heroui/tooltip";
import React from "react";

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

        {/*TODO: move to 2 seperate component/portfolioEdiotr*/}
        <Tab key="experience" title="Work Experience">
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-xl font-bold">Work Experience</h2>
            </CardHeader>
            <CardBody className="gap-4">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Add New Experience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Position"
                    name="position"
                    placeholder="e.g. Software Engineer"
                    value={newExperience.position}
                    onChange={handleExperienceChange}
                  />
                  <Input
                    label="Company"
                    name="company"
                    placeholder="e.g. Tech Corp"
                    value={newExperience.company}
                    onChange={handleExperienceChange}
                  />
                  <Input
                    label="Duration"
                    name="duration"
                    placeholder="e.g. Jan 2020 - Present"
                    value={newExperience.duration}
                    onChange={handleExperienceChange}
                  />
                  <Input
                    label="Location"
                    name="location"
                    placeholder="e.g. San Francisco, CA"
                    value={newExperience.location}
                    onChange={handleExperienceChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="text-sm font-medium block">
                    Description
                    <textarea
                      className="w-full min-h-[100px] px-3 py-2 mt-2 rounded-md border border-default-200 bg-default-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      name="description"
                      placeholder="Describe your role and achievements..."
                      value={newExperience.description}
                      onChange={handleExperienceChange}
                    />
                  </label>
                </div>
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">
                    Technologies
                    {portfolioData.skills?.length > 0 ? (
                      <div className="mb-2">
                        <p className="text-sm text-default-500 mb-2">
                          Select from your skills:
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {portfolioData.skills
                            .filter(
                              (skill: any) => !selectedSkills.has(skill.name),
                            )
                            .map((skill: any, index: number) => (
                              <Button
                                key={index}
                                size="sm"
                                variant="bordered"
                                onPress={() =>
                                  setSelectedSkills(
                                    (prev) => new Set([...prev, skill.name]),
                                  )
                                }
                              >
                                + {skill.name}
                              </Button>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-default-500 mb-2">
                        Add skills first to select technologies.
                      </p>
                    )}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(selectedSkills).map((skill) => (
                      <span
                        key={skill}
                        className="text-xs rounded-full bg-primary-100 text-primary-800 px-3 py-1 flex items-center gap-1"
                      >
                        {skill}
                        <button
                          className="ml-1 text-danger hover:text-danger-600"
                          onClick={() => handleRemoveSelectedSkill(skill)}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <Button color="primary" onPress={handleAddExperience}>
                  Add Experience
                </Button>
              </div>

              <Divider className="my-4" />

              <div>
                <h3 className="text-lg font-medium mb-4">Current Experience</h3>
                {!portfolioData.cv || portfolioData.cv?.length === 0 ? (
                  <p className="text-default-500">
                    No work experience added yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-default-500 mb-2">
                      Drag and drop experiences to reorder them
                    </p>
                    {portfolioData.cv?.map((experience: any, index: any) => (
                      <div
                        key={index}
                        draggable
                        className="flex items-center gap-2 p-4 border border-default-200 rounded-md"
                        onDragEnd={handleExperienceDragEnd}
                        onDragLeave={handleExperienceDragLeave}
                        onDragOver={handleExperienceDragOver}
                        onDragStart={(e) => handleExperienceDragStart(e, index)}
                        onDrop={(e) => handleExperienceDrop(e, index)}
                      >
                        <div
                          className="cursor-move p-1 text-default-400 hover:text-default-600"
                          title="Drag to reorder"
                        >
                          ⋮⋮
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <div>
                              <h4 className="text-md font-semibold">
                                {experience.position} at {experience.company}
                              </h4>
                              <p className="text-sm text-default-500">
                                {experience.location} • {experience.duration}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Tooltip content="Edit experience">
                                <Button
                                  isIconOnly
                                  color="primary"
                                  variant="light"
                                  onPress={() => handleEditExperience(index)}
                                >
                                  ✎
                                </Button>
                              </Tooltip>
                              <Tooltip content="Remove experience">
                                <Button
                                  isIconOnly
                                  color="danger"
                                  variant="light"
                                  onPress={() => handleRemoveExperience(index)}
                                >
                                  ✕
                                </Button>
                              </Tooltip>
                            </div>
                          </div>
                          <p className="text-default-700">
                            {experience.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {experience.technologies?.map(
                              (tech: any, i: number) => (
                                <span
                                  key={i}
                                  className="text-xs rounded-full bg-default-100 px-3 py-1"
                                >
                                  {tech}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="education" title="Education">
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-xl font-bold">Education</h2>
            </CardHeader>
            <CardBody className="gap-4">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Add New Education</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Institution Name"
                    name="institution"
                    placeholder="e.g. XYZ University"
                    value={newEducation.institution}
                    onChange={handleEducationChange}
                  />
                  <Input
                    label="Degree"
                    name="degree"
                    placeholder="e.g. Bachelor of Science"
                    value={newEducation.degree}
                    onChange={handleEducationChange}
                  />
                  <Input
                    label="Duration"
                    name="duration"
                    placeholder="e.g. 2017 - 2021"
                    value={newEducation.duration}
                    onChange={handleEducationChange}
                  />
                  <Input
                    label="Location"
                    name="location"
                    placeholder="e.g. Boston, MA"
                    value={newEducation.location}
                    onChange={handleEducationChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="text-sm font-medium block">
                    Description
                    <textarea
                      className="w-full min-h-[100px] px-3 py-2 mt-2 rounded-md border border-default-200 bg-default-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      name="description"
                      placeholder="Describe your studies and achievements..."
                      value={newEducation.description}
                      onChange={handleEducationChange}
                    />
                  </label>
                </div>
                <Button color="primary" onPress={handleAddEducation}>
                  Add Education
                </Button>
              </div>

              <Divider className="my-4" />

              <div>
                <h3 className="text-lg font-medium mb-4">Current Education</h3>
                {!portfolioData.education ||
                portfolioData.education?.length === 0 ? (
                  <p className="text-default-500">
                    No education records added yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-default-500 mb-2">
                      Drag and drop education records to reorder them
                    </p>
                    {portfolioData.education?.map((edu: any, index: any) => (
                      <div
                        key={index}
                        draggable
                        className="flex items-center gap-2 p-4 border border-default-200 rounded-md"
                        onDragEnd={handleEducationDragEnd}
                        onDragLeave={handleEducationDragLeave}
                        onDragOver={handleEducationDragOver}
                        onDragStart={(e) => handleEducationDragStart(e, index)}
                        onDrop={(e) => handleEducationDrop(e, index)}
                      >
                        <div
                          className="cursor-move p-1 text-default-400 hover:text-default-600"
                          title="Drag to reorder"
                        >
                          ⋮⋮
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <div>
                              <h4 className="text-md font-semibold">
                                {edu.degree} from {edu.institution}
                              </h4>
                              <p className="text-sm text-default-500">
                                {edu.location} • {edu.duration}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Tooltip content="Edit education">
                                <Button
                                  isIconOnly
                                  color="primary"
                                  variant="light"
                                  onPress={() => handleEditEducation(index)}
                                >
                                  ✎
                                </Button>
                              </Tooltip>
                              <Tooltip content="Remove education">
                                <Button
                                  isIconOnly
                                  color="danger"
                                  variant="light"
                                  onPress={() => handleRemoveEducation(index)}
                                >
                                  ✕
                                </Button>
                              </Tooltip>
                            </div>
                          </div>
                          <p className="text-default-700">{edu.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
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
