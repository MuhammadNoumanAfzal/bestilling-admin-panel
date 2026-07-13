export default function PaymentDetailsOverviewCard({ label, value }) {
  return (
    <article className="rounded-[12px] border border-[#ece4de] bg-white px-4 py-3 shadow-[0_8px_20px_rgba(55,31,13,0.07)]">
      <p className="text-[12px] font-bold leading-5 text-[#534841]">{label}</p>
      <p className="mt-1 text-[22px] font-bold leading-none tracking-[-0.03em] text-[#1d1612]">{value}</p>
    </article>
  );
}
