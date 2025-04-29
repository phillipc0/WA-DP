import { Card, CardBody, CardHeader } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import { GithubIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";

export function PersonalInfo() {
  const { portfolio } = siteConfig;

  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <Avatar
          src={portfolio.avatar}
          alt={portfolio.name}
          size="lg"
          className="w-20 h-20"
        />
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{portfolio.name}</h1>
          <p className="text-default-500">{portfolio.title}</p>
          <div className="flex gap-2 mt-2">
            <Chip size="sm" color="primary">{portfolio.location}</Chip>
            <Chip size="sm" color="secondary">{portfolio.email}</Chip>
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="mb-4">{portfolio.bio}</p>
        <div className="flex gap-3">
          <Link 
            isExternal 
            href={`https://github.com/${portfolio.social.github}`}
            className="flex items-center gap-1"
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
          <Link 
            isExternal 
            href={`https://twitter.com/${portfolio.social.twitter}`}
          >
            Twitter
          </Link>
          <Link 
            isExternal 
            href={`https://linkedin.com/in/${portfolio.social.linkedin}`}
          >
            LinkedIn
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
