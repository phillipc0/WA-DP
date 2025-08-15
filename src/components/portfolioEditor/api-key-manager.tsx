import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";

import { getAuthHeaders } from "@/lib/auth";

export function ApiKeyManager() {
  const [apiKey, setApiKey] = useState("");
  const [savedApiKey, setSavedApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        setIsLoading(true);
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
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <h2 className="text-xl font-bold">Gemini API Key Configuration</h2>
      </CardHeader>
      <CardBody className="gap-4">
        <p className="text-default-500 text-sm">
          Configure your Gemini API key to enable AI-powered bio generation.
          Your key is stored securely on the server.
        </p>

        <div className="flex flex-col gap-2">
          <Input
            label="Gemini API Key"
            placeholder="Enter your Gemini API key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />

          <div className="flex gap-2">
            <Button
              className="w-fit"
              color="primary"
              disabled={isSaving || !apiKey}
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

            {savedApiKey && (
              <Button
                isDisabled
                className="w-fit"
                color="success"
                variant="flat"
              >
                ✓ API Key Configured
              </Button>
            )}
          </div>
        </div>

        {error && (
          <p className="text-sm text-danger-500 mt-1">Error: {error}</p>
        )}

        {success && <p className="text-sm text-success-500 mt-1">{success}</p>}

        <p className="text-xs text-default-500 mt-2">
          Note: You can get a free Gemini API key from the Google AI Studio.
        </p>
      </CardBody>
    </Card>
  );
}
