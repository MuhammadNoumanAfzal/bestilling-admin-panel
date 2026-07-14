import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Printer,
  DollarSign,
  Calendar,
  CheckCircle,
  CreditCard,
  XCircle,
  Clock,
} from "lucide-react";

import { initialOrders } from "../data/ordersData.js";
import CustomerInfoCard from "../components/details/CustomerInfoCard.jsx";
import VendorInfoCard from "../components/details/VendorInfoCard.jsx";
import OrderTimelineCard from "../components/details/OrderTimelineCard.jsx";
import OrderItemsTable from "../components/details/OrderItemsTable.jsx";
import EventInfoCard from "../components/details/EventInfoCard.jsx";
import OrderSummaryCard from "../components/details/OrderSummaryCard.jsx";

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const decodedId = decodeURIComponent(orderId || "");
  const order =
    initialOrders.find((o) => o.id === decodedId || o.id === `#${decodedId}`) ||
    initialOrders[0];

  // Helper to format date display in header
  const getHeaderDate = (dateTimeStr) => {
    if (!dateTimeStr) return "20 April 2026 at 12:30";
    const parts = dateTimeStr.split(" ");
    if (parts.length < 4) return dateTimeStr;
    // e.g. "30 April 2026 12:30 PM" -> "30 April 2026 at 12:30"
    const date = parts.slice(0, 3).join(" ");
    const time = parts[3];
    return `Placed on ${date} at ${time}`;
  };

  const statusColors = {
    Delivered: "text-[#2b9e62]",
    Pending: "text-[#c8881b]",
    Canceled: "text-[#d83f3f]",
  };

  const paymentColors = {
    Paid: "text-[#2b9e62]",
    Pending: "text-[#c8881b]",
    Refund: "text-[#8d8178]",
  };

  return (
    <div className="space-y-6">
      {/* Back Link & Header Title */}
      <section className="space-y-2">
        <button
          onClick={() => navigate("/orders")}
          className="inline-flex cursor-pointer items-center gap-1 text-[13px] font-bold text-[#cf6e38] transition hover:underline"
          type="button"
        >
          <ChevronLeft size={16} />
          Order management
        </button>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">
              Orders {order.id}
            </h1>
            <p className="text-[18px] leading-7 text-[#6f645d]">
              {getHeaderDate(order.dateTime)}
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex cursor-pointer items-center gap-2 rounded-[8px] border border-[#e6dad1] bg-white px-4 py-2 text-[13px] font-bold text-[#4d423b] transition hover:bg-[#faf5f1] hover:text-[#cf6e38] outline-none"
            type="button"
          >
            <Printer size={15} />
            Print Invoice
          </button>
        </div>
      </section>

      {/* 4 Cards Overview Row */}
      <section className="grid gap-3.5 grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Amount */}
        <article className="rounded-[14px] border border-[#ece4de] bg-white px-4 py-4 shadow-[0_8px_20px_rgba(55,31,13,0.07)] flex flex-col gap-4 items-start transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(55,31,13,0.09)]">
          <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#fff0e7] text-[#d96834]">
            <DollarSign size={17} strokeWidth={2.2} />
          </div>
          <div className="space-y-4">
            <p className="text-[13px] font-bold leading-5 text-[#4d423b]">Orders Amount</p>
            <strong className="block text-[28px] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#221914]">
              {order.amount}
            </strong>
          </div>
        </article>

        {/* Card 2: Type */}
        <article className="rounded-[14px] border border-[#ece4de] bg-white px-4 py-4 shadow-[0_8px_20px_rgba(55,31,13,0.07)] flex flex-col gap-4 items-start transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(55,31,13,0.09)]">
          <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#fff0e7] text-[#d96834]">
            <Calendar size={17} strokeWidth={2.2} />
          </div>
          <div className="space-y-4">
            <p className="text-[13px] font-bold leading-5 text-[#4d423b]">Orders Type</p>
            <strong className="block text-[28px] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#221914]">
              {order.eventType}
            </strong>
          </div>
        </article>

        {/* Card 3: Status */}
        <article className="rounded-[14px] border border-[#ece4de] bg-white px-4 py-4 shadow-[0_8px_20px_rgba(55,31,13,0.07)] flex flex-col gap-4 items-start transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(55,31,13,0.09)]">
          <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#fff0e7] text-[#d96834]">
            {order.status === "Canceled" ? (
              <XCircle size={17} strokeWidth={2.2} className="text-[#d83f3f]" />
            ) : order.status === "Delivered" ? (
              <CheckCircle size={17} strokeWidth={2.2} className="text-[#2b9e62]" />
            ) : (
              <Clock size={17} strokeWidth={2.2} className="text-[#c8881b]" />
            )}
          </div>
          <div className="space-y-4">
            <p className="text-[13px] font-bold leading-5 text-[#4d423b]">Orders Status</p>
            <strong className={`block text-[28px] font-extrabold leading-[1.05] tracking-[-0.035em] ${statusColors[order.status] || "text-[#221914]"}`}>
              {order.status}
            </strong>
          </div>
        </article>

        {/* Card 4: Payment */}
        <article className="rounded-[14px] border border-[#ece4de] bg-white px-4 py-4 shadow-[0_8px_20px_rgba(55,31,13,0.07)] flex flex-col gap-4 items-start transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(55,31,13,0.09)]">
          <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#fff0e7] text-[#d96834]">
            <CreditCard size={17} strokeWidth={2.2} />
          </div>
          <div className="space-y-4">
            <p className="text-[13px] font-bold leading-5 text-[#4d423b]">Payment Status</p>
            <strong className={`block text-[28px] font-extrabold leading-[1.05] tracking-[-0.035em] ${paymentColors[order.paymentStatus] || "text-[#221914]"}`}>
              {order.paymentStatus}
            </strong>
          </div>
        </article>
      </section>

      {/* Detail grids: Customer, Vendor, Timeline */}
      <section className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <CustomerInfoCard order={order} />
        <VendorInfoCard order={order} />
        <OrderTimelineCard order={order} />
      </section>

      {/* Items list */}
      <section>
        <OrderItemsTable />
      </section>

      {/* Event Details & Summary */}
      <section className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <EventInfoCard />
        <OrderSummaryCard />
      </section>
    </div>
  );
}
