import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Eye,
  MapPin,
  MessageSquare,
  Save,
  Share2,
  Star,
  Clock3,
  Upload,
  UserRound,
  XCircle,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVendorApplicationReview } from "../data/vendorDetailData.js";

function SectionTitle({ title }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <span className="h-6 w-[4px] rounded-full bg-[#dc6a34]" />
      <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#1d1510]">{title}</h2>
    </div>
  );
}

function InfoGrid({ items }) {
  return (
    <div className="grid gap-0 md:grid-cols-2">
      {items.map((column, index) => (
        <div
          key={index}
          className={`space-y-5 px-5 py-5 sm:px-6 ${index === 0 ? "border-b border-[#e5ddd6] md:border-b-0 md:border-r" : ""}`}
        >
          {column.map((item) => (
            <div key={item.label}>
              <p className="text-[13px] font-medium text-[#8d8078]">{item.label}</p>
              <p className="mt-1.5 text-[18px] font-bold leading-7 text-[#1d1510]">{item.value}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function OperatingDayPill({ day, active }) {
  return (
    <span
      className={[
        "inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2.5 text-[11px] font-bold",
        active ? "bg-[#f7b28c] text-[#8d3f16]" : "bg-[#f1ece7] text-[#b0a39a]",
      ].join(" ")}
    >
      {day}
    </span>
  );
}

function DocumentCard({ document }) {
  return (
    <article className="rounded-[16px] border border-[#d8d0c8] bg-white p-4 shadow-[0_6px_14px_rgba(53,34,20,0.05)]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-[16px] font-bold text-[#1c1510]">{document.title}</h3>
          <p className="mt-1 text-[12px] text-[#8d8078]">{document.subtitle}</p>
        </div>
        <span
          className={[
            "rounded-full border px-2.5 py-1 text-[10px] font-bold",
            document.status === "Verified"
              ? "border-[#d9ddd8] bg-[#ffffff] text-[#1d1510]"
              : "border-[#ead9c9] bg-[#fff8f1] text-[#8f5a2e]",
          ].join(" ")}
        >
          {document.status}
        </span>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#f3f0ed] px-3 py-2.5 text-[12px] font-bold text-[#1c1510] transition hover:bg-[#ebe6e1]"
          type="button"
        >
          <Eye size={12} />
          Preview
        </button>
        <button
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#f3f0ed] px-3 py-2.5 text-[12px] font-bold text-[#1c1510] transition hover:bg-[#ebe6e1]"
          type="button"
        >
          <Upload size={12} />
          Download
        </button>
      </div>
    </article>
  );
}

function MenuCard({ menu }) {
  return (
    <article className="overflow-hidden rounded-[16px] border border-[#d9d0c8] bg-white shadow-[0_8px_18px_rgba(53,34,20,0.05)]">
      <div className="relative">
        <img alt={menu.title} className="h-32 w-full object-cover" src={menu.imageUrl} />
        <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#6a5b51]">
          {menu.badge}
        </span>
      </div>
      <div className="space-y-2.5 p-4">
        <div>
          <h3 className="text-[15px] font-bold text-[#1c1510]">{menu.title}</h3>
          <p className="mt-1 text-[11px] leading-5 text-[#8a7d76]">{menu.description}</p>
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#8a7d76]">
          <span>{menu.servings}</span>
          <span>{menu.notice}</span>
        </div>
        <p className="text-[15px] font-extrabold text-[#1c1510]">{menu.price}</p>
        <button className="w-full text-center text-[12px] font-medium text-[#5d5149]" type="button">
          View
        </button>
      </div>
    </article>
  );
}

function ChecklistItem({ item }) {
  const complete = item.complete;

  return (
    <div className="flex items-start gap-2.5">
      <span className="pt-0.5">
        {complete ? (
          <CheckCircle2 size={14} className="text-[#de6b34]" />
        ) : (
          <Circle size={14} className="text-[#b8aaa0]" />
        )}
      </span>
      <p className={`text-[13px] leading-6 ${complete ? "text-[#6c5d54]" : "text-[#8d8078]"}`}>{item.label}</p>
    </div>
  );
}

export default function VendorApplicationReviewPage() {
  const { vendorId } = useParams();
  const navigate = useNavigate();

  const vendor = useMemo(() => getVendorApplicationReview(vendorId), [vendorId]);

  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      <section className="rounded-[18px] border border-[#ddd2c9] bg-[#f6ede4] shadow-[0_8px_24px_rgba(53,34,20,0.05)]">
        <div className="flex flex-col gap-6 px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              className="inline-flex items-center gap-1.5 text-[15px] font-bold text-[#cf6e38] transition hover:underline"
              onClick={() => navigate("/vendors")}
              type="button"
            >
              <ArrowLeft size={16} />
              Back to vendors
            </button>
          </div>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
            <div className="flex min-w-0 gap-4">
              <img
                alt={vendor.name}
                className="h-20 w-20 rounded-[16px] object-cover shadow-[0_8px_18px_rgba(53,34,20,0.14)]"
                src={vendor.logoUrl}
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[40px] font-extrabold tracking-[-0.04em] text-[#17110d]">
                    {vendor.name}
                  </h1>
                  <span className="rounded-full bg-[#f2c49d] px-3 py-1.5 text-[11px] font-bold text-[#6f3a16]">
                    {vendor.applicationStatus}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] font-medium text-[#6f6259]">
                  <span>ID: {vendor.id}</span>
                  <span className="inline-flex items-center gap-1"><UserRound size={12} /> {vendor.owner}</span>
                  <span className="inline-flex items-center gap-1"><Clock3 size={12} /> Submitted {vendor.submittedDate}</span>
                  <span className="inline-flex items-center gap-1"><MapPin size={12} /> {vendor.location}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-[10px] border border-[#d8ccc2] bg-white px-4 py-2.5 text-[14px] font-bold text-[#6a5c53]" type="button">
                <MessageSquare size={13} />
                Request Changes
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-[10px] border border-[#efbbb3] bg-white px-4 py-2.5 text-[14px] font-bold text-[#c53a2f]" type="button">
                <XCircle size={13} />
                Reject
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#d76833] px-4 py-2.5 text-[14px] font-bold text-white shadow-[0_8px_20px_rgba(215,104,51,0.24)]" type="button">
                <CheckCircle2 size={13} />
                Approve Vendor
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[16px] border border-[#ddd2c9] bg-white px-5 py-5 shadow-[0_6px_16px_rgba(53,34,20,0.04)] sm:px-6">
        <h2 className="text-[28px] font-extrabold italic tracking-[-0.02em] text-[#df6b34]">Administrative Verification Required</h2>
        <p className="mt-2 text-[15px] leading-7 text-[#6f6259]">
          This application currently in the final stage of review. Admin must verify all legal documentation and operational
          parameters before the vendor becomes active on the consumer marketplace.
        </p>
      </section>

      <section>
        <SectionTitle title="Business Summary" />
        <div className="overflow-hidden rounded-[16px] border border-[#ddd2c9] bg-white shadow-[0_6px_16px_rgba(53,34,20,0.04)]">
          <InfoGrid items={vendor.businessSummary} />
        </div>
      </section>

      <section>
        <SectionTitle title="Business Profile" />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_320px]">
          <article className="rounded-[16px] border border-[#ddd2c9] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.04)] sm:p-6">
            <h3 className="text-[22px] font-bold text-[#18120f]">Store Description</h3>
            <p className="mt-4 rounded-[10px] bg-[#f3f1ef] p-4 text-[15px] leading-7 text-[#65574f]">
              {vendor.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {vendor.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-[#d9d0c8] bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#7b6e65]">
                  {tag}
                </span>
              ))}
            </div>
          </article>

          <article className="rounded-[16px] border border-[#ddd2c9] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.04)] sm:p-6">
            <h3 className="text-[22px] font-bold text-[#18120f]">Operations</h3>
            <div className="mt-3 space-y-3">
              {vendor.operations.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 text-[15px]">
                  <span className="text-[#8a7d76]">{item.label}</span>
                  <span className="font-bold text-[#18120f]">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-[15px] font-bold text-[#18120f]">Operating Days</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {vendor.operatingDays.map((day) => (
                  <OperatingDayPill key={day.label} {...day} />
                ))}
              </div>
              <p className="mt-2 text-[12px] text-[#8d8078]">{vendor.operatingHours}</p>
            </div>
          </article>
        </div>
      </section>

      <section>
        <SectionTitle title="Document Verification" />
        <div className="grid gap-4 md:grid-cols-2">
          {vendor.documents.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Marketplace Store Preview" />
        <article className="overflow-hidden rounded-[18px] border border-[#ddd2c9] bg-white shadow-[0_8px_18px_rgba(53,34,20,0.04)]">
          <img alt={vendor.preview.name} className="h-[220px] w-full object-cover" src={vendor.preview.coverImage} />
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              <img alt={vendor.preview.name} className="h-24 w-24 rounded-[14px] object-cover" src={vendor.preview.logoImage} />
              <div>
                <h3 className="text-[28px] font-extrabold text-[#18120f]">{vendor.preview.name}</h3>
                <div className="mt-2 flex items-center gap-1 text-[15px] text-[#6e6058]">
                  <Star size={12} className="fill-[#f5ad2b] text-[#f5ad2b]" />
                  <span>{vendor.preview.rating}</span>
                  <span className="text-[#5f9ad5]">({vendor.preview.reviews} reviews)</span>
                </div>
                <p className="mt-1 text-[15px] text-[#6e6058]">{vendor.preview.address}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="inline-flex items-center gap-1 rounded-full border border-[#d8ccc2] px-3.5 py-2 text-[12px] font-bold text-[#53463f]" type="button">
                <Share2 size={11} />
                Share
              </button>
              <button className="inline-flex items-center gap-1 rounded-full border border-[#d8ccc2] px-3.5 py-2 text-[12px] font-bold text-[#53463f]" type="button">
                <Save size={11} />
                Save
              </button>
            </div>
          </div>
        </article>
      </section>

      <section>
        <SectionTitle title="Submitted Menus" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {vendor.submittedMenus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Verification Checklist" />
        <article className="rounded-[16px] border border-[#ddd2c9] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.04)] sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[15px] font-bold text-[#18120f]">Review Progress</p>
              <p className="mt-1 text-[13px] text-[#8d8078]">Complete all mandatory checks before approval</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[22px] font-extrabold text-[#dd6b34]">{vendor.checklistCompleted}/{vendor.checklist.length}</p>
              <p className="text-[13px] text-[#8d8078]">Tasks Completed</p>
            </div>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eee7e0]">
            <div className="h-full rounded-full bg-[#dd6b34]" style={{ width: `${vendor.progressPercent}%` }} />
          </div>

          <div className="mt-4 space-y-3">
            {vendor.checklist.map((item) => (
              <ChecklistItem key={item.label} item={item} />
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
