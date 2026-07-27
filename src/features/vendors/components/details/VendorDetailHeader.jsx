import { ArrowLeft, Calendar, Check, Copy, MapPin, UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VendorDetailHeader({
  vendor,
  sections = [],
  activeSection = "overview",
  onSectionChange,
}) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  async function handleCopyId() {
    try {
      await navigator.clipboard.writeText(vendor.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <section className="overflow-hidden rounded-[18px] border border-[#ddd6cf] bg-gradient-to-br from-white via-[#fffdfa] to-[#fff7f0] shadow-[0_10px_32px_rgba(53,34,20,0.06)]">
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#cf6e38] transition hover:underline"
              onClick={() => navigate("/vendors")}
              type="button"
            >
              <ArrowLeft size={16} />
              Vendor management
            </button>

            <button
              className="inline-flex items-center gap-2 self-start rounded-[10px] border border-[#efc5b1] bg-white px-4 py-2 text-[13px] font-bold text-[#d96834] transition hover:bg-[#fff2ea]"
              onClick={() => navigate("/vendors")}
              type="button"
            >
              {vendor.supportContactLabel}
            </button>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <img
                alt={vendor.name}
                className="h-[4.5rem] w-[4.5rem] rounded-[14px] object-cover shadow-[0_10px_24px_rgba(53,34,20,0.12)] sm:h-20 sm:w-20"
                src={vendor.avatarUrl}
              />

              <div className="space-y-2.5">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-[30px] font-extrabold tracking-[-0.04em] text-[#18120f] sm:text-[38px]">
                      {vendor.name}
                    </h1>
                  </div>
                  <p className="mt-2 text-[16px] leading-7 text-[#6f645d]">
                    Review vendor operations, menus, orders, reviews, payouts, and compliance documents in one place.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] font-semibold text-[#7b6f67] sm:text-[14px]">
                    <button
                      className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#f7f5f3] px-2.5 py-1 text-[#6f655e] transition hover:bg-[#efe9e4] hover:text-[#d96834]"
                      onClick={handleCopyId}
                      type="button"
                    >
                      <span>ID: {vendor.id}</span>
                      {copied ? <Check size={13} className="text-[#2b9e62]" /> : <Copy size={13} />}
                    </button>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={13} />
                      {vendor.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <UserRound size={13} />
                      {vendor.manager}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={13} />
                      {vendor.joinedLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          <div className="space-y-2">
            <div className="rounded-[14px] border border-[#eadfd6] bg-white/90 p-4 shadow-[0_6px_18px_rgba(53,34,20,0.04)]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#8c8077]">
                Business Type
              </p>
              <p className="mt-1 text-[18px] font-extrabold text-[#18120f]">
                {vendor.businessType}
              </p>
              <p className="mt-2 text-[14px] leading-6 text-[#6f645d]">
                {vendor.legalName}
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#eadfd6] bg-white px-5 py-3 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                className={[
                  "inline-flex rounded-[10px] px-3.5 py-2 text-[13px] font-bold transition",
                  isActive
                    ? "bg-[#d96834] text-white"
                    : "text-[#6f645d] hover:bg-[#fff4ec] hover:text-[#cf6e38]",
                ].join(" ")}
                onClick={() => onSectionChange?.(section.id)}
                type="button"
              >
                {section.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
