/**
 * Downloads JSON data as a file
 * @param data - Data to download as JSON
 * @param filename - Name of the downloaded file
 */
export function downloadJSON(
  data: any,
  filename: string = "portfolio-data.json",
) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validates portfolio data structure
 * @param data - Portfolio data to validate
 * @returns Object with validation result and error messages
 */
export function validatePortfolioData(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    errors.push("Data must be a valid JSON object");
    return { isValid: false, errors };
  }

  // Check optional basic fields - only validate if present and not empty
  const basicFields = ["name", "title", "bio", "location", "email"];
  for (const field of basicFields) {
    if (
      data[field] !== undefined &&
      data[field] !== null &&
      data[field] !== ""
    ) {
      if (typeof data[field] !== "string") {
        errors.push(`Invalid field: ${field} must be a string`);
      }
    }
  }

  // Check social object structure - optional
  if (data.social !== undefined) {
    if (typeof data.social !== "object" || data.social === null) {
      errors.push("Social links must be an object");
    } else {
      const socialFields = [
        "github",
        "twitter",
        "linkedin",
        "discord",
        "reddit",
      ];
      for (const field of socialFields) {
        if (
          data.social[field] !== undefined &&
          data.social[field] !== null &&
          data.social[field] !== ""
        ) {
          if (typeof data.social[field] !== "string") {
            errors.push(`Invalid social field: ${field} must be a string`);
          }
        }
      }
    }
  }

  // Check skills array - optional
  if (data.skills !== undefined) {
    if (!Array.isArray(data.skills)) {
      errors.push("Skills must be an array");
    } else {
      data.skills.forEach((skill: any, index: number) => {
        if (
          skill.name !== undefined &&
          skill.name !== null &&
          skill.name !== ""
        ) {
          if (typeof skill.name !== "string") {
            errors.push(`Skill ${index + 1}: name must be a string`);
          }
        }
        if (skill.level !== undefined && skill.level !== null) {
          if (
            typeof skill.level !== "number" ||
            skill.level < 0 ||
            skill.level > 100
          ) {
            errors.push(
              `Skill ${index + 1}: level must be a number between 0 and 100`,
            );
          }
        }
      });
    }
  }

  // Check cv array - optional
  if (data.cv !== undefined) {
    if (!Array.isArray(data.cv)) {
      errors.push("CV/Work experience must be an array");
    } else {
      data.cv.forEach((exp: any, index: number) => {
        const expFields = [
          "company",
          "position",
          "duration",
          "location",
          "description",
        ];
        for (const field of expFields) {
          if (
            exp[field] !== undefined &&
            exp[field] !== null &&
            exp[field] !== ""
          ) {
            if (typeof exp[field] !== "string") {
              errors.push(`Experience ${index + 1}: ${field} must be a string`);
            }
          }
        }
        if (exp.technologies !== undefined && exp.technologies !== null) {
          if (!Array.isArray(exp.technologies)) {
            errors.push(
              `Experience ${index + 1}: technologies must be an array`,
            );
          }
        }
      });
    }
  }

  // Check education array - optional
  if (data.education !== undefined) {
    if (!Array.isArray(data.education)) {
      errors.push("Education must be an array");
    } else {
      data.education.forEach((edu: any, index: number) => {
        const eduFields = [
          "institution",
          "degree",
          "duration",
          "location",
          "description",
        ];
        for (const field of eduFields) {
          if (
            edu[field] !== undefined &&
            edu[field] !== null &&
            edu[field] !== ""
          ) {
            if (typeof edu[field] !== "string") {
              errors.push(`Education ${index + 1}: ${field} must be a string`);
            }
          }
        }
      });
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Parses a JSON file and returns the data
 * @param file - File to parse
 * @returns Promise resolving to parsed JSON data
 */
export function parseJSONFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const data = JSON.parse(result);
        resolve(data);
      } catch {
        reject(new Error("Invalid JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
