import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Tooltip } from "@heroui/tooltip";

type Skill = { name: string; level: number };

interface SkillsFormProps {
  portfolioData: any;
  newSkill: Skill;
  onAddSkill: () => void;
  onRemoveSkill: (index: number) => void;
  onSkillChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSkillLevelChange: (index: number, level: number) => void;
  onSkillNameChange: (index: number, name: string) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetIndex: number) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

/**
 * Form component for managing skills with drag-and-drop reordering
 * @param props - Component props
 * @param props.portfolioData - Portfolio data containing existing skills
 * @param props.newSkill - New skill being created
 * @param props.onAddSkill - Function to add new skill
 * @param props.onRemoveSkill - Function to remove skill by index
 * @param props.onSkillChange - Function to handle new skill input changes
 * @param props.onSkillLevelChange - Function to handle skill level changes
 * @param props.onSkillNameChange - Function to handle skill name changes
 * @param props.onDragStart - Function to handle drag start for reordering
 * @param props.onDragOver - Function to handle drag over for reordering
 * @param props.onDragLeave - Function to handle drag leave for reordering
 * @param props.onDrop - Function to handle drop for reordering
 * @param props.onDragEnd - Function to handle drag end for reordering
 * @returns JSX element containing skills management form
 */
export function SkillsForm({
  portfolioData,
  newSkill,
  onAddSkill,
  onRemoveSkill,
  onSkillChange,
  onSkillLevelChange,
  onSkillNameChange,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: SkillsFormProps) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <h2 className="text-xl font-bold">Your Skills</h2>
      </CardHeader>
      <CardBody>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Add New Skill</h3>
          <div className="flex gap-2 items-end">
            <Input
              className="flex-1"
              label="Skill Name"
              name="name"
              placeholder="e.g. React"
              value={newSkill.name}
              onChange={onSkillChange}
            />
            <Input
              className="w-32"
              label="Proficiency Level (0-100)"
              max={100}
              min={0}
              name="level"
              type="number"
              // @ts-ignore
              value={newSkill.level}
              onChange={onSkillChange}
            />
            <Button color="primary" onPress={onAddSkill}>
              Add Skill
            </Button>
          </div>
        </div>

        <Divider className="my-4" />

        <div>
          <h3 className="text-lg font-medium mb-4">Current Skills</h3>
          {portfolioData.skills.length === 0 ? (
            <p className="text-default-500">No skills added yet.</p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-default-500 mb-2">
                Drag and drop skills to reorder them
              </p>
              {portfolioData.skills.map((skill: any, index: any) => (
                <div
                  key={index}
                  draggable
                  className="flex items-center gap-2 p-2 border border-default-200 rounded-md"
                  onDragEnd={onDragEnd}
                  onDragLeave={onDragLeave}
                  onDragOver={onDragOver}
                  onDragStart={(e) => onDragStart(e, index)}
                  onDrop={(e) => onDrop(e, index)}
                >
                  <div
                    className="cursor-move p-1 text-default-400 hover:text-default-600"
                    title="Drag to reorder"
                  >
                    ⋮⋮
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <Input
                        className="max-w-[70%]"
                        placeholder="Skill name"
                        size="sm"
                        value={skill.name}
                        onChange={(e) =>
                          onSkillNameChange(index, e.target.value)
                        }
                      />
                      <span>{skill.level}%</span>
                    </div>
                    <Input
                      className="mt-1"
                      max={100}
                      min={0}
                      type="range"
                      // @ts-ignore
                      value={skill.level}
                      onChange={(e) =>
                        onSkillLevelChange(index, Number(e.target.value))
                      }
                    />
                  </div>
                  <Tooltip content="Remove skill">
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      onPress={() => onRemoveSkill(index)}
                    >
                      ✕
                    </Button>
                  </Tooltip>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
