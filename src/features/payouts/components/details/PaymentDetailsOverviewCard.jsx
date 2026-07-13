export default function PaymentDetailsOverviewCard({ label, value }) {
  return (
    <article className="rounded-[16px] border border-[#e8ddd5] bg-[linear-gradient(180deg,#ffffff_0%,#fffaf6_100%)] px-4 py-4 shadow-[0_10px_24px_rgba(55,31,13,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(55,31,13,0.08)]">
      <p className="text-[12px] font-bold leading-5 text-[#74675f]">{label}</p>
      <p className="mt-2 text-[24px] font-bold leading-none tracking-[-0.04em] text-[#1d1612]">{value}</p>
    </article>
  );
}
