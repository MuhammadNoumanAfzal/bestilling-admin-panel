import { useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import PaymentActivityCard from "../components/details/PaymentActivityCard.jsx";
import PaymentDetailsInfoCard from "../components/details/PaymentDetailsInfoCard.jsx";
import PaymentDetailsOverviewCard from "../components/details/PaymentDetailsOverviewCard.jsx";
import PaymentLifecycleCard from "../components/details/PaymentLifecycleCard.jsx";
import PaymentStatusCards from "../components/details/PaymentStatusCards.jsx";
import { getPayoutById } from "../data/payoutsData.js";

export default function PaymentDetailsPage() {
  const { payoutId } = useParams();
  const payout = getPayoutById(decodeURIComponent(payoutId || ""));
  const [orderPaymentStatus, setOrderPaymentStatus] = useState(payout?.orderPayment ?? "Paid");
  const [payoutStatus, setPayoutStatus] = useState(payout?.payoutStatus ?? "Pending");
  const [activityLog, setActivityLog] = useState(payout?.activity ?? []);

  if (!payout) {
    return <Navigate replace to="/payouts" />;
  }

  const paymentDetail = useMemo(
    () => ({
      ...payout,
      orderPayment: orderPaymentStatus,
      payoutStatus,
    }),
    [orderPaymentStatus, payout, payoutStatus],
  );

  const timelineItems = useMemo(
    () =>
      activityLog.map((item, index) => {
        const [title, ...rest] = item.split(".");
        const helperText = rest.join(".").trim();

        return {
          id: `${index}-${title}`,
          title: title.trim(),
          helperText: helperText || (index === 0 ? "Recorded in the payment system." : "Waiting for the next update."),
          timestamp: index === 0 ? "Mar 10, 2026 - 10:00 AM" : "Pending update",
          isComplete: item.toLowerCase().includes("completed") || item.toLowerCase().includes("confirmed"),
        };
      }),
    [activityLog],
  );

  function handleMarkReceived() {
    setOrderPaymentStatus("Paid");
    setActivityLog((current) => [
      "Customer payment confirmed. Awaiting vendor payout release.",
      ...current,
    ]);
  }

  function handleMarkPaid() {
    setPayoutStatus("Paid");
    setActivityLog((current) => [
      "Vendor payout completed. Funds released to the vendor account.",
      ...current,
    ]);
  }

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">Payment Details</h1>
        <p className="text-[18px] leading-7">
          Track customer payment and vendor payout for this order.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <PaymentDetailsOverviewCard label="Total Order Amount" value={paymentDetail.orderAmount} />
        <PaymentDetailsOverviewCard
          label="Platform Commission"
          value={paymentDetail.platformCommission.replace("-", "")}
        />
        <PaymentDetailsOverviewCard label="Vendor Receives" value={paymentDetail.vendorAmount} />
        <PaymentDetailsOverviewCard label="Payment Status" value={paymentDetail.orderPayment} />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
        <div className="space-y-4">
          <PaymentDetailsInfoCard payout={paymentDetail} />
          <PaymentLifecycleCard payout={paymentDetail} />
          <PaymentStatusCards
            onMarkPaid={handleMarkPaid}
            onMarkReceived={handleMarkReceived}
            payout={paymentDetail}
          />
        </div>

        <PaymentActivityCard activity={timelineItems} />
      </div>
    </div>
  );
}
