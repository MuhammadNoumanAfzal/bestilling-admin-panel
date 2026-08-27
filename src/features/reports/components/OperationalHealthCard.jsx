import { Activity, AlarmClockCheck, Gauge, ShieldCheck } from "lucide-react";
import ReportsSectionCard from "./ReportsSectionCard.jsx";

function getMetricTone(label, value) {
  const normalizedLabel = String(label || "").toLowerCase();
  const normalizedValue = String(value || "").toLowerCase();

  if (normalizedLabel.includes("sla") || normalizedLabel.includes("response")) {
    return {
      icon: AlarmClockCheck,
      accent: "from-[#e8f7ef] to-[#f7fcf9]",
      border: "border-[#cfe8d9]",
      badge: "bg-[#e7f6ee] text-[#2f8f57]",
      progress: "bg-[linear-gradient(90deg,#36a767_0%,#7fd49d_100%)]",
    };
  }

  if (normalizedLabel.includes("issue") || normalizedLabel.includes("uptime")) {
    return {
      icon: ShieldCheck,
      accent: "from-[#eef5ff] to-[#fbfdff]",
      border: "border-[#d7e2f7]",
      badge: normalizedValue.includes("%") ? "bg-[#eef5ff] text-[#5378bf]" : "bg-[#fff2eb] text-[#cf6e38]",
      progress: "bg-[linear-gradient(90deg,#5d84d9_0%,#8fb0ef_100%)]",
    };
  }

  if (normalizedLabel.includes("order")) {
    return {
      icon: Gauge,
      accent: "from-[#fff3ea] to-[#fffaf6]",
      border: "border-[#efd8ca]",
      badge: "bg-[#fff1e7] text-[#ca6636]",
      progress: "bg-[linear-gradient(90deg,#d56a37_0%,#ef9a70_100%)]",
    };
  }

  return {
    icon: Activity,
    accent: "from-[#f4f0ff] to-[#fcfbff]",
    border: "border-[#e1daf5]",
    badge: "bg-[#f0ebff] text-[#6a58b5]",
    progress: "bg-[linear-gradient(90deg,#8a73d6_0%,#b39ef0_100%)]",
  };
}

function getProgressWidth(value) {
  const numericValue = Number.parseFloat(String(value || "").replace(/[^\d.]/g, ""));
  if (Number.isFinite(numericValue)) {
    return `${Math.max(16, Math.min(100, numericValue))}%`;
  }

  return "56%";
}

function HealthMetric({ label, value }) {
  const tone = getMetricTone(label, value);
  const Icon = tone.icon;

  return (
    <div
      className={[
        "rounded-[18px] border bg-gradient-to-br px-4 py-4 shadow-[0_14px_30px_rgba(55,31,13,0.06)]",
        tone.border,
        tone.accent,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#89786c]">{label}</p>
          <p className="mt-2 text-[24px] font-black leading-none tracking-[-0.06em] text-[#17110d] sm:text-[26px]">
            {value}
          </p>
        </div>
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-white text-[#2c211b] shadow-[0_10px_22px_rgba(55,31,13,0.08)]">
          <Icon size={18} />
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/80">
          <div className={["h-full rounded-full", tone.progress].join(" ")} style={{ width: getProgressWidth(value) }} />
        </div>
        <span className={["rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em]", tone.badge].join(" ")}>
          Healthy
        </span>
      </div>
    </div>
  );
}

export default function OperationalHealthCard({ items }) {
  return (
    <ReportsSectionCard className="p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <span className="inline-flex rounded-full border border-[#efdbc9] bg-white/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#d16936]">
              Live Signals
            </span>
            <h2 className="mt-3 text-[18px] font-black tracking-[-0.05em] text-[#18120f] sm:text-[20px]">
              Operational Health
            </h2>
            <p className="mt-1 text-[12px] font-medium text-[#8a7d74]">A fast read on service quality and reliability</p>
          </div>

          <div className="w-full rounded-[16px] border border-[#edd8ca] bg-white/80 px-3.5 py-2 text-left shadow-[0_10px_24px_rgba(55,31,13,0.05)] sm:w-auto sm:min-w-[108px] sm:text-right">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9a8577]">Status</p>
            <p className="mt-1 text-[13px] font-black text-[#2f8f57]">Stable</p>
          </div>
        </div>

        <div className="grid gap-3">
          {items.map((item) => (
            <HealthMetric key={item.id} {...item} />
          ))}
        </div>

        <div className="rounded-[18px] border border-[#efe0d6] bg-white/65 px-4 py-3 text-[12px] leading-6 text-[#6e625a]">
          Metrics are presented as a quick executive snapshot so teams can spot service drift before it turns into a customer issue.
        </div>
      </div>
    </ReportsSectionCard>
  );
}
