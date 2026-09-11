import { payoutHtml, payoutDate, pt, usePayoutLanguage, payoutError, payoutDialog } from "../payoutTranslation.js";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeft, ArrowUpRight, RefreshCw } from "lucide-react";
import {
  approveInvoicePaymentRequest,
  approveVendorPayoutProfileRequest,
  applyCommissionDisplayFallback,
  getAdminPaymentDetailRequest,
  markInvoicePaidRequest,
  markCustomerPaymentReceivedRequest,
  markVendorPayoutPaidRequest,
  rejectInvoicePaymentRequest,
  releaseVendorPayoutRequest,
} from "../api/paymentsApi.js";
import { getAdminCommissionSettingsRequest } from "../api/commissionApi.js";
import PaymentActivityCard from "../components/details/PaymentActivityCard.jsx";
import PaymentDetailsInfoCard from "../components/details/PaymentDetailsInfoCard.jsx";
import PaymentDetailsOverviewCard from "../components/details/PaymentDetailsOverviewCard.jsx";
import PaymentFinanceContractCard from "../components/details/PaymentFinanceContractCard.jsx";
import PaymentLifecycleCard from "../components/details/PaymentLifecycleCard.jsx";
import PaymentStatusCards from "../components/details/PaymentStatusCards.jsx";
import VendorBankDetailsCard from "../components/details/VendorBankDetailsCard.jsx";
import { showPaymentConfirmation } from "../components/details/paymentConfirmation.js";

function HeaderBadge({ label, value }) {
  usePayoutLanguage();
  return (
    <div className="rounded-[18px] border border-[#efd9cb] bg-white/85 px-4 py-3 shadow-[0_10px_24px_rgba(52,30,16,0.05)]">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a88b7b]">{pt(label)}</p>
      <p className="mt-2 text-[15px] font-semibold text-[#1e1713]">{value}</p>
    </div>
  );
}

function LoadingState() {
  usePayoutLanguage();
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
  usePayoutLanguage();
  const { payoutId } = useParams();
  const navigate = useNavigate();
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isUpdatingCustomerPayment, setIsUpdatingCustomerPayment] = useState(false);
  const [isUpdatingVendorPayout, setIsUpdatingVendorPayout] = useState(false);
  const [isApprovingInvoice, setIsApprovingInvoice] = useState(false);
  const [isVerifyingBankProfile, setIsVerifyingBankProfile] = useState(false);
  const [isRejectingInvoice, setIsRejectingInvoice] = useState(false);
  const [isMarkingInvoicePaid, setIsMarkingInvoicePaid] = useState(false);
  const [isReleasingVendorPayout, setIsReleasingVendorPayout] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPaymentDetail() {
      setIsLoading(true);
      setLoadError("");

      try {
        const [detail, commissionSettings] = await Promise.all([
          getAdminPaymentDetailRequest(decodeURIComponent(payoutId || "")),
          getAdminCommissionSettingsRequest(),
        ]);

        if (isMounted) {
          setPaymentDetail(applyCommissionDisplayFallback(detail, commissionSettings));
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
    const [detail, commissionSettings] = await Promise.all([
      getAdminPaymentDetailRequest(decodeURIComponent(payoutId || "")),
      getAdminCommissionSettingsRequest(),
    ]);
    const resolvedDetail = applyCommissionDisplayFallback(detail, commissionSettings);
    setPaymentDetail(resolvedDetail);
    return resolvedDetail;
  }

  async function handleRefreshDetails() {
    try {
      setIsRefreshing(true);
      await refreshPaymentDetail();
      await Swal.fire(payoutDialog({
        icon: "success",
        title: "Details refreshed",
        text: "The latest payment detail has been loaded.",
        confirmButtonColor: "#cf6e38",
      }));
    } catch (error) {
      await Swal.fire(payoutDialog({
        icon: "error",
        title: "Refresh failed",
        text: payoutError(error, "Unable to refresh payment details."),
        confirmButtonColor: "#cf6e38",
      }));
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleMarkReceived() {
    if (
      !paymentDetail?.invoiceId ||
      paymentDetail.order?.status === "Canceled" ||
      paymentDetail.statuses.customerPaymentStatus === "Paid"
    ) {
      return;
    }

    const prompt = await showPaymentConfirmation();

    if (!prompt.isConfirmed) {
      return;
    }

    try {
      setIsUpdatingCustomerPayment(true);
      const result = await markCustomerPaymentReceivedRequest(paymentDetail.invoiceId, prompt.value || {});
      await refreshPaymentDetail();
      await Swal.fire(payoutDialog({
        icon: "success",
        title: "Customer payment updated",
        text: payoutError(result.message, "Changes saved successfully."),
        confirmButtonColor: "#cf6e38",
      }));
    } catch (error) {
      await Swal.fire(payoutDialog({
        icon: "error",
        title: "Unable to mark payment received",
        text: payoutError(error, "Please try again."),
        confirmButtonColor: "#cf6e38",
      }));
    } finally {
      setIsUpdatingCustomerPayment(false);
    }
  }

  async function handleMarkPaid() {
    if (
      !paymentDetail?.vendor?.payoutProfile?.bankDetailsVerified ||
      paymentDetail?.statuses.customerPaymentStatus !== "Paid" ||
      isUpdatingVendorPayout ||
      paymentDetail.order?.status === "Canceled" ||
      paymentDetail.statuses.vendorPayoutStatus === "Paid"
    ) {
      return;
    }

    const prompt = await showPaymentConfirmation({ vendor: true });

    if (!prompt.isConfirmed) {
      return;
    }

    try {
      setIsUpdatingVendorPayout(true);
      let latest = await refreshPaymentDetail();
      if (latest.statuses.vendorPayoutStatus === "Paid") return;
      if (latest.order?.status === "Canceled" || latest.statuses.customerPaymentStatus !== "Paid" || !latest.vendor?.payoutProfile?.bankDetailsVerified) {
        throw new Error("Customer payment must be received and bank details verified before recording a vendor payout.");
      }
      if (latest.statuses.vendorPayoutStatus !== "Released") {
        if (!latest.settlementId || !latest.vendor?.id) throw new Error("The settlement is not ready for payout yet.");
        await releaseVendorPayoutRequest({ vendorId: latest.vendor.id, settlementIds: [latest.settlementId] }, { note: prompt.value?.note || "Released while recording completed vendor transfer." });
        latest = await refreshPaymentDetail();
      }
      if (!latest.payoutId) throw new Error("The payout record is not available yet. Refresh and retry.");
      const result = await markVendorPayoutPaidRequest(latest.payoutId, prompt.value || {});
      if (result.status !== "Paid") {
        throw new Error(
          "The payout remains released. The payment API must persist the payout as PAID before it can be confirmed.",
        );
      }

      const refreshedDetail = await refreshPaymentDetail();
      if (refreshedDetail.statuses.vendorPayoutStatus !== "Paid") {
        throw new Error(
          "The payout was not saved as paid. The vendor will continue to see it as released until the payment API returns PAID.",
        );
      }

      await Swal.fire(payoutDialog({
        icon: "success",
        title: "Vendor payout updated",
        text: payoutError(result.message, "Changes saved successfully."),
        confirmButtonColor: "#cf6e38",
      }));
    } catch (error) {
      await refreshPaymentDetail().catch(() => {});
      await Swal.fire(payoutDialog({
        icon: "error",
        title: "Unable to mark vendor payout paid",
        text: payoutError(error, "Please try again."),
        confirmButtonColor: "#cf6e38",
      }));
    } finally {
      setIsUpdatingVendorPayout(false);
    }
  }

  async function handleVerifyBankProfile() {
    const payoutProfile = paymentDetail?.vendor?.payoutProfile;

    if (!paymentDetail?.vendor?.id || payoutProfile?.bankDetailsVerified) {
      return;
    }

    const prompt = await Swal.fire(payoutDialog({
      title: "Verify vendor bank details",
      text: "Confirm that the account holder, bank, and account number match the vendor records before enabling payout release.",
      input: "textarea",
      inputPlaceholder: "Optional verification note",
      showCancelButton: true,
      confirmButtonText: "Verify bank details",
      confirmButtonColor: "#cf6e38",
      cancelButtonColor: "#c8b9aa",
    }));

    if (!prompt.isConfirmed) {
      return;
    }

    try {
      setIsVerifyingBankProfile(true);
      const result = await approveVendorPayoutProfileRequest(paymentDetail.vendor.id, {
        verificationNote: prompt.value || "",
      });
      await refreshPaymentDetail();
      await Swal.fire(payoutDialog({
        icon: "success",
        title: "Bank details verified",
        text: payoutError(result.message, "Changes saved successfully."),
        confirmButtonColor: "#cf6e38",
      }));
    } catch (error) {
      await Swal.fire(payoutDialog({
        icon: "error",
        title: "Unable to verify bank details",
        text: payoutError(error, "Please try again."),
        confirmButtonColor: "#cf6e38",
      }));
    } finally {
      setIsVerifyingBankProfile(false);
    }
  }

  async function handleApproveInvoice() {
    if (
      !paymentDetail?.invoiceId ||
      paymentDetail.order?.status === "Canceled" ||
      paymentDetail.statuses.customerPaymentStatus !== "Reported"
    ) {
      return;
    }

    const prompt = await Swal.fire(payoutDialog({
      title: "Approve invoice payment",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <div>
            <label for="approve-note" style="display:block;margin-bottom:6px;font-size:13px;font-weight:600;">${payoutHtml("Verification note")}</label>
            <textarea id="approve-note" class="swal2-textarea" placeholder="${payoutHtml("Payment verified in bank statement")}" style="margin:0;width:100%;min-height:110px;"></textarea>
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
    }));

    if (!prompt.isConfirmed) {
      return;
    }

    try {
      setIsApprovingInvoice(true);
      const result = await approveInvoicePaymentRequest(paymentDetail.invoiceId, prompt.value || {});
      await refreshPaymentDetail();
      await Swal.fire(payoutDialog({
        icon: "success",
        title: "Invoice approved",
        text: payoutError(result.message, "Changes saved successfully."),
        confirmButtonColor: "#cf6e38",
      }));
    } catch (error) {
      await Swal.fire(payoutDialog({
        icon: "error",
        title: "Unable to approve invoice payment",
        text: payoutError(error, "Please try again."),
        confirmButtonColor: "#cf6e38",
      }));
    } finally {
      setIsApprovingInvoice(false);
    }
  }

  async function handleRejectInvoice() {
    if (
      !paymentDetail?.invoiceId ||
      paymentDetail.order?.status === "Canceled" ||
      paymentDetail.statuses.customerPaymentStatus !== "Reported"
    ) {
      return;
    }

    const prompt = await Swal.fire(payoutDialog({
      title: "Reject invoice payment report",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <div>
            <label for="reject-reason" style="display:block;margin-bottom:6px;font-size:13px;font-weight:600;">${payoutHtml("Reason")}</label>
            <textarea id="reject-reason" class="swal2-textarea" placeholder="${payoutHtml("Explain why the reported payment is rejected")}" style="margin:0;width:100%;min-height:110px;"></textarea>
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
    }));

    if (!prompt.isConfirmed) {
      return;
    }

    try {
      setIsRejectingInvoice(true);
      const result = await rejectInvoicePaymentRequest(paymentDetail.invoiceId, prompt.value || {});
      await refreshPaymentDetail();
      await Swal.fire(payoutDialog({
        icon: "success",
        title: "Invoice report rejected",
        text: payoutError(result.message, "Changes saved successfully."),
        confirmButtonColor: "#cf6e38",
      }));
    } catch (error) {
      await Swal.fire(payoutDialog({
        icon: "error",
        title: "Unable to reject invoice payment report",
        text: payoutError(error, "Please try again."),
        confirmButtonColor: "#cf6e38",
      }));
    } finally {
      setIsRejectingInvoice(false);
    }
  }

  async function handleMarkInvoicePaid() {
    if (
      !paymentDetail?.invoiceId ||
      paymentDetail.order?.status === "Canceled" ||
      paymentDetail.statuses.customerPaymentStatus === "Paid"
    ) {
      return;
    }

    const prompt = await Swal.fire(payoutDialog({
      title: "Mark invoice paid",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <div>
            <label for="invoice-paid-note" style="display:block;margin-bottom:6px;font-size:13px;font-weight:600;">${payoutHtml("Internal note")}</label>
            <textarea id="invoice-paid-note" class="swal2-textarea" placeholder="${payoutHtml("Optional admin note")}" style="margin:0;width:100%;min-height:110px;"></textarea>
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
    }));

    if (!prompt.isConfirmed) {
      return;
    }

    try {
      setIsMarkingInvoicePaid(true);
      const result = await markInvoicePaidRequest(paymentDetail.invoiceId, prompt.value || {});
      await refreshPaymentDetail();
      await Swal.fire(payoutDialog({
        icon: "success",
        title: "Invoice updated",
        text: payoutError(result.message, "Changes saved successfully."),
        confirmButtonColor: "#cf6e38",
      }));
    } catch (error) {
      await Swal.fire(payoutDialog({
        icon: "error",
        title: "Unable to mark invoice paid",
        text: payoutError(error, "Please try again."),
        confirmButtonColor: "#cf6e38",
      }));
    } finally {
      setIsMarkingInvoicePaid(false);
    }
  }

  async function handleReleasePayout() {
    if (paymentDetail?.order?.status === "Canceled") {
      return;
    }

    const canReleaseFromSettlement = Boolean(paymentDetail?.vendor?.id && paymentDetail?.settlementId);

    if (!canReleaseFromSettlement) {
      await Swal.fire(payoutDialog({
        icon: "info",
        title: "Payout record is not ready",
        text: "The customer payment is approved, but no payout or settlement record is available for release yet. Refresh after the payment settlement is created.",
        confirmButtonColor: "#cf6e38",
      }));
      return;
    }

    if (
      paymentDetail.statuses.vendorPayoutStatus === "Released" ||
      paymentDetail.statuses.vendorPayoutStatus === "Paid"
    ) {
      return;
    }

    const prompt = await Swal.fire(payoutDialog({
      title: "Release vendor payout",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <div>
            <label for="release-note" style="display:block;margin-bottom:6px;font-size:13px;font-weight:600;">${payoutHtml("Release note")}</label>
            <textarea id="release-note" class="swal2-textarea" placeholder="${payoutHtml("Approved for payout batch")}" style="margin:0;width:100%;min-height:110px;"></textarea>
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
    }));

    if (!prompt.isConfirmed) {
      return;
    }

    try {
      setIsReleasingVendorPayout(true);
      const result = await releaseVendorPayoutRequest(
        {
          vendorId: paymentDetail.vendor.id,
          settlementIds: [paymentDetail.settlementId],
        },
        prompt.value || {},
      );
      await refreshPaymentDetail();
      await Swal.fire(payoutDialog({
        icon: "success",
        title: "Vendor payout released",
        text: payoutError(result.message, "Changes saved successfully."),
        confirmButtonColor: "#cf6e38",
      }));
    } catch (error) {
      await Swal.fire(payoutDialog({
        icon: "error",
        title: "Unable to release vendor payout",
        text: payoutError(error, "Please try again."),
        confirmButtonColor: "#cf6e38",
      }));
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
          {payoutError(loadError)}
        </div>
      );
    }

    return <Navigate replace to="/payouts" />;
  }

  return (
    <div className="space-y-6 [&_button:enabled]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_a[href]]:cursor-pointer">
      {loadError ? (
        <div className="rounded-[16px] border border-[#efd7cc] bg-white px-5 py-8 text-center text-[15px] font-medium text-[#9f4d33]">
          {payoutError(loadError)}
        </div>
      ) : null}

      <section className="relative overflow-hidden rounded-[30px] border border-[#e6d7cb] bg-[linear-gradient(135deg,#fffdfb_0%,#fff6ef_52%,#fff1e5_100%)] px-5 py-5 shadow-[0_20px_44px_rgba(51,30,17,0.08)] sm:px-6 sm:py-6">
        <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-[#ffd8c2]/60 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-[#fff0d4]/60 blur-3xl" aria-hidden="true" />

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <button
              className="inline-flex items-center gap-2 rounded-full border border-[#edd8ca] bg-white/85 px-4 py-2 text-[13px] font-semibold text-[#c86332] shadow-[0_8px_20px_rgba(51,30,17,0.05)] transition hover:-translate-y-[1px] hover:border-[#d7b39c] hover:text-[#b9582a]"
              onClick={() => window.history.back()}
              type="button"
            >
              <ArrowLeft size={15} />
              <span>{pt("Back to payouts")}</span>
            </button>

            <div className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b07a5b]">{pt("Payment Operations")}</p>
              <h1 className="mt-2 text-[32px] font-bold tracking-[-0.05em] text-[#191310] sm:text-[40px]">
                {paymentDetail.invoiceNumber}
              </h1>
              <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#665a53]">{pt("Review customer payment proof, vendor payout readiness, settlement details, and finance activity from one place.")}</p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <HeaderBadge label={pt("Customer")} value={paymentDetail.customer.fullName} />
              <HeaderBadge label={pt("Vendor")} value={paymentDetail.vendor.name} />
              <HeaderBadge label={pt("Order Status")} value={pt(paymentDetail.order.status)} />
              <HeaderBadge label={pt("Last Updated")} value={payoutDate(paymentDetail.updatedAtLabel)} />
            </div>
          </div>

          <div className="grid gap-3 xl:w-[320px] xl:grid-cols-1">
            {paymentDetail.order?.id ? (
              <button
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[16px] border border-[#e2cbbb] bg-white/90 px-4 text-[14px] font-semibold text-[#703619] shadow-[0_10px_24px_rgba(51,30,17,0.08)] transition hover:-translate-y-[1px] hover:border-[#cf6e38] hover:bg-[#fff7f2]"
                onClick={() => navigate(`/orders/${encodeURIComponent(paymentDetail.order.id)}`)}
                type="button"
              >
                <span>{pt("View Order")}</span>
                <ArrowUpRight size={16} />
              </button>
            ) : null}
            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[16px] bg-[linear-gradient(135deg,#d97342_0%,#c65b2d_100%)] px-4 text-[14px] font-semibold text-white shadow-[0_16px_34px_rgba(198,91,45,0.24)] transition hover:-translate-y-[1px] hover:shadow-[0_20px_40px_rgba(198,91,45,0.3)]"
              disabled={isRefreshing}
              onClick={handleRefreshDetails}
              type="button"
            >
              <RefreshCw size={16} />
              <span>{isRefreshing ? pt("Refreshing...") : pt("Refresh details")}</span>
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PaymentDetailsOverviewCard label={pt("Total Order Amount")} value={paymentDetail.financials.orderAmount} />
        <PaymentDetailsOverviewCard label={pt("Platform Commission")} value={paymentDetail.financials.platformCommission} />
        <PaymentDetailsOverviewCard label={pt("Vendor Receives")} value={paymentDetail.financials.vendorAmount} />
        <PaymentDetailsOverviewCard label={pt("Customer Payment Status")} value={pt(paymentDetail.statuses.customerPaymentStatus)} />
      </section>

          <PaymentStatusCards
            isApprovingInvoice={isApprovingInvoice}
            isVerifyingBankProfile={isVerifyingBankProfile}
            isMarkingInvoicePaid={isMarkingInvoicePaid}
            isRejectingInvoice={isRejectingInvoice}
            isReleasingVendorPayout={isReleasingVendorPayout}
            isUpdatingCustomerPayment={isUpdatingCustomerPayment}
            isUpdatingVendorPayout={isUpdatingVendorPayout}
            onApproveInvoice={handleApproveInvoice}
            onVerifyBankProfile={handleVerifyBankProfile}
            onMarkInvoicePaid={handleMarkInvoicePaid}
            onMarkPaid={handleMarkPaid}
            onMarkReceived={handleMarkReceived}
            onRejectInvoice={handleRejectInvoice}
            onReleasePayout={handleReleasePayout}
            payout={paymentDetail}
          />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.08fr)_360px]">
        <div className="space-y-4">
          <PaymentDetailsInfoCard payout={paymentDetail} />
          <PaymentLifecycleCard payout={paymentDetail} />
          <VendorBankDetailsCard
            isApproving={isVerifyingBankProfile}
            onApprove={handleVerifyBankProfile}
            payout={paymentDetail}
          />
          <PaymentFinanceContractCard payout={paymentDetail} />

        </div>

        <div className="xl:sticky xl:top-6">
          <PaymentActivityCard activity={paymentDetail.activityItems} />
        </div>
      </div>
    </div>
  );
}
