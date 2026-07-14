import { Clock, Sparkle, Check, Utensils, Truck, MapPin } from "lucide-react";

export default function OrderTimelineCard({ order }) {
  const isCanceled = order.status === "Canceled";
  const isDelivered = order.status === "Delivered";

  const timelineSteps = [
    {
      label: "Order Placed",
      time: "14 May 2026, 01:00 PM",
      desc: "Order has been placed by customer",
      status: "completed",
      icon: Sparkle,
    },
    {
      label: "Accepted",
      time: "",
      desc: isCanceled ? "Order Canceled before acceptance" : "Order Accepted by Vendor",
      status: "completed",
      icon: Check,
    },
    {
      label: "Preparing",
      time: isDelivered ? "14 May 2026, 02:30 PM" : "",
      desc: isDelivered ? "Caterer finished food preparation" : "Pending",
      status: isDelivered ? "completed" : isCanceled ? "canceled" : "pending",
      icon: Utensils,
    },
    {
      label: "Out for Delivery",
      time: isDelivered ? "14 May 2026, 04:15 PM" : "",
      desc: isDelivered ? "Delivery partner picked up shipment" : "Pending",
      status: isDelivered ? "completed" : isCanceled ? "canceled" : "pending",
      icon: Truck,
    },
    {
      label: "Delivered",
      time: isDelivered ? "14 May 2026, 05:00 PM" : "",
      desc: isDelivered ? "Order handed over to the customer" : "Pending",
      status: isDelivered ? "completed" : isCanceled ? "canceled" : "pending",
      icon: MapPin,
    },
  ];

  return (
    <article className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)] h-full">
      <header className="mb-6 flex items-center gap-2 border-b border-[#eee4dd] pb-3">
        <Clock size={18} className="text-[#cf6432]" />
        <h3 className="text-[18px] font-bold text-[#18120f]">Order Timeline</h3>
      </header>

      {/* Vertical Timeline container */}
      <div className="flex flex-col">
        {timelineSteps.map((step, idx) => {
          const StepIcon = step.icon;
          let nodeBg = "bg-white border-[#d8ccc2]";
          let iconColor = "text-[#18120f]";

          if (step.status === "completed") {
            nodeBg = "bg-[#d96834] border-[#d96834]";
            iconColor = "text-white";
          } else if (step.status === "canceled") {
            nodeBg = "bg-[#d83f3f] border-[#d83f3f]";
            iconColor = "text-white";
          }

          return (
            <div key={idx} className="relative pl-13 pb-7 last:pb-0 min-h-[58px]">
              {/* Segment Line */}
              {idx < timelineSteps.length - 1 && (
                <div
                  className={`absolute left-[17px] top-9 bottom-0 w-[2px] ${
                    step.status === "completed" && timelineSteps[idx + 1].status === "completed"
                      ? "bg-[#d96834]"
                      : "bg-[#e6dad1]"
                  }`}
                />
              )}

              {/* Timeline dot */}
              <div
                className={`absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border-2 ${nodeBg} transition-all shadow-sm shrink-0`}
              >
                <StepIcon size={16} className={iconColor} strokeWidth={2.2} />
              </div>

              {/* Title & Time */}
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <p
                    className={`text-[14px] font-bold ${
                      step.status === "completed"
                        ? "text-[#d96834]"
                        : step.status === "canceled"
                        ? "text-[#d83f3f]"
                        : "text-[#18120f]"
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.time && (
                    <span className="text-[11px] font-medium text-[#9a8f86]">
                      {step.time}
                    </span>
                  )}
                </div>

                {/* Summary Description */}
                <p className="text-[12px] text-[#8a7f76] mt-0.5 leading-4">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
