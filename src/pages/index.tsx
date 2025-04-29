import { siteConfig } from "@/config/site";
import DefaultLayout from "@/layouts/default";
import { Portfolio } from "@/components/portfolio";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="py-8 md:py-10">
        <Portfolio />
      </section>
    </DefaultLayout>
  );
}
