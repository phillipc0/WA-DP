import { Alert } from "@heroui/alert";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { Select, SelectItem } from "@heroui/select";
import { useEffect, useMemo, useState } from "react";

import DefaultLayout from "@/layouts/default";
import { usePortfolioData } from "@/hooks/usePortfolioData";

/**
 * Privacy Policy page component for EU legal compliance (GDPR)
 * @returns Privacy Policy page component
 */
export default function PrivacyPage() {
  const { portfolioData, isLoading } = usePortfolioData();
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
        displayTitle: "Datenschutzerklärung",
        noticeTitle: "Hinweis Vorlage",
        noticeDesc:
          'Bitte prüfen und passen Sie diese Datenschutzerklärung an Ihre konkreten Verarbeitungstätigkeiten und rechtlichen Anforderungen an. Konfigurieren Sie Ihre rechtlichen Informationen im Editor unter "Legal Info".',
        dpGlanceTitle: "1. Datenschutz auf einen Blick",
        generalInfoTitle: "Allgemeine Hinweise",
        generalInfoText:
          "Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer nachstehenden Datenschutzerklärung.",
        responsibleQuestionTitle:
          "Wer ist verantwortlich für die Datenerfassung auf dieser Website?",
        responsibleQuestionText:
          'Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten entnehmen Sie dem Abschnitt "Verantwortliche Stelle" dieser Datenschutzerklärung.',
        collectHowTitle: "Wie erfassen wir Ihre Daten?",
        collectHowText1:
          "Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.",
        collectHowText2:
          "Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie unsere Website betreten.",
        responsibleSectionTitle:
          "2. Verantwortliche Stelle für die Datenverarbeitung",
        responsibleIntro:
          "Verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:",
        phone: "Telefon:",
        email: "E-Mail:",
        rightsTitle: "3. Ihre Rechte gemäß DSGVO",
        rightsIntro:
          "Sie haben bezüglich Ihrer personenbezogenen Daten insbesondere folgende Rechte:",
        rights: [
          "Auskunft (Art. 15 DSGVO) – Auskunft über die bei uns gespeicherten Daten und deren Verarbeitung",
          "Berichtigung (Art. 16 DSGVO) – Berichtigung unrichtiger personenbezogener Daten",
          "Löschung (Art. 17 DSGVO) – Löschung Ihrer bei uns gespeicherten Daten, sofern keine gesetzliche Aufbewahrungspflicht besteht",
          "Einschränkung der Verarbeitung (Art. 18 DSGVO) – Einschränkung der Verarbeitung Ihrer personenbezogenen Daten",
          "Datenübertragbarkeit (Art. 20 DSGVO) – Herausgabe Ihrer Daten in einem strukturierten, gängigen und maschinenlesbaren Format",
          "Widerspruch (Art. 21 DSGVO) – Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten",
        ],
        dataCollectionTitle: "4. Datenerfassung auf dieser Website",
        cookiesTitle: "Cookies",
        cookiesText:
          'Unsere Internetseiten verwenden sogenannte "Cookies". Cookies richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (persistente Cookies) auf Ihrem Endgerät gespeichert. Session-Cookies werden nach Ende Ihres Besuchs automatisch gelöscht. Persistente Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese selbst löschen oder eine automatische Löschung durch Ihren Webbrowser erfolgt.',
        serverLogsTitle: "Server-Log-Dateien",
        serverLogsIntro:
          "Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:",
        serverLogItems: [
          "Browsertyp und Browserversion",
          "verwendetes Betriebssystem",
          "Referrer URL",
          "Hostname des zugreifenden Rechners",
          "Uhrzeit der Serveranfrage",
          "IP-Adresse",
        ],
        serverLogsFoot:
          "Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Optimierung seiner Website.",
        contactFormsTitle: "Kontaktformular",
        contactFormsText:
          "Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.",
        externalServicesTitle: "5. Externe Dienste und Hosting",
        externalHostingTitle: "Externes Hosting",
        externalHostingText1:
          "Diese Website wird bei einem externen Dienstleister (Hoster) gehostet. Personenbezogene Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann es sich insbesondere um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten handeln, die über eine Website generiert werden.",
        externalHostingText2:
          "Der Einsatz des Hosters erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren potenziellen und bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen und effizienten Bereitstellung unseres Online-Angebots durch einen professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).",
        githubIntegrationTitle: "GitHub-Integration",
        githubIntegrationTextPrefix:
          "Diese Website kann GitHub integrieren, um Repository-Informationen anzuzeigen. Beim Aufruf entsprechender Seiten kann Ihr Browser direkt eine Verbindung zu GitHub herstellen. Bitte beachten Sie",
        githubLinkLabel: "GitHubs Datenschutzerklärung",
        githubIntegrationTextSuffix:
          "für Informationen zu deren Datenverarbeitung.",
        storageDurationTitle: "6. Speicherdauer",
        storageDurationText:
          "Sofern in dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck der Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten vorliegen (z. B. steuer- oder handelsrechtliche Aufbewahrungsfristen); in letzterem Fall erfolgt die Löschung nach Wegfall dieser Gründe.",
        policyNote:
          "Diese Datenschutzerklärung wurde unter Berücksichtigung der EU-Datenschutz-Grundverordnung (DSGVO) erstellt.",
        lastUpdated: "Zuletzt aktualisiert:",
      } as const;
    }
    return {
      displayTitle: "Privacy Policy / Datenschutzerklärung",
      noticeTitle: "Template Notice",
      noticeDesc:
        'Please review and customize this privacy policy according to your specific data processing activities and legal requirements. Configure your legal information in the editor under "Legal Info".',
      dpGlanceTitle: "1. Data Protection at a Glance",
      generalInfoTitle: "General Information",
      generalInfoText:
        "The following information provides a simple overview of what happens to your personal data when you visit this website. Personal data is any data that can personally identify you. For detailed information on data protection, please refer to our privacy policy listed below this text.",
      responsibleQuestionTitle:
        "Who is responsible for data collection on this website?",
      responsibleQuestionText:
        'Data processing on this website is carried out by the website operator. You can find their contact details in the "Responsible Party" section of this privacy policy.',
      collectHowTitle: "How do we collect your data?",
      collectHowText1:
        "Your data is collected when you provide it to us. This could, for example, be data you enter on a contact form.",
      collectHowText2:
        "Other data is collected automatically by our IT systems when you visit the website. This is mainly technical data (such as internet browser, operating system, or time of the page call). The collection of this data takes place automatically as soon as you enter our website.",
      responsibleSectionTitle: "2. Responsible Party for Data Processing",
      responsibleIntro:
        "The responsible party for data processing on this website is:",
      phone: "Phone:",
      email: "Email:",
      rightsTitle: "3. Your Rights under the GDPR",
      rightsIntro:
        "You have the following rights regarding your personal data:",
      rights: [
        "Right to information – You have the right to receive information about your data stored with us and its processing (Art. 15 GDPR).",
        "Right to correction – You have the right to correction of incorrect personal data concerning you (Art. 16 GDPR).",
        "Right to deletion – You have the right to deletion of your data stored with us, unless we are legally obliged to store it (Art. 17 GDPR).",
        "Right to restrict processing – You have the right to request the restriction of processing of your personal data (Art. 18 GDPR).",
        "Right to data portability – You have the right to receive your data in a structured, commonly used and machine-readable format (Art. 20 GDPR).",
        "Right to object – You have the right to object to the processing of your personal data (Art. 21 GDPR).",
      ],
      dataCollectionTitle: "4. Data Collection on This Website",
      cookiesTitle: "Cookies",
      cookiesText:
        'Our internet pages use so-called "cookies". Cookies are small text files and do not cause any damage to your device. They are stored either temporarily for the duration of a session (session cookies) or permanently (permanent cookies) on your device. Session cookies are automatically deleted after your visit. Permanent cookies remain stored on your device until you delete them yourself or until they are automatically deleted by your web browser.',
      serverLogsTitle: "Server Log Files",
      serverLogsIntro:
        "The website provider automatically collects and stores information in so-called server log files, which your browser transmits to us automatically. These are:",
      serverLogItems: [
        "Browser type and browser version",
        "Operating system used",
        "Referrer URL",
        "Host name of the accessing computer",
        "Time of the server request",
        "IP address",
      ],
      serverLogsFoot:
        "This data is not combined with other data sources. The collection of this data is based on Art. 6 (1) lit. f GDPR. The website operator has a legitimate interest in the technically error-free presentation and optimization of his website.",
      contactFormsTitle: "Contact Forms",
      contactFormsText:
        "If you send us inquiries via contact forms, your details from the inquiry form, including the contact details you provided there, will be stored by us for the purpose of processing the inquiry and in the event of follow-up questions. We do not pass on this data without your consent.",
      externalServicesTitle: "5. External Services and Hosting",
      externalHostingTitle: "External Hosting",
      externalHostingText1:
        "This website is hosted by a third-party service provider (hoster). The personal data collected on this website is stored on the hoster's servers. This may include IP addresses, contact requests, meta and communication data, contract data, contact details, names, website accesses, and other data generated via a website.",
      externalHostingText2:
        "The use of the hoster is for the purpose of fulfilling the contract with our potential and existing customers (Art. 6 para. 1 lit. b GDPR) and in the interest of secure, fast, and efficient provision of our online service by a professional provider (Art. 6 para. 1 lit. f GDPR).",
      githubIntegrationTitle: "GitHub Integration",
      githubIntegrationTextPrefix:
        "This website may integrate with GitHub to display repository information. When you view pages that display GitHub data, your browser may connect directly to GitHub's servers. Please refer to",
      githubLinkLabel: "GitHub's Privacy Statement",
      githubIntegrationTextSuffix:
        "for information about their data processing practices.",
      storageDurationTitle: "6. Data Storage Duration",
      storageDurationText:
        "Unless a more specific storage period has been specified in this privacy policy, your personal data will remain with us until the purpose for which it was collected no longer applies. If you assert a justified request for deletion or revoke your consent to data processing, your data will be deleted unless we have other legally permissible reasons for storing your personal data (e.g., tax or commercial law retention periods); in the latter case, the deletion takes place after these reasons cease to apply.",
      policyNote:
        "This privacy policy was created with consideration for the EU General Data Protection Regulation (GDPR).",
      lastUpdated: "Last updated:",
    } as const;
  }, [lang]);

  if (isLoading) {
    return (
      <DefaultLayout>
        <section className="py-8 md:py-10">
          <div className="max-w-4xl mx-auto px-4">
            <Card className="w-full border border-default-200/50 shadow-sm">
              <CardHeader>
                <h1 className="text-3xl font-bold">
                  Privacy Policy / Datenschutzerklärung
                </h1>
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
                <h2 className="text-2xl font-semibold">{t.dpGlanceTitle}</h2>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    {t.generalInfoTitle}
                  </h3>
                  <p>{t.generalInfoText}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    {t.responsibleQuestionTitle}
                  </h3>
                  <p>{t.responsibleQuestionText}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{t.collectHowTitle}</h3>
                  <p>{t.collectHowText1}</p>
                  <p>{t.collectHowText2}</p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  {t.responsibleSectionTitle}
                </h2>
                <p>{t.responsibleIntro}</p>
                <p>
                  <strong>{displayName}</strong>
                  <br />
                  {displayStreetAddress}
                  <br />
                  {displayZipCity}
                  <br />
                  {displayCountry}
                </p>
                <p>
                  {legal.phone && (
                    <>
                      <strong>{t.phone}</strong> {displayPhone}
                      <br />
                    </>
                  )}
                  <strong>{t.email}</strong> {displayEmail}
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t.rightsTitle}</h2>
                <p>{t.rightsIntro}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {t.rights.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  {t.dataCollectionTitle}
                </h2>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{t.cookiesTitle}</h3>
                  <p>{t.cookiesText}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{t.serverLogsTitle}</h3>
                  <p>{t.serverLogsIntro}</p>
                  <ul className="list-disc pl-6 space-y-1">
                    {t.serverLogItems.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  <p>{t.serverLogsFoot}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    {t.contactFormsTitle}
                  </h3>
                  <p>{t.contactFormsText}</p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  {t.externalServicesTitle}
                </h2>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    {t.externalHostingTitle}
                  </h3>
                  <p>{t.externalHostingText1}</p>
                  <p>{t.externalHostingText2}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    {t.githubIntegrationTitle}
                  </h3>
                  <p>
                    {t.githubIntegrationTextPrefix}
                    <span> </span>
                    <Link
                      isExternal
                      href="https://docs.github.com/en/github/site-policy/github-privacy-statement"
                    >
                      {t.githubLinkLabel}
                    </Link>
                    <span> </span>
                    {t.githubIntegrationTextSuffix}
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  {t.storageDurationTitle}
                </h2>
                <p>{t.storageDurationText}</p>
              </section>

              <Divider className="my-2" />
              <div className="space-y-1 text-sm text-default-500">
                <p>{t.policyNote}</p>
                <p>
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
              </div>
            </CardBody>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}
