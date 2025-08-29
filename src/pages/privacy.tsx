import DefaultLayout from "@/layouts/default";
import { usePortfolioData } from "@/hooks/usePortfolioData";

/**
 * Privacy Policy page component for EU legal compliance (GDPR)
 * @returns Privacy Policy page component
 */
export default function PrivacyPage() {
  const { portfolioData, isLoading } = usePortfolioData();

  if (isLoading) {
    return (
      <DefaultLayout>
        <section className="py-8 md:py-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">
              Privacy Policy / Datenschutzerklärung
            </h1>
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
  return (
    <DefaultLayout>
      <section className="py-8 md:py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">
            Privacy Policy / Datenschutzerklärung
          </h1>

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
                    Please review and customize this privacy policy according to
                    your specific data processing activities and legal
                    requirements. Configure your legal information in the editor
                    under &quot;Legal Info&quot;.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2>1. Data Protection at a Glance</h2>

            <h3>General Information</h3>
            <p>
              The following information provides a simple overview of what
              happens to your personal data when you visit this website.
              Personal data is any data that can personally identify you. For
              detailed information on data protection, please refer to our
              privacy policy listed below this text.
            </p>

            <h3>Who is responsible for data collection on this website?</h3>
            <p>
              Data processing on this website is carried out by the website
              operator. You can find their contact details in the
              &quot;Responsible Party&quot; section of this privacy policy.
            </p>

            <h3>How do we collect your data?</h3>
            <p>
              Your data is collected when you provide it to us. This could, for
              example, be data you enter on a contact form.
            </p>
            <p>
              Other data is collected automatically by our IT systems when you
              visit the website. This is mainly technical data (such as internet
              browser, operating system, or time of the page call). The
              collection of this data takes place automatically as soon as you
              enter our website.
            </p>

            <h2>2. Responsible Party for Data Processing</h2>
            <p>The responsible party for data processing on this website is:</p>
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
                  <strong>Phone:</strong> {displayPhone}
                  <br />
                </>
              )}
              <strong>Email:</strong> {displayEmail}
            </p>

            <h2>3. Your Rights under the GDPR</h2>
            <p>You have the following rights regarding your personal data:</p>
            <ul>
              <li>
                <strong>Right to information</strong> - You have the right to
                receive information about your data stored with us and its
                processing (Art. 15 GDPR).
              </li>
              <li>
                <strong>Right to correction</strong> - You have the right to
                correction of incorrect personal data concerning you (Art. 16
                GDPR).
              </li>
              <li>
                <strong>Right to deletion</strong> - You have the right to
                deletion of your data stored with us, unless we are legally
                obliged to store it (Art. 17 GDPR).
              </li>
              <li>
                <strong>Right to restrict processing</strong> - You have the
                right to request the restriction of processing of your personal
                data (Art. 18 GDPR).
              </li>
              <li>
                <strong>Right to data portability</strong> - You have the right
                to receive your data in a structured, commonly used and
                machine-readable format (Art. 20 GDPR).
              </li>
              <li>
                <strong>Right to object</strong> - You have the right to object
                to the processing of your personal data (Art. 21 GDPR).
              </li>
            </ul>

            <h2>4. Data Collection on This Website</h2>

            <h3>Cookies</h3>
            <p>
              Our internet pages use so-called &quot;cookies&quot;. Cookies are
              small text files and do not cause any damage to your device. They
              are stored either temporarily for the duration of a session
              (session cookies) or permanently (permanent cookies) on your
              device. Session cookies are automatically deleted after your
              visit. Permanent cookies remain stored on your device until you
              delete them yourself or until they are automatically deleted by
              your web browser.
            </p>

            <h3>Server Log Files</h3>
            <p>
              The website provider automatically collects and stores information
              in so-called server log files, which your browser transmits to us
              automatically. These are:
            </p>
            <ul>
              <li>Browser type and browser version</li>
              <li>Operating system used</li>
              <li>Referrer URL</li>
              <li>Host name of the accessing computer</li>
              <li>Time of the server request</li>
              <li>IP address</li>
            </ul>
            <p>
              This data is not combined with other data sources. The collection
              of this data is based on Art. 6 (1) lit. f GDPR. The website
              operator has a legitimate interest in the technically error-free
              presentation and optimization of his website.
            </p>

            <h3>Contact Forms</h3>
            <p>
              If you send us inquiries via contact forms, your details from the
              inquiry form, including the contact details you provided there,
              will be stored by us for the purpose of processing the inquiry and
              in the event of follow-up questions. We do not pass on this data
              without your consent.
            </p>

            <h2>5. External Services and Hosting</h2>

            <h3>External Hosting</h3>
            <p>
              This website is hosted by a third-party service provider (hoster).
              The personal data collected on this website is stored on the
              hoster&apos;s servers. This may include IP addresses, contact
              requests, meta and communication data, contract data, contact
              details, names, website accesses, and other data generated via a
              website.
            </p>
            <p>
              The use of the hoster is for the purpose of fulfilling the
              contract with our potential and existing customers (Art. 6 para. 1
              lit. b GDPR) and in the interest of secure, fast, and efficient
              provision of our online service by a professional provider (Art. 6
              para. 1 lit. f GDPR).
            </p>

            <h3>GitHub Integration</h3>
            <p>
              This website may integrate with GitHub to display repository
              information. When you view pages that display GitHub data, your
              browser may connect directly to GitHub&apos;s servers. Please
              refer to GitHub&apos;s privacy policy at
              https://docs.github.com/en/github/site-policy/github-privacy-statement
              for information about their data processing practices.
            </p>

            <h2>6. Data Storage Duration</h2>
            <p>
              Unless a more specific storage period has been specified in this
              privacy policy, your personal data will remain with us until the
              purpose for which it was collected no longer applies. If you
              assert a justified request for deletion or revoke your consent to
              data processing, your data will be deleted unless we have other
              legally permissible reasons for storing your personal data (e.g.,
              tax or commercial law retention periods); in the latter case, the
              deletion takes place after these reasons cease to apply.
            </p>

            <div className="text-sm text-gray-600 dark:text-gray-400 mt-8 pt-4 border-t">
              <p>
                This privacy policy was created with consideration for the EU
                General Data Protection Regulation (GDPR).
              </p>
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
