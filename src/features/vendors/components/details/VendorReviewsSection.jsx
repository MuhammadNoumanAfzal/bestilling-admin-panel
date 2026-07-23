import { Star } from "lucide-react";

function StarRow({ item }) {
  return (
    <div className="flex items-center gap-3 text-[11px]">
      <span className="flex w-5 items-center gap-1 font-semibold text-[#5a4d46]">
        {item.stars}
        <Star size={9} className="fill-[#ffb020] text-[#ffb020]" />
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e7e3df]">
        <div className="h-full rounded-full bg-[#d46a37]" style={{ width: `${item.percent}%` }} />
      </div>
      <span className="w-14 text-right font-semibold text-[#8c8077]">
        {item.count}({item.percent}%)
      </span>
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <article
      className={[
        "rounded-[14px] border p-4 shadow-[0_4px_16px_rgba(53,34,20,0.03)]",
        review.highlighted ? "border-[#f3b7b7] bg-[#fff8f8]" : "border-[#e7ddd6] bg-white",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img alt={review.name} className="h-10 w-10 rounded-full object-cover" src={review.avatarUrl} />
          <div>
            <p className="text-[13px] font-bold text-[#18120f]">{review.name}</p>
            <p className="text-[11px] text-[#8c8077]">{review.timeAgo}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold text-[#8c8077]">ORDER REF</p>
          <p className="text-[11px] font-bold text-[#1f1711]">{review.reviewId}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-0.5 text-[#ffb020]">
        {Array.from({ length: review.rating }).map((_, index) => (
          <Star key={index} size={12} className="fill-[#ffb020] text-[#ffb020]" />
        ))}
      </div>
      <p className="mt-3 text-[12px] leading-6 text-[#5a4d46]">{review.content}</p>
    </article>
  );
}

export default function VendorReviewsSection({ summary }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <span className="h-5 w-[3px] rounded-full bg-[#d96834]" />
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-[8px] bg-[#fff2ea] text-[#d96834] shadow-sm">
          <Star size={12} className="fill-[#d96834] text-[#d96834]" />
        </span>
        <h2 className="text-[18px] font-extrabold tracking-tight text-[#18120f]">Reviews</h2>
      </div>

      <div className="rounded-[16px] border border-[#d6cbc2] bg-white p-5 shadow-[0_8px_20px_rgba(53,34,20,0.04)]">
        <div className="grid gap-5 lg:grid-cols-[190px_minmax(0,1fr)_220px] lg:items-center">
          <div className="flex flex-col items-center justify-center border-b border-[#e9dfd8] pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
            <p className="text-[38px] font-extrabold leading-none tracking-[-0.05em] text-[#18120f]">
              {summary.average}
            </p>
            <div className="mt-3 flex items-center gap-1 text-[#ffb020]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={18} className="fill-[#ffc107] text-[#ffc107]" />
              ))}
            </div>
            <p className="mt-3 text-[14px] font-medium text-[#2f241d]">Based on {summary.totalReviews}</p>
          </div>

          <div className="space-y-3 lg:border-r lg:border-[#e9dfd8] lg:pr-5">
            {summary.starBreakdown.map((item) => (
              <StarRow key={item.stars} item={item} />
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-2">
            {summary.statCards.map((card) => (
              <div key={card.label} className={card.label === "Response Rate" ? "lg:col-span-2" : ""}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[#1f1711]">{card.label}</p>
                <p className="mt-1 text-[18px] font-extrabold leading-none text-[#18120f]">{card.value}</p>
                <p className="mt-1 text-[10px] text-[#8c8077]">{card.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[16px] border border-[#d6cbc2] bg-white p-4 shadow-[0_8px_20px_rgba(53,34,20,0.04)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex flex-wrap items-center gap-0 rounded-[10px] border border-[#d8cdc4] bg-white p-1">
            {summary.filterTabs.map((tab) => (
              <span
                key={tab}
                className={[
                  "inline-flex items-center gap-1 rounded-[8px] px-3 py-1.5 text-[11px] font-bold",
                  tab === summary.activeFilter
                    ? "bg-[#d96834] text-white"
                    : "text-[#1f1711]",
                ].join(" ")}
              >
                {tab !== "All" ? <Star size={10} /> : null}
                {tab}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="inline-flex rounded-[8px] border border-[#ddd4cb] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#4d423b] shadow-[0_2px_6px_rgba(53,34,20,0.03)]">
              {summary.periodFilter}
            </span>
            <button className="rounded-[8px] border border-[#ddd4cb] bg-[#faf7f4] px-3 py-1.5 text-[11px] font-semibold text-[#4d423b] shadow-[0_2px_6px_rgba(53,34,20,0.03)]" type="button">
              Clear Filters
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {summary.reviewEntries.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        <button className="mt-4 w-full rounded-[10px] border border-[#ddd4cb] bg-white px-4 py-2 text-[12px] font-bold text-[#1f1711] transition hover:bg-[#faf7f4]" type="button">
          View All
        </button>
      </div>
    </section>
  );
}
