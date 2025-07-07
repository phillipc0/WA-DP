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

  // Helper to render LoginModal with default props
  const renderModal = (isOpen = true) => {
    return render(
      <LoginModal
        isOpen={isOpen}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />,
    );
  };

  // Helper to mock successful fetch response
  const mockSuccessfulResponse = (responseData: any) => {
    return (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(responseData),
    });
  };

  // Helper to mock failed fetch response
  const mockFailedResponse = (error: string) => {
    return (fetch as any).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error }),
    });
  };

  // Helper to mock network error
  const mockNetworkError = (message = "Network error") => {
    return (fetch as any).mockRejectedValueOnce(new Error(message));
  };

  // Helper to mock pending fetch (never resolves)
  const mockPendingFetch = () => {
    return (fetch as any).mockImplementation(() => new Promise(() => {}));
  };

  // Helper to wait for login form to appear
  const waitForLoginForm = async () => {
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    });
  };

  // Helper to fill in login form
  const fillLoginForm = (username = "testuser", password = "password") => {
    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: username },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: password },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("renders nothing when not open", () => {
    renderModal(false);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows loading state initially when open", async () => {
    mockPendingFetch();

    renderModal();

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });

  it("shows create account form when no users exist", async () => {
    mockSuccessfulResponse({ exists: false });

    renderModal();

    await waitFor(() => {
      expect(screen.getByText("Create Admin Account")).toBeInTheDocument();
    });

    expect(screen.getByTestId("username-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  it("shows login form when users exist", async () => {
    mockSuccessfulResponse({ exists: true });

    renderModal();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    });

    expect(screen.getByTestId("username-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    mockSuccessfulResponse({ exists: true });
    mockSuccessfulResponse({
      authenticated: true,
      token: "test-token",
      user: { username: "testuser" },
    });

    renderModal();

    await waitForLoginForm();
    fillLoginForm();
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
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it("handles successful account creation", async () => {
    mockSuccessfulResponse({ exists: false });
    mockSuccessfulResponse({
      created: true,
      token: "test-token",
      user: { username: "newuser" },
    });

    renderModal();

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
    mockSuccessfulResponse({ exists: true });
    mockFailedResponse("Invalid credentials");

    renderModal();

    await waitForLoginForm();
    fillLoginForm("wronguser", "wrongpass");
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("displays server error on fetch failure", async () => {
    mockSuccessfulResponse({ exists: true });
    mockNetworkError();

    renderModal();

    await waitForLoginForm();
    fillLoginForm();
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument();
    });
  });

  it("calls onClose when cancel button is clicked", async () => {
    mockSuccessfulResponse({ exists: true });

    renderModal();

    await waitForLoginForm();

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("sets exists to false on API error", async () => {
    mockNetworkError("API error");

    renderModal();

    await waitFor(() => {
      expect(screen.getByText("Create Admin Account")).toBeInTheDocument();
    });
  });
});
