import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  downloadJSON,
  validatePortfolioData,
  parseJSONFile,
} from "@/lib/portfolio-export";

// Mock DOM APIs
Object.defineProperty(window, "URL", {
  value: {
    createObjectURL: vi.fn(() => "mock-url"),
    revokeObjectURL: vi.fn(),
  },
});

// Mock document.createElement and related methods
const mockLink = {
  href: "",
  download: "",
  click: vi.fn(),
};

Object.defineProperty(document, "createElement", {
  value: vi.fn(() => mockLink),
});

Object.defineProperty(document.body, "appendChild", {
  value: vi.fn(),
});

Object.defineProperty(document.body, "removeChild", {
  value: vi.fn(),
});

describe("portfolio-export utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("downloadJSON", () => {
    it("creates a download link with correct attributes", () => {
      const testData = { name: "John Doe", skills: ["React", "TypeScript"] };
      const filename = "test-portfolio.json";

      downloadJSON(testData, filename);

      expect(document.createElement).toHaveBeenCalledWith("a");
      expect(mockLink.href).toBe("mock-url");
      expect(mockLink.download).toBe(filename);
      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(mockLink.click).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
      expect(window.URL.revokeObjectURL).toHaveBeenCalledWith("mock-url");
    });

    it("uses default filename when none provided", () => {
      const testData = { name: "Jane Doe" };

      downloadJSON(testData);

      expect(mockLink.download).toBe("portfolio-data.json");
    });

    it("creates blob with correct JSON content", () => {
      const testData = { name: "Test User", age: 25 };
      const createObjectURLSpy = vi.spyOn(window.URL, "createObjectURL");

      downloadJSON(testData);

      expect(createObjectURLSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "application/json",
        }),
      );
    });

    it("handles complex nested objects", () => {
      const complexData = {
        personal: { name: "John", location: "NYC" },
        skills: [
          { name: "React", level: 90 },
          { name: "Node.js", level: 85 },
        ],
        social: { github: "johndoe", linkedin: "john-doe" },
      };

      expect(() => downloadJSON(complexData)).not.toThrow();
      expect(mockLink.click).toHaveBeenCalled();
    });
  });

  describe("validatePortfolioData", () => {
    const validPortfolioData = {
      name: "John Doe",
      title: "Software Developer",
      bio: "Software Developer",
      location: "New York",
      email: "john@example.com",
      skills: [
        { name: "React", level: 90 },
        { name: "TypeScript", level: 85 },
      ],
      social: {
        github: "johndoe",
        linkedin: "john-doe",
        twitter: "johndoe",
      },
      cv: [
        {
          company: "Tech Corp",
          position: "Developer",
          duration: "2020-2023",
          location: "NYC",
          description: "Built web apps",
          technologies: ["React", "Node.js"],
        },
      ],
      education: [
        {
          institution: "University",
          degree: "Computer Science",
          duration: "2016-2020",
          location: "NYC",
          description: "Bachelor's degree",
        },
      ],
    };

    it("returns valid for correct portfolio data", () => {
      const result = validatePortfolioData(validPortfolioData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("allows empty string fields", () => {
      const dataWithEmptyFields = { ...validPortfolioData, name: "", title: "", bio: "" };
      const result = validatePortfolioData(dataWithEmptyFields);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("validates field types when present", () => {
      const invalidData = { ...validPortfolioData, name: 123 }; // wrong type
      const result = validatePortfolioData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Invalid field: name must be a string");
    });

    it("validates skills is an array", () => {
      const invalidData = {
        ...validPortfolioData,
        skills: "not-an-array", // should be array
      };
      const result = validatePortfolioData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Skills must be an array");
    });

    it("allows skills with missing name (optional)", () => {
      const dataWithMissingSkillName = {
        ...validPortfolioData,
        skills: [{ level: 90 }], // missing name is allowed
      };
      const result = validatePortfolioData(dataWithMissingSkillName);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("validates skill name type when present", () => {
      const invalidData = {
        ...validPortfolioData,
        skills: [{ name: 123, level: 90 }], // name should be string
      };
      const result = validatePortfolioData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Skill 1: name must be a string",
      );
    });

    it("allows skills with missing level (optional)", () => {
      const dataWithMissingSkillLevel = {
        ...validPortfolioData,
        skills: [{ name: "React" }], // missing level is allowed
      };
      const result = validatePortfolioData(dataWithMissingSkillLevel);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("validates skill level is a number", () => {
      const invalidData = {
        ...validPortfolioData,
        skills: [{ name: "React", level: "high" }], // level should be number
      };
      const result = validatePortfolioData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Skill 1: level must be a number between 0 and 100",
      );
    });

    it("validates skill level range", () => {
      const invalidData = {
        ...validPortfolioData,
        skills: [{ name: "React", level: 150 }], // level too high
      };
      const result = validatePortfolioData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Skill 1: level must be a number between 0 and 100",
      );
    });

    it("validates social object structure when present", () => {
      const invalidData = {
        ...validPortfolioData,
        social: "invalid-social", // should be object
      };
      const result = validatePortfolioData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Social links must be an object");
    });

    it("allows missing social object", () => {
      const { social, ...dataWithoutSocial } = validPortfolioData;
      const result = validatePortfolioData(dataWithoutSocial);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("validates social field values are strings", () => {
      const invalidData = {
        ...validPortfolioData,
        social: {
          github: 123, // should be string
          linkedin: "valid-string",
        },
      };
      const result = validatePortfolioData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Invalid social field: github must be a string",
      );
    });

    it("validates CV is an array", () => {
      const invalidData = {
        ...validPortfolioData,
        cv: "not-an-array", // should be array
      };
      const result = validatePortfolioData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("CV/Work experience must be an array");
    });

    it("allows CV entries with missing fields (optional)", () => {
      const dataWithPartialCV = {
        ...validPortfolioData,
        cv: [{ company: "Tech Corp" }], // missing other fields is allowed
      };
      const result = validatePortfolioData(dataWithPartialCV);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("validates CV field types when present", () => {
      const invalidData = {
        ...validPortfolioData,
        cv: [{ company: 123 }], // company should be string
      };
      const result = validatePortfolioData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Experience 1: company must be a string",
      );
    });

    it("validates education is an array", () => {
      const invalidData = {
        ...validPortfolioData,
        education: "not-an-array", // should be array
      };
      const result = validatePortfolioData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Education must be an array");
    });

    it("allows education entries with missing fields (optional)", () => {
      const dataWithPartialEducation = {
        ...validPortfolioData,
        education: [{ institution: "University" }], // missing other fields is allowed
      };
      const result = validatePortfolioData(dataWithPartialEducation);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("validates education field types when present", () => {
      const invalidData = {
        ...validPortfolioData,
        education: [{ institution: 123 }], // institution should be string
      };
      const result = validatePortfolioData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Education 1: institution must be a string",
      );
    });

    it("validates technologies array in CV", () => {
      const invalidData = {
        ...validPortfolioData,
        cv: [
          {
            company: "Tech Corp",
            position: "Developer",
            duration: "2020-2023",
            location: "NYC",
            description: "Built web apps",
            technologies: "React, Node.js", // should be array
          },
        ],
      };
      const result = validatePortfolioData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Experience 1: technologies must be an array",
      );
    });

    it("handles null/undefined data", () => {
      const result = validatePortfolioData(null);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Data must be a valid JSON object");
    });

    it("handles non-object data", () => {
      const result = validatePortfolioData("invalid");

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Data must be a valid JSON object");
    });

    it("allows completely minimal data", () => {
      const minimalData = { name: "John Doe" };
      const result = validatePortfolioData(minimalData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("allows empty object", () => {
      const emptyData = {};
      const result = validatePortfolioData(emptyData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("allows all fields to be present but empty", () => {
      const emptyFieldsData = {
        name: "",
        title: "",
        bio: "",
        location: "",
        email: "",
        skills: [],
        social: {},
        cv: [],
        education: [],
      };
      const result = validatePortfolioData(emptyFieldsData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  describe("parseJSONFile", () => {
    it("parses valid JSON file", async () => {
      const validJSON = JSON.stringify({ name: "John Doe", skills: [] });
      const file = new File([validJSON], "portfolio.json", {
        type: "application/json",
      });

      const result = await parseJSONFile(file);

      expect(result).toEqual({ name: "John Doe", skills: [] });
    });

    it("throws error for invalid JSON", async () => {
      const invalidJSON = "{ invalid json }";
      const file = new File([invalidJSON], "portfolio.json", {
        type: "application/json",
      });

      await expect(parseJSONFile(file)).rejects.toThrow();
    });

    it("handles empty file", async () => {
      const file = new File([""], "portfolio.json", {
        type: "application/json",
      });

      await expect(parseJSONFile(file)).rejects.toThrow();
    });

    it("parses complex nested JSON", async () => {
      const complexJSON = JSON.stringify({
        personal: { name: "Jane" },
        skills: [{ name: "Vue", level: 80 }],
        nested: { deep: { value: "test" } },
      });
      const file = new File([complexJSON], "portfolio.json", {
        type: "application/json",
      });

      const result = await parseJSONFile(file);

      expect(result.personal.name).toBe("Jane");
      expect(result.skills[0].level).toBe(80);
      expect(result.nested.deep.value).toBe("test");
    });
  });
});
