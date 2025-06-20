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

      return data.valid;
    } else {
      // Token is invalid, clean up
      logout();

      return false;
    }
  } catch (error) {
    console.error("Error validating token:", error);
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

  if (response.status === 401 || response.status === 403) {
    logout();
    window.location.href = "/";
  }

  return response;
};

export const migrateOldAuth = (): void => {
  const oldAuth = localStorage.getItem("isAdmin");

  if (oldAuth === "true") {
    localStorage.removeItem("isAdmin");
  }
};
