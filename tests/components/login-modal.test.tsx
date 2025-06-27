import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginModal } from "@/components/login-modal";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock fetch
global.fetch = vi.fn();

describe("LoginModal", () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("renders nothing when not open", () => {
    render(
      <LoginModal
        isOpen={false}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />,
    );
    expect(screen.queryByTestId("login-modal")).not.toBeInTheDocument();
  });

  it("shows loading state initially when open", async () => {
    (fetch as any).mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <LoginModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows create account form when no users exist", async () => {
    (fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve({ exists: false }),
    });

    render(
      <LoginModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Create Admin Account")).toBeInTheDocument();
    });

    expect(screen.getByTestId("username-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  it("shows login form when users exist", async () => {
    (fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve({ exists: true }),
    });

    render(
      <LoginModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Login" }),
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId("username-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    (fetch as any)
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ exists: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            authenticated: true,
            token: "test-token",
            user: { username: "testuser" },
          }),
      });

    render(
      <LoginModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Login" }),
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "authToken",
        "test-token",
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({ username: "testuser" }),
      );
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("isAdmin");
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it("handles successful account creation", async () => {
    (fetch as any)
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ exists: false }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            created: true,
            token: "test-token",
            user: { username: "newuser" },
          }),
      });

    render(
      <LoginModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Create Admin Account")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it("displays error on failed login", async () => {
    (fetch as any)
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ exists: true }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "Invalid credentials" }),
      });

    render(
      <LoginModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Login" }),
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "wronguser" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("displays server error on fetch failure", async () => {
    (fetch as any)
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ exists: true }),
      })
      .mockRejectedValueOnce(new Error("Network error"));

    render(
      <LoginModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Login" }),
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument();
    });
  });

  it("calls onClose when cancel button is clicked", async () => {
    (fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve({ exists: true }),
    });

    render(
      <LoginModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Login" }),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("sets exists to false on API error", async () => {
    (fetch as any).mockRejectedValueOnce(new Error("API error"));

    render(
      <LoginModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Create Admin Account")).toBeInTheDocument();
    });
  });
});
