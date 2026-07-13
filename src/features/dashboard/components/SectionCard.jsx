export default function SectionCard({ title, subtitle, action, children, className = "" }) {
  return (
    <section
      className={`rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)] ${className}`}
    >
      {(title || subtitle || action) ? (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div className="space-y-1">
            {title ? <h2 className="text-[18px] font-bold text-[#1f1711]">{title}</h2> : null}
            {subtitle ? <p className="max-w-2xl text-[13px] leading-6 text-[#6f655e]">{subtitle}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
