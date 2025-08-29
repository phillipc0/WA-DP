import { Alert } from "@heroui/alert";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Select, SelectItem } from "@heroui/select";
import { useEffect, useMemo, useState } from "react";

import DefaultLayout from "@/layouts/default";
import { usePortfolioData } from "@/hooks/usePortfolioData";

/**
 * Imprint page component for EU legal compliance
 * @returns Imprint page component
 */
export default function ImprintPage() {
  const { portfolioData, isLoading } = usePortfolioData();

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

  const getInitialLang = (): "en" | "de" => {
    try {
      const saved = localStorage.getItem("legalLang");
      if (saved === "de" || saved === "en") return saved;
      const nav =
        (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        "";
      return nav.toLowerCase().startsWith("de") ? "de" : "en";
    } catch {
      return "en";
    }
  };

  const [lang, setLang] = useState<"en" | "de">(getInitialLang);
  useEffect(() => {
    try {
      localStorage.setItem("legalLang", lang);
    } catch {
      // ignore persistence errors
    }
  }, [lang]);

  const t = useMemo(() => {
    if (lang === "de") {
      return {
        displayTitle: "Impressum",
        noticeTitle: "Hinweis Vorlage",
        noticeDesc:
          'Bitte ersetzen Sie die Platzhalter unten durch Ihre tatsächlichen Kontaktdaten, bevor Sie diese Website öffentlich verwenden. Konfigurieren Sie dies im Editor unter "Legal Info".',
        tmgTitle: "Angaben gemäß § 5 TMG",
        contactInfo: "Anschrift",
        contact: "Kontakt",
        phone: "Telefon:",
        email: "E-Mail:",
        vatTitle: "USt-IdNr.",
        vatLine: "Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:",
        responsibleTitle: "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV",
        disclaimerTitle: "Haftungsausschluss",
        contentAccountabilityTitle: "Haftung für Inhalte",
        contentAccountabilityText:
          "Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Nach den gesetzlichen Bestimmungen sind wir für eigene Inhalte auf diesen Seiten verantwortlich. In diesem Zusammenhang weisen wir darauf hin, dass wir nicht verpflichtet sind, übermittelte oder gespeicherte fremde Informationen zu überwachen oder Umstände zu erforschen, die auf eine rechtswidrige Tätigkeit hinweisen.",
        linkAccountabilityTitle: "Haftung für Links",
        linkAccountabilityText:
          "Für Inhalte externer Links (zu Webseiten Dritter) ist ausschließlich der jeweilige Betreiber verantwortlich. Zum Zeitpunkt der Verlinkung waren Rechtsverstöße für uns nicht erkennbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.",
        copyrightTitle: "Urheberrecht",
        copyrightText:
          "Diese Webseiten und deren Inhalte unterliegen dem deutschen Urheberrecht. Soweit nicht gesetzlich ausdrücklich erlaubt (§§ 44a ff. UrhG), bedarf jede Verwertung, Vervielfältigung oder Verarbeitung urheberrechtlich geschützter Werke auf unseren Seiten der vorherigen Zustimmung des jeweiligen Rechteinhabers.",
        lastUpdated: "Zuletzt aktualisiert:",
      } as const;
    }
    return {
      displayTitle: "Imprint / Impressum",
      noticeTitle: "Template Notice",
      noticeDesc:
        'Please replace the placeholder information below with your actual contact details before using this website publicly. Configure this in the editor under "Legal Info".',
      tmgTitle: "Information according to § 5 TMG",
      contactInfo: "Contact Information",
      contact: "Contact",
      phone: "Phone:",
      email: "Email:",
      vatTitle: "VAT ID",
      vatLine:
        "Sales tax identification number according to § 27a of the Sales Tax Law:",
      responsibleTitle:
        "Responsible for the content according to § 55 Abs. 2 RStV",
      disclaimerTitle: "Disclaimer",
      contentAccountabilityTitle: "Accountability for content",
      contentAccountabilityText:
        "The contents of our pages have been created with the utmost care. However, we cannot guarantee the contents' accuracy, completeness or topicality. According to statutory provisions, we are furthermore responsible for our own content on these web pages. In this context, please note that we are accordingly not under obligation to monitor merely the transmitted or saved information of third parties, or investigate circumstances pointing to illegal activity.",
      linkAccountabilityTitle: "Accountability for links",
      linkAccountabilityText:
        "Responsibility for the content of external links (to web pages of third parties) lies solely with the operators of the linked pages. No violations were evident to us at the time of linking. Should any legal infringement become known to us, we will remove the respective link immediately.",
      copyrightTitle: "Copyright",
      copyrightText:
        "Our web pages and their contents are subject to German copyright law. Unless expressly permitted by law (§ 44a et seq. of the copyright law), every form of utilizing, reproducing or processing works subject to copyright protection on our web pages requires the prior consent of the respective owner of the rights.",
      lastUpdated: "Last updated:",
    } as const;
  }, [lang]);

  // Ensure hooks run before any early return
  if (isLoading) {
    return (
      <DefaultLayout>
        <section className="py-8 md:py-10">
          <div className="max-w-4xl mx-auto px-4">
            <Card className="w-full border border-default-200/50 shadow-sm">
              <CardHeader>
                <h1 className="text-3xl font-bold">{t.displayTitle}</h1>
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

  return (
    <DefaultLayout>
      <section className="py-8 md:py-10">
        <div className="max-w-4xl mx-auto px-4">
          {!hasRequiredFields && (
            <div className="mb-6">
              <Alert
                color="warning"
                description={t.noticeDesc}
                title={t.noticeTitle}
                variant="faded"
              />
            </div>
          )}

          <Card className="w-full border border-default-200/50 shadow-sm">
            <CardHeader>
              <div className="flex w-full items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">{t.displayTitle}</h1>
                <Select
                  aria-label="Language selector"
                  className="w-40"
                  selectedKeys={new Set([lang])}
                  size="sm"
                  onSelectionChange={(keys) => {
                    const k = Array.from(keys as Set<string>)[0];
                    if (k === "en" || k === "de") setLang(k);
                  }}
                >
                  <SelectItem key="en">English</SelectItem>
                  <SelectItem key="de">Deutsch</SelectItem>
                </Select>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="p-6 space-y-8 text-foreground leading-relaxed">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t.tmgTitle}</h2>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{t.contactInfo}</h3>
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
                  <h3 className="text-xl font-semibold">{t.contact}</h3>
                  <p>
                    {legal.phone && (
                      <>
                        <strong>{t.phone}</strong> {displayPhone}
                        <br />
                      </>
                    )}
                    <strong>{t.email}</strong> {displayEmail}
                  </p>
                </div>

                {(legal.vatId || !hasRequiredFields) && (
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{t.vatTitle}</h3>
                    <p>
                      {t.vatLine}
                      <br />
                      {displayVatId}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    {t.responsibleTitle}
                  </h3>
                  <p>
                    {displayResponsiblePerson}
                    <br />
                    {displayResponsibleAddress}
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t.disclaimerTitle}</h2>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    {t.contentAccountabilityTitle}
                  </h3>
                  <p>{t.contentAccountabilityText}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    {t.linkAccountabilityTitle}
                  </h3>
                  <p>{t.linkAccountabilityText}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{t.copyrightTitle}</h3>
                  <p>{t.copyrightText}</p>
                </div>
              </section>

              <Divider className="my-2" />
              <p className="text-sm text-default-500">
                {t.lastUpdated}{" "}
                {new Date().toLocaleDateString(
                  lang === "de" ? "de-DE" : "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </p>
            </CardBody>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}
