import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getAdminPaymentDetailRequest,
  markCustomerPaymentReceivedRequest,
  markVendorPayoutPaidRequest,
} from "../api/paymentsApi.js";
import PaymentActivityCard from "../components/details/PaymentActivityCard.jsx";
import PaymentDetailsInfoCard from "../components/details/PaymentDetailsInfoCard.jsx";
import PaymentDetailsOverviewCard from "../components/details/PaymentDetailsOverviewCard.jsx";
import PaymentLifecycleCard from "../components/details/PaymentLifecycleCard.jsx";
import PaymentStatusCards from "../components/details/PaymentStatusCards.jsx";

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-[16px] border border-[#e8ddd5] bg-white" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
        <div className="space-y-4">
          <div className="h-56 animate-pulse rounded-[18px] border border-[#ddd4cd] bg-white" />
          <div className="h-52 animate-pulse rounded-[18px] border border-[#ddd4cd] bg-white" />
          <div className="h-72 animate-pulse rounded-[18px] border border-[#ddd4cd] bg-white" />
        </div>
        <div className="h-80 animate-pulse rounded-[18px] border border-[#ddd4cd] bg-white" />
      </div>
    </div>
  );
}

export default function PaymentDetailsPage() {
  const { payoutId } = useParams();
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isUpdatingCustomerPayment, setIsUpdatingCustomerPayment] = useState(false);
  const [isUpdatingVendorPayout, setIsUpdatingVendorPayout] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPaymentDetail() {
      setIsLoading(true);
      setLoadError("");

      try {
        const detail = await getAdminPaymentDetailRequest(decodeURIComponent(payoutId || ""));

        if (isMounted) {
          setPaymentDetail(detail);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : "Unable to load this payment.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPaymentDetail();

    return () => {
      isMounted = false;
    };
  }, [payoutId]);

  async function refreshPaymentDetail() {
    const detail = await getAdminPaymentDetailRequest(decodeURIComponent(payoutId || ""));
    setPaymentDetail(detail);
    return detail;
  }

  async function handleMarkReceived() {
    if (!paymentDetail?.id || paymentDetail.statuses.customerPaymentStatus === "Paid") {
      return;
    }

    try {
      setIsUpdatingCustomerPayment(true);
      const result = await markCustomerPaymentReceivedRequest(paymentDetail.id);
      await refreshPaymentDetail();
      await Swal.fire({
        icon: "success",
        title: "Customer payment updated",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to mark payment received",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsUpdatingCustomerPayment(false);
    }
  }

  async function handleMarkPaid() {
    if (!paymentDetail?.id || paymentDetail.statuses.vendorPayoutStatus === "Paid") {
      return;
    }

    try {
      setIsUpdatingVendorPayout(true);
      const result = await markVendorPayoutPaidRequest(paymentDetail.id);
      await refreshPaymentDetail();
      await Swal.fire({
        icon: "success",
        title: "Vendor payout updated",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to mark vendor payout paid",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsUpdatingVendorPayout(false);
    }
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (!paymentDetail) {
    if (loadError) {
      return (
        <div className="rounded-[16px] border border-[#efd7cc] bg-white px-5 py-10 text-center text-[15px] font-medium text-[#9f4d33]">
          {loadError}
        </div>
      );
    }

    return <Navigate replace to="/payouts" />;
  }

  return (
    <div className="space-y-6">
      {loadError ? (
        <div className="rounded-[16px] border border-[#efd7cc] bg-white px-5 py-8 text-center text-[15px] font-medium text-[#9f4d33]">
          {loadError}
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <PaymentDetailsOverviewCard label="Total Order Amount" value={paymentDetail.financials.orderAmount} />
        <PaymentDetailsOverviewCard label="Platform Commission" value={paymentDetail.financials.platformCommission} />
        <PaymentDetailsOverviewCard label="Vendor Receives" value={paymentDetail.financials.vendorAmount} />
        <PaymentDetailsOverviewCard label="Customer Payment" value={paymentDetail.statuses.customerPaymentStatus} />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
        <div className="space-y-4">
          <PaymentDetailsInfoCard payout={paymentDetail} />
          <PaymentLifecycleCard payout={paymentDetail} />
          <PaymentStatusCards
            isUpdatingCustomerPayment={isUpdatingCustomerPayment}
            isUpdatingVendorPayout={isUpdatingVendorPayout}
            onMarkPaid={handleMarkPaid}
            onMarkReceived={handleMarkReceived}
            payout={paymentDetail}
          />
        </div>

        <PaymentActivityCard activity={paymentDetail.activityItems} />
      </div>
    </div>
  );
}
