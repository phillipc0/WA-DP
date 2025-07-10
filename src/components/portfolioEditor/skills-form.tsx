import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Slider } from "@heroui/slider";
import { Tooltip } from "@heroui/tooltip";

import { SkillLevel } from "@/types";

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

  const levelToIndex = (lvl: SkillLevel) => SKILL_LEVELS.indexOf(lvl);
  const indexToLevel = (i: number) => SKILL_LEVELS[i] as SkillLevel;

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
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
            label={`Proficiency: ${newSkill.level}`}
            marks={SKILL_LEVELS.map((label, i) => ({ value: i, label }))}
            maxValue={4}
            minValue={0}
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

        <Divider className="my-6" />

        {portfolioData.skills.length === 0 ? (
          <p className="text-default-500">No skills added yet.</p>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-default-500 mb-2">
              Drag &amp; drop to reorder
            </p>
            {portfolioData.skills.map((skill: any, idx: number) => (
              <div
                key={idx}
                draggable
                className="flex flex-col gap-2 border rounded-md p-3 cursor-move hover:bg-default-50 transition-colors"
                onDragEnd={onDragEnd}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDragStart={(e) => onDragStart(e, idx)}
                onDrop={(e) => onDrop(e, idx)}
              >
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
                  marks={SKILL_LEVELS.map((label, i) => ({ value: i, label }))}
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
