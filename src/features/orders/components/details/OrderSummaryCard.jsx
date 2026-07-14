export default function OrderSummaryCard() {
  return (
    <article className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)] h-full">
      <header className="mb-4 border-b border-[#eee4dd] pb-3">
        <h3 className="text-[18px] font-bold text-[#18120f]">Order Summary</h3>
      </header>

      {/* Invoice Breakdown */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center text-[13px]">
          <span className="font-semibold text-[#8c8077]">Items Total</span>
          <span className="font-bold text-[#18120f]">NOK 32,860</span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="font-semibold text-[#8c8077]">Add-ons</span>
          <span className="font-bold text-[#18120f]">NOK 2,080</span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="font-semibold text-[#8c8077]">Delivery Fee</span>
          <span className="font-bold text-[#18120f]">NOK 850</span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="font-semibold text-[#8c8077]">Discount</span>
          <span className="font-bold text-[#d83f3f]">-NOK 1,840</span>
        </div>

        <div className="border-t border-[#f1e9e2] my-2 pt-2 flex justify-between items-center text-[13px]">
          <span className="font-bold text-[#6f655e]">Subtotal</span>
          <span className="font-bold text-[#18120f]">NOK 38,560</span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="font-semibold text-[#8c8077]">Platform Tax (8%)</span>
          <span className="font-bold text-[#18120f]">NOK 3,084</span>
        </div>

        {/* Total Highlight */}
        <div className="border-t-2 border-double border-[#d8ccc2] my-2.5 py-2.5 flex justify-between items-center text-[16px]">
          <span className="font-extrabold text-[#18120f]">Total Amount</span>
          <span className="font-extrabold text-[#cf6e38] text-[18px]">NOK 41,644</span>
        </div>

        <div className="flex justify-between items-center text-[13px]">
          <span className="font-semibold text-[#8c8077]">Paid Amount</span>
          <span className="font-bold text-[#2b9e62]">NOK 24,560</span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="font-semibold text-[#8c8077]">Due/Balanced</span>
          <span className="font-bold text-[#18120f]">NOK 0</span>
        </div>
      </div>
    </article>
  );
}
