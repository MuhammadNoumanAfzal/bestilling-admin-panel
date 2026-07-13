import { ArrowRight, Banknote, CircleDollarSign, Landmark } from "lucide-react";

function FlowNode({ icon: Icon, label, value, tone = "default" }) {
  const toneClass =
    tone === "orange"
      ? "bg-[#fff0e7] text-[#cf6e38]"
      : tone === "blue"
        ? "bg-[#eef4ff] text-[#4b74c6]"
        : "bg-[#f4f2ef] text-[#7c6f67]";

  return (
    <div className="flex flex-1 flex-col items-center gap-3 rounded-[18px] border border-[#efe4dd] bg-[#fcfbfa] px-4 py-4 text-center">
      <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${toneClass}`}>
        <Icon size={20} />
      </span>
      <div>
        <p className="text-[12px] font-bold text-[#7d7068]">{label}</p>
        <p className="mt-1.5 text-[15px] font-bold text-[#2a1e17]">{value}</p>
      </div>
    </div>
  );
}

export default function PaymentLifecycleCard({ payout }) {
  return (
    <section className="rounded-[18px] border border-[#ddd4cd] bg-white p-5 shadow-[0_12px_30px_rgba(55,31,13,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#9b8f86]">Transaction Lifecycle Flow</p>
          <h2 className="mt-1 text-[22px] font-bold tracking-[-0.03em] text-[#241914]">Money Movement</h2>
        </div>
        <span className="rounded-full bg-[#fff4eb] px-3 py-1 text-[11px] font-bold text-[#cf6e38]">
          {payout.payoutStatus}
        </span>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
        <FlowNode icon={CircleDollarSign} label="Customer Pays" tone="blue" value={payout.orderAmount} />
        <div className="hidden justify-center lg:flex">
          <ArrowRight className="text-[#d7c9be]" size={18} />
        </div>
        <FlowNode icon={Banknote} label="Commission" tone="orange" value={payout.platformCommission.replace("-", "")} />
        <div className="hidden justify-center lg:flex">
          <ArrowRight className="text-[#d7c9be]" size={18} />
        </div>
        <FlowNode icon={Landmark} label="Vendor Receives" value={payout.vendorAmount} />
      </div>
    </section>
  );
}
