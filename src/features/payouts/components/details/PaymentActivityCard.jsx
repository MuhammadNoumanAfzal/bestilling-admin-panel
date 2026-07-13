export default function PaymentActivityCard({ activity }) {
  return (
    <section className="rounded-[18px] border border-[#ddd4cd] bg-white shadow-[0_12px_30px_rgba(55,31,13,0.05)]">
      <div className="border-b border-[#eee5de] bg-[linear-gradient(180deg,#fff7f1_0%,#fffdfa_100%)] px-5 py-4">
        <h2 className="text-[18px] font-bold text-[#221914]">Activity Timeline</h2>
        <p className="mt-1 text-[13px] leading-6 text-[#7b6f67]">Recent updates for this payment and payout flow.</p>
      </div>

      <div className="space-y-4 px-5 py-5">
        {activity.map((item, index) => (
          <div key={`${item}-${index}`} className="relative flex items-start gap-3">
            {index !== activity.length - 1 ? (
              <span className="absolute left-[9px] top-7 h-[calc(100%+10px)] w-px bg-[#f0e2d9]" />
            ) : null}
            <span className="relative z-10 mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fff0e7] text-[#cf6e38]">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
            </span>
            <p className="text-[13px] leading-6 text-[#5f534c]">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
