import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { Navbar } from "@/components/navbar";

// Mock dependencies
vi.mock("@/components/theme-switch", () => ({
  ThemeSwitch: () => <div data-testid="theme-switch">ThemeSwitch</div>,
}));

vi.mock("@/components/icons", () => ({
  Logo: () => <div data-testid="logo">Logo</div>,
}));

vi.mock("@/components/login-modal", () => ({
  LoginModal: ({
    isOpen,
    onClose,
    onSuccess,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
  }) =>
    isOpen ? (
      <div data-testid="login-modal">
        <button onClick={onClose} data-testid="modal-close">
          Close
        </button>
        <button onClick={onSuccess} data-testid="modal-success">
          Success
        </button>
        Login Modal
      </div>
    ) : null,
}));

vi.mock("@/config/site", () => ({
  siteConfig: {
    navItems: [
      { label: "Home", href: "/" },
      { label: "Edit", href: "/edit" },
    ],
    navMenuItems: [
      { label: "Home", href: "/" },
      { label: "Edit", href: "/edit" },
      { label: "Logout", href: "/logout" },
    ],
  },
}));

vi.mock("@/lib/auth", () => ({
  isAuthenticated: vi.fn(),
  logout: vi.fn(),
  migrateOldAuth: vi.fn(),
  validateToken: vi.fn(),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock window.location
const mockReload = vi.fn();
Object.defineProperty(window, "location", {
  value: {
    pathname: "/",
    reload: mockReload,
  },
  writable: true,
});

const renderNavbar = () => {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>,
  );
};

describe("Navbar", () => {
  // Helper function to get mocked auth dependencies
  const getMockAuthDependencies = async () => {
    const { isAuthenticated, validateToken, logout, migrateOldAuth } =
      await vi.importMock("@/lib/auth");

    return {
      mockIsAuthenticated: isAuthenticated as any,
      mockValidateToken: validateToken as any,
      mockLogout: logout as any,
      mockMigrateOldAuth: migrateOldAuth as any,
    };
  };

  // Helper to setup unauthenticated state
  const setupUnauthenticatedState = async () => {
    const { mockIsAuthenticated, mockValidateToken } =
      await getMockAuthDependencies();
    mockIsAuthenticated.mockReturnValue(false);
    mockValidateToken.mockResolvedValue(false);
    return { mockIsAuthenticated, mockValidateToken };
  };

  // Helper to set up authenticated state
  const setupAuthenticatedState = async () => {
    const { mockIsAuthenticated, mockValidateToken } =
      await getMockAuthDependencies();
    mockIsAuthenticated.mockReturnValue(true);
    mockValidateToken.mockResolvedValue(true);
    return { mockIsAuthenticated, mockValidateToken };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.location.pathname = "/";
  });

  it("renders brand with logo and link", () => {
    renderNavbar();

    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByText("WA-DP")).toBeInTheDocument();

    const brandLink = screen.getByRole("link", { name: /logo wa-dp/i });
    expect(brandLink).toHaveAttribute(
      "href",
      "https://github.com/phillipc0/WA-DP",
    );
    expect(brandLink).toHaveAttribute("target", "_blank");
  });

  it("renders theme switch components", () => {
    renderNavbar();

    const themeSwitches = screen.getAllByTestId("theme-switch");
    expect(themeSwitches).toHaveLength(2); // One in desktop nav, one in mobile nav
  });

  it("shows login button when user is not authenticated", async () => {
    await setupUnauthenticatedState();

    renderNavbar();

    await waitFor(() => {
      expect(screen.getByTestId("login-button")).toBeInTheDocument();
      expect(screen.getByText("Login")).toBeInTheDocument();
    });
  });

  it("shows logout button when user is authenticated", async () => {
    await setupAuthenticatedState();

    renderNavbar();

    await waitFor(() => {
      expect(screen.getByTestId("logout-button")).toBeInTheDocument();
      expect(screen.getByText("Logout")).toBeInTheDocument();
    });
  });

  it("opens login modal when login button is clicked", async () => {
    await setupUnauthenticatedState();

    renderNavbar();

    await waitFor(() => {
      expect(screen.getByTestId("login-button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("login-button"));

    expect(screen.getByTestId("login-modal")).toBeInTheDocument();
  });

  it("calls logout and reloads page when logout button is clicked", async () => {
    const { mockLogout } = await getMockAuthDependencies();
    await setupAuthenticatedState();

    renderNavbar();

    await waitFor(() => {
      expect(screen.getByTestId("logout-button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("logout-button"));

    expect(mockLogout).toHaveBeenCalled();
    expect(mockReload).toHaveBeenCalled();
  });

  it("navigates to home when logout is clicked from portfolioEditor page", async () => {
    const { mockLogout } = await getMockAuthDependencies();
    await setupAuthenticatedState();
    window.location.pathname = "/edit";

    renderNavbar();

    await waitFor(() => {
      expect(screen.getByTestId("logout-button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("logout-button"));

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
    expect(mockReload).not.toHaveBeenCalled();
  });

  it("handles successful login by closing modal and navigating to portfolioEditor", async () => {
    await setupUnauthenticatedState();

    renderNavbar();

    await waitFor(() => {
      expect(screen.getByTestId("login-button")).toBeInTheDocument();
    });

    // Open modal
    fireEvent.click(screen.getByTestId("login-button"));
    expect(screen.getByTestId("login-modal")).toBeInTheDocument();

    // Trigger successful login
    fireEvent.click(screen.getByTestId("modal-success"));

    expect(screen.queryByTestId("login-modal")).not.toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith("/edit");
  });

  it("closes login modal when close button is clicked", async () => {
    await setupUnauthenticatedState();

    renderNavbar();

    await waitFor(() => {
      expect(screen.getByTestId("login-button")).toBeInTheDocument();
    });

    // Open modal
    fireEvent.click(screen.getByTestId("login-button"));
    expect(screen.getByTestId("login-modal")).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByTestId("modal-close"));
    expect(screen.queryByTestId("login-modal")).not.toBeInTheDocument();
  });

  it("shows portfolioEditor nav item only when user is authenticated", async () => {
    // First test unauthenticated state
    await setupUnauthenticatedState();

    renderNavbar();

    await waitFor(() => {
      // In unauthenticated state, Edit should only appear in mobile menu, not desktop nav
      const navbarContent = document.querySelector('[data-justify="start"]');
      expect(navbarContent?.textContent).not.toContain("Edit");
    });
  });

  it("renders navigation items with correct links", async () => {
    await setupAuthenticatedState();

    renderNavbar();

    await waitFor(() => {
      // Home should be available for authenticated users
      const homeLinks = screen.getAllByText("Home");
      expect(homeLinks.length).toBeGreaterThan(0);

      // Check that navigation structure exists
      const navigation = screen.getByRole("navigation");
      expect(navigation).toBeInTheDocument();
    });
  });

  it("renders mobile menu structure", async () => {
    await setupUnauthenticatedState();

    renderNavbar();

    await waitFor(() => {
      // Check that mobile menu toggle exists
      const menuToggle = screen.getByText(/open navigation menu/i);
      expect(menuToggle).toBeInTheDocument();

      // Home should not be present in navigation when unauthenticated
      const homeLink = screen.queryByText("Home");
      expect(homeLink).toBeNull();
    });
  });

  it("renders basic navigation structure", async () => {
    await setupUnauthenticatedState();

    renderNavbar();

    await waitFor(() => {
      // Check that basic navigation links exist
      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);

      // Check that theme switches are present
      const themeSwitches = screen.getAllByTestId("theme-switch");
      expect(themeSwitches.length).toBeGreaterThan(0);
    });
  });

  it("calls migrateOldAuth on component mount", async () => {
    const { mockMigrateOldAuth } = await getMockAuthDependencies();
    await setupUnauthenticatedState();

    renderNavbar();

    await waitFor(() => {
      expect(mockMigrateOldAuth).toHaveBeenCalled();
    });
  });

  it("validates token when user is authenticated", async () => {
    const { mockValidateToken } = await setupAuthenticatedState();

    renderNavbar();

    await waitFor(() => {
      expect(mockValidateToken).toHaveBeenCalled();
    });
  });

  it("sets admin state to false when token validation fails", async () => {
    const { mockIsAuthenticated, mockValidateToken } =
      await getMockAuthDependencies();
    mockIsAuthenticated.mockReturnValue(true);
    mockValidateToken.mockResolvedValue(false);

    renderNavbar();

    await waitFor(() => {
      expect(screen.getByTestId("login-button")).toBeInTheDocument();
      expect(screen.queryByTestId("logout-button")).not.toBeInTheDocument();
    });
  });

  it("renders navbar with correct HeroUI props", () => {
    renderNavbar();

    // Check that the navbar container exists
    const navbar =
      document.querySelector("[data-slot='base']") ||
      document.querySelector(".heroui-navbar") ||
      screen.getByRole("navigation");
    expect(navbar).toBeInTheDocument();
  });

  it("renders mobile menu toggle", () => {
    renderNavbar();

    // The NavbarMenuToggle should be rendered - check for the hamburger menu button
    const menuToggle = screen.getByText(/open navigation menu/i);
    expect(menuToggle).toBeInTheDocument();

    // Also verify navigation structure exists
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("handles authentication state changes correctly", async () => {
    // Start unauthenticated
    await setupUnauthenticatedState();

    renderNavbar();

    await waitFor(() => {
      expect(screen.getByTestId("login-button")).toBeInTheDocument();
    });

    // Simulate login success which updates state
    fireEvent.click(screen.getByTestId("login-button"));
    fireEvent.click(screen.getByTestId("modal-success"));

    // After login success, logout button should appear
    await waitFor(() => {
      expect(screen.getByTestId("logout-button")).toBeInTheDocument();
    });
  });
});
