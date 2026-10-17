import SiteChrome from "@/components/SiteChrome";

export default function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <SiteChrome>
      <div className="min-h-screen pb-16 md:pb-0 bg-[#efeeeb]">
        <div className="section-pad pt-20 md:pt-24 pb-4">
          <div className="max-w-4xl mx-auto">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500">
              <a href="/" className="hover:text-[#023341]">Home</a>
              <span>/</span>
              <span className="text-gray-800 font-medium">{title}</span>
            </nav>
            <h1 className="mt-2 font-display text-2xl md:text-3xl font-bold text-[#003b53]">
              {title}
            </h1>
            {intro && <p className="mt-2 text-sm md:text-[15px] text-gray-600">{intro}</p>}
          </div>
        </div>
        <div className="section-pad pb-12">
          <div className="max-w-4xl mx-auto rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
            <div className="text-[14px] md:text-[15px] leading-[1.75] text-gray-700 [&_p]:mb-3.5 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1.5 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-[#003b53] [&_h2]:mt-6 [&_h2]:mb-2">
              {children}
            </div>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
