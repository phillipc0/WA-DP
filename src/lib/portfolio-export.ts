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

export function validatePortfolioData(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    errors.push("Data must be a valid JSON object");
    return { isValid: false, errors };
  }

  // Check required fields
  const requiredFields = ["name", "title", "bio", "location", "email"];
  for (const field of requiredFields) {
    if (!data[field] || typeof data[field] !== "string") {
      errors.push(`Missing or invalid field: ${field}`);
    }
  }

  // Check social object structure
  if (!data.social || typeof data.social !== "object") {
    errors.push("Missing or invalid social links object");
  } else {
    const socialFields = ["github", "twitter", "linkedin", "discord", "reddit"];
    for (const field of socialFields) {
      if (data.social[field] && typeof data.social[field] !== "string") {
        errors.push(`Invalid social field: ${field} must be a string`);
      }
    }
  }

  // Check skills array
  if (!Array.isArray(data.skills)) {
    errors.push("Skills must be an array");
  } else {
    data.skills.forEach((skill: any, index: number) => {
      if (!skill.name || typeof skill.name !== "string") {
        errors.push(
          `Skill ${index + 1}: name is required and must be a string`,
        );
      }
      if (
        typeof skill.level !== "number" ||
        skill.level < 0 ||
        skill.level > 100
      ) {
        errors.push(
          `Skill ${index + 1}: level must be a number between 0 and 100`,
        );
      }
    });
  }

  // Check cv array
  if (!Array.isArray(data.cv)) {
    errors.push("CV/Work experience must be an array");
  } else {
    data.cv.forEach((exp: any, index: number) => {
      const requiredExpFields = [
        "company",
        "position",
        "duration",
        "location",
        "description",
      ];
      for (const field of requiredExpFields) {
        if (!exp[field] || typeof exp[field] !== "string") {
          errors.push(
            `Experience ${index + 1}: missing or invalid field: ${field}`,
          );
        }
      }
      if (exp.technologies && !Array.isArray(exp.technologies)) {
        errors.push(`Experience ${index + 1}: technologies must be an array`);
      }
    });
  }

  // Check education array
  if (!Array.isArray(data.education)) {
    errors.push("Education must be an array");
  } else {
    data.education.forEach((edu: any, index: number) => {
      const requiredEduFields = [
        "institution",
        "degree",
        "duration",
        "location",
        "description",
      ];
      for (const field of requiredEduFields) {
        if (!edu[field] || typeof edu[field] !== "string") {
          errors.push(
            `Education ${index + 1}: missing or invalid field: ${field}`,
          );
        }
      }
    });
  }

  return { isValid: errors.length === 0, errors };
}

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
