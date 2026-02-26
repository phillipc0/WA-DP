import { authenticatedFetch } from "./auth";

import { CvDocument } from "@/types";

let pendingRequest: Promise<JSON | null> | null = null;

declare global {
  interface Window {
    getPortfolioUrl: () => string;
  }
}

export const getPortfolioData = async (): Promise<JSON | null> => {
  if (pendingRequest) {
    return pendingRequest;
  }

  pendingRequest = (async () => {
    try {
      // Add cache busting to prevent stale data after portfolio changes
      // The cache only gets used if the file is requested again within 1 second
      let portfolioUrl =
        window.getPortfolioUrl?.() ??
        "/portfolio.json?_t=" + Math.floor(Date.now() / 1000);
      const response = await fetch(portfolioUrl, {
        method: "GET",
      });

      if (response.ok) {
        return await response.json();
      } else {
        console.error(
          "Failed to fetch static portfolio.json:",
          response.statusText,
        );
        return null;
      }
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
      return null;
    } finally {
      pendingRequest = null;
    }
  })();

  return pendingRequest;
};

export const savePortfolioData = async (data: any): Promise<boolean> => {
  try {
    const response = await authenticatedFetch("/api/portfolio", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return true;
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      console.error("Failed to save portfolio data:", errorData.error);
      return false;
    }
  } catch (error) {
    console.error("Error saving portfolio data:", error);
    return false;
  }
};

const fileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Failed to read file"));
        return;
      }

      const base64 = result.split(",")[1];
      if (!base64) {
        reject(new Error("Failed to encode file"));
        return;
      }

      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

export const uploadCVDocument = async (
  file: File,
  previousFileUrl?: string,
): Promise<CvDocument | null> => {
  try {
    const base64Data = await fileToBase64(file);
    const response = await authenticatedFetch("/api/cv-document", {
      method: "POST",
      body: JSON.stringify({
        data: base64Data,
        fileName: file.name,
        mimeType: file.type || undefined,
        previousFileUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      console.error("Failed to upload CV document:", errorData.error);
      return null;
    }

    const responseData = (await response.json()) as { cvDocument?: CvDocument };
    return responseData.cvDocument ?? null;
  } catch (error) {
    console.error("Error uploading CV document:", error);
    return null;
  }
};
