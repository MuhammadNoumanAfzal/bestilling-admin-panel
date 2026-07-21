import { useMemo, useState } from "react";
import { ChevronDown, MessageSquare, Star } from "lucide-react";

const TIMEFRAMES = ["Last 30 days", "Last 3 Months", "All time"];

export default function CustomerReviewsCard({ reviewsData = [] }) {
  const [ratingFilter, setRatingFilter] = useState("All");
  const [timeframe, setTimeframe] = useState("Last 30 days");
  const [dropOpen, setDropOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const filteredReviews = useMemo(() => {
    let result = [...reviewsData];

    if (ratingFilter !== "All") {
      result = result.filter((review) => review.rating === Number.parseInt(ratingFilter, 10));
    }

    return result;
  }, [ratingFilter, reviewsData]);

  const displayedReviews = useMemo(() => {
    if (showAll) {
      return filteredReviews;
    }

    return filteredReviews.slice(0, 3);
  }, [filteredReviews, showAll]);

  function handleResetFilters() {
    setRatingFilter("All");
    setTimeframe("Last 30 days");
    setDropOpen(false);
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="h-5 w-[3px] rounded-full bg-[#d96834]" />
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-[8px] bg-[#fff0e7] text-[#d96834] shadow-sm">
            <Star size={13} fill="currentColor" strokeWidth={2.5} />
          </span>
          <h3 className="text-[18px] font-extrabold tracking-tight text-[#18120f]">
            Customer Reviews
          </h3>
          <span className="rounded-full border border-[#fff0e7] bg-[#fff0e7] px-2.5 py-0.5 text-[11px] font-bold text-[#cf6e38] shadow-sm">
            4.8 Average Rating Given
          </span>
        </div>
      </div>

      <div className="space-y-5 rounded-[16px] border border-[#ddd6cf] bg-white p-4 shadow-[0_8px_24px_rgba(53,34,20,0.04)] transition-all duration-300 hover:border-[#cf6e38]/10 sm:p-5">
        <div className="flex flex-col justify-between gap-4 border-b border-[#f3ece6] pb-3 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-1.5">
            {["All", "5", "4", "3", "2", "1"].map((value) => (
              <button
                key={value}
                onClick={() => setRatingFilter(value)}
                type="button"
                className={`rounded-[10px] border px-3.5 py-2 text-[12px] font-bold transition duration-150 active:scale-95 ${
                  ratingFilter === value
                    ? "border-[#d96834] bg-[#d96834] text-white shadow-[0_2px_8px_rgba(217,104,52,0.25)]"
                    : "border-[#e0d5cc] bg-white text-[#6f655e] hover:bg-[#faf5f1]"
                }`}
              >
                {value === "All" ? "All Stars" : `${value} Star`}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-end">
            <div className="relative">
              <button
                onClick={() => setDropOpen((current) => !current)}
                type="button"
                className="inline-flex h-9 w-full cursor-pointer items-center justify-between gap-1.5 rounded-[10px] border border-[#e0d5cc] bg-white px-4 text-[12px] font-bold text-[#4d423b] shadow-sm transition duration-150 hover:bg-[#faf9f8] active:scale-95 sm:w-auto"
              >
                <span>{timeframe}</span>
                <ChevronDown size={13} />
              </button>

              {dropOpen ? (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setDropOpen(false)} />
                  <div className="absolute right-0 z-30 mt-1.5 w-full rounded-[10px] border border-[#e0d5cc] bg-white py-1 shadow-[0_8px_20px_rgba(53,34,20,0.1)] sm:w-36">
                    {TIMEFRAMES.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setTimeframe(option);
                          setDropOpen(false);
                        }}
                        type="button"
                        className={`block w-full px-3.5 py-2 text-left text-[12px] font-bold transition ${
                          timeframe === option
                            ? "bg-[#fff3ec] text-[#d96834]"
                            : "text-[#6f655e] hover:bg-[#faf5f1]"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            <button
              onClick={handleResetFilters}
              type="button"
              className="inline-flex h-9 cursor-pointer items-center justify-center rounded-[10px] border border-[#ddd4cb] bg-[#f0ebe6] px-4 text-[12px] font-bold text-[#5a4d46] shadow-sm transition duration-150 hover:bg-[#e6dad1] active:scale-95"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {displayedReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[#ddd6cf] bg-[#faf9f8] py-12 text-[#a89f97]">
              <MessageSquare size={24} className="mb-2 text-[#baaea0]" />
              <p className="text-[13px] font-bold">No reviews matching the filters</p>
            </div>
          ) : (
            displayedReviews.map((review) => (
              <article
                key={review.id}
                className="flex flex-col gap-4 rounded-[12px] border border-[#f0eae4]/60 bg-[#faf9f8] p-4 shadow-[0_2px_8px_rgba(55,31,13,0.01)] transition duration-200 hover:bg-[#f5f2ef] sm:flex-row"
              >
                {review.avatarUrl ? (
                  <img
                    src={review.avatarUrl}
                    alt={review.name}
                    className="h-12 w-12 shrink-0 rounded-full border border-[#eee4dd] object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#eee4dd] bg-white text-[13px] font-bold text-[#2f241d] shadow-sm">
                    {review.name?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "AW"}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                    <div>
                      <span className="block text-[15px] font-bold text-[#18120f]">{review.name}</span>
                      <div className="mt-1.5 flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            size={12}
                            fill={index < review.rating ? "#ffc107" : "none"}
                            stroke={index < review.rating ? "none" : "#ccc"}
                          />
                        ))}
                      </div>
                    </div>

                    <span className="rounded-[6px] border border-[#ffdcd0] bg-[#fff0e7] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[#cf6e38]">
                      Order Ref {review.orderRef || "#ORD-8829"}
                    </span>
                  </div>

                  <p className="mt-2.5 text-[13px] font-medium leading-relaxed text-[#5a4d46]">
                    {review.content}
                  </p>
                </div>
              </article>
            ))
          )}
        </div>

        {filteredReviews.length > 3 ? (
          <div className="flex justify-center border-t border-[#f3ece6] bg-white pt-4">
            <button
              onClick={() => setShowAll((current) => !current)}
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-[10px] border border-[#e6dad1] bg-white px-6 text-[13px] font-bold text-[#cf6e38] shadow-sm transition duration-150 hover:border-[#f0d4ca] hover:bg-[#fff0e7] active:scale-95"
            >
              {showAll ? "View Less Reviews" : "View All Reviews"}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
