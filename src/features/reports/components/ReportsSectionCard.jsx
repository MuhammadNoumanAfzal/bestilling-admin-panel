export default function ReportsSectionCard({ children, className = "" }) {
  return (
    <article
      className={[
        "overflow-hidden rounded-[24px] border border-[#e7d8cd] bg-[linear-gradient(180deg,#fffdfa_0%,#fff8f3_100%)] p-4 shadow-[0_20px_48px_rgba(55,31,13,0.08)]",
        className,
      ].join(" ")}
    >
      {children}
    </article>
  );
}
