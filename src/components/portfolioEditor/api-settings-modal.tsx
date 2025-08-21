import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";

import { getAuthHeaders } from "@/lib/auth";

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiSettingsModal({ isOpen, onClose }: ApiSettingsModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [setSavedApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchApiKey = async () => {
        try {
          setIsLoading(true);
          setError(null);
          setSuccess(null);
          
          const response = await fetch("/api/gemini-key", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeaders(),
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch API key");
          }

          const data = await response.json();
          setSavedApiKey(data.apiKey);
          setApiKey(data.apiKey);
        } catch (err) {
          setError("Failed to load API key");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchApiKey();
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/gemini-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ apiKey }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to save API key");
      }

      setSavedApiKey(apiKey);
      setSuccess("API key saved successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save API key");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Gemini API Configuration</h2>
          <p className="text-default-500 text-sm font-normal">
            Configure your Gemini API key to enable AI-powered bio generation.
          </p>
        </ModalHeader>
        <ModalBody>
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Spinner size="md" />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Input
                label="Gemini API Key"
                placeholder="Enter your Gemini API key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />

              {error && (
                <p className="text-sm text-danger-500">Error: {error}</p>
              )}

              {success && (
                <p className="text-sm text-success-500">{success}</p>
              )}

              <p className="text-xs text-default-500">
                Note: You can get a free Gemini API key from{" "}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google AI Studio
                </a>
                . Your key is stored securely on the server.
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={handleClose}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={isSaving || !apiKey || isLoading}
            onPress={handleSave}
          >
            {isSaving ? (
              <>
                <Spinner className="mr-2" size="sm" />
                Saving...
              </>
            ) : (
              "Save API Key"
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}