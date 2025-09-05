import { Alert } from "@heroui/alert";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
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
        intro:
          "Wir nehmen den Schutz der Privatsphäre unserer Website-Besucher ernst. Diese Datenschutzerklärung erklärt, wie wir personenbezogene Daten erheben, verwenden und schützen, wenn Sie diese Website nutzen, in Übereinstimmung mit der EU-Datenschutz-Grundverordnung (DSGVO). Auch wenn unsere Website keine Benutzerregistrierung erfordert oder aktiv personenbezogene Daten verfolgt, kann allein der Besuch der Website die Verarbeitung bestimmter personenbezogener Informationen (z. B. IP-Adressen) beinhalten. Im Folgenden stellen wir alle erforderlichen Informationen gemäß DSGVO Artikel 13 zur Verfügung.",
        controllerTitle: "1. Verantwortlicher und Kontaktinformationen",
        controllerText:
          'Der "Verantwortliche" (die für die Datenverarbeitung verantwortliche Person) für diese Website ist die Person, die die Website betreibt (siehe Impressum unten für vollständige Kontaktdaten). Für alle datenschutzbezogenen Anfragen können Sie den Website-Eigentümer über die im Impressum angegebene E-Mail-Adresse kontaktieren.',
        dataCollectionTitle: "2. Datenerfassung und -verwendung",
        dataCollectionIntro:
          "Wir erheben und verarbeiten personenbezogene Daten nur in dem minimal notwendigen Umfang, um diese Portfolio-Website zu betreiben und ihre Funktionen bereitzustellen. Es gibt keine Funktionen für allgemeine Besucher, personenbezogene Informationen zu übermitteln (keine öffentlichen Benutzerkonten, Kommentare oder Tracker). Insbesondere werden Daten in den folgenden Szenarien verarbeitet:",
        websiteAccessTitle: "Website-Zugriff (Server-Logs)",
        websiteAccessText:
          "Wenn Sie die Website besuchen, verarbeitet unser Webserver automatisch bestimmte Informationen in Server-Log-Dateien. Dazu gehören Ihre IP-Adresse, Datum und Uhrzeit des Zugriffs, Browser-Typ und aufgerufene Seiten. Wir speichern diese Daten nicht dauerhaft; sie werden nur vorübergehend verwendet, um die Verbindung herzustellen und sicherzustellen, dass die Website Ihnen Inhalte korrekt und sicher liefert. Diese Verarbeitung ist technisch notwendig für die Bereitstellung der Website und den Schutz vor Missbrauch (Rechtsgrundlage: DSGVO Art. 6(1)(f), berechtigtes Interesse am Betrieb einer sicheren Website).",
        contactEmailTitle: "Kontakt per E-Mail",
        contactEmailText:
          "Wenn Sie sich dafür entscheiden, den Website-Eigentümer über die angegebene E-Mail-Adresse zu kontaktieren (zum Beispiel, um sich nach dem Portfolio oder den Dienstleistungen zu erkundigen), erhalten wir die personenbezogenen Daten, die Sie in dieser E-Mail angeben (wie Ihre E-Mail-Adresse und andere Kontaktinformationen oder den Nachrichteninhalt). Diese Daten werden ausschließlich verwendet, um auf Ihre Anfrage zu antworten und sie zu bearbeiten. Die Angabe Ihrer E-Mail oder anderer Daten erfolgt freiwillig, aber wir können Ihnen ohne diese nicht antworten. Die Rechtsgrundlage für die Verarbeitung dieser Daten ist Ihre Einwilligung und/oder die Durchführung vorvertraglicher Maßnahmen auf Ihre Anfrage hin (DSGVO Art. 6(1)(a) oder Art. 6(1)(b)). Wir bewahren solche Kommunikation nur so lange auf, wie es zur Erfüllung Ihrer Anfrage oder gesetzlich erforderlich ist.",
        noAccountsTitle: "Keine Benutzerkonten für Besucher",
        noAccountsText:
          "Diese Website bietet keine Kontoregistrierung oder Anmeldung für allgemeine Besucher. Nur der Website-Eigentümer (Administrator) hat ein passwortgeschütztes Konto zur Bearbeitung des Portfolios. Daher erheben wir keine Registrierungsdaten von Besuchern.",
        thirdPartyTitle: "3. Drittanbieter-Dienste und Integrationen",
        thirdPartyIntro:
          "Wir nutzen einige externe Dienste, um bestimmte Funktionen dieser Website bereitzustellen. In allen Fällen werden diese Dienste datenschutzbewusst eingesetzt, und keine personenbezogenen Daten von Besuchern werden mit ihnen geteilt. Wir legen diese Integrationen aus Transparenzgründen offen:",
        githubApiTitle: "GitHub API (Repository-Anzeige)",
        githubApiText:
          "Unsere Portfolio-Website zeigt Informationen über die öffentlichen GitHub-Repositories des Website-Eigentümers an (wie Projektnamen und Sterne). Dazu ruft unser Server regelmäßig öffentliche Daten von der GitHub API ab (ein Dienst von GitHub, Inc. in den USA). Die abgerufenen Daten umfassen Repository-Namen, Beschreibungen, Update-Daten und Stern-Anzahlen – alles Informationen, die öffentlich auf GitHub verfügbar sind. Diese Informationen werden auf unserem Server (in einer lokalen Datei) zwischengespeichert, um direkte Anfragen von jedem Besucher-Browser an GitHub zu vermeiden. Wenn Sie die Website besuchen, sehen Sie die zwischengespeicherten Daten; Ihr Browser überträgt keine personenbezogenen Daten an GitHub. Wir senden keine Besucher-Informationen an die GitHub API. (Weitere Informationen zu GitHubs Umgang mit Daten finden Sie in GitHubs eigener Datenschutzerklärung auf ihrer Website.)",
        googleGeminiTitle: "Google Gemini AI (Content-Generierung)",
        googleGeminiText:
          'Der Website-Eigentümer nutzt Googles Generative Language API (Teil von Google Clouds AI-Services), um bei der Generierung von Portfolio-Inhalten zu helfen (zum Beispiel ein autobiographischer "Über mich"-Text basierend auf den Eingaben des Eigentümers). Diese Funktion ist nur für den Website-Eigentümer (Administrator) zugänglich und nicht für öffentliche Besucher. Bei der Nutzung dieses Dienstes werden bestimmte personenbezogene Informationen des Website-Eigentümers – wie Profildetails wie Name, Berufsbezeichnung, Fähigkeiten und Erfahrungen – an Googles Server gesendet, um den Text zu generieren. Der Service wird von Google LLC bereitgestellt, die Daten auf Servern außerhalb der EU verarbeiten kann (z. B. in den Vereinigten Staaten). Google hat sich verpflichtet, dass Daten, die für generative KI-Verarbeitung übermittelt werden, nicht ohne Erlaubnis zur Schulung von Googles Modellen verwendet werden und nur vorübergehend zur Bereitstellung des Dienstes aufbewahrt werden. Keine Besucherdaten werden über diese Funktion an Google gesendet. Wir haben sichergestellt, dass diese Integration in Übereinstimmung mit geltenden Datenschutzbestimmungen verwendet wird (zum Beispiel durch Zustimmung zu Googles Datenverarbeitungsbestimmungen). Weitere Informationen finden Sie in Googles Datenschutzerklärung und ihren KI-Datennutzungsbedingungen.',
        externalLinksTitle: "Hinweis zu externen Links",
        externalLinksText:
          "Diese Website kann Links zu den Profilen des Website-Eigentümers auf externen Plattformen enthalten (zum Beispiel Links zu GitHub, LinkedIn oder anderen sozialen Medien). Wenn Sie solche Links anklicken, werden Sie zu Drittanbieter-Websites weitergeleitet, die außerhalb unserer Kontrolle liegen. Diese Plattformen können personenbezogene Daten verarbeiten (zum Beispiel durch Protokollierung Ihres Besuchs oder wenn Sie in deren Service eingeloggt sind). Wir sind nicht verantwortlich für den Inhalt oder die Datenschutzpraktiken externer Websites. Wir empfehlen Ihnen, die Datenschutzerklärungen aller Drittanbieter-Websites zu überprüfen, die Sie über Links auf unserem Portfolio besuchen.",
        cookiesTitle: "4. Verwendung von Cookies und lokalem Speicher",
        cookiesIntro:
          "Diese Website verwendet keine Cookies oder Tracking-Skripte. Wir setzen keine Cookies, die eine Einwilligung nach EU-Recht erfordern würden. Die Anwendung verwendet jedoch lokalen Speicher in Ihrem Webbrowser für bestimmte Funktionalitäten:",
        localStorageTitle: "Lokaler Speicher",
        localStorageText:
          "Die Bearbeitungsschnittstelle des Portfolios (nur für den Website-Eigentümer zugänglich) verwendet den lokalen Speicher des Browsers, um vorübergehend Entwurfs-Portfolio-Daten und Benutzereinstellungen zu speichern. Diese Daten werden lokal im Browser des Website-Eigentümers gespeichert und nicht an unseren Server oder Dritte übertragen. Besucher, die das Portfolio betrachten, haben keine Daten, die über lokalen Speicher von unserer Website in ihren Browsern gespeichert werden (abgesehen von standardmäßigem Browser-Caching statischer Dateien).",
        sessionStorageTitle: "Session-Speicher",
        sessionStorageText:
          "Wenn sich der Website-Eigentümer in die Admin-Schnittstelle einloggt, wird ein Session-Token (JWT) im Session-Speicher des Browsers gespeichert, um die Login-Sitzung aufrechtzuerhalten. Dies ist eine notwendige technische Maßnahme für die Authentifizierung. Es läuft nach einer festgelegten Zeit ab und ist für Dritte nicht zugänglich oder wird von ihnen verwendet. Normale Besucher erhalten keine Session-Tokens, da es für sie keine Anmeldung gibt.",
        cookieBannerNote:
          "Da wir keine Cookies oder ähnliche Tracker für Besucher verwenden, zeigen wir kein Cookie-Einverständnis-Banner an. Sollten wir in Zukunft nicht-essenzielle Cookies oder Tracking-Tools einführen, werden wir einen Einverständnismechanismus implementieren, wie gesetzlich vorgeschrieben.",
        securityTitle: "5. Datensicherheit",
        securityText:
          "Wir setzen angemessene technische und organisatorische Maßnahmen um, um die von uns verarbeiteten personenbezogenen Daten vor unbefugtem Zugriff, Änderung, Offenlegung oder Zerstörung zu schützen. Zum Beispiel werden sensible Informationen (wie die Admin-Anmeldedaten des Website-Eigentümers oder API-Schlüssel für die oben genannten Dienste) verschlüsselt auf dem Server gespeichert. Die Website wird ausschließlich über HTTPS bereitgestellt, was bedeutet, dass zwischen Ihrem Browser und unserem Server übertragene Daten während der Übertragung verschlüsselt sind. Obwohl kein System perfekte Sicherheit garantieren kann, streben wir danach, bewährte Praktiken zum Schutz von Daten zu befolgen.",
        retentionTitle: "6. Datenspeicherung",
        retentionIntro:
          "Wir minimieren unsere Datenspeicherzeiten auf das Notwendige:",
        serverLogsTitle: "Server-Logs",
        serverLogsText:
          "Routinemäßige Server-Log-Daten (IP-Adressen und Besuchsdetails wie oben beschrieben) werden normalerweise nur für kurze Zeit zur Fehlerbehebung und Sicherheitsüberwachung aufbewahrt. Sie werden automatisch auf rollierender Basis gelöscht, normalerweise innerhalb weniger Tage bis höchstens weniger Wochen. Wir archivieren oder bewahren diese Daten nicht langfristig auf, es sei denn, sie werden für Sicherheitsuntersuchungen benötigt.",
        emailInquiriesTitle: "E-Mail-Anfragen",
        emailInquiriesText:
          "Wenn Sie uns per E-Mail kontaktieren, bewahren wir Ihre Nachricht und Kontaktdaten so lange auf, wie es zur Antwort und Lösung Ihrer Anfrage erforderlich ist. Normalerweise löschen wir die Korrespondenz, sobald Ihre Anfrage vollständig bearbeitet wurde. In einigen Fällen können wir die Kommunikation für einen längeren Zeitraum aufbewahren, wenn dies aus rechtlichen Gründen oder zur Aufzeichnung erforderlich ist (zum Beispiel, wenn Ihre Anfrage zu einer vertraglichen Beziehung führen könnte oder wenn sie für die Rechenschaftspflicht benötigt wird).",
        portfolioContentTitle: "Portfolio-Inhalte",
        portfolioContentText:
          "Alle im Portfolio angezeigten personenbezogenen Informationen (wie der Name des Website-Eigentümers, Biographie, Fähigkeiten usw.) werden gespeichert, bis der Website-Eigentümer sie aktualisiert oder entfernt. Diese Informationen unterliegen der Kontrolle des Website-Eigentümers. Es ist wichtig zu beachten, dass dies Informationen sind, die der Website-Eigentümer über sich selbst zu veröffentlichen gewählt hat, und sie bleiben veröffentlicht, bis er sie zu ändern beschließt.",
        legalBasesTitle: "7. Rechtsgrundlagen für die Verarbeitung",
        legalBasesIntro:
          "Wir verarbeiten personenbezogene Daten nur in Übereinstimmung mit der DSGVO. Die Rechtsgrundlagen für unsere Verarbeitungstätigkeiten sind wie folgt:",
        consentTitle: "Einwilligung (DSGVO Art. 6(1)(a))",
        consentText:
          "Wenn Sie uns freiwillig kontaktieren und personenbezogene Informationen bereitstellen, gehen wir davon aus, dass Sie der Verwendung dieser Daten zur Antwort einwilligen. Sie können die Einwilligung jederzeit durch Benachrichtigung an uns widerrufen, woraufhin wir die Verarbeitung einstellen und Ihre Daten löschen (es sei denn, eine andere Rechtsgrundlage gilt für die weitere Aufbewahrung).",
        contractualTitle:
          "Vertragliche oder vorvertragliche Notwendigkeit (Art. 6(1)(b))",
        contractualText:
          "Wenn Ihr Kontakt oder Ihre Anfrage in Vorbereitung auf eine Dienstleistung oder Zusammenarbeit erfolgt (zum Beispiel erkundigen Sie sich nach der Beauftragung des Website-Eigentümers für ein Projekt), kann die Verarbeitung Ihrer Kontaktdaten notwendig sein, um auf Ihre Anfrage vor Vertragsabschluss zu reagieren.",
        legitimateInterestsTitle: "Berechtigte Interessen (Art. 6(1)(f))",
        legitimateInterestsText:
          "Für alle technischen Verarbeitungen, die zum Betrieb der Website notwendig sind (wie Server-Logs, Sicherheitsmaßnahmen und Integration von Drittanbieter-Inhalten wie beschrieben), stützen wir uns auf unser berechtigtes Interesse an der Bereitstellung einer sicheren, funktionalen und effizienten Website. Wir haben diese Interessen gegen Ihre Datenschutzrechte abgewogen und festgestellt, dass diese Datenverarbeitung in minimaler, datenschutzschonender Weise Ihre Rechte oder Freiheiten nicht beeinträchtigt. Sie haben das Recht, der Verarbeitung aufgrund berechtigter Interessen zu widersprechen (siehe Abschnitt 9 über Ihre Rechte).",
        legalObligationNote:
          "Wir verarbeiten keine Daten basierend auf rechtlicher Verpflichtung (Art. 6(1)(c)) oder lebenswichtigen Interessen (Art. 6(1)(d)) im Kontext des normalen Website-Betriebs. Wenn wir jemals gesetzlich verpflichtet wären, Daten aufzubewahren oder offenzulegen (zum Beispiel eine gerichtliche Anordnung zur Offenlegung von Informationen an Behörden), würden wir dies unter rechtlicher Verpflichtung tun und Sie informieren, wenn erlaubt.",
        transfersTitle: "8. Internationale Datenübertragungen",
        transfersIntro:
          "Wie bereits erwähnt, befinden sich einige unserer Dienstleister außerhalb der Europäischen Union:",
        googleTransferTitle: "Google (Generative AI API)",
        googleTransferText:
          "Google LLC hat ihren Sitz in den Vereinigten Staaten. Wenn der Website-Eigentümer die Content-Generierungsfunktion nutzt, werden Daten an Googles Server gesendet und von diesen verarbeitet, die sich in den USA oder anderen Ländern außerhalb der EU befinden können. Google ist unter dem EU-US Data Privacy Framework zertifiziert (oder stützt sich auf Standardvertragsklauseln und andere Schutzmaßnahmen), um ein angemessenes Schutzniveau für personenbezogene Daten zu gewährleisten, die aus der EU übertragen werden. Wir senden nur die minimal notwendigen Daten und haben Googles Datenverarbeitungsbestimmungen zugestimmt, um den Datenschutz zu gewährleisten.",
        githubTransferTitle: "GitHub",
        githubTransferText:
          "GitHub, Inc. hat ihren Sitz in den Vereinigten Staaten (mit möglicherweise globalen Servern). Die Daten, die wir von GitHubs API abrufen, sind öffentlich verfügbare Informationen über die Repositories des Website-Eigentümers. In diesem Fall werden keine personenbezogenen Daten von Nutzern oder Besuchern übertragen – es sind die eigenen öffentlichen Daten des Website-Eigentümers. Wenn Sie jedoch einen GitHub-Link anklicken, wird Ihr Browser direkt mit GitHubs Servern verbunden. Solche Interaktionen unterliegen GitHubs Bedingungen und können die Übertragung Ihrer Daten (wie IP-Adresse) in die USA beinhalten. Wir erinnern Sie daran, GitHubs Datenschutzerklärung zu überprüfen, wenn Sie ihre Website besuchen.",
        noOtherTransfers:
          "Wir übertragen oder teilen anderweitig keine personenbezogenen Daten mit Drittländern oder internationalen Organisationen. Unser Website-Hosting basiert in der EU (Deutschland), sodass Besucherdaten (wie IP-Adressen in Logs) innerhalb der EU verarbeitet werden.",
        rightsTitle: "9. Ihre Rechte als betroffene Person",
        rightsIntro:
          "Unter der DSGVO haben Sie bestimmte Rechte bezüglich Ihrer personenbezogenen Daten. Da wir personenbezogene Daten über Sie nur in sehr begrenzten Szenarien verarbeiten, müssen diese Rechte hier selten ausgeübt werden – aber es ist wichtig, dass Sie sie kennen. Sie haben das Recht auf:",
        accessTitle: "Zugang zu Ihren Daten",
        accessText:
          "Sie können eine Bestätigung anfordern, ob wir personenbezogene Daten über Sie verarbeiten, und wenn ja, eine Kopie dieser Daten anfordern (DSGVO Art. 15).",
        rectificationTitle: "Berichtigung",
        rectificationText:
          "Wenn Sie glauben, dass die personenbezogenen Daten, die wir über Sie haben, ungenau oder unvollständig sind, haben Sie das Recht zu verlangen, dass wir sie korrigieren oder aktualisieren (Art. 16).",
        erasureTitle: "Löschung",
        erasureText:
          'Sie haben das "Recht auf Vergessenwerden". Unter bestimmten Umständen können Sie verlangen, dass wir personenbezogene Daten löschen, die wir über Sie haben (Art. 17). Zum Beispiel, wenn Sie uns kontaktiert haben und nun wünschen, dass Ihre Korrespondenz gelöscht wird, werden wir dieser Anfrage nachkommen, vorausgesetzt, wir haben keinen übergeordneten rechtlichen Grund, sie aufzubewahren.',
        restrictionTitle: "Einschränkung der Verarbeitung",
        restrictionText:
          "Sie können uns bitten, die Verarbeitung Ihrer Daten einzuschränken (Art. 18) in bestimmten Fällen, etwa wenn Sie die Richtigkeit der Daten bestreiten oder die Verarbeitung rechtswidrig ist, aber Sie die Daten nicht gelöscht haben möchten.",
        objectionTitle: "Widerspruch",
        objectionText:
          "Wenn wir Daten basierend auf unseren berechtigten Interessen verarbeiten, haben Sie das Recht, dieser Verarbeitung zu widersprechen (Art. 21). Wenn Sie Widerspruch einlegen, werden wir unsere Gründe für die Verarbeitung überprüfen und entweder die Verarbeitung einstellen oder unsere zwingenden berechtigten Gründe erklären, je nach Situation. Sie können auch jeder Direktwerbung widersprechen (obwohl wir keine betreiben).",
        portabilityTitle: "Datenübertragbarkeit",
        portabilityText:
          "Für alle Daten, die Sie uns bereitgestellt haben und die wir durch automatisierte Mittel basierend auf Einwilligung oder Vertrag verarbeiten, können Sie verlangen, sie in einem gängigen maschinenlesbaren Format zu erhalten (Art. 20). (In der Praxis wären die einzigen Daten, die Sie uns bereitstellen könnten, eine E-Mail-Anfrage; wenn Sie diese jemals in einem übertragbaren Format benötigen würden, könnten wir den E-Mail-Verlauf oder relevante Daten bereitstellen.)",
        withdrawConsentTitle: "Einwilligung widerrufen",
        withdrawConsentText:
          "Wenn wir Daten basierend auf Ihrer Einwilligung verarbeiten, haben Sie das Recht, diese Einwilligung jederzeit zu widerrufen (Art. 7(3)). Dies beeinträchtigt nicht die Rechtmäßigkeit der vor dem Widerruf durchgeführten Verarbeitung. (Zum Beispiel, wenn Sie eingewilligt haben, dass wir Ihre E-Mail zur Beantwortung einer Anfrage verwenden, können Sie diese Einwilligung später widerrufen – dann würden wir aufhören und Ihre Kontaktinformationen löschen.)",
        complaintTitle: "Recht auf Beschwerde",
        complaintText:
          "Wenn Sie glauben, dass wir Ihre personenbezogenen Daten unter Verletzung geltender Gesetze verarbeitet haben, haben Sie das Recht, eine Beschwerde bei einer Aufsichtsdatenschutzbehörde einzureichen (Art. 77). Sie können dies bei der Behörde in dem EU-Land tun, in dem Sie leben, oder wo die angebliche Verletzung aufgetreten ist. In Deutschland können Sie sich an die Datenschutzbehörde des Bundeslandes wenden, in dem Sie wohnen oder wo der Website-Betreiber sich befindet. (Zum Beispiel Nordrhein-Westfalens Beauftragte für Datenschutz für eine in NRW gehostete Website usw.) Wir würden es schätzen, wenn Sie uns die Möglichkeit geben würden, Ihre Bedenken direkt zu klären, bevor Sie sich an eine Regulierungsbehörde wenden, also kontaktieren Sie uns gerne mit allen Problemen.",
        exerciseRights:
          "Sie können Ihre Rechte ausüben, indem Sie uns kontaktieren (siehe Impressum für Kontaktdaten). Wir werden auf Anfragen innerhalb der gesetzlichen Fristen und kostenlos antworten. Aus Sicherheitsgründen müssen wir möglicherweise Ihre Identität überprüfen, bevor wir bestimmte Anfragen erfüllen.",
        automatedDecisionTitle: "10. Keine automatisierte Entscheidungsfindung",
        automatedDecisionText:
          "Wir verwenden keine personenbezogenen Daten für automatisierte Entscheidungsfindung oder Profiling, das rechtliche oder ähnlich bedeutsame Auswirkungen auf Sie hat (Art. 22 DSGVO). Der Besuch unserer Website und die Kontaktaufnahme mit uns beinhalten immer eine menschliche Behandlung aller personenbezogenen Daten.",
        changesTitle: "11. Änderungen an dieser Datenschutzerklärung",
        changesText:
          'Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren, um Änderungen an unserer Website oder rechtlichen Verpflichtungen widerzuspiegeln. Wenn wir Änderungen vornehmen, werden wir das Datum "zuletzt aktualisiert" am Ende der Erklärung aktualisieren. Wir empfehlen Ihnen, diese Erklärung regelmäßig beim Besuch unserer Website zu überprüfen, um über den Schutz Ihrer Daten informiert zu bleiben.',
        contactInfoTitle: "12. Kontaktinformationen",
        contactInfoText:
          "Wenn Sie Fragen oder Bedenken zu dieser Datenschutzerklärung oder unserem Umgang mit personenbezogenen Daten haben, kontaktieren Sie bitte den Website-Eigentümer. Sie finden Namen und vollständige Kontaktinformationen im unten stehenden Impressum.",
        phone: "Telefon:",
        email: "E-Mail:",
        policyNote:
          "Diese Datenschutzerklärung wurde unter Berücksichtigung der EU-Datenschutz-Grundverordnung (DSGVO) erstellt.",
        lastUpdated: "Zuletzt aktualisiert:",
      } as const;
    }
    return {
      displayTitle: "Privacy Policy",
      noticeTitle: "Template Notice",
      noticeDesc:
        'Please review and customize this privacy policy according to your specific data processing activities and legal requirements. Configure your legal information in the editor under "Legal Info".',
      intro:
        "We take the privacy of our website visitors seriously. This Privacy Policy explains how we collect, use, and protect personal data when you use this website, in compliance with the EU General Data Protection Regulation (GDPR). Even if our site does not require user registration or actively track personal data, simply visiting the site can involve processing certain personal information (e.g. IP addresses). Below we provide all required information in accordance with GDPR Article 13.",
      controllerTitle: "1. Data Controller and Contact Information",
      controllerText:
        'The "data controller" (the person responsible for data processing) for this website is the individual operating the site (see Imprint below for full contact details). For any privacy-related inquiries, you can contact the site owner via the email provided in the Imprint.',
      dataCollectionTitle: "2. Data Collection and Use",
      dataCollectionIntro:
        "We only collect and process personal data to the minimal extent necessary to operate this portfolio website and provide its features. There are no features for general visitors to submit personal information (no public user accounts, comments, or trackers). Specifically, data is processed in the following scenarios:",
      websiteAccessTitle: "Website Access (Server Logs)",
      websiteAccessText:
        "When you visit the website, our web server automatically processes certain information in server log files. This includes your IP address, date and time of access, browser type, and pages accessed. We do not store this data permanently; it is used only transiently to establish the connection and ensure the website delivers content to you correctly and securely. This processing is technically necessary for delivering the site and protecting against misuse (legal basis: GDPR Art. 6(1)(f), legitimate interest in operating a secure website).",
      contactEmailTitle: "Contact via Email",
      contactEmailText:
        "If you choose to contact the site owner using the email address provided (for example, to inquire about the portfolio or services), we will receive the personal data you provide in that email (such as your email address and any other contact information or message content). This data will be used solely to respond to and manage your inquiry. Providing your email or other data is voluntary, but we cannot respond to you without it. The legal basis for processing this data is your consent and/or to take steps at your request (GDPR Art. 6(1)(a) or Art. 6(1)(b)). We will keep such communications only as long as necessary to fulfill your request or as required by law.",
      noAccountsTitle: "No User Accounts for Visitors",
      noAccountsText:
        "This site does not offer account registration or login for general visitors. Only the site owner (administrator) has a password-protected account to edit the portfolio. As a result, we do not collect any registration data from visitors.",
      thirdPartyTitle: "3. Third-Party Services and Integrations",
      thirdPartyIntro:
        "We use a few external services to provide certain features of this website. In all cases, these services are used in a privacy-conscious manner, and no personal data from visitors is shared with them. We disclose these integrations for transparency:",
      githubApiTitle: "GitHub API (Repository Display)",
      githubApiText:
        "Our portfolio site displays information about the site owner's public GitHub repositories (such as project names and stars). To do this, our server periodically fetches public data from the GitHub API (a service provided by GitHub, Inc. in the USA). The data retrieved includes repository names, descriptions, update dates, and star counts – all of which are publicly available on GitHub. This information is cached on our server (in a local file) to avoid direct requests from each visitor's browser to GitHub. When you visit the site, you are viewing the cached data; your browser does not transmit any personal data to GitHub. We do not send any visitor information to the GitHub API. (For more on GitHub's handling of data, see GitHub's own privacy policy on their website.)",
      googleGeminiTitle: "Google Gemini AI (Content Generation)",
      googleGeminiText:
        "The site owner uses Google's Generative Language API (part of Google Cloud's AI services) to help generate portions of the portfolio content (for example, an autobiographical \"About Me\" text based on the owner's input). This feature is only accessible to the site owner (administrator) and not to public visitors. In using this service, certain personal information provided by the site owner – such as profile details like name, professional title, skills and experience – is sent to Google's servers to generate the text. The service is provided by Google LLC, which may process data on servers outside the EU (e.g. in the United States). Google has committed that data submitted for generative AI processing is not used to train Google's models without permission and is only retained temporarily to provide the service. No visitor data is sent to Google through this feature. We have ensured that this integration is used in compliance with applicable data protection requirements (for example, by agreeing to Google's data processing terms). For more information, please refer to Google's Privacy Policy and their AI data usage terms.",
      externalLinksTitle: "Note on External Links",
      externalLinksText:
        "This website may contain links to the site owner's profiles on external platforms (for example, links to GitHub, LinkedIn, or other social media). If you click such links, you will be directed to third-party websites which are outside of our control. Those platforms may process personal data (for instance, by logging your visit or if you are logged into their service). We are not responsible for the content or privacy practices of external sites. We recommend you review the privacy policies of any third-party sites you visit via links on our portfolio.",
      cookiesTitle: "4. Use of Cookies and Local Storage",
      cookiesIntro:
        "This site does not use any cookies or tracking scripts. We do not set any cookies that would require consent under EU law. The application does, however, use local storage in your web browser for certain functionality:",
      localStorageTitle: "Local Storage",
      localStorageText:
        "The portfolio's editing interface (accessible only to the site owner) uses the browser's local storage to temporarily save draft portfolio data and user preferences. This data is stored locally on the site owner's browser and is not transmitted to our server or any third party. Visitors viewing the portfolio do not have any data stored in their browsers via local storage by our site (aside from standard browser caching of static files).",
      sessionStorageTitle: "Session Storage",
      sessionStorageText:
        "If the site owner logs into the admin interface, a session token (JWT) is stored in the browser's session storage to maintain the login session. This is a necessary technical measure for authentication. It expires after a set time and is not accessible to or used by any third party. Regular visitors do not receive any session tokens since there is no login for them.",
      cookieBannerNote:
        "Because we do not use cookies or similar trackers for visitors, we do not display a cookie consent banner. If in the future we introduce any non-essential cookies or tracking tools, we will implement a consent mechanism as required.",
      securityTitle: "5. Data Security",
      securityText:
        "We implement appropriate technical and organizational measures to protect the personal data we process from unauthorized access, alteration, disclosure, or destruction. For instance, any sensitive information (such as the site owner's admin credentials or API keys for the services above) is stored in encrypted form on the server. The website is served exclusively over HTTPS, which means data transmitted between your browser and our server is encrypted in transit. While no system can guarantee perfect security, we strive to follow best practices to safeguard data.",
      retentionTitle: "6. Data Retention",
      retentionIntro:
        "We minimize our data retention periods to only what is necessary:",
      serverLogsTitle: "Server Logs",
      serverLogsText:
        "Routine server log data (IP addresses and visit details as described above) are typically retained only for a short duration for troubleshooting and security monitoring. They are automatically deleted on a rolling basis, usually within a few days to a few weeks at most. We do not archive or retain this data long-term unless required for security investigations.",
      emailInquiriesTitle: "Email Inquiries",
      emailInquiriesText:
        "If you contact us via email, we will retain your message and contact details for as long as needed to respond and resolve your inquiry. Typically, once your request is fully addressed, we will delete the correspondence. In some cases, we may retain communications for a longer period if necessary for legal reasons or record-keeping (for example, if your inquiry could lead to a contractual relationship or if needed for accountability).",
      portfolioContentTitle: "Portfolio Content",
      portfolioContentText:
        "All personal information displayed on the portfolio (such as the site owner's name, biography, skills, etc.) is stored until the site owner updates or removes it. This information is under the site owner's control. It is important to note that this is information the site owner has chosen to publish about themselves, and it remains published until they decide to change it.",
      legalBasesTitle: "7. Legal Bases for Processing",
      legalBasesIntro:
        "We only process personal data in accordance with the GDPR. The legal grounds for our processing activities are as follows:",
      consentTitle: "Consent (GDPR Art. 6(1)(a))",
      consentText:
        "If you voluntarily contact us and provide personal information, we assume you consent to our use of that data to respond. You may withdraw consent at any time by notifying us, in which case we will stop processing and delete your data (unless another legal basis applies for continued retention).",
      contractualTitle:
        "Contractual or Pre-contractual Necessity (Art. 6(1)(b))",
      contractualText:
        "If your contact or inquiry is in preparation for a service or collaboration (for example, you're inquiring about hiring the site owner for a project), processing your contact data may be necessary to take steps at your request prior to entering into a contract.",
      legitimateInterestsTitle: "Legitimate Interests (Art. 6(1)(f))",
      legitimateInterestsText:
        "For all technical processing necessary to operate the website (such as server logs, security measures, and integration of third-party content as described), we rely on our legitimate interest in providing a safe, functional, and efficient website. We have balanced these interests against your privacy rights and have determined that this data processing in a minimal, privacy-preserving manner does not adversely affect your rights or freedoms. You have the right to object to processing based on legitimate interests (see Section 9 on your rights).",
      legalObligationNote:
        "We do not process any data based on legal obligation (Art. 6(1)(c)) or vital interests (Art. 6(1)(d)) in the context of normal website operation. If we ever were required by law to retain or disclose data (for example, a legal order to disclose information to authorities), we would do so under legal obligation, and we would inform you if permitted.",
      transfersTitle: "8. International Data Transfers",
      transfersIntro:
        "As noted, some of our service providers are located outside the European Union:",
      googleTransferTitle: "Google (Generative AI API)",
      googleTransferText:
        "Google LLC is based in the United States. When the site owner uses the content generation feature, data is sent to and processed by Google's servers which may be in the U.S. or other countries outside the EU. Google is certified under the EU-U.S. Data Privacy Framework (or relies on Standard Contractual Clauses and other safeguards) to ensure an adequate level of protection for personal data transferred from the EU. We only send the minimal necessary data and have agreed to Google's data processing terms to safeguard privacy.",
      githubTransferTitle: "GitHub",
      githubTransferText:
        "GitHub, Inc. is based in the United States (with servers possibly globally). The data we retrieve from GitHub's API is publicly available information about the site owner's repositories. In this case, no personal data of users or visitors is being transferred – it's the site owner's own public data. However, if you click a GitHub link, your browser will connect to GitHub's servers directly. Such interactions are subject to GitHub's terms and may involve transfer of your data (like IP address) to the U.S. We remind you to check GitHub's privacy policy when visiting their site.",
      noOtherTransfers:
        "We do not otherwise transfer or share personal data with third countries or international organizations. Our website hosting is based in the EU (Germany), so visitor data (like IP addresses in logs) is handled within the EU.",
      rightsTitle: "9. Your Rights as a Data Subject",
      rightsIntro:
        "Under the GDPR, you have certain rights regarding your personal data. Since we process personal data about you only in very limited scenarios, these rights may rarely need to be exercised here – but it's important you know them. You have the right to:",
      accessTitle: "Access Your Data",
      accessText:
        "You can request confirmation of whether we are processing any personal data about you, and if so, request a copy of that data (GDPR Art. 15).",
      rectificationTitle: "Rectification",
      rectificationText:
        "If you believe the personal data we hold about you is inaccurate or incomplete, you have the right to request that we correct or update it (Art. 16).",
      erasureTitle: "Erasure",
      erasureText:
        'You have the "right to be forgotten." In certain circumstances, you can request that we delete personal data we hold about you (Art. 17). For example, if you contacted us and now wish your correspondence to be deleted, we will honor that request, provided we have no overriding legal reason to keep it.',
      restrictionTitle: "Restriction of Processing",
      restrictionText:
        "You can ask us to restrict the processing of your data (Art. 18) in certain cases, such as if you contest the accuracy of the data or the processing is unlawful but you do not want the data deleted.",
      objectionTitle: "Objection",
      objectionText:
        "If we process data based on our legitimate interests, you have the right to object to that processing (Art. 21). If you lodge an objection, we will review our reasons for processing and either stop processing or explain our compelling legitimate grounds, depending on the situation. You can also object to any direct marketing (though we do none).",
      portabilityTitle: "Data Portability",
      portabilityText:
        "For any data you provided to us and which we process by automated means based on consent or contract, you can request to receive it in a common machine-readable format (Art. 20). (In practice, the only data you might provide us would be an email inquiry; if you ever needed this in a portable format, we could provide the email thread or relevant data.)",
      withdrawConsentTitle: "Withdraw Consent",
      withdrawConsentText:
        "If we process any data based on your consent, you have the right to withdraw that consent at any time (Art. 7(3)). This will not affect the lawfulness of processing done before the withdrawal. (For example, if you consented to us using your email to respond to a query, you can later withdraw that consent – then we would stop and delete your contact info.)",
      complaintTitle: "Right to Lodge a Complaint",
      complaintText:
        "If you believe we have processed your personal data in violation of applicable laws, you have the right to file a complaint with a supervisory data protection authority (Art. 77). You can do this with the authority in the EU country where you live, or where the alleged infringement occurred. In Germany, you may contact the data protection authority of the federal state (Land) in which you reside or where the website operator is located. (For example, Nordrhein-Westfalen's Commissioner for Data Protection for a site hosted in NRW, etc.) We would appreciate the chance to address your concerns directly before you approach a regulator, so please feel free to contact us with any issues.",
      exerciseRights:
        "You can exercise your rights by contacting us (see Imprint for contact details). We will respond to requests within the statutory timeframes and free of charge. For security, we may need to verify your identity before fulfilling certain requests.",
      automatedDecisionTitle: "10. No Automated Decision-Making",
      automatedDecisionText:
        "We do not use any personal data for automated decision-making or profiling that produces legal or similarly significant effects on you (Art. 22 GDPR). Visiting our site and contacting us will always involve human handling of any personal data.",
      changesTitle: "11. Changes to this Privacy Policy",
      changesText:
        'We may update this Privacy Policy from time to time to reflect changes in our website or legal obligations. When we make changes, we will update the "last updated" date at the bottom of the policy. We encourage you to review this policy periodically when visiting our site to stay informed about how we protect your data.',
      contactInfoTitle: "12. Contact Information",
      contactInfoText:
        "If you have any questions or concerns about this Privacy Policy or how we handle personal data, please contact the site owner. You can find the name and full contact information in the Imprint below.",
      phone: "Phone:",
      email: "Email:",
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
                <p className="text-lg">{t.intro}</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t.controllerTitle}</h2>
                <p>{t.controllerText}</p>
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
                <h2 className="text-2xl font-semibold">
                  {t.dataCollectionTitle}
                </h2>
                <p>{t.dataCollectionIntro}</p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.websiteAccessTitle}
                    </h3>
                    <p>{t.websiteAccessText}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.contactEmailTitle}
                    </h3>
                    <p>{t.contactEmailText}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.noAccountsTitle}
                    </h3>
                    <p>{t.noAccountsText}</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t.thirdPartyTitle}</h2>
                <p>{t.thirdPartyIntro}</p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.githubApiTitle}
                    </h3>
                    <p>{t.githubApiText}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.googleGeminiTitle}
                    </h3>
                    <p>{t.googleGeminiText}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.externalLinksTitle}
                    </h3>
                    <p>{t.externalLinksText}</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t.cookiesTitle}</h2>
                <p>{t.cookiesIntro}</p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.localStorageTitle}
                    </h3>
                    <p>{t.localStorageText}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.sessionStorageTitle}
                    </h3>
                    <p>{t.sessionStorageText}</p>
                  </div>
                </div>

                <p>{t.cookieBannerNote}</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t.securityTitle}</h2>
                <p>{t.securityText}</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t.retentionTitle}</h2>
                <p>{t.retentionIntro}</p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.serverLogsTitle}
                    </h3>
                    <p>{t.serverLogsText}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.emailInquiriesTitle}
                    </h3>
                    <p>{t.emailInquiriesText}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.portfolioContentTitle}
                    </h3>
                    <p>{t.portfolioContentText}</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t.legalBasesTitle}</h2>
                <p>{t.legalBasesIntro}</p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{t.consentTitle}</h3>
                    <p>{t.consentText}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.contractualTitle}
                    </h3>
                    <p>{t.contractualText}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.legitimateInterestsTitle}
                    </h3>
                    <p>{t.legitimateInterestsText}</p>
                  </div>
                </div>

                <p>{t.legalObligationNote}</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t.transfersTitle}</h2>
                <p>{t.transfersIntro}</p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.googleTransferTitle}
                    </h3>
                    <p>{t.googleTransferText}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.githubTransferTitle}
                    </h3>
                    <p>{t.githubTransferText}</p>
                  </div>
                </div>

                <p>{t.noOtherTransfers}</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t.rightsTitle}</h2>
                <p>{t.rightsIntro}</p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{t.accessTitle}</h3>
                    <p>{t.accessText}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.rectificationTitle}
                    </h3>
                    <p>{t.rectificationText}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{t.erasureTitle}</h3>
                    <p>{t.erasureText}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.restrictionTitle}
                    </h3>
                    <p>{t.restrictionText}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.objectionTitle}
                    </h3>
                    <p>{t.objectionText}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.portabilityTitle}
                    </h3>
                    <p>{t.portabilityText}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.withdrawConsentTitle}
                    </h3>
                    <p>{t.withdrawConsentText}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {t.complaintTitle}
                    </h3>
                    <p>{t.complaintText}</p>
                  </div>
                </div>

                <p>{t.exerciseRights}</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  {t.automatedDecisionTitle}
                </h2>
                <p>{t.automatedDecisionText}</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t.changesTitle}</h2>
                <p>{t.changesText}</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t.contactInfoTitle}</h2>
                <p>{t.contactInfoText}</p>
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
