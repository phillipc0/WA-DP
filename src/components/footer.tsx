import { Link } from "@heroui/link";

/**
 * Footer component with legal links for EU compliance
 * @returns Footer component
 */
export const Footer = () => {
  return (
    <footer className="border-t border-divider bg-background/60 backdrop-blur-md">
      <div className="container mx-auto max-w-7xl px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-foreground-500">
            © {new Date().getFullYear()} Developer Portfolio. All rights
            reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <Link
              className="hover:text-primary transition-colors"
              color="foreground"
              href="/imprint"
            >
              Imprint
            </Link>
            <Link
              className="hover:text-primary transition-colors"
              color="foreground"
              href="/privacy"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
