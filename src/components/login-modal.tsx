import React, { useEffect, useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Login modal component for user authentication
 * @param props - Component props
 * @param props.isOpen - Whether the modal is open
 * @param props.onClose - Callback when modal is closed
 * @param props.onSuccess - Callback when login is successful
 * @returns Login modal component
 */
export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [exists, setExists] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setExists(data.exists))
      .catch(() => setExists(false));
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && (data.created || data.authenticated)) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onSuccess();
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Server error");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {exists === null
                ? "Loading..."
                : exists
                  ? "Login"
                  : "Create Admin Account"}
            </ModalHeader>
            <ModalBody>
              {exists === null ? (
                <div
                  aria-label="Loading authentication status"
                  className="flex justify-center items-center h-24"
                  role="status"
                >
                  <p>Loading...</p>
                </div>
              ) : (
                <form
                  className="flex flex-col gap-4"
                  id="login-form"
                  onSubmit={handleSubmit}
                >
                  <Input
                    data-testid="username-input"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <Input
                    data-testid="password-input"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {error && (
                    <p aria-live="polite" className="text-danger" role="alert">
                      {error}
                    </p>
                  )}
                </form>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                type="button"
                variant="flat"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button form="login-form" type="submit">
                {exists ? "Login" : "Create"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
