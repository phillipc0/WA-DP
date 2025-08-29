import DefaultLayout from "@/layouts/default";
import { usePortfolioData } from "@/hooks/usePortfolioData";

/**
 * Imprint page component for EU legal compliance
 * @returns Imprint page component
 */
export default function ImprintPage() {
  const { portfolioData, isLoading } = usePortfolioData();

  if (isLoading) {
    return (
      <DefaultLayout>
        <section className="py-8 md:py-10">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-8">Imprint / Impressum</h1>
            <p>Loading...</p>
          </div>
        </section>
      </DefaultLayout>
    );
  }

  const legal = portfolioData?.legal || {};
  const hasRequiredFields =
    legal.fullName &&
    legal.streetAddress &&
    legal.city &&
    legal.country &&
    legal.email;

  const displayName = legal.fullName || "[Your Full Name]";
  const displayStreetAddress = legal.streetAddress || "[Your Street Address]";
  const displayZipCity =
    legal.zipCode && legal.city
      ? `${legal.zipCode} ${legal.city}`
      : "[Your ZIP Code and City]";
  const displayCountry = legal.country || "[Your Country]";
  const displayPhone = legal.phone || "[Your Phone Number]";
  const displayEmail = legal.email || "[Your Email Address]";
  const displayVatId = legal.vatId || "[Your VAT ID - if applicable]";
  const displayResponsiblePerson =
    legal.responsiblePerson || legal.fullName || "[Your Full Name]";
  const displayResponsibleAddress =
    legal.responsibleAddress ||
    (legal.streetAddress && legal.city
      ? `${legal.streetAddress}, ${legal.zipCode ? legal.zipCode + " " : ""}${legal.city}`
      : "[Your Address]");

  return (
    <DefaultLayout>
      <section className="py-8 md:py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Imprint / Impressum</h1>

          {!hasRequiredFields && (
            <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-warning-500 flex items-center justify-center text-white text-sm font-bold">
                  !
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-warning-800 dark:text-warning-200 mb-2">
                    Template Notice
                  </h3>
                  <p className="text-warning-700 dark:text-warning-300">
                    Please replace the placeholder information below with your
                    actual contact details before using this website publicly.
                    Configure this in the editor under &quot;Legal Info&quot;.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2>Information according to § 5 TMG</h2>

            <h3>Contact Information</h3>
            <p>
              <strong>{displayName}</strong>
              <br />
              {displayStreetAddress}
              <br />
              {displayZipCity}
              <br />
              {displayCountry}
            </p>

            <h3>Contact</h3>
            <p>
              {legal.phone && (
                <>
                  <strong>Phone:</strong> {displayPhone}
                  <br />
                </>
              )}
              <strong>Email:</strong> {displayEmail}
            </p>

            {(legal.vatId || !hasRequiredFields) && (
              <>
                <h3>VAT ID</h3>
                <p>
                  Sales tax identification number according to § 27a of the
                  Sales Tax Law:
                  <br />
                  {displayVatId}
                </p>
              </>
            )}

            <h3>Responsible for the content according to § 55 Abs. 2 RStV</h3>
            <p>
              {displayResponsiblePerson}
              <br />
              {displayResponsibleAddress}
            </p>

            <h2>Disclaimer</h2>

            <h3>Accountability for content</h3>
            <p>
              The contents of our pages have been created with the utmost care.
              However, we cannot guarantee the contents&apos; accuracy,
              completeness or topicality. According to statutory provisions, we
              are furthermore responsible for our own content on these web
              pages. In this context, please note that we are accordingly not
              under obligation to monitor merely the transmitted or saved
              information of third parties, or investigate circumstances
              pointing to illegal activity.
            </p>

            <h3>Accountability for links</h3>
            <p>
              Responsibility for the content of external links (to web pages of
              third parties) lies solely with the operators of the linked pages.
              No violations were evident to us at the time of linking. Should
              any legal infringement become known to us, we will remove the
              respective link immediately.
            </p>

            <h3>Copyright</h3>
            <p>
              Our web pages and their contents are subject to German copyright
              law. Unless expressly permitted by law (§ 44a et seq. of the
              copyright law), every form of utilizing, reproducing or processing
              works subject to copyright protection on our web pages requires
              the prior consent of the respective owner of the rights.
            </p>

            <div className="text-sm text-gray-600 dark:text-gray-400 mt-8 pt-4 border-t">
              <p>
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
