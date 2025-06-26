import DefaultLayout from "@/layouts/default";
import { PortfolioEditor } from "@/components/edit";

export default function EditPage() {
  return (
    <DefaultLayout>
      <section className="py-8 md:py-10">
        <PortfolioEditor />
      </section>
    </DefaultLayout>
  );
}
