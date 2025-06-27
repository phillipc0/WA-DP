import { PortfolioEditor } from "@/components/portfolioEditor";
import DefaultLayout from "@/layouts/default";

export default function EditPage() {
  return (
    <DefaultLayout>
      <section className="py-8 md:py-10">
        <PortfolioEditor />
      </section>
    </DefaultLayout>
  );
}
