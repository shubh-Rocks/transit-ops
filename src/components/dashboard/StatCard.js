import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const toneStyles = {
  plum: "border-primary/15 bg-primary/10 text-primary",
  teal: "border-secondary/20 bg-secondary/10 text-secondary",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  slate: "border-slate-200 bg-slate-50 text-slate-700",
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  href,
  tone = "plum",
  detail,
  badge,
}) {
  const card = (
    <div className="group h-full rounded-lg border border-[#E6DFE4] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted">{title}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <h2 className="text-3xl font-semibold text-ink">{value}</h2>
            {badge ? (
              <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-semibold text-secondary">
                {badge}
              </span>
            ) : null}
          </div>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${toneStyles[tone] ?? toneStyles.plum}`}
        >
          <Icon size={21} />
        </div>
      </div>

      <div className="mt-5 flex min-h-5 items-center justify-between gap-3 text-sm">
        <p className="truncate text-muted">{detail}</p>
        {href ? (
          <ArrowUpRight
            size={16}
            className="shrink-0 text-muted transition group-hover:text-primary"
          />
        ) : null}
      </div>
    </div>
  );

  if (!href) {
    return card;
  }

  return (
    <Link href={href} className="block h-full">
      {card}
    </Link>
  );
}
