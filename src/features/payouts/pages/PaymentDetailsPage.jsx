import { Navigate, useParams } from "react-router-dom";
import PaymentActivityCard from "../components/details/PaymentActivityCard.jsx";
import PaymentDetailsInfoCard from "../components/details/PaymentDetailsInfoCard.jsx";
import PaymentDetailsOverviewCard from "../components/details/PaymentDetailsOverviewCard.jsx";
import PaymentLifecycleCard from "../components/details/PaymentLifecycleCard.jsx";
import PaymentStatusCards from "../components/details/PaymentStatusCards.jsx";
import { getPayoutById } from "../data/payoutsData.js";

export default function PaymentDetailsPage() {
  const { payoutId } = useParams();
  const payout = getPayoutById(payoutId);

  if (!payout) {
    return <Navigate replace to="/payouts" />;
  }

  return (
    <div className="space-y-5">
      <section className="space-y-1">
        <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">Payment Details</h1>
        <p className="text-[14px] leading-6 text-[#6f645d]">
          Track customer payment and vendor payout for this order.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <PaymentDetailsOverviewCard label="Total Order Amount" value={payout.orderAmount} />
        <PaymentDetailsOverviewCard label="Platform Commission" value={payout.platformCommission.replace("-", "")} />
        <PaymentDetailsOverviewCard label="Vendor Receives" value={payout.vendorAmount} />
        <PaymentDetailsOverviewCard label="Payment Status" value={payout.orderPayment} />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <PaymentDetailsInfoCard payout={payout} />
          <PaymentLifecycleCard payout={payout} />
          <PaymentStatusCards />
        </div>

        <PaymentActivityCard activity={payout.activity} />
      </div>
    </div>
  );
}
