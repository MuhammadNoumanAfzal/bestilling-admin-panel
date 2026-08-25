import { BadgeCheck, CheckCircle2, Landmark, MessageSquareWarning, ShieldCheck, Sparkles } from "lucide-react";

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
    <section className="overflow-hidden rounded-[22px] border border-[#ddd6cf] bg-white shadow-[0_14px_32px_rgba(55,31,13,0.06)]">
      <div className="border-b border-[#eee1d7] bg-[linear-gradient(135deg,#fff8f2_0%,#fffdfb_55%,#fff5ec_100%)] px-5 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[#221914]">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#fff0e6] text-[#cf6e38] shadow-[0_10px_22px_rgba(207,110,56,0.14)]">
                <Landmark size={18} />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#b07a5b]">Finance review</p>
                <h2 className="text-[22px] font-extrabold tracking-[-0.03em] text-[#221914]">Payout Bank Profile</h2>
              </div>
            </div>
            <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-[#665850]">
              Review the payout bank profile carefully before any vendor payout is released. This approval should stay high priority because it directly controls finance handoff.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <StatusPill
              verified={payoutProfile.bankDetailsVerified}
              verificationStatus={payoutProfile.verificationStatus}
            />
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e8ddd5] bg-white/90 px-3 py-2 text-[12px] font-semibold text-[#4d433d] shadow-[0_8px_20px_rgba(41,24,12,0.05)]">
              <ShieldCheck size={14} className={payoutProfile.bankDetailsVerified ? "text-[#208348]" : "text-[#cf6e38]"} />
              {payoutProfile.bankDetailsVerified ? "Ready for payout release" : "Waiting for admin approval"}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f7f2ee] px-3 py-1.5 text-[12px] font-bold text-[#9a7a68]">
            <Sparkles size={13} className="text-[#cf6e38]" />
            Verification controls
          </div>
        </div>

        <div className="mt-4 rounded-[22px] border border-[#f0ded2] bg-[linear-gradient(135deg,#fff8f2_0%,#fffdfa_100%)] px-4 py-4 shadow-[0_10px_22px_rgba(52,29,13,0.04)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#b07a5b]">Admin review</p>
              <p className="mt-2 text-[16px] font-bold text-[#221914]">
                Approve the bank profile before finance releases any vendor payout.
              </p>
              <p className="mt-1 text-[13px] leading-6 text-[#6f6056]">
                If anything does not match the vendor identity or company record, request corrections instead of approving.
              </p>
            </div>

            <div className="rounded-[18px] border border-[#efddcf] bg-white/90 p-3 shadow-[0_8px_20px_rgba(41,24,12,0.05)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#a08b7f]">Priority</p>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#fff1e8] px-3 py-1.5 text-[12px] font-bold text-[#cf6e38]">
                <BadgeCheck size={14} />
                {payoutProfile.bankDetailsVerified ? "Completed" : "Approve before payout"}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4 rounded-[20px] border border-[#ece1d7] bg-[#fcfaf8] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[15px] font-bold text-[#211915]">Verification actions</p>
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
      </div>
    </section>
  );
}
