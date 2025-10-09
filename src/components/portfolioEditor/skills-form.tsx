import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Slider } from "@heroui/slider";
import { Tooltip } from "@heroui/tooltip";

import { Skill, SkillLevel } from "@/types";
import { getSliderMarks, useIsSmallScreen } from "@/utils/skills.ts";

interface SkillsFormProps {
  portfolioData: any;
  newSkill: { name: string; level: SkillLevel };
  onAddSkill: () => void;
  onRemoveSkill: (index: number) => void;
  onSkillNameChange: (index: number, name: string) => void;
  onSkillLevelChange: (index: number, level: SkillLevel) => void;
  handleNewSkillLevelChange: (level: SkillLevel) => void;
  SKILL_LEVELS: SkillLevel[];
  onSkillChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
export function SkillsForm(props: SkillsFormProps) {
  const {
    portfolioData,
    newSkill,
    onAddSkill,
    onRemoveSkill,
    onSkillChange,
    onSkillNameChange,
    onSkillLevelChange,
    handleNewSkillLevelChange,
    SKILL_LEVELS,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
  } = props;

  const isSmallScreen = useIsSmallScreen();
  const isMediumScreen = useIsSmallScreen(650);
  const levelToIndex = (lvl: SkillLevel) => SKILL_LEVELS.indexOf(lvl);
  const indexToLevel = (i: number) => SKILL_LEVELS[i] as SkillLevel;
  return (
    <Card className="mt-4">
      <CardHeader>
        <h2 className="text-xl font-bold">Your Skills</h2>
      </CardHeader>

      <CardBody>
        <div className="mb-6 space-y-4">
          <h3 className="text-lg font-medium">Add New Skill</h3>
          <Input
            label="Skill name"
            name="name"
            placeholder="e.g. React"
            value={newSkill.name}
            onChange={onSkillChange}
          />
          <Slider
            disableThumbScale
            showSteps
            className="pb-4 px-5"
            label={`Proficiency: ${newSkill.level}`}
            marks={getSliderMarks(newSkill.level, isSmallScreen)}
            maxValue={4}
            minValue={0}
            name="level"
            step={1}
            value={levelToIndex(newSkill.level)}
            // @ts-ignore
            onChange={(val) => handleNewSkillLevelChange(indexToLevel(val))}
          />
          <Button
            color="primary"
            isDisabled={newSkill.name.trim() === ""}
            onPress={onAddSkill}
          >
            Add Skill
          </Button>
        </div>

        <Divider className="mb-5" />

        {portfolioData.skills.length === 0 ? (
          <p className="text-default-500">No skills added yet.</p>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-default-500 mb-2">
              Drag &amp; drop to reorder
            </p>
            {portfolioData.skills.map((skill: Skill, idx: number) => (
              <div
                key={idx}
                draggable
                className="flex items-center gap-2 border border-gray-400 rounded-md p-3 cursor-move hover:bg-default-50 transition-colors"
                onDragEnd={onDragEnd}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDragStart={(e) => onDragStart(e, idx)}
                onDrop={(e) => onDrop(e, idx)}
              >
                <div
                  className="cursor-move p-1 text-default-400 hover:text-default-600"
                  title="Drag to reorder"
                >
                  ⋮⋮
                </div>
                <div className="flex justify-between items-center gap-2">
                  <Input
                    className="max-w-[60%]"
                    size="sm"
                    value={skill.name}
                    onChange={(e) => onSkillNameChange(idx, e.target.value)}
                  />

                  <Tooltip content="Remove skill">
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      onPress={() => onRemoveSkill(idx)}
                    >
                      ✕
                    </Button>
                  </Tooltip>
                </div>

                <Slider
                  disableThumbScale
                  showSteps
                  className="px-4"
                  marks={getSliderMarks(skill.level, isMediumScreen)}
                  maxValue={4}
                  minValue={0}
                  step={1}
                  value={levelToIndex(skill.level)}
                  // @ts-ignore
                  onChange={(val) => onSkillLevelChange(idx, indexToLevel(val))}
                />
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
