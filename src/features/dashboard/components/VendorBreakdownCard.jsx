export default function VendorBreakdownCard({ breakdown }) {
  return (
    <article className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <h2 className="text-[18px] font-bold text-[#18120f] mb-4">Vendor Breakdown</h2>

      <div className="grid grid-cols-2 gap-3">
        {/* Active Vendors */}
        <div className="rounded-[10px] border border-[#eee4dd] bg-[#fcfbfa] p-3 text-center">
          <p className="text-[22px] font-extrabold text-[#18120f]">
            {breakdown.active}
          </p>
          <p className="mt-1 text-[12px] font-bold text-[#6f645d]">
            Active Vendors
          </p>
        </div>

        {/* Pending Approval */}
        <div className="rounded-[10px] border border-[#eee4dd] bg-[#fcfbfa] p-3 text-center">
          <p className="text-[22px] font-extrabold text-[#18120f]">
            {breakdown.pending}
          </p>
          <p className="mt-1 text-[12px] font-bold text-[#6f645d]">
            Pending Approval
          </p>
        </div>

        {/* Out of Stock */}
        <div className="rounded-[10px] border border-[#eee4dd] bg-[#fcfbfa] p-3 text-center">
          <p className="text-[22px] font-extrabold text-[#d83f3f]">
            {breakdown.outOfStock}
          </p>
          <p className="mt-1 text-[12px] font-bold text-[#d83f3f]">
            Out of Stock
          </p>
        </div>

        {/* Top Rated */}
        <div className="rounded-[10px] border border-[#eee4dd] bg-[#fcfbfa] p-3 text-center">
          <p className="text-[22px] font-extrabold text-[#18120f]">
            {breakdown.topRated}
          </p>
          <p className="mt-1 text-[12px] font-bold text-[#6f645d]">
            Top Rated
          </p>
        </div>
      </div>
    </article>
  );
}
