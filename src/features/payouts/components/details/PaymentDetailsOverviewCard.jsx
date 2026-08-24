export default function PaymentDetailsOverviewCard({ label, value }) {
  return (
    <article className="rounded-[20px] border border-[#e7dacf] bg-[linear-gradient(180deg,#ffffff_0%,#fff9f4_100%)] px-5 py-5 shadow-[0_14px_30px_rgba(55,31,13,0.06)] transition hover:-translate-y-0.5 hover:border-[#dcc1b0] hover:shadow-[0_18px_36px_rgba(55,31,13,0.1)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a7b71]">{label}</p>
      <p className="mt-3 text-[28px] font-bold leading-none tracking-[-0.05em] text-[#1d1612]">{value}</p>
    </article>
  );
}
