import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  ChevronLeft,
  DollarSign,
  Calendar,
  CheckCircle,
  CreditCard,
  XCircle,
  Clock,
  BadgeCheck,
} from "lucide-react";

import CustomerInfoCard from "../components/details/CustomerInfoCard.jsx";
import VendorInfoCard from "../components/details/VendorInfoCard.jsx";
import OrderTimelineCard from "../components/details/OrderTimelineCard.jsx";
import OrderItemsTable from "../components/details/OrderItemsTable.jsx";
import EventInfoCard from "../components/details/EventInfoCard.jsx";
import OrderSummaryCard from "../components/details/OrderSummaryCard.jsx";
import {
  getCommissionPreviewForOrderRequest,
  getAdminOrderDetailRequest,
  updateOrderPaymentStatusRequest,
} from "../api/ordersApi.js";

function OverviewCard({ icon: Icon, label, value, valueClassName = "text-[#221914]", children }) {
  return (
    <article className="flex flex-col gap-4 rounded-[14px] border border-[#ece4de] bg-white px-4 py-4 shadow-[0_8px_20px_rgba(55,31,13,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(55,31,13,0.09)]">
      <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#fff0e7] text-[#d96834]">
        <Icon size={17} strokeWidth={2.2} />
      </div>
      <div className="space-y-1.5">
        <p className="text-[13px] font-bold leading-5 text-[#4d423b]">{label}</p>
        <strong className={`block text-[26px] font-extrabold leading-[1.05] tracking-[-0.035em] ${valueClassName}`}>
          {value}
        </strong>
        {children}
      </div>
    </article>
  );
}

function CommissionPreviewCard({ preview }) {
  if (!preview) {
    return null;
  }

  const rows = [
    { label: "Applied Rule", value: preview.appliedRuleLabel },
    { label: "Rule Type", value: preview.appliedRuleType },
    { label: "Commission Model", value: preview.commissionModel },
    { label: "Commission Rate", value: preview.ratePercent },
    { label: "Gross Order Amount", value: preview.grossOrderAmount },
    { label: "Gross Commission", value: preview.grossCommission },
    { label: "Fixed Fee", value: preview.fixedFee },
    { label: "VAT on Commission", value: preview.vatOnCommission },
    { label: "Total Commission", value: preview.totalCommission },
    { label: "Vendor Payable", value: preview.vendorPayable },
  ];

  return (
    <article className="h-full rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <header className="mb-4 border-b border-[#eee4dd] pb-3">
        <h3 className="text-[18px] font-bold text-[#18120f]">Commission Preview</h3>
        <p className="mt-1 text-[13px] leading-6 text-[#7a6d66]">
          Live commission resolution for this order before payout settlement.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2">
        {rows.map((item) => (
          <div key={item.label} className="space-y-1">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a8f86]">
              {item.label}
            </span>
            <span className="block text-[13px] font-semibold leading-5 text-[#18120f]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [commissionPreview, setCommissionPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isWorking, setIsWorking] = useState(false);

  async function loadOrder(options = {}) {
    const { silent = false } = options;

    if (!orderId) {
      setLoadError("Order ID is missing.");
      setIsLoading(false);
      return;
    }

    if (!silent) {
      setIsLoading(true);
    }

    if (!silent) {
      setLoadError("");
    }

    try {
      const decodedId = decodeURIComponent(orderId);
      const [detail, preview] = await Promise.all([
        getAdminOrderDetailRequest(decodedId),
        getCommissionPreviewForOrderRequest(decodedId).catch(() => null),
      ]);

      setOrder((current) => {
        if (
          silent &&
          current &&
          (current.rawStatus !== detail.rawStatus ||
            current.paymentStatus !== detail.paymentStatus ||
            current.updatedAtLabel !== detail.updatedAtLabel)
        ) {
          void Swal.fire({
            toast: true,
            position: "top-end",
            icon: "info",
            title: `Order updated to ${detail.status}`,
            text: `Latest sync: ${detail.updatedAtLabel}`,
            showConfirmButton: false,
            timer: 2800,
            timerProgressBar: true,
          });
        }

        return detail;
      });
      setCommissionPreview(preview);
    } catch (error) {
      if (!silent) {
        setLoadError(error instanceof Error ? error.message : "Unable to load order details.");
      }
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  useEffect(() => {
    if (!orderId) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      if (!document.hidden && !isWorking) {
        void loadOrder({ silent: true });
      }
    }, 15000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isWorking, orderId]);

  async function runAction(task) {
    try {
      setIsWorking(true);
      const message = await task();
      await loadOrder({ silent: true });
      await Swal.fire({
        icon: "success",
        title: "Order updated",
        text: message || "The order was updated successfully.",
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Action failed",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsWorking(false);
    }
  }

  async function handleMarkPaid() {
    await runAction(async () => {
      const result = await updateOrderPaymentStatusRequest({
        orderId: order.id,
        paymentStatus: "PAID",
      });
      return result.message;
    });
  }

  function handleViewCustomerProfile() {
    if (!order?.customer?.id) {
      return;
    }

    navigate(`/customers/${encodeURIComponent(order.customer.id)}`);
  }

  function handleViewVendorProfile() {
    if (!order?.vendor?.id) {
      return;
    }

    navigate(`/vendors/${encodeURIComponent(order.vendor.id)}`);
  }

  function handleViewItemSource() {
    if (!order?.vendor?.id) {
      return;
    }

    navigate(`/vendors/${encodeURIComponent(order.vendor.id)}#menus`);
  }

  if (isLoading) {
    return (
      <div className="rounded-[16px] border border-[#e7ddd6] bg-white px-5 py-14 text-center text-[15px] font-medium text-[#6f645d]">
        Loading order details...
      </div>
    );
  }

  if (loadError || !order) {
    return (
      <div className="rounded-[16px] border border-[#efd7cc] bg-white px-5 py-10 text-center text-[15px] font-medium text-[#9f4d33]">
        {loadError || "Unable to load order details."}
      </div>
    );
  }

  const statusColors = {
    Delivered: "text-[#2b9e62]",
    Pending: "text-[#b45309]",
    Accepted: "text-[#b45309]",
    Preparing: "text-[#c2410c]",
    "Out for delivery": "text-[#296db8]",
    Canceled: "text-[#d83f3f]",
    Refunded: "text-[#7a51b3]",
  };

  const paymentColors = {
    Paid: "text-[#2b9e62]",
    Pending: "text-[#b45309]",
    Reported: "text-[#296db8]",
    Failed: "text-[#d83f3f]",
    Refunded: "text-[#7a51b3]",
    "Partially refunded": "text-[#b5751a]",
  };

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <button
          className="inline-flex items-center gap-1 text-[13px] font-bold text-[#cf6e38] transition hover:underline"
          onClick={() => navigate("/orders")}
          type="button"
        >
          <ChevronLeft size={16} />
          Back to orders
        </button>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-1">
            <h1 className="text-[34px] font-bold tracking-[-0.04em] text-[#18120f] sm:text-[40px]">
              Order {order.orderNumber}
            </h1>
            <p className="text-[16px] leading-7 text-[#6f645d]">
              Placed on {order.placedAtLabel}
            </p>
            <p className="text-[13px] text-[#8c8077]">
              Internal ID {order.id} · Last updated {order.updatedAtLabel}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {order.actions.canMarkPaid ? (
              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[12px] bg-[#2b9e62] px-4 text-[13px] font-semibold text-white transition hover:bg-[#238251] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isWorking}
                onClick={handleMarkPaid}
                type="button"
              >
                <BadgeCheck size={15} />
                Mark Paid
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-3.5 grid-cols-2 lg:grid-cols-4">
        <OverviewCard icon={DollarSign} label="Order Amount" value={order.amount.total} />
        <OverviewCard icon={Calendar} label="Order Type" value={order.eventType} />
        <OverviewCard
          icon={order.status === "Canceled" ? XCircle : order.status === "Delivered" ? CheckCircle : Clock}
          label="Order Status"
          value={order.status}
          valueClassName={statusColors[order.status] || "text-[#221914]"}
        />
        <OverviewCard
          icon={CreditCard}
          label="Payment Status"
          value={order.paymentStatus}
          valueClassName={paymentColors[order.paymentStatus] || "text-[#221914]"}
        >
          <p className="text-[12px] text-[#7a6d66]">Method: {order.payment.method}</p>
        </OverviewCard>
      </section>

      <section className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <CustomerInfoCard customer={order.customer} onViewProfile={handleViewCustomerProfile} />
        <VendorInfoCard vendor={order.vendor} onViewProfile={handleViewVendorProfile} />
        <OrderTimelineCard timeline={order.timeline} />
      </section>

      <section>
        <OrderItemsTable items={order.items} onViewItemSource={handleViewItemSource} />
      </section>

      <section className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <EventInfoCard order={order} />
        <OrderSummaryCard amount={order.amount} payment={order.payment} />
      </section>

      <section>
        <CommissionPreviewCard preview={commissionPreview} />
      </section>

      <section>
        <article className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
          <header className="mb-4 border-b border-[#eee4dd] pb-3">
            <h3 className="text-[18px] font-bold text-[#18120f]">Payment & Delivery Meta</h3>
          </header>

          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a8f86]">
                Transaction ID
              </span>
              <span className="block text-[13px] font-semibold text-[#18120f]">
                {order.payment.transactionId}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a8f86]">
                Provider
              </span>
              <span className="block text-[13px] font-semibold text-[#18120f]">
                {order.payment.provider}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a8f86]">
                Provider Reference
              </span>
              <span className="block text-[13px] font-semibold text-[#18120f]">
                {order.payment.providerReference}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a8f86]">
                Delivery Type
              </span>
              <span className="block text-[13px] font-semibold text-[#18120f]">
                {order.delivery.type}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a8f86]">
                Delivery Status
              </span>
              <span className="block text-[13px] font-semibold text-[#18120f]">
                {order.delivery.status}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a8f86]">
                Scheduled Delivery
              </span>
              <span className="block text-[13px] font-semibold text-[#18120f]">
                {order.delivery.scheduledAt}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a8f86]">
                Delivered At
              </span>
              <span className="block text-[13px] font-semibold text-[#18120f]">
                {order.delivery.deliveredAt}
              </span>
            </div>
            <div className="sm:col-span-2">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a8f86]">
                Delivery Address
              </span>
              <span className="block text-[13px] font-semibold leading-6 text-[#18120f]">
                {order.delivery.address}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a8f86]">
                Rider
              </span>
              <span className="block text-[13px] font-semibold text-[#18120f]">
                {order.delivery.riderName}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a8f86]">
                Rider Phone
              </span>
              <span className="block text-[13px] font-semibold text-[#18120f]">
                {order.delivery.riderPhone}
              </span>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
