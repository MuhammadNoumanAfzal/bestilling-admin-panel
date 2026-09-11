import { ot, useOrderLanguage, orderDate, orderError, orderMessage } from "../orderTranslation.js";
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
import { MenuPreviewModal } from "../../vendors/components/details/VendorPublishedMenusSection.jsx";
import { getAdminVendorMenuDetailRequest } from "../../vendors/api/vendorsApi.js";
import AdminLoadingState from "../../shared/components/AdminLoadingState.jsx";
import {
  getCommissionPreviewForOrderRequest,
  getAdminOrderDetailRequest,
  updateOrderPaymentStatusRequest,
} from "../api/ordersApi.js";

function OverviewCard({ icon: Icon, label, value, valueClassName = "text-[#221914]", children }) {
  useOrderLanguage();
  return (
    <article className="flex flex-col gap-4 rounded-[14px] border border-[#ece4de] bg-white px-4 py-4 shadow-[0_8px_20px_rgba(55,31,13,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(55,31,13,0.09)]">
      <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#fff0e7] text-[#d96834]">
        <Icon size={17} strokeWidth={2.2} />
      </div>
      <div className="space-y-1.5">
        <p className="text-[13px] font-bold leading-5 text-[#4d423b]">{ot(label)}</p>
        <strong className={`block text-[26px] font-extrabold leading-[1.05] tracking-[-0.035em] ${valueClassName}`}>
          {value}
        </strong>
        {children}
      </div>
    </article>
  );
}

function CommissionPreviewCard({ preview }) {
  useOrderLanguage();
  if (!preview) {
    return null;
  }

  const rows = [
    { label: "Applied Rule", value: ot(preview.appliedRuleLabel) },
    { label: "Commission Rate", value: preview.ratePercent },
    { label: "Total Commission", value: preview.totalCommission },
    { label: "Vendor Payable", value: preview.vendorPayable },
  ];

  return (
    <article className="h-full rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <header className="mb-4 border-b border-[#eee4dd] pb-3">
        <h3 className="text-[18px] font-bold text-[#18120f]">{ot("Commission Preview")}</h3>
      </header>

      <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-4">
        {rows.map((item) => (
          <div key={item.label} className="space-y-1">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a8f86]">
              {ot(item.label)}
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
  useOrderLanguage();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [commissionPreview, setCommissionPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedMenuDetail, setSelectedMenuDetail] = useState(null);
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const [menuLoadError, setMenuLoadError] = useState("");

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
          confirmButtonText: ot("OK"),
            toast: true,
            position: "top-end",
            icon: "info",
            title: ot("Order updated to {{status}}", { status: ot(detail.status) }),
            text: ot("Latest sync: {{date}}", { date: orderDate(detail.updatedAtValue || detail.updatedAtLabel) }),
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
          confirmButtonText: ot("OK"),
        icon: "success",
        title: ot("Order updated"),
        text: orderMessage(message),
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
          confirmButtonText: ot("OK"),
        icon: "error",
        title: ot("Action failed"),
        text: orderError(error, "Please try again."),
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

  async function handleViewItemSource(item) {
    if (!item?.menuId) {
      return;
    }

    setSelectedMenu({
      id: item.menuId,
      title: item.name,
      primaryImageUrl: item.imageUrl,
      imageUrl: item.imageUrl,
    });
    setSelectedMenuDetail(null);
    setMenuLoadError("");
    setIsLoadingMenu(true);

    try {
      setSelectedMenuDetail(await getAdminVendorMenuDetailRequest(item.menuId));
    } catch (error) {
      setMenuLoadError(error instanceof Error ? error.message : "Unable to load the full menu details.");
    } finally {
      setIsLoadingMenu(false);
    }
  }

  function handleCloseMenuPreview() {
    setSelectedMenu(null);
    setSelectedMenuDetail(null);
    setMenuLoadError("");
    setIsLoadingMenu(false);
  }

  if (isLoading) {
    return <AdminLoadingState cards={3} columns={5} title={ot("Loading order details")} description={ot("Preparing the order, customer, and fulfillment details.")} />;
  }

  if (loadError || !order) {
    return (
      <div className="rounded-[16px] border border-[#efd7cc] bg-white px-5 py-10 text-center text-[15px] font-medium text-[#9f4d33]">
        {orderError(loadError, "Unable to load order details.")}
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
    "Refund pending": "text-[#b45309]",
    Cancelled: "text-[#6f645d]",
  };

  return (
    <div className="space-y-6 [&_button:enabled]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_a[href]]:cursor-pointer">
      <section className="space-y-3">
        <button
          className="inline-flex items-center gap-1 text-[13px] font-bold text-[#cf6e38] transition hover:underline"
          onClick={() => navigate("/orders")}
          type="button"
        >
          <ChevronLeft size={16} />{ot("Back to orders")}</button>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-1">
            <h1 className="text-[34px] font-bold tracking-[-0.04em] text-[#18120f] sm:text-[40px]">{ot("Order {{number}}", { number: order.orderNumber })}
            </h1>
            <p className="text-[16px] leading-7 text-[#6f645d]">{ot("Placed on {{date}}", { date: orderDate(order.placedAt) })}
            </p>
            <p className="text-[13px] text-[#8c8077]">{ot("Internal ID {{id}} · Last updated {{date}}", { id: order.id, date: orderDate(order.updatedAtValue || order.updatedAtLabel) })}
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
                <BadgeCheck size={15} />{ot("Mark Paid")}</button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-3.5 grid-cols-2 lg:grid-cols-4">
        <OverviewCard icon={DollarSign} label={ot("Order Amount")} value={order.amount.total} />
        <OverviewCard icon={Calendar} label={ot("Order Type")} value={ot(order.eventType)} />
        <OverviewCard
          icon={order.status === "Canceled" ? XCircle : order.status === "Delivered" ? CheckCircle : Clock}
          label={ot("Order Status")}
          value={ot(order.status)}
          valueClassName={statusColors[order.status] || "text-[#221914]"}
        />
        <OverviewCard
          icon={CreditCard}
          label={ot("Payment Status")}
          value={ot(order.paymentStatus)}
          valueClassName={paymentColors[order.paymentStatus] || "text-[#221914]"}
        >
          <p className="text-[12px] text-[#7a6d66]">{ot("Method:")}{" "}{ot(order.payment.method)}</p>
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

      <MenuPreviewModal
        errorMessage={menuLoadError}
        isLoading={isLoadingMenu}
        menu={selectedMenuDetail || selectedMenu}
        onClose={handleCloseMenuPreview}
      />

      <section className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <EventInfoCard order={order} />
        <OrderSummaryCard amount={order.amount} payment={order.payment} />
      </section>

      <section>
        <CommissionPreviewCard preview={commissionPreview} />
      </section>

    </div>
  );
}
