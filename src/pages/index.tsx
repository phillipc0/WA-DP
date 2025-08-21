import DefaultLayout from "@/layouts/default";
import { Portfolio } from "@/components/portfolio";

/**
 * Main portfolio display page component
 * @returns Index page with portfolio display
 */
export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="py-8 md:py-10">
        <Portfolio />
      </section>
    </DefaultLayout>
  );
}
