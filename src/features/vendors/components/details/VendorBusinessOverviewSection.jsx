import { useState } from "react";
import { vt, useVendorLanguage } from "../../utils/vendorTranslation.js";
import { BadgeCheck, BriefcaseBusiness, ChevronLeft, ChevronRight, Gauge, MapPin, PackageCheck, ShieldAlert, Truck } from "lucide-react";

function OverviewCard({ title, items }) {
  useVendorLanguage();
  return (
    <article className="rounded-[16px] border border-[#ddd6cf] bg-white p-5 shadow-[0_8px_20px_rgba(53,34,20,0.05)]">
      <h3 className="mb-4 text-[20px] font-bold text-[#18120f]">{title}</h3>
      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-[12px] font-medium text-[#8a7f76]">{vt(item.label)}</p>
            <p className="mt-1.5 text-[15px] font-bold leading-6 text-[#1f1711]">{vt(item.value)}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

const logisticsIcons = {
  "Delivery Radius": Truck,
  "Lead Time": Gauge,
  "Max Capacity": BriefcaseBusiness,
  "Delivery Zones": MapPin,
};

function getUniqueListItems(value) {
  const rawValue = `${value ?? ""}`.trim();

  if (!rawValue.includes(",")) {
    return [];
  }

  const seen = new Set();
  return rawValue
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .filter((entry) => {
      const key = entry.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

function LogisticsValue({ value }) {
  const listItems = getUniqueListItems(value);

  if (listItems.length > 1) {
    const visibleItems = listItems.slice(0, 8);
    const hiddenCount = listItems.length - visibleItems.length;

    return (
      <div
        className="flex max-w-[260px] flex-wrap justify-end gap-1.5 text-right"
        title={listItems.join(", ")}
      >
        {visibleItems.map((entry) => (
          <span
            key={entry}
            className="inline-flex max-w-full items-center rounded-full border border-[#ecd8ca] bg-[#fff7f2] px-2.5 py-1 text-[12px] font-bold leading-none text-[#1f1711]"
          >
            {vt(entry)}
          </span>
        ))}
        {hiddenCount > 0 ? (
          <span className="inline-flex items-center rounded-full border border-[#d9c6b8] bg-[#f6eee8] px-2.5 py-1 text-[12px] font-bold leading-none text-[#6d5b51]">
            +{hiddenCount} more
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <span className="max-w-[260px] break-words text-right text-[14px] font-bold leading-6 text-[#1f1711]">
      {vt(value)}
    </span>
  );
}

function groupServiceAreas(serviceAreas = []) {
  return serviceAreas.reduce((groups, area) => {
    const groupName = `${area.name || ""}`.trim() || vt("Unassigned area");
    const existingGroup = groups.find((group) => group.name === groupName);
    const normalizedArea = {
      id: area.id || `${groupName}-${area.postCode}`,
      postCode: area.postCode,
    };

    if (existingGroup) {
      existingGroup.areas.push(normalizedArea);
      return groups;
    }

    return [...groups, { name: groupName, areas: [normalizedArea] }];
  }, []);
}

const SERVICE_AREA_PAGE_SIZE = 40;

function ServiceAreasPanel({ serviceAreas = [] }) {
  useVendorLanguage();
  const [groupPages, setGroupPages] = useState({});

  if (!serviceAreas.length) {
    return null;
  }

  const groupedAreas = groupServiceAreas(serviceAreas).map((group) => ({
    ...group,
    areas: [...group.areas].sort((left, right) => Number(left.postCode) - Number(right.postCode)),
  }));
  const totalCount = serviceAreas.length;

  function setGroupPage(groupName, nextPage) {
    setGroupPages((current) => ({
      ...current,
      [groupName]: nextPage,
    }));
  }

  return (
    <article className="rounded-[16px] border border-[#ddd6cf] bg-white p-5 shadow-[0_8px_20px_rgba(53,34,20,0.05)] lg:col-span-2">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#d96834]">{vt("Delivery coverage")}</p>
          <h3 className="mt-1 text-[20px] font-bold text-[#18120f]">{vt("Service areas")}</h3>
          <p className="mt-1 text-[12px] font-medium text-[#81736a]">
            {groupedAreas.length} {vt(groupedAreas.length === 1 ? "area" : "areas")} • {totalCount} {vt(totalCount === 1 ? "postal code" : "postal codes")}
          </p>
        </div>
        <span className="rounded-full border border-[#d8ebdc] bg-[#f1fbf4] px-3 py-1.5 text-[12px] font-bold text-[#2d7446]">
          {vt("Active coverage")}
        </span>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        {groupedAreas.map((group) => {
          const pageCount = Math.max(1, Math.ceil(group.areas.length / SERVICE_AREA_PAGE_SIZE));
          const currentPage = Math.min(Math.max(groupPages[group.name] || 1, 1), pageCount);
          const startIndex = (currentPage - 1) * SERVICE_AREA_PAGE_SIZE;
          const visibleAreas = group.areas.slice(startIndex, startIndex + SERVICE_AREA_PAGE_SIZE);
          const startLabel = startIndex + 1;
          const endLabel = startIndex + visibleAreas.length;

          return (
            <div key={group.name} className="rounded-[14px] border border-[#eee2d9] bg-[#fffdfb] p-4">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h4 className="text-[15px] font-extrabold text-[#211913]">{vt(group.name)}</h4>
                  <p className="mt-1 text-[11px] font-semibold text-[#8a7a70]">
                    {vt("Showing")} {startLabel}-{endLabel} {vt("of")} {group.areas.length}
                  </p>
                </div>
                <span className="rounded-full bg-[#fff0e7] px-3 py-1 text-[11px] font-bold text-[#a85b31]">
                  {group.areas.length} {vt(group.areas.length === 1 ? "postal code" : "postal codes")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
                {visibleAreas.map((area) => (
                  <span
                    key={area.id}
                    className="flex h-9 items-center justify-center rounded-[10px] border border-[#ead8ca] bg-[#fff7f2] px-3 text-[13px] font-bold tabular-nums text-[#2d241f]"
                  >
                    {area.postCode}
                  </span>
                ))}
              </div>

              {pageCount > 1 ? (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#f0e5dc] pt-3">
                  <span className="text-[12px] font-bold text-[#7b6d63]">
                    {vt("Page")} {currentPage} {vt("of")} {pageCount}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-[9px] border border-[#e4d5ca] bg-white px-2.5 text-[12px] font-bold text-[#58483e] disabled:cursor-not-allowed disabled:opacity-45"
                      disabled={currentPage <= 1}
                      onClick={() => setGroupPage(group.name, currentPage - 1)}
                      type="button"
                    >
                      <ChevronLeft size={14} />
                      {vt("Prev")}
                    </button>
                    <button
                      className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-[9px] border border-[#e4d5ca] bg-white px-2.5 text-[12px] font-bold text-[#58483e] disabled:cursor-not-allowed disabled:opacity-45"
                      disabled={currentPage >= pageCount}
                      onClick={() => setGroupPage(group.name, currentPage + 1)}
                      type="button"
                    >
                      {vt("Next")}
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </article>
  );
}
function formatIdentityProvider(provider) {
  const normalized = `${provider ?? ""}`.trim();

  if (!normalized) {
    return vt("BankID");
  }

  return normalized.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function IdentityVerificationCard({ identityVerification = {} }) {
  useVendorLanguage();
  const isVerified = Boolean(identityVerification.isVerified);
  const Icon = isVerified ? BadgeCheck : ShieldAlert;

  return (
    <article className="rounded-[16px] border border-[#ddd6cf] bg-white p-5 shadow-[0_8px_20px_rgba(53,34,20,0.05)] lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`inline-flex h-11 w-11 items-center justify-center rounded-[14px] ${isVerified ? "bg-[#edf9f0] text-[#23884a]" : "bg-[#fff2ea] text-[#d96834]"}`}>
            <Icon size={20} />
          </span>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#9b7a65]">{vt("Identity verification")}</p>
            <h3 className="mt-1 text-[19px] font-extrabold text-[#18120f]">
              {isVerified ? vt("Verified with BankID") : vt("Not verified yet")}
            </h3>
          </div>
        </div>
        <span className={`rounded-full border px-3 py-1.5 text-[12px] font-bold ${isVerified ? "border-[#cfead7] bg-[#f1fbf4] text-[#247245]" : "border-[#f0d9bf] bg-[#fff7f0] text-[#b15f31]"}`}>
          {isVerified ? vt("Verified") : vt("Pending")}
        </span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[12px] border border-[#eee2d9] bg-[#fffdfb] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9b7a65]">{vt("Provider")}</p>
          <p className="mt-1 text-[14px] font-bold text-[#211913]">{formatIdentityProvider(identityVerification.provider)}</p>
        </div>
        <div className="rounded-[12px] border border-[#eee2d9] bg-[#fffdfb] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9b7a65]">{vt("Verified at")}</p>
          <p className="mt-1 text-[14px] font-bold text-[#211913]">{identityVerification.verifiedAt || vt("Not available")}</p>
        </div>
      </div>
    </article>
  );
}
function LogisticsCard({ title, items }) {
  useVendorLanguage();
  return (
    <article className="rounded-[16px] border border-[#ddd6cf] bg-white p-5 shadow-[0_8px_20px_rgba(53,34,20,0.05)]">
      <h3 className="mb-4 text-[20px] font-bold text-[#18120f]">{title}</h3>
      <div className="space-y-0.5">
        {items.map((item, index) => {
          const Icon = logisticsIcons[item.label] || PackageCheck;

          return (
            <div
              key={item.label}
              className={[
                "flex items-start justify-between gap-4 py-3",
                index !== items.length - 1 ? "border-b border-[#e9dfd8]" : "",
              ].join(" ")}
            >
              <div className="flex min-w-0 items-center gap-2.5 text-[#8a7f76]">
                <Icon size={15} className="shrink-0 text-[#d96834]" />
                <span className="text-[13px] font-medium">{vt(item.label)}</span>
              </div>
              <LogisticsValue value={item.value} />
            </div>
          );
        })}
      </div>
    </article>
  );
}

export default function VendorBusinessOverviewSection({ overview }) {
  useVendorLanguage();
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <span className="h-6 w-[4px] rounded-full bg-[#d96834]" />
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#fff2ea] text-[#d96834] shadow-sm">
          <BriefcaseBusiness size={15} />
        </span>
        <h2 className="text-[22px] font-extrabold tracking-tight text-[#18120f]">{vt("Business Overview")}</h2>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,1fr)]">
        <OverviewCard items={overview.contact} title={vt("Contact & Identity")} />
        <LogisticsCard items={overview.logistics} title={vt("Logistics & Capacity")} />
        <IdentityVerificationCard identityVerification={overview.identityVerification} />
        <ServiceAreasPanel serviceAreas={overview.serviceAreas} />
      </div>
    </section>
  );
}
