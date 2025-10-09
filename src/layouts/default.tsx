import { Navbar } from "@/components/navbar";

/**
 * Default layout component with navbar and main content area
 * @param props - Component props
 * @param props.children - Child components to render in main area
 * @returns Default layout component
 */
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow">
        {children}
      </main>
    </div>
  );
}
