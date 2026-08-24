import { CheckCircle2, Landmark, MessageSquareWarning, ShieldCheck } from "lucide-react";

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
  const normalized = `${verificationStatus || ""}`.trim().toLowerCase();
  const tone = verified
    ? "border-[#cde8d4] bg-[#effaf2] text-[#208348]"
    : normalized === "changes requested"
      ? "border-[#f2cfcf] bg-[#fff1f1] text-[#be4141]"
      : "border-[#f3d8c7] bg-[#fff5ee] text-[#c96533]";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-bold ${tone}`}>
      <span className="h-2 w-2 rounded-full bg-current" />
      {verificationStatus || (verified ? "Verified" : "Pending review")}
    </span>
  );
}

function ActionButton({ disabled = false, icon: Icon, label, onClick, secondary = false }) {
  return (
    <button
      className={
        secondary
          ? "inline-flex h-11 items-center justify-center gap-2 rounded-[14px] border border-[#ead5c8] bg-white px-4 text-[13px] font-semibold text-[#5a4b43] transition hover:-translate-y-[1px] hover:border-[#d8b8a4] hover:bg-[#fffaf6] disabled:cursor-not-allowed disabled:opacity-60"
          : "inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(135deg,#d97342_0%,#c65b2d_100%)] px-4 text-[13px] font-semibold text-white shadow-[0_14px_28px_rgba(198,91,45,0.22)] transition hover:-translate-y-[1px] hover:shadow-[0_18px_34px_rgba(198,91,45,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
      }
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <Icon size={15} />
      <span>{label}</span>
    </button>
  );
}

export default function VendorPayoutProfileSection({
  isApproving = false,
  isRequestingChanges = false,
  onApprove,
  onRequestChanges,
  vendor,
}) {
  const payoutProfile = vendor?.payoutProfile;

  if (!payoutProfile) {
    return (
      <section className="rounded-[18px] border border-[#ddd6cf] bg-white p-5 shadow-[0_10px_24px_rgba(55,31,13,0.05)]">
        <div className="flex items-center gap-2 text-[#221914]">
          <Landmark size={18} className="text-[#cf6e38]" />
          <h2 className="text-[18px] font-bold">Payout Bank Profile</h2>
        </div>
        <div className="mt-4 rounded-[18px] border border-dashed border-[#ecd8cb] bg-[#fffaf6] px-4 py-5 text-[14px] leading-6 text-[#6c5d54]">
          This vendor has not added payout bank details yet.
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[18px] border border-[#ddd6cf] bg-white p-5 shadow-[0_10px_24px_rgba(55,31,13,0.05)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-[#221914]">
          <Landmark size={18} className="text-[#cf6e38]" />
          <h2 className="text-[18px] font-bold">Payout Bank Profile</h2>
        </div>
        <StatusPill
          verified={payoutProfile.bankDetailsVerified}
          verificationStatus={payoutProfile.verificationStatus}
        />
      </div>

      <div className="mt-4 rounded-[20px] border border-[#f0ded2] bg-[linear-gradient(135deg,#fff8f2_0%,#fffdfa_100%)] px-4 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#b07a5b]">Admin review</p>
            <p className="mt-2 text-[15px] font-semibold text-[#221914]">
              Approve the bank profile here before finance releases any vendor payout.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e6ded5] bg-white px-3 py-2 text-[12px] font-semibold text-[#4d433d]">
            <ShieldCheck size={14} className={payoutProfile.bankDetailsVerified ? "text-[#208348]" : "text-[#cf6e38]"} />
            {payoutProfile.bankDetailsVerified ? "Bank details confirmed" : "Needs admin review"}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-[18px] border border-[#ece1d7] bg-[#fcfaf8] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[14px] font-semibold text-[#211915]">Verification actions</p>
          <p className="mt-1 text-[13px] leading-6 text-[#665850]">
            Request corrections if anything does not match the vendor account or company records.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <ActionButton
            disabled={isApproving || isRequestingChanges || payoutProfile.bankDetailsVerified}
            icon={CheckCircle2}
            label={payoutProfile.bankDetailsVerified ? "Already verified" : isApproving ? "Approving..." : "Approve bank details"}
            onClick={onApprove}
          />
          <ActionButton
            disabled={isApproving || isRequestingChanges}
            icon={MessageSquareWarning}
            label={isRequestingChanges ? "Sending..." : "Request changes"}
            onClick={onRequestChanges}
            secondary
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
        <DetailCell label="Verification Note" value={payoutProfile.verificationNote} />
        <DetailCell label="Created" value={payoutProfile.createdAtLabel} />
        <DetailCell label="Last Updated" value={payoutProfile.updatedAtLabel} />
      </div>
    </section>
  );
}
