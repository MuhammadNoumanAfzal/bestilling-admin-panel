import { Calendar, Copy, MapPin, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VendorDetailHeader({ vendor }) {
  const navigate = useNavigate();

  async function handleCopyId() {
    try {
      await navigator.clipboard.writeText(vendor.id);
    } catch {}
  }

  return (
    <section className="overflow-hidden rounded-[16px] border border-[#ddd6cf] bg-[#fff8f2] shadow-[0_8px_28px_rgba(53,34,20,0.05)]">
      <div className="px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <img
            alt={vendor.name}
            className="h-16 w-16 rounded-[12px] object-cover shadow-[0_8px_20px_rgba(53,34,20,0.10)]"
            src={vendor.avatarUrl}
          />

            <div className="space-y-2">
            <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#18120f] sm:text-[32px]">
                {vendor.name}
              </h1>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-[#7b6f67] sm:text-[12px]">
                <button
                  className="inline-flex items-center gap-1 text-[#7b6f67] transition hover:text-[#d96834]"
                  onClick={handleCopyId}
                  type="button"
                >
                    <span>ID: {vendor.id}</span>
                    <Copy size={11} />
                </button>
                <span className="inline-flex items-center gap-1">
                    <MapPin size={11} />
                  {vendor.location}
                </span>
                <span className="inline-flex items-center gap-1">
                    <UserRound size={11} />
                  {vendor.manager}
                </span>
                <span className="inline-flex items-center gap-1">
                    <Calendar size={11} />
                  {vendor.joinedLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
            className="inline-flex items-center gap-2 self-start rounded-[8px] border border-[#efc5b1] bg-white px-3 py-1.5 text-[11px] font-bold text-[#d96834] transition hover:bg-[#fff2ea]"
            onClick={() => navigate("/vendors")}
          type="button"
        >
          {vendor.supportContactLabel}
        </button>
      </div>
      </div>

      <div className="border-t border-[#eadfd6] bg-white px-5 py-3 sm:px-6">
        <div className="flex flex-wrap gap-5">
          {["Overview", "Menus", "Orders", "Reviews", "Earnings", "Documents"].map((tab, index) => (
            <span
              key={tab}
              className={[
                "inline-flex rounded-[8px] px-3 py-1.5 text-[11px] font-semibold",
                index === 0
                  ? "bg-[#d96834] text-white"
                  : "text-[#6f645d]",
              ].join(" ")}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
