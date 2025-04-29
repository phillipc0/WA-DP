import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Link } from "@heroui/link";
import { Spinner } from "@heroui/spinner";
import { GithubIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";

type Repository = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
};

export function GithubIntegration() {
  const [portfolioData, setPortfolioData] = useState(siteConfig.portfolio);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load portfolio data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("portfolioData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setPortfolioData(parsedData);
      } catch (error) {
        console.error("Error parsing portfolio data from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.github.com/users/${portfolioData.social.github}/repos?sort=updated&per_page=5`
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
  }, [portfolioData.social.github]);

  return (
    <Card className="w-full">
      <CardHeader className="flex gap-2">
        <GithubIcon size={24} />
        <h2 className="text-xl font-bold">GitHub Repositories</h2>
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
          <div className="space-y-4">
            {repos.map((repo) => (
              <div key={repo.id} className="border-b pb-3 last:border-b-0">
                <Link href={repo.html_url} isExternal className="font-medium">
                  {repo.name}
                </Link>
                <p className="text-small text-default-500">{repo.description || "No description"}</p>
                <div className="flex gap-3 mt-2 text-small">
                  {repo.language && <span>Language: {repo.language}</span>}
                  <span>Stars: {repo.stargazers_count}</span>
                  <span>Forks: {repo.forks_count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
      <CardFooter>
        <Link 
          href={`https://github.com/${portfolioData.social.github}`} 
          isExternal
          className="flex items-center gap-1"
        >
          View all repositories
        </Link>
      </CardFooter>
    </Card>
  );
}
