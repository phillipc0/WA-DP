import { useState } from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";

import { FileDropZone } from "./file-dropzone";

interface CvUploadControlProps {
  currentCvFileName?: string;
  isUploading?: boolean;
  onCvUpload: (file: File) => Promise<boolean>;
}

/**
 * CV upload control with modal-based drag/drop and file picker flow.
 * @param {CvUploadControlProps} root0 - Component props.
 * @param {string} [root0.currentCvFileName] - Name of the currently uploaded CV file.
 * @param {boolean} [root0.isUploading=false] - Whether a CV upload request is in progress.
 * @param {(file: File) => Promise<boolean>} root0.onCvUpload - Upload handler invoked when modal save is clicked.
 * @returns {import("react").ReactElement} CV upload trigger button and modal UI.
 */
export function CvUploadControl({
  currentCvFileName,
  isUploading = false,
  onCvUpload,
}: CvUploadControlProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localSelectedFile, setLocalSelectedFile] = useState<File | null>(null);

  const resetModal = () => {
    setIsModalOpen(false);
    setLocalSelectedFile(null);
  };

  const openModal = () => {
    setLocalSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleLocalFileSelect = (file: File | undefined) => {
    if (!file) return;
    setLocalSelectedFile(file);
  };

  const handleSave = async () => {
    if (!localSelectedFile) return;

    const success = await onCvUpload(localSelectedFile);
    if (success) {
      resetModal();
    }
  };

  return (
    <>
      <Button color="secondary" variant="flat" onPress={openModal}>
        Upload CV PDF
      </Button>

      <Modal isOpen={isModalOpen} size="2xl" onClose={resetModal}>
        <ModalContent>
          <ModalHeader>Upload CV PDF</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <FileDropZone
                accept="application/pdf,.pdf"
                ariaLabel="Upload CV PDF by clicking or dragging and dropping"
                defaultPrompt="Drag & drop your PDF file here"
                fileTypeHint="Only .pdf files are accepted"
                onFileSelect={handleLocalFileSelect}
              />

              {currentCvFileName && (
                <div className="p-3 bg-default-100 border border-default-200 rounded-lg">
                  <p className="text-sm text-default-700 font-medium">
                    Currently uploaded file: {currentCvFileName}
                  </p>
                </div>
              )}

              {localSelectedFile && (
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
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
                      File selected: {localSelectedFile.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={resetModal}>
              Cancel
            </Button>
            <Button
              color="primary"
              isDisabled={!localSelectedFile || isUploading}
              isLoading={isUploading}
              onPress={handleSave}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
