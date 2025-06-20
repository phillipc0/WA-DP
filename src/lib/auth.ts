export interface User {
  username: string;
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem("user");

  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const user = getUser();

  return !!(token && user);
};

// Server-side token validation
export const validateToken = async (): Promise<boolean> => {
  const token = getAuthToken();

  if (!token) {
    return false;
  }

  try {
    const response = await fetch("/api/validate-token", {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      const data = await response.json();

      return data.valid === true;
    } else {
      // Token is invalid, clean up
      logout();

      return false;
    }
  } catch (error) {
    // Network error or other issue, assume invalid
    logout();

    return false;
  }
};

export const logout = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  localStorage.removeItem("isAdmin"); // Remove legacy auth
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Utility to make authenticated API calls
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const headers = {
    ...getAuthHeaders(),
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If token is invalid/expired, logout user
  if (response.status === 401 || response.status === 403) {
    logout();
    // Optionally redirect to login or home page
    window.location.href = "/";
  }

  return response;
};

// Migration utility to handle old authentication method
export const migrateOldAuth = (): void => {
  const oldAuth = localStorage.getItem("isAdmin");

  if (oldAuth === "true") {
    // User was authenticated with old method, but we need to force re-login
    localStorage.removeItem("isAdmin");
    // Authentication system has been updated - user will need to re-login
  }
};
