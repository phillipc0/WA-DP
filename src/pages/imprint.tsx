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
        intro:
          "Gemäß § 5 des deutschen Telemediengesetzes (Telemediengesetz) und anderen anwendbaren Gesetzen ist im Folgenden die rechtlich erforderliche Anbieterkennung für diese Website aufgeführt. Diese Website ist ein persönliches Portfolio, das von einer Einzelperson betrieben wird.",
        ownerTitle: "Name des Website-Eigentümers",
        addressTitle: "Anschrift",
        contactEmailTitle: "Kontakt-E-Mail",
        telephoneTitle: "Telefon",
        telephoneNote:
          "*(Für einen privaten Website-Eigentümer ist eine Telefonnummer optional, solange eine E-Mail-Adresse für schnellen Kontakt bereitgestellt wird.)",
        vatTitle: "USt-IdNr.",
        vatNote:
          "(Als Privatperson, die nicht in der umsatzsteuerpflichtigen gewerblichen Tätigkeit engagiert ist, haben Sie möglicherweise keine USt-IdNr. Wenn keine vorhanden, kann diese Zeile weggelassen werden.)",
        responsibleTitle:
          "Verantwortlich für den Inhalt (gem. § 18 Abs. 2 MStV)",
        responsibleNote:
          "(Dies ist normalerweise dieselbe Person wie oben, die zur Einhaltung des deutschen Medienrechts für die redaktionelle Inhaltsverantwortung erneut aufgeführt wird.)",
        purposeTitle: "Zweck der Website",
        purposeText:
          "Dies ist eine persönliche Entwickler-Portfolio-Website. Ihr Zweck ist es, die Fähigkeiten, Projekte und Erfahrungen des Website-Eigentümers zu präsentieren. Sie wird nicht für direkte kommerzielle Transaktionen oder E-Commerce verwendet.",
        disclaimerTitle: "Rechtlicher Haftungsausschluss",
        contentLiabilityTitle: "Inhaltshaftung",
        contentLiabilityText:
          "Als Website-Betreiber bemühe ich mich, alle Informationen auf dieser Website aktuell und korrekt zu halten. Ich kann jedoch nicht die Genauigkeit, Vollständigkeit oder Aktualität der Inhalte garantieren. Nach §§ 8–10 des Telemediengesetzes bin ich als Diensteanbieter nicht verpflichtet, übermittelte oder gespeicherte Informationen Dritter zu überwachen oder Umstände zu untersuchen, die auf rechtswidrige Aktivitäten hinweisen. Nach Benachrichtigung über spezifische Rechtsverletzungen werde ich die betroffenen Inhalte unverzüglich entfernen oder korrigieren. Bis zu einer solchen Benachrichtigung wird jede Haftung für solche Inhalte abgelehnt.",
        externalLinksTitle: "Externe Links",
        externalLinksText:
          "Diese Website enthält Links zu externen Websites Dritter (zum Beispiel Projekt-Repositories oder Social-Media-Profile). Ich habe keinen Einfluss auf den Inhalt dieser externen Websites. Daher kann ich keine Verantwortung für deren Inhalt übernehmen. Die jeweiligen Anbieter oder Betreiber der verlinkten Websites sind allein für deren Inhalt verantwortlich. Ich habe die verlinkten Seiten zum Zeitpunkt der Verlinkung auf mögliche Rechtsverletzungen überprüft, und rechtswidrige Inhalte waren zu diesem Zeitpunkt nicht erkennbar. Eine permanente Überwachung externer Links ohne konkrete Hinweise auf Rechtsverstöße ist jedoch nicht zumutbar. Wenn ich von Rechtsverletzungen auf verlinkten Websites erfahre, werde ich solche Links unverzüglich entfernen.",
        copyrightTitle: "Urheberrecht",
        copyrightText:
          "Alle Inhalte und Werke auf dieser Website, die vom Website-Eigentümer erstellt wurden (Text, Bilder, Grafiken usw.), unterliegen dem Urheberrecht. Vervielfältigung, Bearbeitung, Verteilung oder jede Form der Kommerzialisierung solcher Materialien über das, was das Urheberrecht erlaubt, hinaus erfordert die vorherige schriftliche Zustimmung des Website-Eigentümers. Soweit Inhalte auf dieser Website nicht vom Betreiber erstellt wurden, werden die geistigen Eigentumsrechte Dritter respektiert, und solche Inhalte werden gekennzeichnet (z. B. bleiben Logos oder Markennamen Dritter Eigentum ihrer jeweiligen Inhaber). Wenn Sie eine Urheberrechtsverletzung bemerken, teilen Sie mir dies bitte mit, und ich werde sie umgehend beheben.",
        noWarningTitle: "Keine Abmahnung ohne vorherigen Kontakt",
        noWarningText:
          "Sollten Inhalte oder Gestaltungsaspekte dieser Website die Rechte Dritter oder gesetzliche Bestimmungen verletzen, bitte ich um einen entsprechenden Hinweis ohne Kostennote. Ich garantiere, dass die zu Recht beanstandeten Passagen unverzüglich entfernt oder korrigiert werden, ohne dass die Einschaltung eines Rechtsbeistandes erforderlich ist. Dennoch von Ihnen ohne vorherige Kontaktaufnahme ausgelöste Kosten werden vollständig zurückgewiesen und gegebenenfalls werde ich Gegenklage wegen Verletzung vorgenannter Bestimmungen einreichen.",
        phone: "Telefon:",
        email: "E-Mail:",
        lastUpdated: "Zuletzt aktualisiert:",
      } as const;
    }
    return {
      displayTitle: "Imprint",
      noticeTitle: "Template Notice",
      noticeDesc:
        'Please replace the placeholder information below with your actual contact details before using this website publicly. Configure this in the editor under "Legal Info".',
      intro:
        "In accordance with § 5 of the German Telemedia Act (Telemediengesetz) and other applicable laws, the following is the legally required provider identification for this website. This website is a personal portfolio operated by an individual.",
      ownerTitle: "Name of Website Owner",
      addressTitle: "Address",
      contactEmailTitle: "Contact Email",
      telephoneTitle: "Telephone",
      telephoneNote:
        "*(For a private individual website owner, a telephone number is optional as long as an email address is provided for quick contact.)",
      vatTitle: "VAT ID",
      vatNote:
        "(As a private individual not engaged in VAT-taxable commercial activity, you may not have a VAT ID. If none, this line can be omitted.)",
      responsibleTitle: "Responsible for Content (gem. § 18 Abs. 2 MStV)",
      responsibleNote:
        "(This is typically the same person as above, listed again to comply with German media law for editorial content responsibility.)",
      purposeTitle: "Purpose of Website",
      purposeText:
        "This is a personal developer portfolio website. Its purpose is to showcase the skills, projects, and experiences of the site owner. It is not used for direct commercial transactions or e-commerce.",
      disclaimerTitle: "Legal Disclaimer",
      contentLiabilityTitle: "Content Liability",
      contentLiabilityText:
        "As the website operator, I strive to keep all information on this site up to date and correct. However, I cannot guarantee the accuracy, completeness, or timeliness of content. According to §§ 8–10 of the Telemediengesetz, I, as a service provider, am not obligated to monitor third-party information transmitted or stored on this site, nor to investigate circumstances indicating illegal activity. Upon notification of specific legal violations, I will promptly remove or correct the affected content. Until such notification, any liability for such content is disclaimed.",
      externalLinksTitle: "External Links",
      externalLinksText:
        "This website contains links to external websites of third parties (for example, project repositories or social media profiles). I have no influence over the content of these external sites. Therefore, I cannot accept any responsibility for their content. The respective providers or operators of linked sites are solely responsible for their content. I checked the linked pages for possible legal violations at the time of linking and no unlawful content was apparent at that time. However, continuous monitoring of external links without concrete evidence of wrongdoing is not feasible. If I become aware of any legal infringements on linked sites, I will remove such links immediately.",
      copyrightTitle: "Copyright",
      copyrightText:
        "All content and works on this website created by the site owner (text, images, graphics, etc.) are subject to copyright. Duplication, processing, distribution, or any form of commercialization of such material beyond what is permitted by copyright law requires prior written consent of the site owner. Where content on this site is not created by the operator, the intellectual property rights of third parties are respected and such content is indicated (e.g., third-party logos or brand names remain the property of their respective owners). If you notice any copyright infringement, please inform me and I will address it promptly.",
      noWarningTitle: "No Warning without Prior Contact",
      noWarningText:
        "Should any content or design aspects of this website infringe upon the rights of third parties or legal provisions, I ask for an appropriate notice without a fee. I guarantee that the rightly objected portions will be removed or corrected promptly, without the need for legal assistance. Nonetheless, any costs incurred without prior contact will be fully rejected, and if necessary, I will file a counter-claim for violation of the aforementioned provisions.",
      phone: "Phone:",
      email: "Email:",
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
                <p className="text-lg">{t.intro}</p>
              </section>

              <section className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{t.ownerTitle}</h3>
                  <p>
                    <strong>{displayName}</strong>
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{t.addressTitle}</h3>
                  <p>
                    {displayStreetAddress}
                    <br />
                    {displayZipCity}
                    <br />
                    {displayCountry}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    {t.contactEmailTitle}
                  </h3>
                  <p>
                    <strong>{t.email}</strong> {displayEmail}
                  </p>
                </div>

                {(legal.phone || !hasRequiredFields) && (
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.telephoneTitle}
                    </h3>
                    {legal.phone ? (
                      <p>
                        <strong>{t.phone}</strong> {displayPhone}
                      </p>
                    ) : (
                      <p>{displayPhone}</p>
                    )}
                    <p className="text-sm text-default-500 italic">
                      {t.telephoneNote}
                    </p>
                  </div>
                )}

                {(legal.vatId || !hasRequiredFields) && (
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{t.vatTitle}</h3>
                    <p>{displayVatId}</p>
                    <p className="text-sm text-default-500 italic">
                      {t.vatNote}
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

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{t.purposeTitle}</h3>
                  <p>{t.purposeText}</p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t.disclaimerTitle}</h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.contentLiabilityTitle}
                    </h3>
                    <p>{t.contentLiabilityText}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.externalLinksTitle}
                    </h3>
                    <p>{t.externalLinksText}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.copyrightTitle}
                    </h3>
                    <p>{t.copyrightText}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.noWarningTitle}
                    </h3>
                    <p>{t.noWarningText}</p>
                  </div>
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
