export default function PaymentActivityCard({ activity }) {
  return (
    <section className="rounded-[16px] border border-[#ddd4cd] bg-white p-4 shadow-[0_10px_24px_rgba(55,31,13,0.05)]">
      <h2 className="text-[16px] font-bold text-[#221914]">Activity Timeline</h2>
      <div className="mt-4 space-y-3">
        {activity.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fff0e7] text-[#cf6e38]">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
            </span>
            <p className="text-[12px] leading-6 text-[#5f534c]">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
