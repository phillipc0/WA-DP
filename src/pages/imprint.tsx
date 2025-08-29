import { Alert } from "@heroui/alert";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";

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
            <Card className="w-full border border-default-200/50 shadow-sm">
              <CardHeader>
                <h1 className="text-3xl font-bold">Imprint / Impressum</h1>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-default-500">Loading…</p>
              </CardBody>
            </Card>
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
          {!hasRequiredFields && (
            <div className="mb-6">
              <Alert
                color="warning"
                description={`Please replace the placeholder information below with your actual contact details before using this website publicly. Configure this in the editor under "Legal Info".`}
                title="Template Notice"
                variant="faded"
              />
            </div>
          )}

          <Card className="w-full border border-default-200/50 shadow-sm">
            <CardHeader>
              <h1 className="text-3xl font-bold">Imprint / Impressum</h1>
            </CardHeader>
            <Divider />
            <CardBody className="p-6 space-y-8 text-foreground leading-relaxed">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  Information according to § 5 TMG
                </h2>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Contact Information</h3>
                  <p>
                    <strong>{displayName}</strong>
                    <br />
                    {displayStreetAddress}
                    <br />
                    {displayZipCity}
                    <br />
                    {displayCountry}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Contact</h3>
                  <p>
                    {legal.phone && (
                      <>
                        <strong>Phone:</strong> {displayPhone}
                        <br />
                      </>
                    )}
                    <strong>Email:</strong> {displayEmail}
                  </p>
                </div>

                {(legal.vatId || !hasRequiredFields) && (
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">VAT ID</h3>
                    <p>
                      Sales tax identification number according to § 27a of the
                      Sales Tax Law:
                      <br />
                      {displayVatId}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    Responsible for the content according to § 55 Abs. 2 RStV
                  </h3>
                  <p>
                    {displayResponsiblePerson}
                    <br />
                    {displayResponsibleAddress}
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Disclaimer</h2>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    Accountability for content
                  </h3>
                  <p>
                    The contents of our pages have been created with the utmost
                    care. However, we cannot guarantee the contents&apos;
                    accuracy, completeness or topicality. According to statutory
                    provisions, we are furthermore responsible for our own
                    content on these web pages. In this context, please note
                    that we are accordingly not under obligation to monitor
                    merely the transmitted or saved information of third
                    parties, or investigate circumstances pointing to illegal
                    activity.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    Accountability for links
                  </h3>
                  <p>
                    Responsibility for the content of external links (to web
                    pages of third parties) lies solely with the operators of
                    the linked pages. No violations were evident to us at the
                    time of linking. Should any legal infringement become known
                    to us, we will remove the respective link immediately.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Copyright</h3>
                  <p>
                    Our web pages and their contents are subject to German
                    copyright law. Unless expressly permitted by law (§ 44a et
                    seq. of the copyright law), every form of utilizing,
                    reproducing or processing works subject to copyright
                    protection on our web pages requires the prior consent of
                    the respective owner of the rights.
                  </p>
                </div>
              </section>

              <Divider className="my-2" />
              <p className="text-sm text-default-500">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </CardBody>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}
