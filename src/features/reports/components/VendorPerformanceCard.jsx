import { ArrowUpRight } from "lucide-react";
import ReportsSectionCard from "./ReportsSectionCard.jsx";

function VendorAvatar({ avatar, avatarUrl, name }) {
  if (avatarUrl) {
    return (
      <img
        alt={name}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
        src={avatarUrl}
      />
    );
  }

  return (
    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#4a3b30_0%,#171311_100%)] text-[12px] font-bold text-white">
      {avatar}
    </span>
  );
}

function VendorRow({ name, region, revenue, orders, avatar, avatarUrl }) {
  return (
    <div className="flex items-center gap-3 rounded-[12px] border border-[#efe5de] bg-[#fffdfa] px-3 py-2.5">
      <VendorAvatar avatar={avatar} avatarUrl={avatarUrl} name={name} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-bold text-[#1f1711]">{name}</p>
        <p className="text-[10px] font-medium text-[#8b7f76]">{region}</p>
      </div>

      <div className="text-right">
        <p className="text-[12px] font-extrabold text-[#1f1711]">{revenue}</p>
        <p className="text-[10px] font-medium text-[#8b7f76]">{orders} orders</p>
      </div>
    </div>
  );
}

export default function VendorPerformanceCard({ vendors, registration }) {
  return (
    <ReportsSectionCard className="h-full">
      <div className="space-y-4">
        <div>
          <h2 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#18120f]">
            Vendor Performance
          </h2>
          <p className="text-[12px] font-medium text-[#8a7d74]">
            Top contributors by revenue this month
          </p>
        </div>

        <div className="space-y-2.5">
          {vendors.map((vendor) => (
            <VendorRow key={vendor.id} {...vendor} />
          ))}
        </div>

        <div className="flex items-end justify-between rounded-[16px] border border-[#f1c7b6] bg-[#fff1ea] px-4 py-3">
          <div>
            <p className="text-[12px] font-bold text-[#cc6031]">New Registrations</p>
            <p className="mt-1 text-[32px] font-extrabold leading-none tracking-[-0.05em] text-[#d66030]">
              {registration.count}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#a56748]">{registration.note}</p>
          </div>

          <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-white text-[#d86a38] shadow-[0_10px_20px_rgba(216,106,56,0.12)]">
            <ArrowUpRight size={20} />
          </span>
        </div>
      </div>
    </ReportsSectionCard>
  );
}
