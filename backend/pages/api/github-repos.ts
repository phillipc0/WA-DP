import type { NextApiRequest, NextApiResponse } from "next";

import fs from "fs";
import path from "path";

const GITHUB_REPOS_FILE = path.join(
  process.cwd(),
  "frontend",
  "github-repos.json",
);
const REPO_PER_PAGE = 4;

type Repository = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage?: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  updated_at: string;
};

type SortOption = "updated" | "stars";

type GitHubReposData = {
  updated: Repository[];
  stars: Repository[];
  lastUpdated: string | null;
  metadata: {
    version: string;
    description: string;
    updated_at: string | null;
    username: string;
  };
  fetchConfig: {
    intervalHours: number;
    reposPerPage: number;
  };
};

/**
 * Fetches GitHub repositories for a given user and sort option
 * @param githubUsername - The GitHub username
 * @param sort - The sort option (updated or stars)
 * @returns Promise resolving to array of repositories
 */
async function fetchReposForSort(
  githubUsername: string,
  sort: SortOption,
): Promise<Repository[]> {
  try {
    let response;

    if (sort === "stars") {
      response = await fetch(
        `https://api.github.com/search/repositories?q=user:${githubUsername}&sort=stars&order=desc&per_page=${REPO_PER_PAGE}`,
      );
    } else {
      response = await fetch(
        `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=${REPO_PER_PAGE}`,
      );
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch repositories: ${response.status}`);
    }

    const data = await response.json();
    return sort === "stars" ? data.items : data;
  } catch (err) {
    console.error(`Error fetching ${sort} repos for ${githubUsername}:`, err);
    throw err;
  }
}

/**
 * Ensures the GitHub repositories file exists and returns its data
 * @returns The GitHub repositories data structure
 */
function ensureReposFileExists(): GitHubReposData {
  if (!fs.existsSync(GITHUB_REPOS_FILE)) {
    const initialData: GitHubReposData = {
      updated: [],
      stars: [],
      lastUpdated: null,
      metadata: {
        version: "1.0.0",
        description: "GitHub repositories data cache for EU compliance",
        updated_at: null,
        username: "",
      },
      fetchConfig: {
        intervalHours: 1,
        reposPerPage: REPO_PER_PAGE,
      },
    };

    const dir = path.dirname(GITHUB_REPOS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(GITHUB_REPOS_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }

  try {
    const fileContent = fs.readFileSync(GITHUB_REPOS_FILE, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading github-repos.json:", error);
    // Return default structure if file is corrupted
    return {
      updated: [],
      stars: [],
      lastUpdated: null,
      metadata: {
        version: "1.0.0",
        description: "GitHub repositories data cache for EU compliance",
        updated_at: null,
        username: "",
      },
      fetchConfig: {
        intervalHours: 1,
        reposPerPage: REPO_PER_PAGE,
      },
    };
  }
}

/**
 * Updates GitHub repositories for a specific user
 * @param githubUsername - The GitHub username to update repositories for
 * @returns Promise that resolves when update is complete
 */
async function updateReposForUser(githubUsername: string): Promise<void> {
  try {
    // Fetch both updated and starred repos
    const [updatedRepos, starredRepos] = await Promise.all([
      fetchReposForSort(githubUsername, "updated"),
      fetchReposForSort(githubUsername, "stars"),
    ]);

    const now = new Date().toISOString();
    const reposData: GitHubReposData = {
      updated: updatedRepos,
      stars: starredRepos,
      lastUpdated: now,
      metadata: {
        version: "1.0.0",
        description: "GitHub repositories data cache for EU compliance",
        updated_at: now,
        username: githubUsername,
      },
      fetchConfig: {
        intervalHours: 1,
        reposPerPage: REPO_PER_PAGE,
      },
    };

    // Ensure directory exists
    const dir = path.dirname(GITHUB_REPOS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(GITHUB_REPOS_FILE, JSON.stringify(reposData, null, 2));
  } catch (error) {
    console.error(`Failed to update repos for user ${githubUsername}:`, error);
    throw error;
  }
}

/**
 * Determines if repositories should be updated based on last update time
 * @param lastUpdated - ISO string of last update time or null
 * @param intervalHours - Hours between updates
 * @returns True if repositories should be updated
 */
function shouldUpdateRepos(
  lastUpdated: string | null,
  intervalHours: number,
): boolean {
  if (!lastUpdated) return true;

  const lastUpdateTime = new Date(lastUpdated).getTime();
  const now = Date.now();
  const intervalMs = intervalHours * 60 * 60 * 1000;

  return now - lastUpdateTime >= intervalMs;
}

/**
 * Next.js API handler for GitHub repositories management
 * @param req - The API request object
 * @param res - The API response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { username, sort = "updated", force = "false" } = req.query;

      if (!username || typeof username !== "string") {
        return res.status(400).json({ error: "GitHub username is required" });
      }

      const reposData = ensureReposFileExists();
      const sortOption = sort as SortOption;

      // Check if we should update the repos
      const forceUpdate = force === "true";
      const shouldUpdate =
        forceUpdate ||
        shouldUpdateRepos(
          reposData.lastUpdated,
          reposData.fetchConfig.intervalHours,
        );

      // Check if we need to update (forced, stale data, or different user)
      const needsUpdate =
        shouldUpdate ||
        reposData.metadata.username !== username ||
        reposData[sortOption].length === 0;

      if (needsUpdate) {
        try {
          await updateReposForUser(username);
          // Re-read the updated data
          const updatedData = ensureReposFileExists();
          return res.status(200).json({
            repos: updatedData[sortOption] || [],
            lastUpdated: updatedData.lastUpdated,
            fromCache: false,
          });
        } catch {
          // If update fails and current cached data is for the same user, return it
          if (
            reposData.metadata.username === username &&
            reposData[sortOption].length > 0
          ) {
            return res.status(200).json({
              repos: reposData[sortOption],
              lastUpdated: reposData.lastUpdated,
              fromCache: true,
              warning: "Using cached data due to fetch error",
            });
          } else {
            return res.status(503).json({
              error:
                "Failed to fetch GitHub repositories and no cached data available",
              repos: [],
              lastUpdated: null,
              fromCache: false,
            });
          }
        }
      } else {
        // Return cached data for same user
        return res.status(200).json({
          repos: reposData[sortOption] || [],
          lastUpdated: reposData.lastUpdated,
          fromCache: true,
        });
      }
    } catch (error) {
      console.error("GitHub repos API error:", error);
      return res.status(500).json({
        error: "Internal server error",
        repos: [],
        lastUpdated: null,
        fromCache: false,
      });
    }
  }

  if (req.method === "POST") {
    try {
      const { username, action } = req.body;

      if (!username || typeof username !== "string") {
        return res.status(400).json({ error: "GitHub username is required" });
      }

      if (action === "refresh") {
        await updateReposForUser(username);
        const reposData = ensureReposFileExists();

        return res.status(200).json({
          message: "GitHub repositories updated successfully",
          lastUpdated: reposData.lastUpdated,
        });
      } else {
        return res.status(400).json({ error: "Invalid action" });
      }
    } catch (error) {
      console.error("GitHub repos refresh error:", error);
      return res
        .status(500)
        .json({ error: "Failed to refresh GitHub repositories" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).json({ error: "Method not allowed" });
}
