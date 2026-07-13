function TimelineItem({ helperText, isComplete, timestamp, title }) {
  return (
    <div className="relative flex gap-3">
      <div className="relative flex w-6 shrink-0 justify-center">
        <span
          className={[
            "relative z-10 mt-1 inline-flex h-4 w-4 rounded-full border-2",
            isComplete ? "border-[#cf6e38] bg-[#fff1e7]" : "border-[#cf6e38] bg-white",
          ].join(" ")}
        />
      </div>
      <div className="pb-5">
        <p className={`text-[15px] font-semibold ${isComplete ? "text-[#18120f]" : "text-[#8c8179]"}`}>{title}</p>
        <p className={`mt-1 text-[13px] ${isComplete ? "text-[#3f342e]" : "text-[#b0a49b]"}`}>{timestamp}</p>
        <p className={`mt-1 text-[13px] leading-6 ${isComplete ? "text-[#6c6058]" : "text-[#c0b3aa]"}`}>
          {helperText}
        </p>
      </div>
    </div>
  );
}

export default function PaymentActivityCard({ activity }) {
  return (
    <section className="rounded-[18px] border border-[#ddd4cd] bg-white shadow-[0_12px_30px_rgba(55,31,13,0.05)]">
      <div className="border-b border-[#eee5de] bg-[linear-gradient(180deg,#fff7f1_0%,#fffdfa_100%)] px-5 py-4">
        <h2 className="text-[18px] font-bold text-[#221914]">Activity Timeline</h2>
      </div>

      <div className="px-5 py-5">
        {activity.map((item, index) => (
          <div key={item.id} className="relative">
            {index !== activity.length - 1 ? (
              <span className="absolute left-[7px] top-5 h-[calc(100%-4px)] w-px bg-[#f0e2d9]" />
            ) : null}
            <TimelineItem {...item} />
          </div>
        ))}
      </div>
    </section>
  );
}
