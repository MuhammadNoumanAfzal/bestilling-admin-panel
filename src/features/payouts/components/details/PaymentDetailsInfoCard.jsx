import { FileText, StickyNote, Store, UserRound } from "lucide-react";

function InfoCell({ label, value }) {
  return (
    <div className="rounded-[14px] border border-[#efe5de] bg-[#fcfbfa] px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#a39388]">{label}</p>
      <p className="mt-1.5 text-[14px] font-semibold text-[#2a1f19]">{value}</p>
    </div>
  );
}

function QuickInfoTile({ icon: Icon, label, value, iconTone }) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-[#efe5de] bg-white px-4 py-3">
      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${iconTone}`}>
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#a39388]">{label}</p>
        <p className="truncate text-[13px] font-semibold text-[#2a1f19]">{value}</p>
      </div>
    </div>
  );
}

export default function PaymentDetailsInfoCard({ payout }) {
  return (
    <section className="overflow-hidden rounded-[18px] border border-[#ddd4cd] bg-white shadow-[0_12px_30px_rgba(55,31,13,0.05)]">
      <div className="flex flex-col gap-3 border-b border-[#eee5de] bg-[linear-gradient(180deg,#fff8f3_0%,#ffffff_100%)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-[#fff0e7] px-3 py-1 text-[11px] font-bold text-[#cf6e38]">
            Order Information
          </span>
          <h2 className="mt-3 text-[24px] font-bold tracking-[-0.03em] text-[#241914]">{payout.id}</h2>
        </div>

        <div className="rounded-[14px] border border-[#f1d9cc] bg-white px-4 py-3 text-right">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#ab7f69]">Customer Notes</p>
          <p className="mt-1 max-w-[260px] text-[13px] leading-6 text-[#5e514a]">{payout.notes}</p>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCell label="Invoice Number" value={payout.invoiceNumber} />
        <InfoCell label="Customer Name" value={payout.customer} />
        <InfoCell label="Vendor Name" value={payout.vendorName} />
        <InfoCell label="Order Date" value={payout.date} />
      </div>

      <div className="grid gap-3 border-t border-[#eee5de] bg-[#fffdfa] px-5 py-4 sm:grid-cols-2 xl:grid-cols-4">
        <QuickInfoTile
          icon={FileText}
          iconTone="bg-[#eef4ff] text-[#5777b8]"
          label="Invoice Ref"
          value={payout.invoiceNumber}
        />
        <QuickInfoTile
          icon={UserRound}
          iconTone="bg-[#fff0e7] text-[#cf6e38]"
          label="Customer Email"
          value={payout.customerEmail}
        />
        <QuickInfoTile
          icon={Store}
          iconTone="bg-[#f7f1ff] text-[#8567d2]"
          label="Vendor Outlet"
          value={`${payout.vendor}, ${payout.vendorCity}`}
        />
        <QuickInfoTile
          icon={StickyNote}
          iconTone="bg-[#eefbf2] text-[#249f56]"
          label="Payment State"
          value={payout.orderPayment}
        />
      </div>
    </section>
  );
}
