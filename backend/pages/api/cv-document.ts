import fs from "fs";
import path from "path";

import { NextApiResponse } from "next";

import {
  AuthenticatedRequest,
  authenticateToken,
  handleError,
} from "../../lib/auth";

const DATA_UPLOADS_DIR = path.join(process.cwd(), "data", "uploads");
const FRONTEND_UPLOADS_DIR = path.join(process.cwd(), "frontend", "uploads");
const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;
const BASE64_PATTERN = /^[A-Za-z0-9+/=\s]+$/;

interface CvDocument {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

interface UploadCvRequestBody {
  data?: string;
  fileName?: string;
  mimeType?: string;
  previousFileUrl?: string;
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

const ensureDirectoryExists = (directoryPath: string): void => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};

const sanitizePdfBaseName = (fileName: string): string => {
  const baseName = path.basename(fileName, path.extname(fileName));
  const sanitized = baseName
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return sanitized || "cv";
};

const buildStoredFileName = (fileName: string): string => {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${Date.now()}-${suffix}-${sanitizePdfBaseName(fileName)}.pdf`;
};

const extractStoredPdfFileName = (fileUrl: string): string | null => {
  const extracted = path.basename(fileUrl);
  if (!extracted || extracted.includes("..") || !extracted.endsWith(".pdf")) {
    return null;
  }
  return extracted;
};

const deleteFileIfExists = (filePath: string): void => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const deletePreviousFile = (fileUrl?: string): void => {
  if (!fileUrl) {
    return;
  }

  const storedFileName = extractStoredPdfFileName(fileUrl);
  if (!storedFileName) {
    return;
  }

  deleteFileIfExists(path.join(DATA_UPLOADS_DIR, storedFileName));
  deleteFileIfExists(path.join(FRONTEND_UPLOADS_DIR, storedFileName));
};

const persistPdfFile = (storedFileName: string, fileBuffer: Buffer): void => {
  ensureDirectoryExists(DATA_UPLOADS_DIR);
  ensureDirectoryExists(FRONTEND_UPLOADS_DIR);

  fs.writeFileSync(path.join(DATA_UPLOADS_DIR, storedFileName), fileBuffer);
  fs.writeFileSync(path.join(FRONTEND_UPLOADS_DIR, storedFileName), fileBuffer);
};

const isPdfContent = (fileBuffer: Buffer): boolean => {
  if (fileBuffer.length < 4) {
    return false;
  }

  return fileBuffer.subarray(0, 4).toString("ascii") === "%PDF";
};

const validateBody = (body: UploadCvRequestBody): string | null => {
  if (typeof body.fileName !== "string" || body.fileName.trim() === "") {
    return "A valid file name is required";
  }

  if (!body.fileName.toLowerCase().endsWith(".pdf")) {
    return "Only PDF files are allowed";
  }

  if (
    typeof body.mimeType === "string" &&
    body.mimeType !== "application/pdf"
  ) {
    return "Only PDF files are allowed";
  }

  if (typeof body.data !== "string" || body.data.trim() === "") {
    return "Missing file data";
  }

  if (!BASE64_PATTERN.test(body.data)) {
    return "Invalid file data";
  }

  return null;
};

const handler = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
): Promise<void> => {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const body = (req.body ?? {}) as UploadCvRequestBody;
    const validationError = validateBody(body);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    const normalizedBase64 = (body.data as string).replace(/\s/g, "");
    const fileBuffer = Buffer.from(normalizedBase64, "base64");

    if (!fileBuffer.length || !isPdfContent(fileBuffer)) {
      res.status(400).json({ error: "Invalid PDF file content" });
      return;
    }

    if (fileBuffer.byteLength > MAX_PDF_SIZE_BYTES) {
      res
        .status(400)
        .json({ error: "File is too large. Maximum size is 10MB." });
      return;
    }

    deletePreviousFile(body.previousFileUrl);

    const storedFileName = buildStoredFileName(body.fileName as string);
    persistPdfFile(storedFileName, fileBuffer);

    const cvDocument: CvDocument = {
      fileName: body.fileName as string,
      fileUrl: `/uploads/${storedFileName}`,
      fileSize: fileBuffer.byteLength,
      uploadedAt: new Date().toISOString(),
    };

    res.status(200).json({
      message: "CV uploaded successfully",
      cvDocument,
    });
  } catch (error) {
    handleError(res, error, "CV upload failed");
  }
};

export default authenticateToken(handler);
