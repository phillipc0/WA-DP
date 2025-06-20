import { useEffect, useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

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
        localStorage.removeItem("isAdmin"); // Remove old auth method
        onSuccess();
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Server error");
    }
  };

  if (!isOpen) return null;

  if (exists === null) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-background p-6 rounded-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      data-testid="login-modal"
    >
      <div className="bg-background p-6 rounded-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">
          {exists ? "Login" : "Create Admin Account"}
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
          {error && <p className="text-danger">{error}</p>}
          <div className="flex gap-2 justify-end">
            <Button
              color="default"
              type="button"
              variant="flat"
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">{exists ? "Login" : "Create"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
