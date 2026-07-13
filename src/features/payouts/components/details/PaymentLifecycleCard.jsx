import { ArrowRight, Banknote, CircleDollarSign, Landmark } from "lucide-react";

function FlowNode({ icon: Icon, label, tone = "default", value }) {
  const toneClass =
    tone === "orange"
      ? "bg-[#fff0e7] text-[#cf6e38]"
      : tone === "blue"
        ? "bg-[#eef4ff] text-[#4b74c6]"
        : "bg-[#edf3ff] text-[#5a78b5]";

  return (
    <div className="flex flex-1 flex-col items-center text-center">
      <span className={`inline-flex h-14 w-14 items-center justify-center rounded-full border border-white ${toneClass}`}>
        <Icon size={22} />
      </span>
      <p className="mt-3 text-[15px] font-semibold text-[#18120f]">{label}</p>
      <p className="mt-1 text-[14px] font-semibold text-[#cf6e38]">{value}</p>
    </div>
  );
}

export default function PaymentLifecycleCard({ payout }) {
  return (
    <section className="rounded-[18px] border border-[#ddd4cd] bg-white px-5 py-5 shadow-[0_12px_30px_rgba(55,31,13,0.05)]">
      <div className="text-center">
        <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#6f645d]">Transaction Lifecycle Flow</p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
        <FlowNode icon={CircleDollarSign} label="Customer Pays" tone="blue" value={payout.orderAmount} />
        <div className="hidden justify-center lg:flex">
          <ArrowRight className="text-[#c9b7ab]" size={20} />
        </div>
        <FlowNode
          icon={Banknote}
          label="Commission"
          tone="orange"
          value={`(-${payout.platformCommission.replace("-", "")})`}
        />
        <div className="hidden justify-center lg:flex">
          <ArrowRight className="text-[#c9b7ab]" size={20} />
        </div>
        <FlowNode icon={Landmark} label="Vendor Receives" value={payout.vendorAmount} />
      </div>
    </section>
  );
}
