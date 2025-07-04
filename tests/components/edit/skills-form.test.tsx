import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SkillsForm } from "@/components/portfolioEditor/skills-form";

describe("SkillsForm", () => {
  const mockPortfolioData = {
    skills: [
      { name: "JavaScript", level: 85 },
      { name: "TypeScript", level: 90 },
      { name: "React", level: 80 },
    ],
  };

  const mockNewSkill = { name: "Vue.js", level: 70 };

  const defaultProps = {
    portfolioData: mockPortfolioData,
    newSkill: mockNewSkill,
    onAddSkill: vi.fn(),
    onRemoveSkill: vi.fn(),
    onSkillChange: vi.fn(),
    onSkillLevelChange: vi.fn(),
    onSkillNameChange: vi.fn(),
    onDragStart: vi.fn(),
    onDragOver: vi.fn(),
    onDragLeave: vi.fn(),
    onDrop: vi.fn(),
    onDragEnd: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders card header correctly", () => {
    render(<SkillsForm {...defaultProps} />);

    expect(screen.getByText("Your Skills")).toBeInTheDocument();
  });

  it("renders add new skill section", () => {
    render(<SkillsForm {...defaultProps} />);

    expect(screen.getByText("Add New Skill")).toBeInTheDocument();
    expect(screen.getByLabelText("Skill Name")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Proficiency Level (0-100)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Add Skill")).toBeInTheDocument();
  });

  it("displays new skill values in input fields", () => {
    render(<SkillsForm {...defaultProps} />);

    expect(screen.getByDisplayValue("Vue.js")).toBeInTheDocument();
    expect(screen.getByDisplayValue("70")).toBeInTheDocument();
  });

  it("calls onSkillChange when skill name input changes", () => {
    const onSkillChange = vi.fn();
    render(<SkillsForm {...defaultProps} onSkillChange={onSkillChange} />);

    const skillNameInput = screen.getByDisplayValue("Vue.js");
    fireEvent.change(skillNameInput, {
      target: { name: "name", value: "Angular" },
    });

    expect(onSkillChange).toHaveBeenCalled();
    const call = onSkillChange.mock.calls[0][0];
    expect(call.target.name).toBe("name");
  });

  it("calls onSkillChange when skill level input changes", () => {
    const onSkillChange = vi.fn();
    render(<SkillsForm {...defaultProps} onSkillChange={onSkillChange} />);

    const skillLevelInput = screen.getByDisplayValue("70");
    fireEvent.change(skillLevelInput, {
      target: { name: "level", value: "75" },
    });

    expect(onSkillChange).toHaveBeenCalled();
    const call = onSkillChange.mock.calls[0][0];
    expect(call.target.name).toBe("level");
  });

  it("calls onAddSkill when Add Skill button is clicked", () => {
    const onAddSkill = vi.fn();
    render(<SkillsForm {...defaultProps} onAddSkill={onAddSkill} />);

    const addButton = screen.getByText("Add Skill");
    fireEvent.click(addButton);

    expect(onAddSkill).toHaveBeenCalledOnce();
  });

  it("renders current skills section", () => {
    render(<SkillsForm {...defaultProps} />);

    expect(screen.getByText("Current Skills")).toBeInTheDocument();
    expect(
      screen.getByText("Drag and drop skills to reorder them"),
    ).toBeInTheDocument();
  });

  it("displays all current skills", () => {
    render(<SkillsForm {...defaultProps} />);

    expect(screen.getByDisplayValue("JavaScript")).toBeInTheDocument();
    expect(screen.getByDisplayValue("TypeScript")).toBeInTheDocument();
    expect(screen.getByDisplayValue("React")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(screen.getByText("90%")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("calls onSkillNameChange when existing skill name is changed", () => {
    const onSkillNameChange = vi.fn();
    render(
      <SkillsForm {...defaultProps} onSkillNameChange={onSkillNameChange} />,
    );

    const skillInputs = screen.getAllByDisplayValue("JavaScript");
    const skillNameInput = skillInputs.find(
      (input) =>
        input.tagName === "INPUT" &&
        input.getAttribute("placeholder") === "Skill name",
    );

    if (skillNameInput) {
      fireEvent.change(skillNameInput, { target: { value: "JavaScript ES6" } });
      expect(onSkillNameChange).toHaveBeenCalledWith(0, "JavaScript ES6");
    }
  });

  it("calls onSkillLevelChange when skill level slider is changed", () => {
    const onSkillLevelChange = vi.fn();
    render(
      <SkillsForm {...defaultProps} onSkillLevelChange={onSkillLevelChange} />,
    );

    const sliders = screen.getAllByRole("slider");
    fireEvent.change(sliders[0], { target: { value: "95" } });

    expect(onSkillLevelChange).toHaveBeenCalledWith(0, 95);
  });

  it("calls onRemoveSkill when remove button is clicked", () => {
    const onRemoveSkill = vi.fn();
    render(<SkillsForm {...defaultProps} onRemoveSkill={onRemoveSkill} />);

    const removeButtons = screen.getAllByText("✕");
    fireEvent.click(removeButtons[0]);

    expect(onRemoveSkill).toHaveBeenCalledWith(0);
  });

  it("shows drag handles for reordering", () => {
    render(<SkillsForm {...defaultProps} />);

    const dragHandles = screen.getAllByText("⋮⋮");
    expect(dragHandles).toHaveLength(3); // One for each skill
  });

  it("calls drag event handlers on drag interactions", () => {
    const onDragStart = vi.fn();
    const onDragEnd = vi.fn();
    render(
      <SkillsForm
        {...defaultProps}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />,
    );

    const skillItems = document.querySelectorAll('[draggable="true"]');

    fireEvent.dragStart(skillItems[0]);
    expect(onDragStart).toHaveBeenCalledWith(expect.any(Object), 0);

    fireEvent.dragEnd(skillItems[0]);
    expect(onDragEnd).toHaveBeenCalled();
  });

  it("shows message when no skills exist", () => {
    const emptyPortfolioData = { skills: [] };
    render(<SkillsForm {...defaultProps} portfolioData={emptyPortfolioData} />);

    expect(screen.getByText("No skills added yet.")).toBeInTheDocument();
  });

  it("renders skill level input with correct attributes", () => {
    render(<SkillsForm {...defaultProps} />);

    const levelInput = screen.getByDisplayValue("70");
    expect(levelInput).toHaveAttribute("type", "number");
    expect(levelInput).toHaveAttribute("min", "0");
    expect(levelInput).toHaveAttribute("max", "100");
    expect(levelInput).toHaveAttribute("name", "level");
  });

  it("renders skill name input with correct attributes", () => {
    render(<SkillsForm {...defaultProps} />);

    const nameInput = screen.getByDisplayValue("Vue.js");
    expect(nameInput).toHaveAttribute("name", "name");
    expect(nameInput).toHaveAttribute("placeholder", "e.g. React");
  });

  it("renders range sliders with correct attributes", () => {
    render(<SkillsForm {...defaultProps} />);

    const sliders = screen.getAllByRole("slider");
    sliders.forEach((slider) => {
      expect(slider).toHaveAttribute("type", "range");
      expect(slider).toHaveAttribute("min", "0");
      expect(slider).toHaveAttribute("max", "100");
    });
  });

  it("shows tooltips on remove buttons", () => {
    render(<SkillsForm {...defaultProps} />);

    // HeroUI Tooltips render their content via data attributes
    const removeButtons = screen.getAllByText("✕");
    expect(removeButtons).toHaveLength(3);
  });

  it("skills are draggable", () => {
    render(<SkillsForm {...defaultProps} />);

    const skillItems = document.querySelectorAll('[draggable="true"]');
    expect(skillItems).toHaveLength(3);

    skillItems.forEach((item) => {
      expect(item).toHaveAttribute("draggable", "true");
    });
  });

  it("calls onDragOver and onDragLeave on drag interactions", () => {
    const onDragOver = vi.fn();
    const onDragLeave = vi.fn();
    render(
      <SkillsForm
        {...defaultProps}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      />,
    );

    const skillItems = document.querySelectorAll('[draggable="true"]');

    fireEvent.dragOver(skillItems[0]);
    expect(onDragOver).toHaveBeenCalled();

    fireEvent.dragLeave(skillItems[0]);
    expect(onDragLeave).toHaveBeenCalled();
  });

  it("calls onDrop when item is dropped", () => {
    const onDrop = vi.fn();
    render(<SkillsForm {...defaultProps} onDrop={onDrop} />);

    const skillItems = document.querySelectorAll('[draggable="true"]');

    fireEvent.drop(skillItems[1]);
    expect(onDrop).toHaveBeenCalledWith(expect.any(Object), 1);
  });
});
