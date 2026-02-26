import React, { useRef, useState } from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";

interface CvUploadControlProps {
  currentCvFileName?: string;
  isUploading?: boolean;
  onCvUpload: (file: File) => Promise<boolean>;
}

/**
 * CV upload control with modal-based drag/drop and file picker flow.
 */
export function CvUploadControl({
  currentCvFileName,
  isUploading = false,
  onCvUpload,
}: CvUploadControlProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [localSelectedFile, setLocalSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetModal = () => {
    setIsModalOpen(false);
    setIsDragging(false);
    setLocalSelectedFile(null);
  };

  const openModal = () => {
    setLocalSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileSelect = (file: File | undefined) => {
    if (!file) return;
    setLocalSelectedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files?.[0]);
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
    const droppedFile = files[0];
    handleFileSelect(droppedFile);
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
              <div
                aria-label="Upload CV PDF by clicking or dragging and dropping"
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
                  accept="application/pdf,.pdf"
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
                        : "Drag & drop your PDF file here"}
                    </p>
                    <p className="text-xs text-default-500">
                      or click to browse files
                    </p>
                    <p className="text-xs text-default-400">
                      Only .pdf files are accepted
                    </p>
                  </div>
                </div>
              </div>

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
