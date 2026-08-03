import { Clock, Check, Circle, AlertTriangle } from "lucide-react";

function TimelineIcon({ status }) {
  if (status === "completed") {
    return <Check size={16} className="text-white" strokeWidth={2.2} />;
  }

  if (status === "failed") {
    return <AlertTriangle size={16} className="text-white" strokeWidth={2.2} />;
  }

  return <Circle size={14} className={status === "current" ? "text-white" : "text-[#18120f]"} fill="currentColor" />;
}

export default function OrderTimelineCard({ timeline }) {
  return (
    <article className="h-full rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <header className="mb-6 flex items-center gap-2 border-b border-[#eee4dd] pb-3">
        <Clock size={18} className="text-[#cf6432]" />
        <h3 className="text-[18px] font-bold text-[#18120f]">Order Timeline</h3>
      </header>

      <div className="flex flex-col">
        {timeline.length === 0 ? (
          <p className="text-[14px] text-[#7a6d66]">No timeline activity is available yet.</p>
        ) : (
          timeline.map((step, index) => {
            const nodeStyles =
              step.status === "completed"
                ? "bg-[#d96834] border-[#d96834]"
                : step.status === "failed"
                ? "bg-[#d83f3f] border-[#d83f3f]"
                : step.status === "current"
                ? "bg-[#18120f] border-[#18120f]"
                : "bg-white border-[#d8ccc2]";

            return (
              <div key={`${step.key}-${index}`} className="relative min-h-[58px] pb-7 pl-13 last:pb-0">
                {index < timeline.length - 1 ? (
                  <div
                    className={`absolute bottom-0 left-[17px] top-9 w-[2px] ${
                      step.status === "completed" ? "bg-[#d96834]" : "bg-[#e6dad1]"
                    }`}
                  />
                ) : null}

                <div
                  className={`absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border-2 ${nodeStyles} shadow-sm`}
                >
                  <TimelineIcon status={step.status} />
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[14px] font-bold text-[#18120f]">{step.label}</p>
                    <span className="text-[11px] font-medium text-[#9a8f86]">
                      {step.happenedAtLabel}
                    </span>
                  </div>
                  <p className="text-[12px] leading-4 text-[#8a7f76]">{step.description}</p>
                  {step.actor ? (
                    <p className="text-[11px] font-medium text-[#a0897f]">By {step.actor}</p>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    </article>
  );
}
