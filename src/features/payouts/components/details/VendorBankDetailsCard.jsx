import { Building2, Landmark, ShieldCheck } from "lucide-react";

function DetailCell({ label, value }) {
  return (
    <div className="rounded-[18px] border border-[#eee3db] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf8_100%)] px-4 py-4 shadow-[0_8px_18px_rgba(55,31,13,0.04)]">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a29388]">{label}</p>
      <p className="mt-2 break-words text-[14px] font-semibold leading-6 text-[#1b1512]">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function StatusPill({ verified, verificationStatus }) {
  const label = verificationStatus || (verified ? "Verified" : "Pending review");
  const tone = verified
    ? "border-[#cde8d4] bg-[#effaf2] text-[#208348]"
    : "border-[#f3d8c7] bg-[#fff5ee] text-[#c96533]";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-bold ${tone}`}>
      <span className="h-2 w-2 rounded-full bg-current" />
      {label}
    </span>
  );
}

export default function VendorBankDetailsCard({ payout }) {
  const payoutProfile = payout?.vendor?.payoutProfile;

  if (!payoutProfile) {
    return (
      <section className="overflow-hidden rounded-[24px] border border-[#ddd4cd] bg-white shadow-[0_14px_34px_rgba(55,31,13,0.06)]">
        <div className="flex items-center gap-2 border-b border-[#eee5de] bg-[linear-gradient(180deg,#fff8f3_0%,#ffffff_100%)] px-5 py-4 text-[#221914]">
          <Landmark size={17} className="text-[#cf6e38]" />
          <h2 className="text-[18px] font-bold">Vendor Payout Bank Details</h2>
        </div>
        <div className="px-5 py-5">
          <div className="rounded-[18px] border border-dashed border-[#ecd8cb] bg-[#fffaf6] px-4 py-5 text-[14px] leading-6 text-[#6c5d54]">
            Bank details were not returned in this admin payout response yet. The vendor may already have saved them,
            but backend still needs to expose the payout profile on the admin payout detail contract before operations
            can review it here.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[24px] border border-[#ddd4cd] bg-white shadow-[0_14px_34px_rgba(55,31,13,0.06)]">
      <div className="flex flex-col gap-3 border-b border-[#eee5de] bg-[linear-gradient(180deg,#fff8f3_0%,#ffffff_100%)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-[#221914]">
          <Landmark size={17} className="text-[#cf6e38]" />
          <h2 className="text-[18px] font-bold">Vendor Payout Bank Details</h2>
        </div>
        <StatusPill
          verified={payoutProfile.bankDetailsVerified}
          verificationStatus={payoutProfile.verificationStatus}
        />
      </div>

      <div className="space-y-4 px-5 py-5">
        <div className="rounded-[20px] border border-[#f0ded2] bg-[linear-gradient(135deg,#fff8f2_0%,#fffdfa_100%)] px-4 py-4 shadow-[0_10px_22px_rgba(55,31,13,0.04)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#b07a5b]">Review before payout</p>
              <p className="mt-2 text-[15px] font-semibold text-[#221914]">
                Use these saved bank details when you manually transfer the vendor payout.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e6ded5] bg-white px-3 py-2 text-[12px] font-semibold text-[#4d433d]">
              <ShieldCheck size={14} className={payoutProfile.bankDetailsVerified ? "text-[#208348]" : "text-[#cf6e38]"} />
              {payoutProfile.bankDetailsVerified ? "Bank details confirmed" : "Needs admin review"}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <DetailCell label="Account Holder" value={payoutProfile.accountHolderName} />
          <DetailCell label="Bank Name" value={payoutProfile.bankName} />
          <DetailCell label="Payout Method" value={payoutProfile.payoutMethod} />
          <DetailCell label="Account Number" value={payoutProfile.accountNumber} />
          <DetailCell label="IBAN" value={payoutProfile.iban} />
          <DetailCell label="SWIFT / BIC" value={payoutProfile.swiftBic} />
          <DetailCell label="Routing Number" value={payoutProfile.routingNumber} />
          <DetailCell label="Branch Name" value={payoutProfile.branchName} />
          <DetailCell label="Branch Code" value={payoutProfile.branchCode} />
          <DetailCell label="Billing Address" value={payoutProfile.billingAddress} />
          <DetailCell label="City" value={payoutProfile.city} />
          <DetailCell label="Postal Code" value={payoutProfile.postalCode} />
          <DetailCell label="Country" value={payoutProfile.country} />
          <DetailCell label="Vendor" value={payout?.vendor?.name} />
          <DetailCell label="Vendor Contact" value={payout?.vendor?.contactName} />
          <DetailCell label="Vendor City" value={payout?.vendor?.city} />
        </div>

        <div className="flex items-start gap-3 rounded-[18px] border border-[#e8ddd5] bg-[#fcfaf8] px-4 py-4 text-[13px] leading-6 text-[#665850]">
          <Building2 size={16} className="mt-0.5 shrink-0 text-[#cf6e38]" />
          <p>
            There is no separate admin approval mutation wired for bank detail verification yet. For now, this screen
            gives operations the exact payout data to review and use before releasing or marking payouts as paid.
          </p>
        </div>
      </div>
    </section>
  );
}
