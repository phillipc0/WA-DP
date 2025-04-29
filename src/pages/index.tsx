import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import { Portfolio } from "@/components/portfolio";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title()}>Welcome to&nbsp;</span>
          <span className={title({ color: "violet" })}>My Portfolio&nbsp;</span>
          <div className={subtitle({ class: "mt-4" })}>
            Check out my skills and projects below
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            isExternal
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href={siteConfig.links.docs}
          >
            Documentation
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={`https://github.com/${siteConfig.portfolio.social.github}`}
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
        </div>
      </section>

      <section className="py-8 md:py-10">
        <Portfolio />
      </section>
    </DefaultLayout>
  );
}
