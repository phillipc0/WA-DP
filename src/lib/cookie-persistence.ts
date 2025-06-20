import { PortfolioData } from "./portfolio";

const COOKIE_NAME = "portfolio_draft";
const COOKIE_EXPIRY_DAYS = 7;

/**
 * Set a cookie with the given name, value, and expiry days
 */
function setCookie(name: string, value: string, days: number): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Get a cookie value by name
 */
function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
}

/**
 * Delete a cookie by name
 */
function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

/**
 * Save portfolio data draft to cookies
 */
export function saveDraftToCookies(data: PortfolioData): void {
  try {
    const serializedData = JSON.stringify(data);
    setCookie(
      COOKIE_NAME,
      encodeURIComponent(serializedData),
      COOKIE_EXPIRY_DAYS,
    );
  } catch (error) {
    console.error("Failed to save draft to cookies:", error);
  }
}

/**
 * Load portfolio data draft from cookies
 */
export function loadDraftFromCookies(): PortfolioData | null {
  try {
    const cookieValue = getCookie(COOKIE_NAME);
    if (!cookieValue) return null;

    const decodedValue = decodeURIComponent(cookieValue);
    return JSON.parse(decodedValue) as PortfolioData;
  } catch (error) {
    console.error("Failed to load draft from cookies:", error);
    return null;
  }
}

/**
 * Clear draft data from cookies
 */
export function clearDraftFromCookies(): void {
  deleteCookie(COOKIE_NAME);
}

/**
 * Compare two portfolio data objects to check if they're different
 */
export function hasChangesComparedToSaved(
  draft: PortfolioData,
  saved: PortfolioData,
): boolean {
  try {
    return JSON.stringify(draft) !== JSON.stringify(saved);
  } catch (error) {
    console.error("Failed to compare portfolio data:", error);
    return false;
  }
}
