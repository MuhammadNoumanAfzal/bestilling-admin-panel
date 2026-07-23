import { ArrowLeft, Calendar, Copy, MapPin, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VendorDetailHeader({ vendor }) {
  const navigate = useNavigate();

  async function handleCopyId() {
    try {
      await navigator.clipboard.writeText(vendor.id);
    } catch {}
  }

  return (
    <section className="rounded-[16px] border border-[#ddd6cf] bg-gradient-to-br from-white to-[#fffbf8] px-5 py-5 shadow-[0_8px_28px_rgba(53,34,20,0.05)] sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border border-[#ddd4ca] bg-white text-[#6f655e] transition hover:border-[#f0d4ca] hover:bg-[#fff0e7] hover:text-[#d96834]"
            onClick={() => navigate("/vendors")}
            type="button"
          >
            <ArrowLeft size={18} />
          </button>

          <img
            alt={vendor.name}
            className="h-20 w-20 rounded-[18px] object-cover shadow-[0_8px_20px_rgba(53,34,20,0.10)]"
            src={vendor.avatarUrl}
          />

          <div className="space-y-3">
            <div>
              <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-[#18120f] sm:text-[36px]">
                {vendor.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] font-medium text-[#7b6f67] sm:text-[13px]">
                <button
                  className="inline-flex items-center gap-1 rounded-full bg-[#f8f4f0] px-2.5 py-1 text-[#6f645d] transition hover:bg-[#efe8e1]"
                  onClick={handleCopyId}
                  type="button"
                >
                  <span>ID: {vendor.id}</span>
                  <Copy size={12} />
                </button>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} />
                  {vendor.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <UserRound size={12} />
                  {vendor.manager}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar size={12} />
                  {vendor.joinedLabel}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {["Overview", "Menus", "Orders", "Reviews", "Earnings", "Documents"].map((tab, index) => (
                <span
                  key={tab}
                  className={[
                    "inline-flex rounded-[10px] px-3 py-1.5 text-[12px] font-semibold",
                    index === 0
                      ? "bg-[#d96834] text-white"
                      : "border border-[#e7ddd6] bg-white text-[#6f645d]",
                  ].join(" ")}
                >
                  {tab}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          className="inline-flex items-center gap-2 self-start rounded-[10px] border border-[#efc5b1] bg-white px-4 py-2 text-[12px] font-bold text-[#d96834] transition hover:bg-[#fff2ea]"
          type="button"
        >
          {vendor.supportContactLabel}
        </button>
      </div>
    </section>
  );
}
