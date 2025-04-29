import { Card, CardBody, CardHeader } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import { GithubIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { useEffect, useState } from "react";

export function PersonalInfo() {
  const [portfolioData, setPortfolioData] = useState(siteConfig.portfolio);

  // Load data from localStorage on component mount
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

  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <Avatar
          src={portfolioData.avatar}
          alt={portfolioData.name}
          size="lg"
          className="w-20 h-20"
        />
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{portfolioData.name}</h1>
          <p className="text-default-500">{portfolioData.title}</p>
          <div className="flex gap-2 mt-2">
            <Chip size="sm" color="primary">{portfolioData.location}</Chip>
            <Chip size="sm" color="secondary">{portfolioData.email}</Chip>
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="mb-4">{portfolioData.bio}</p>
        <div className="flex gap-3">
          <Link 
            isExternal 
            href={`https://github.com/${portfolioData.social.github}`}
            className="flex items-center gap-1"
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
          <Link 
            isExternal 
            href={`https://twitter.com/${portfolioData.social.twitter}`}
          >
            Twitter
          </Link>
          <Link 
            isExternal 
            href={`https://linkedin.com/in/${portfolioData.social.linkedin}`}
          >
            LinkedIn
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
