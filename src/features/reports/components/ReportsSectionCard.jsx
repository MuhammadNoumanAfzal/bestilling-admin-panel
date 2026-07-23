export default function ReportsSectionCard({ children, className = "" }) {
  return (
    <article
      className={[
        "overflow-hidden rounded-[18px] border border-[#d8ccc2] bg-white p-4 shadow-[0_8px_24px_rgba(55,31,13,0.06)]",
        className,
      ].join(" ")}
    >
      {children}
    </article>
  );
}
