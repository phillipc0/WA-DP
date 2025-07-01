import React, { useState } from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Input } from "@heroui/input";

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

  const handleExportJSON = () => {
    try {
      downloadJSON(portfolioData, "portfolio-data.json");
    } catch {
      setImportAlertMessage("Failed to export portfolio data");
      setImportAlertType("error");
      setImportAlert(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/json") {
      setImportFile(file);
      setImportText("");
    } else {
      setImportAlertMessage("Please select a valid JSON file");
      setImportAlertType("error");
      setImportAlert(true);
    }
  };

  const handleTextChange = (value: string) => {
    setImportText(value);
    if (value.trim()) {
      setImportFile(null);
    }
  };

  const validateAndImport = async (data: any) => {
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
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="file-upload"
                >
                  Upload JSON File
                </label>
                <Input
                  accept=".json"
                  className="w-full"
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                {importFile && (
                  <p className="text-sm text-green-600 mt-1">
                    File selected: {importFile.name}
                  </p>
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
