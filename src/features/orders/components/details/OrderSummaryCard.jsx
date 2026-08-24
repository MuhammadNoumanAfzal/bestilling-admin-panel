export default function OrderSummaryCard({ amount, payment }) {
  return (
    <article className="h-full rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <header className="mb-4 border-b border-[#eee4dd] pb-3">
        <h3 className="text-[18px] font-bold text-[#18120f]">Order Summary</h3>
      </header>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-[#8c8077]">Subtotal</span>
          <span className="font-bold text-[#18120f]">{amount.subtotal}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-[#8c8077]">Service Fee</span>
          <span className="font-bold text-[#18120f]">{amount.serviceFee}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-[#8c8077]">Delivery Fee</span>
          <span className="font-bold text-[#18120f]">{amount.deliveryFee}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-[#8c8077]">Tip</span>
          <span className="font-bold text-[#18120f]">{amount.tip}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-[#8c8077]">Tax</span>
          <span className="font-bold text-[#18120f]">{amount.tax}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-[#8c8077]">Discount</span>
          <span className="font-bold text-[#d83f3f]">-{amount.discount}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-[#8c8077]">Refunded</span>
          <span className="font-bold text-[#8a5b16]">{amount.refundAmount}</span>
        </div>

        <div className="my-2.5 flex items-center justify-between border-t-2 border-double border-[#d8ccc2] py-2.5 text-[16px]">
          <span className="font-extrabold text-[#18120f]">Total Amount</span>
          <span className="text-[18px] font-extrabold text-[#cf6e38]">{amount.total}</span>
        </div>

        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-[#8c8077]">Captured At</span>
          <span className="font-bold text-[#18120f]">{payment.capturedAt}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-[#8c8077]">Refunded At</span>
          <span className="font-bold text-[#18120f]">{payment.refundedAt}</span>
        </div>
      </div>
    </article>
  );
}
