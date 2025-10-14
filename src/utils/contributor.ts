/**
 * Utility functions for contributor-related operations
 */

/**
 * List of GitHub usernames that are contributors to the WA-DP project
 */
export const CONTRIBUTOR_USERS = [
  "phillipc0",
  "rbn-apps",
  "freakmedialp",
  "joos-too",
];

/**
 * Checks if a GitHub username is a contributor to the WA-DP project
 * @param githubUsername - The GitHub username to check
 * @returns True if the username is a contributor, false otherwise
 */
export function isContributor(githubUsername?: string): boolean {
  if (!githubUsername) return false;
  return CONTRIBUTOR_USERS.includes(githubUsername.toLowerCase());
}
