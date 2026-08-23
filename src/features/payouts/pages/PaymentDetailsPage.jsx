import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  approveInvoicePaymentRequest,
  getAdminPaymentDetailRequest,
  markInvoicePaidRequest,
  markCustomerPaymentReceivedRequest,
  markVendorPayoutPaidRequest,
  rejectInvoicePaymentRequest,
  releaseVendorPayoutRequest,
} from "../api/paymentsApi.js";
import PaymentActivityCard from "../components/details/PaymentActivityCard.jsx";
import PaymentDetailsInfoCard from "../components/details/PaymentDetailsInfoCard.jsx";
import PaymentDetailsOverviewCard from "../components/details/PaymentDetailsOverviewCard.jsx";
import PaymentFinanceContractCard from "../components/details/PaymentFinanceContractCard.jsx";
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
  const [isApprovingInvoice, setIsApprovingInvoice] = useState(false);
  const [isRejectingInvoice, setIsRejectingInvoice] = useState(false);
  const [isMarkingInvoicePaid, setIsMarkingInvoicePaid] = useState(false);
  const [isReleasingVendorPayout, setIsReleasingVendorPayout] = useState(false);

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

    const prompt = await Swal.fire({
      title: "Confirm customer payment",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <div>
            <label for="payment-reference" style="display:block;margin-bottom:6px;font-size:13px;font-weight:600;">Reference</label>
            <input id="payment-reference" class="swal2-input" placeholder="Bank transfer reference or cash receipt number" style="margin:0;width:100%;" />
          </div>
          <div>
            <label for="payment-note" style="display:block;margin-bottom:6px;font-size:13px;font-weight:600;">Internal note</label>
            <textarea id="payment-note" class="swal2-textarea" placeholder="Optional admin note" style="margin:0;width:100%;min-height:110px;"></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Mark as received",
      confirmButtonColor: "#cf6e38",
      cancelButtonColor: "#c8b9aa",
      preConfirm: () => ({
        reference: document.getElementById("payment-reference")?.value?.trim() || "",
        note: document.getElementById("payment-note")?.value?.trim() || "",
      }),
    });

    if (!prompt.isConfirmed) {
      return;
    }

    try {
      setIsUpdatingCustomerPayment(true);
      const result = await markCustomerPaymentReceivedRequest(paymentDetail.id, prompt.value || {});
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

    const prompt = await Swal.fire({
      title: "Confirm vendor payout",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <div>
            <label for="payout-reference" style="display:block;margin-bottom:6px;font-size:13px;font-weight:600;">Payout reference</label>
            <input id="payout-reference" class="swal2-input" placeholder="Outbound bank transfer reference" style="margin:0;width:100%;" />
          </div>
          <div>
            <label for="payout-note" style="display:block;margin-bottom:6px;font-size:13px;font-weight:600;">Internal note</label>
            <textarea id="payout-note" class="swal2-textarea" placeholder="Optional admin note" style="margin:0;width:100%;min-height:110px;"></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Mark payout paid",
      confirmButtonColor: "#cf6e38",
      cancelButtonColor: "#c8b9aa",
      preConfirm: () => ({
        reference: document.getElementById("payout-reference")?.value?.trim() || "",
        note: document.getElementById("payout-note")?.value?.trim() || "",
      }),
    });

    if (!prompt.isConfirmed) {
      return;
    }

    try {
      setIsUpdatingVendorPayout(true);
      const result = await markVendorPayoutPaidRequest(paymentDetail.id, prompt.value || {});
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

  async function handleApproveInvoice() {
    if (!paymentDetail?.id || paymentDetail.statuses.customerPaymentStatus !== "Reported") {
      return;
    }

    const prompt = await Swal.fire({
      title: "Approve invoice payment",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <div>
            <label for="approve-note" style="display:block;margin-bottom:6px;font-size:13px;font-weight:600;">Verification note</label>
            <textarea id="approve-note" class="swal2-textarea" placeholder="Payment verified in bank statement" style="margin:0;width:100%;min-height:110px;"></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Approve payment",
      confirmButtonColor: "#cf6e38",
      cancelButtonColor: "#c8b9aa",
      preConfirm: () => ({
        note: document.getElementById("approve-note")?.value?.trim() || "",
      }),
    });

    if (!prompt.isConfirmed) {
      return;
    }

    try {
      setIsApprovingInvoice(true);
      const result = await approveInvoicePaymentRequest(paymentDetail.id, prompt.value || {});
      await refreshPaymentDetail();
      await Swal.fire({
        icon: "success",
        title: "Invoice approved",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to approve invoice payment",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsApprovingInvoice(false);
    }
  }

  async function handleRejectInvoice() {
    if (!paymentDetail?.id || paymentDetail.statuses.customerPaymentStatus !== "Reported") {
      return;
    }

    const prompt = await Swal.fire({
      title: "Reject invoice payment report",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <div>
            <label for="reject-reason" style="display:block;margin-bottom:6px;font-size:13px;font-weight:600;">Reason</label>
            <textarea id="reject-reason" class="swal2-textarea" placeholder="Explain why the reported payment is rejected" style="margin:0;width:100%;min-height:110px;"></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Reject report",
      confirmButtonColor: "#cf6e38",
      cancelButtonColor: "#c8b9aa",
      preConfirm: () => ({
        reason: document.getElementById("reject-reason")?.value?.trim() || "",
      }),
    });

    if (!prompt.isConfirmed) {
      return;
    }

    try {
      setIsRejectingInvoice(true);
      const result = await rejectInvoicePaymentRequest(paymentDetail.id, prompt.value || {});
      await refreshPaymentDetail();
      await Swal.fire({
        icon: "success",
        title: "Invoice report rejected",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to reject invoice payment report",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsRejectingInvoice(false);
    }
  }

  async function handleMarkInvoicePaid() {
    if (!paymentDetail?.id || paymentDetail.statuses.customerPaymentStatus === "Paid") {
      return;
    }

    const prompt = await Swal.fire({
      title: "Mark invoice paid",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <div>
            <label for="invoice-paid-note" style="display:block;margin-bottom:6px;font-size:13px;font-weight:600;">Internal note</label>
            <textarea id="invoice-paid-note" class="swal2-textarea" placeholder="Optional admin note" style="margin:0;width:100%;min-height:110px;"></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Mark invoice paid",
      confirmButtonColor: "#cf6e38",
      cancelButtonColor: "#c8b9aa",
      preConfirm: () => ({
        note: document.getElementById("invoice-paid-note")?.value?.trim() || "",
      }),
    });

    if (!prompt.isConfirmed) {
      return;
    }

    try {
      setIsMarkingInvoicePaid(true);
      const result = await markInvoicePaidRequest(paymentDetail.id, prompt.value || {});
      await refreshPaymentDetail();
      await Swal.fire({
        icon: "success",
        title: "Invoice updated",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to mark invoice paid",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsMarkingInvoicePaid(false);
    }
  }

  async function handleReleasePayout() {
    if (
      !paymentDetail?.id ||
      paymentDetail.statuses.vendorPayoutStatus === "Released" ||
      paymentDetail.statuses.vendorPayoutStatus === "Paid"
    ) {
      return;
    }

    const prompt = await Swal.fire({
      title: "Release vendor payout",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <div>
            <label for="release-note" style="display:block;margin-bottom:6px;font-size:13px;font-weight:600;">Release note</label>
            <textarea id="release-note" class="swal2-textarea" placeholder="Approved for payout batch" style="margin:0;width:100%;min-height:110px;"></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Release payout",
      confirmButtonColor: "#cf6e38",
      cancelButtonColor: "#c8b9aa",
      preConfirm: () => ({
        note: document.getElementById("release-note")?.value?.trim() || "",
      }),
    });

    if (!prompt.isConfirmed) {
      return;
    }

    try {
      setIsReleasingVendorPayout(true);
      const result = await releaseVendorPayoutRequest(paymentDetail.id, prompt.value || {});
      await refreshPaymentDetail();
      await Swal.fire({
        icon: "success",
        title: "Vendor payout released",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to release vendor payout",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsReleasingVendorPayout(false);
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
          <PaymentFinanceContractCard payout={paymentDetail} />
          <PaymentStatusCards
            isApprovingInvoice={isApprovingInvoice}
            isMarkingInvoicePaid={isMarkingInvoicePaid}
            isRejectingInvoice={isRejectingInvoice}
            isReleasingVendorPayout={isReleasingVendorPayout}
            isUpdatingCustomerPayment={isUpdatingCustomerPayment}
            isUpdatingVendorPayout={isUpdatingVendorPayout}
            onApproveInvoice={handleApproveInvoice}
            onMarkInvoicePaid={handleMarkInvoicePaid}
            onMarkPaid={handleMarkPaid}
            onMarkReceived={handleMarkReceived}
            onRejectInvoice={handleRejectInvoice}
            onReleasePayout={handleReleasePayout}
            payout={paymentDetail}
          />
        </div>

        <PaymentActivityCard activity={paymentDetail.activityItems} />
      </div>
    </div>
  );
}
