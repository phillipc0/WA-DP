import React, { useState, useRef } from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

import { Alert } from "./alert";

import {
  downloadJSON,
  validatePortfolioData,
  parseJSONFile,
} from "@/lib/portfolio-export";

interface ImportExportControlsProps {
  portfolioData: any;
  onImport: (data: any) => void;
}

/**
 * Component for importing and exporting portfolio data
 * @param props - Component props
 * @param props.portfolioData - Current portfolio data to export
 * @param props.onImport - Callback function to handle imported data
 * @returns JSX element containing import/export controls
 */
export function ImportExportControls({
  portfolioData,
  onImport,
}: ImportExportControlsProps) {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importAlert, setImportAlert] = useState(false);
  const [importAlertMessage, setImportAlertMessage] = useState("");
  const [importAlertType, setImportAlertType] = useState<"success" | "error">(
    "success",
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    try {
      downloadJSON(portfolioData, "portfolio-data.json");
    } catch {
      setImportAlertMessage("Failed to export portfolio data");
      setImportAlertType("error");
      setImportAlert(true);
    }
  };

  const handleFileSelect = (file: File | undefined) => {
    if (file && file.type === "application/json") {
      setImportFile(file);
      setImportText("");
    } else {
      setImportAlertMessage("Please select a valid JSON file");
      setImportAlertType("error");
      setImportAlert(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find((file) => file.type === "application/json");

    if (jsonFile) {
      handleFileSelect(jsonFile);
    } else {
      setImportAlertMessage("Please drop a valid JSON file");
      setImportAlertType("error");
      setImportAlert(true);
    }
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleDropZoneKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const handleTextChange = (value: string) => {
    setImportText(value);
    if (value.trim()) {
      setImportFile(null);
    }
  };

  const validateAndImport = async (data: any) => {
    // Validate the data structure
    const validation = validatePortfolioData(data);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return false;
    }

    try {
      onImport(data);
      setIsImportModalOpen(false);
      setImportText("");
      setImportFile(null);
      setValidationErrors([]);
      setImportAlertMessage("Portfolio data imported successfully!");
      setImportAlertType("success");
      setImportAlert(true);
      return true;
    } catch {
      setImportAlertMessage("Failed to import portfolio data");
      setImportAlertType("error");
      setImportAlert(true);
      return false;
    }
  };

  const handleImport = async () => {
    try {
      let data: any;

      if (importFile) {
        data = await parseJSONFile(importFile);
      } else if (importText.trim()) {
        data = JSON.parse(importText);
      } else {
        setValidationErrors([
          "Please provide JSON data either by file upload or text input",
        ]);
        return;
      }

      await validateAndImport(data);
    } catch {
      setValidationErrors(["Invalid JSON format"]);
    }
  };

  const resetImportModal = () => {
    setImportText("");
    setImportFile(null);
    setValidationErrors([]);
    setIsImportModalOpen(false);
  };

  return (
    <>
      <Button color="primary" variant="flat" onPress={handleExportJSON}>
        Export Portfolio Data
      </Button>
      <Button
        color="secondary"
        variant="flat"
        onPress={() => setIsImportModalOpen(true)}
      >
        Import Portfolio Data
      </Button>

      <Modal isOpen={isImportModalOpen} size="2xl" onClose={resetImportModal}>
        <ModalContent>
          <ModalHeader>Import Portfolio Data</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <p className="block text-sm font-medium mb-2">
                  Upload JSON File
                </p>
                <div
                  aria-label="Upload JSON file by clicking or dragging and dropping"
                  className={`
                    relative w-full min-h-[120px] p-8 border-2 border-dashed rounded-lg
                    transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary
                    ${
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-default-300 bg-default-50 hover:border-primary hover:bg-primary/5"
                    }
                  `}
                  role="button"
                  tabIndex={0}
                  onClick={handleDropZoneClick}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onKeyDown={handleDropZoneKeyDown}
                >
                  <input
                    ref={fileInputRef}
                    accept=".json"
                    className="hidden"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-3">
                      <svg
                        className={`w-12 h-12 ${isDragging ? "text-primary" : "text-default-400"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                        />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p
                        className={`text-sm font-medium ${isDragging ? "text-primary" : "text-default-700"}`}
                      >
                        {isDragging
                          ? "Drop your file here"
                          : "Drag & drop your JSON file here"}
                      </p>
                      <p className="text-xs text-default-500">
                        or click to browse files
                      </p>
                      <p className="text-xs text-default-400">
                        Only .json files are accepted
                      </p>
                    </div>
                  </div>
                </div>
                {importFile && (
                  <div className="mt-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-success"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          clipRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          fillRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm text-success font-medium">
                        File selected: {importFile.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center py-2">
                <span className="text-sm text-gray-500">OR</span>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="json-input"
                >
                  Paste JSON Data
                </label>
                <textarea
                  className="w-full min-h-[200px] px-3 py-2 rounded-md border border-default-200 bg-default-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  id="json-input"
                  placeholder="Paste your portfolio JSON data here..."
                  rows={10}
                  value={importText}
                  onChange={(e) => handleTextChange(e.target.value)}
                />
              </div>

              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <h4 className="text-sm font-medium text-red-800 mb-2">
                    Validation Errors:
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={resetImportModal}>
              Cancel
            </Button>
            <Button
              color="primary"
              isDisabled={!importFile && !importText.trim()}
              onPress={handleImport}
            >
              Import
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Alert
        confirmLabel="OK"
        isOpen={importAlert}
        message={importAlertMessage}
        title={importAlertType === "success" ? "Success" : "Error"}
        type={importAlertType}
        onClose={() => setImportAlert(false)}
      />
    </>
  );
}
