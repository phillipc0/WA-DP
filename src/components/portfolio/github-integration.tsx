import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import { Spinner } from "@heroui/spinner";

import { GithubIcon } from "@/components/icons";
import { usePortfolioData } from "@/hooks/usePortfolioData";

type Repository = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
};

const getLanguageColor = (language: string): string => {
  const colors: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    "C#": "#239120",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Go: "#00ADD8",
    Rust: "#dea584",
    Swift: "#ffac45",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#1572B6",
    SCSS: "#c6538c",
    Shell: "#89e051",
    PowerShell: "#012456",
    Dockerfile: "#384d54",
    YAML: "#cb171e",
    JSON: "#292929",
    Markdown: "#083fa1",
    Vue: "#4FC08D",
    React: "#61DAFB",
    Svelte: "#ff3e00",
    Angular: "#DD0031",
    Jupyter: "#DA5B0B",
    R: "#198CE7",
    MATLAB: "#e16737",
    Lua: "#000080",
    Perl: "#0298c3",
    Scala: "#c22d40",
    Clojure: "#db5855",
    Haskell: "#5e5086",
    Elixir: "#6e4a7e",
    Erlang: "#B83998",
    F: "#b845fc",
    Julia: "#a270ba",
    Nim: "#ffc200",
    Crystal: "#000100",
    Zig: "#ec915c",
    Assembly: "#6E4C13",
    Objective: "#438eff",
    Vim: "#199f4b",
    Emacs: "#c065db",
  };
  return colors[language] || "#6b7280";
};

interface GithubIntegrationProps {
  refreshTrigger?: number;
}

export function GithubIntegration({ refreshTrigger }: GithubIntegrationProps) {
  const { portfolioData, isLoading: portfolioLoading } =
    usePortfolioData(refreshTrigger);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      const githubUsername = portfolioData.social.github;

      if (portfolioLoading || !githubUsername || githubUsername === "johndoe") {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=5`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }

        const data = await response.json();

        setRepos(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load GitHub repositories");
        setLoading(false);
        console.error(err);
      }
    };

    fetchRepos();
  }, [portfolioData.social.github, portfolioLoading]);

  return (
    <Card className="w-full border border-default-200/50 shadow-sm">
      <CardHeader className="flex gap-3 items-center bg-gradient-to-r from-default-50 to-default-100/50 border-b border-default-200/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-default-900 dark:bg-default-100">
          <GithubIcon
            className="text-default-100 dark:text-default-900"
            size={20}
          />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-foreground">
            GitHub Repositories
          </h2>
          <p className="text-sm text-default-500">
            Latest projects and contributions
          </p>
        </div>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : repos.length === 0 ? (
          <div>No repositories found</div>
        ) : (
          <div className="grid gap-4">
            {repos.map((repo, index) => (
              <Card
                key={repo.id}
                isExternal
                isHoverable
                isPressable
                as={Link}
                className="group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-default-200/50 hover:border-primary/30"
                href={repo.html_url}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                  opacity: 0,
                  transform: "translateY(20px)",
                }}
              >
                <CardBody className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-200">
                        {repo.name}
                      </h3>
                      <p className="text-sm text-default-600 mt-1 line-clamp-2">
                        {repo.description || "No description available"}
                      </p>
                    </div>
                    <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    {repo.language && (
                      <div className="flex items-center gap-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: getLanguageColor(repo.language),
                          }}
                        />
                        <span className="text-xs text-default-600 font-medium">
                          {repo.language}
                        </span>
                      </div>
                    )}

                    <Link
                      isExternal
                      className="flex items-center gap-1 text-xs text-default-500 hover:text-primary transition-colors duration-200"
                      href={`${repo.html_url}/stargazers`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{repo.stargazers_count.toLocaleString()}</span>
                    </Link>

                    <Link
                      isExternal
                      className="flex items-center gap-1 text-xs text-default-500 hover:text-primary transition-colors duration-200"
                      href={`${repo.html_url}/network/members`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          clipRule="evenodd"
                          d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 7l3.707-3.707a1 1 0 011.414 0z"
                          fillRule="evenodd"
                        />
                      </svg>
                      <span>{repo.forks_count.toLocaleString()}</span>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </CardBody>
      <CardFooter className="border-t border-default-200/50 bg-default-50/50">
        <Link
          isExternal
          className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-600 transition-colors duration-200"
          href={`https://github.com/${portfolioData.social.github}`}
        >
          <span>View all repositories</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </Link>
      </CardFooter>
    </Card>
  );
}
