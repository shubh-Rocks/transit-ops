export default function PagePlaceholder({ eyebrow, title, description }) {
  return (
    <section className="rounded-lg border border-[#E6DFE4] bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase text-secondary">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
        {description}
      </p>
    </section>
  );
}
