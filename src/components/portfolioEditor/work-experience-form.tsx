import React from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";

import { Experience } from "@/types";

interface WorkExperienceFormProps {
  newExperience: Experience;
  selectedSkills: Set<string>;
  setSelectedSkills: (skills: Set<string>) => void;
  portfolioData: any;
  handleAddExperience: () => void;
  handleRemoveExperience: (index: number) => void;
  handleEditExperience: (index: number) => void;
  handleExperienceChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleRemoveSelectedSkill: (skillName: string) => void;
  handleExperienceDragStart: (e: React.DragEvent, index: number) => void;
  handleExperienceDragOver: (e: React.DragEvent) => void;
  handleExperienceDragLeave: (e: React.DragEvent) => void;
  handleExperienceDrop: (e: React.DragEvent, targetIndex: number) => void;
  handleExperienceDragEnd: (e: React.DragEvent) => void;
}

export default function WorkExperienceForm({
  newExperience,
  selectedSkills,
  setSelectedSkills,
  portfolioData,
  handleAddExperience,
  handleRemoveExperience,
  handleEditExperience,
  handleExperienceChange,
  handleRemoveSelectedSkill,
  handleExperienceDragStart,
  handleExperienceDragOver,
  handleExperienceDragLeave,
  handleExperienceDrop,
  handleExperienceDragEnd,
}: WorkExperienceFormProps) {
  return (
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
                      .filter((skill: any) => !selectedSkills.has(skill.name))
                      .map((skill: any, index: number) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="bordered"
                          onPress={() =>
                            setSelectedSkills(
                              new Set([...selectedSkills, skill.name]),
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
                    className="text-primary-600 hover:text-primary-800"
                    onClick={() => handleRemoveSelectedSkill(skill)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <Button
            className="w-full"
            color="primary"
            isDisabled={
              newExperience.position.trim() === "" ||
              newExperience.company.trim() === ""
            }
            onPress={handleAddExperience}
          >
            Add Experience
          </Button>
        </div>

        {portfolioData.cv && portfolioData.cv.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Your Experiences</h3>
            <div className="space-y-4">
              {portfolioData.cv.map((exp: Experience, index: number) => (
                <div
                  key={index}
                  draggable
                  className="border border-default-200 rounded-lg p-4 cursor-move hover:bg-default-50 transition-colors"
                  onDragEnd={handleExperienceDragEnd}
                  onDragLeave={handleExperienceDragLeave}
                  onDragOver={handleExperienceDragOver}
                  onDragStart={(e) => handleExperienceDragStart(e, index)}
                  onDrop={(e) => handleExperienceDrop(e, index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                      <div
                        className="cursor-move p-1 text-default-400 hover:text-default-600"
                        title="Drag to reorder"
                      >
                        ⋮⋮
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-lg">
                            {exp.position} at {exp.company}
                          </h4>
                          <span className="text-sm text-default-500">
                            {exp.duration}
                          </span>
                        </div>
                        {exp.location && (
                          <p className="text-sm text-default-600 mb-2">
                            📍 {exp.location}
                          </p>
                        )}
                        {exp.description && (
                          <p className="text-sm text-default-700 mb-3">
                            {exp.description}
                          </p>
                        )}
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {exp.technologies.map(
                              (tech: string, techIndex: number) => (
                                <span
                                  key={techIndex}
                                  className="text-xs rounded-full bg-secondary-100 text-secondary-800 px-2 py-1"
                                >
                                  {tech}
                                </span>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => handleEditExperience(index)}
                      >
                        ✎
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        variant="light"
                        onPress={() => handleRemoveExperience(index)}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
