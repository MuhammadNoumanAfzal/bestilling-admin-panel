function StarRow({ item }) {
  return (
    <div className="flex items-center gap-3 text-[11px]">
      <span className="w-4 font-semibold text-[#5a4d46]">{item.stars}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#efe8e2]">
        <div className="h-full rounded-full bg-[#d46a37]" style={{ width: `${item.percent}%` }} />
      </div>
      <span className="w-10 text-right font-semibold text-[#8c8077]">{item.count}</span>
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
      <div className="mt-2 text-[#ffb020]">
        {"★★★★★".slice(0, review.rating)}
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
        <h2 className="text-[18px] font-extrabold tracking-tight text-[#18120f]">Reviews</h2>
      </div>

      <div className="rounded-[16px] border border-[#ddd6cf] bg-white p-5 shadow-[0_8px_20px_rgba(53,34,20,0.04)]">
        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_260px]">
          <div className="flex flex-col items-center justify-center border-b border-[#eee4dd] pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4">
            <p className="text-[44px] font-extrabold leading-none tracking-[-0.05em] text-[#18120f]">
              {summary.average}
            </p>
            <p className="mt-2 text-[#ffb020]">★★★★★</p>
            <p className="mt-2 text-[12px] font-medium text-[#6f645d]">Based on {summary.totalReviews}</p>
          </div>

          <div className="space-y-3">
            {summary.starBreakdown.map((item) => (
              <StarRow key={item.stars} item={item} />
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {summary.statCards.map((card) => (
              <div key={card.label} className="rounded-[12px] border border-[#e7ddd6] bg-[#fcfbfa] px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[#8c8077]">{card.label}</p>
                <p className="mt-1 text-[24px] font-extrabold leading-none text-[#18120f]">{card.value}</p>
                <p className="mt-1 text-[11px] text-[#8c8077]">{card.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[16px] border border-[#ddd6cf] bg-white p-4 shadow-[0_8px_20px_rgba(53,34,20,0.04)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {summary.filterTabs.map((tab) => (
              <span
                key={tab}
                className={[
                  "inline-flex rounded-[8px] px-3 py-1.5 text-[11px] font-bold",
                  tab === summary.activeFilter
                    ? "bg-[#d96834] text-white"
                    : "border border-[#e6dad1] bg-white text-[#6f645d]",
                ].join(" ")}
              >
                {tab}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="inline-flex rounded-[8px] border border-[#ddd4cb] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#4d423b]">
              {summary.periodFilter}
            </span>
            <button className="rounded-[8px] border border-[#ddd4cb] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#4d423b]" type="button">
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
