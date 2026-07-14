import { useState, useMemo } from "react";
import { Star, ChevronDown, MessageSquare } from "lucide-react";

const TIMEFRAMES = ["Last 30 days", "Last 3 Months", "All time"];

export default function CustomerReviewsCard({ reviewsData = [] }) {
  const [ratingFilter, setRatingFilter] = useState("All");
  const [timeframe, setTimeframe] = useState("Last 30 days");
  const [dropOpen, setDropOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const filteredReviews = useMemo(() => {
    let result = [...reviewsData];

    // Rating Filter
    if (ratingFilter !== "All") {
      result = result.filter((r) => r.rating === parseInt(ratingFilter));
    }

    return result;
  }, [reviewsData, ratingFilter]);

  const displayedReviews = useMemo(() => {
    if (showAll) return filteredReviews;
    return filteredReviews.slice(0, 3);
  }, [filteredReviews, showAll]);

  const handleResetFilters = () => {
    setRatingFilter("All");
    setTimeframe("Last 30 days");
  };

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2.5">
          <span className="h-5 w-[3px] bg-[#d96834] rounded-full" />
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-[8px] bg-[#fff0e7] text-[#d96834] shadow-sm">
            <Star size={13} strokeWidth={2.5} fill="currentColor" />
          </span>
          <h3 className="text-[18px] font-extrabold tracking-tight text-[#18120f]">
            Customer Reviews
          </h3>
          <span className="rounded-full bg-[#fff0e7] px-2.5 py-0.5 text-[11px] font-bold text-[#cf6e38] shadow-sm border border-[#fff0e7]">
            ★ 4.8 Average Rating Given
          </span>
        </div>
      </div>

      {/* Main Review Card */}
      <div className="rounded-[16px] border border-[#ddd6cf] bg-white p-5.5 shadow-[0_8px_24px_rgba(53,34,20,0.04)] space-y-5 transition-all duration-300 hover:border-[#cf6e38]/10">
        {/* Filters Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#f3ece6]">
          {/* Stars Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {["All", "5", "4", "3", "2", "1"].map((v) => (
              <button
                key={v}
                onClick={() => setRatingFilter(v)}
                type="button"
                className={`rounded-[10px] px-3.5 py-2 text-[12px] font-bold cursor-pointer outline-none transition duration-150 active:scale-95 ${
                  ratingFilter === v
                    ? "bg-[#d96834] text-white shadow-[0_2px_8px_rgba(217,104,52,0.25)] border border-[#d96834]"
                    : "border border-[#e0d5cc] bg-white text-[#6f655e] hover:bg-[#faf5f1]"
                }`}
              >
                {v === "All" ? "All Stars" : `${v} ★`}
              </button>
            ))}
          </div>

          {/* Timeframe & Clear Filters */}
          <div className="flex items-center gap-2.5 justify-end">
            <div className="relative">
              <button
                onClick={() => setDropOpen(!dropOpen)}
                type="button"
                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[10px] border border-[#e0d5cc] bg-white px-4 text-[12px] font-bold text-[#4d423b] outline-none hover:bg-[#faf9f8] transition duration-150 shadow-sm active:scale-95"
              >
                {timeframe} <ChevronDown size={13} />
              </button>
              {dropOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setDropOpen(false)} />
                  <div className="absolute right-0 mt-1.5 z-30 w-36 rounded-[10px] border border-[#e0d5cc] bg-white py-1 shadow-[0_8px_20px_rgba(53,34,20,0.1)]">
                    {TIMEFRAMES.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setTimeframe(opt);
                          setDropOpen(false);
                        }}
                        type="button"
                        className={`block w-full px-3.5 py-2 text-left text-[12px] font-bold cursor-pointer transition ${
                          timeframe === opt
                            ? "bg-[#fff3ec] text-[#d96834]"
                            : "text-[#6f655e] hover:bg-[#faf5f1]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleResetFilters}
              type="button"
              className="inline-flex h-9 cursor-pointer items-center rounded-[10px] border border-[#ddd4cb] bg-[#f0ebe6] px-4 text-[12px] font-bold text-[#5a4d46] hover:bg-[#e6dad1] outline-none transition duration-150 shadow-sm active:scale-95"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Reviews List Grid (Side-by-side or beautiful cards) */}
        <div className="space-y-4">
          {displayedReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-[#faf9f8] rounded-[12px] text-[#a89f97] border border-dashed border-[#ddd6cf]">
              <MessageSquare size={24} className="mb-2 text-[#baaea0]" />
              <p className="text-[13px] font-bold">No reviews matching the filters</p>
            </div>
          ) : (
            displayedReviews.map((rev) => (
              <div key={rev.id} className="flex gap-4 p-4.5 rounded-[12px] bg-[#faf9f8] hover:bg-[#f5f2ef] transition duration-200 border border-[#f0eae4]/60 shadow-[0_2px_8px_rgba(55,31,13,0.01)]">
                {/* Avatar */}
                {rev.avatarUrl ? (
                  <img
                    src={rev.avatarUrl}
                    alt={rev.name}
                    className="h-12 w-12 shrink-0 rounded-full object-cover border border-[#eee4dd] shadow-sm"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[13px] font-bold text-[#2f241d] border border-[#eee4dd] shadow-sm">
                    {rev.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "AW"}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                    <div>
                      <span className="block text-[15px] font-bold text-[#18120f]">{rev.name}</span>
                      <div className="flex items-center gap-0.5 mt-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < rev.rating ? "#ffc107" : "none"}
                            stroke={i < rev.rating ? "none" : "#ccc"}
                          />
                        ))}
                      </div>
                    </div>

                    <span className="text-[11px] font-extrabold text-[#cf6e38] bg-[#fff0e7] rounded-[6px] px-2.5 py-0.5 border border-[#ffdcd0] uppercase tracking-wider">
                      ORDER REF {rev.orderRef || "#ORD-8829"}
                    </span>
                  </div>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-[#5a4d46] font-medium">
                    {rev.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View All Button */}
        {filteredReviews.length > 3 && (
          <div className="flex justify-center border-t border-[#f3ece6] pt-4 bg-white">
            <button
              onClick={() => setShowAll(!showAll)}
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-[10px] border border-[#e6dad1] bg-white px-6 text-[13px] font-bold text-[#cf6e38] transition duration-150 hover:bg-[#fff0e7] hover:border-[#f0d4ca] cursor-pointer outline-none shadow-sm active:scale-95"
            >
              {showAll ? "View Less Reviews" : "View All Reviews"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
