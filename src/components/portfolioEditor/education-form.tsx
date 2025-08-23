import React from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";

import { Education } from "@/types";

interface EducationFormProps {
  newEducation: Education;
  portfolioData: any;
  handleAddEducation: () => void;
  handleRemoveEducation: (index: number) => void;
  handleEditEducation: (index: number) => void;
  handleEducationChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleEducationDragStart: (e: React.DragEvent, index: number) => void;
  handleEducationDragOver: (e: React.DragEvent) => void;
  handleEducationDragLeave: (e: React.DragEvent) => void;
  handleEducationDrop: (e: React.DragEvent, targetIndex: number) => void;
  handleEducationDragEnd: (e: React.DragEvent) => void;
}

/**
 * Form component for managing education entries
 * @param props - Component props
 * @param props.newEducation - New education entry being created
 * @param props.portfolioData - Portfolio data containing existing education entries
 * @param props.handleAddEducation - Function to add new education entry
 * @param props.handleRemoveEducation - Function to remove education entry by index
 * @param props.handleEditEducation - Function to edit education entry by index
 * @param props.handleEducationChange - Function to handle education input changes
 * @param props.handleEducationDragStart - Function to handle drag start for reordering
 * @param props.handleEducationDragOver - Function to handle drag over for reordering
 * @param props.handleEducationDragLeave - Function to handle drag leave for reordering
 * @param props.handleEducationDrop - Function to handle drop for reordering
 * @param props.handleEducationDragEnd - Function to handle drag end for reordering
 * @returns JSX element containing education form
 */
export default function EducationForm({
  newEducation,
  portfolioData,
  handleAddEducation,
  handleRemoveEducation,
  handleEditEducation,
  handleEducationChange,
  handleEducationDragStart,
  handleEducationDragOver,
  handleEducationDragLeave,
  handleEducationDrop,
  handleEducationDragEnd,
}: EducationFormProps) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <h2 className="text-xl font-bold">Education</h2>
      </CardHeader>
      <CardBody className="gap-4">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Add New Education</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Institution"
              name="institution"
              placeholder="e.g. University of California"
              value={newEducation.institution}
              onChange={handleEducationChange}
            />
            <Input
              label="Degree"
              name="degree"
              placeholder="e.g. Bachelor of Science in Computer Science"
              value={newEducation.degree}
              onChange={handleEducationChange}
            />
            <Input
              label="Duration"
              name="duration"
              placeholder="e.g. 2016 - 2020"
              value={newEducation.duration}
              onChange={handleEducationChange}
            />
            <Input
              label="Location"
              name="location"
              placeholder="e.g. Berkeley, CA"
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
                placeholder="Describe your studies, achievements, relevant coursework..."
                value={newEducation.description}
                onChange={handleEducationChange}
              />
            </label>
          </div>
          <Button
            className="w-full"
            color="primary"
            isDisabled={
              newEducation.institution.trim() === "" ||
              newEducation.degree.trim() === ""
            }
            onPress={handleAddEducation}
          >
            Add Education
          </Button>
        </div>

        {portfolioData.education && portfolioData.education.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Your Education</h3>
            <div className="space-y-4">
              {portfolioData.education.map((edu: Education, index: number) => (
                <div
                  key={index}
                  draggable
                  className="border border-default-200 rounded-lg p-4 cursor-move hover:bg-default-50 transition-colors"
                  onDragEnd={handleEducationDragEnd}
                  onDragLeave={handleEducationDragLeave}
                  onDragOver={handleEducationDragOver}
                  onDragStart={(e) => handleEducationDragStart(e, index)}
                  onDrop={(e) => handleEducationDrop(e, index)}
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
                            {edu.degree}
                          </h4>
                          <span className="text-sm text-default-500">
                            {edu.duration}
                          </span>
                        </div>
                        <p className="text-sm text-default-600 mb-2">
                          🎓 {edu.institution}
                        </p>
                        {edu.location && (
                          <p className="text-sm text-default-600 mb-2">
                            📍 {edu.location}
                          </p>
                        )}
                        {edu.description && (
                          <p className="text-sm text-default-700">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => handleEditEducation(index)}
                      >
                        ✎
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        variant="light"
                        onPress={() => handleRemoveEducation(index)}
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
