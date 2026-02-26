import React, { useRef, useState } from "react";

interface FileDropZoneProps {
  ariaLabel: string;
  accept: string;
  defaultPrompt: string;
  fileTypeHint: string;
  onFileSelect: (file: File | undefined) => void;
}

/**
 * Reusable drag-and-drop file zone with click-to-browse support.
 * @param {FileDropZoneProps} root0 - Component props.
 * @param {string} root0.ariaLabel - Accessible label for drop zone.
 * @param {string} root0.accept - Accepted file input types.
 * @param {string} root0.defaultPrompt - Prompt shown when not dragging.
 * @param {string} root0.fileTypeHint - Secondary hint about allowed file types.
 * @param {(file: File | undefined) => void} root0.onFileSelect - Callback invoked on file select/drop.
 * @returns {import("react").ReactElement} Drop zone UI.
 */
export function FileDropZone({
  ariaLabel,
  accept,
  defaultPrompt,
  fileTypeHint,
  onFileSelect,
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e.target.files?.[0]);
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
    onFileSelect(files[0]);
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

  return (
    <div
      aria-label={ariaLabel}
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
        accept={accept}
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
            {isDragging ? "Drop your file here" : defaultPrompt}
          </p>
          <p className="text-xs text-default-500">or click to browse files</p>
          <p className="text-xs text-default-400">{fileTypeHint}</p>
        </div>
      </div>
    </div>
  );
}
