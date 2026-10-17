import { MapPin } from "lucide-react";

export default function PageHero({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <section className="w-full bg-[#efeeeb] section-pad pt-8 pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#023341] to-[#045a6e] px-6 py-8 md:px-10 md:py-10">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none"
            aria-hidden="true"
            style={{ backgroundImage: 'url("/images/Home-banner.jpg")' }}
          />
          <div className="relative z-10 flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
              {icon}
            </span>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight">
                {title}
              </h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
                <MapPin size={13} />
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
