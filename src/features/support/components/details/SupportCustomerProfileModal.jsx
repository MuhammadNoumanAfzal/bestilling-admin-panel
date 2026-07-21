import { Mail, MapPin, Phone, ShoppingBag, UserRound, X } from "lucide-react";

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[14px] border border-[#f0e2d8] bg-white px-4 py-3 shadow-[0_6px_18px_rgba(69,38,19,0.04)]">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">
        <Icon size={13} />
        <span>{label}</span>
      </div>
      <p className="mt-2 text-[14px] font-semibold text-[#2a1f19]">{value}</p>
    </div>
  );
}

export default function SupportCustomerProfileModal({ isOpen, onClose, ticket }) {
  if (!isOpen || !ticket) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#211713]/48 px-4 py-6 backdrop-blur-[4px]">
      <div className="flex min-h-full items-center justify-center">
        <div className="flex max-h-[calc(100vh-3rem)] w-full max-w-[560px] flex-col overflow-hidden rounded-[24px] border border-[#f2dfd3] bg-[linear-gradient(180deg,#fffdfa_0%,#fff7f2_100%)] shadow-[0_28px_80px_rgba(28,18,12,0.20)]">
          <div className="flex items-start justify-between gap-4 border-b border-[#f1e2d8] px-5 py-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/80 bg-[#ffe4d4] shadow-[0_8px_16px_rgba(207,110,56,0.15)]">
                {ticket.avatarUrl ? (
                  <img alt={ticket.user} className="h-full w-full object-cover" src={ticket.avatarUrl} />
                ) : (
                  <span className="inline-flex h-full w-full items-center justify-center text-[15px] font-bold text-[#c86735]">
                    {ticket.avatarInitials}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#cf6e38]">
                  Customer Profile
                </p>
                <h2 className="mt-2 text-[22px] font-bold leading-7 tracking-[-0.03em] text-[#1d1612]">
                  {ticket.user}
                </h2>
                <p className="mt-1 text-[14px] font-medium text-[#8d8077]">{ticket.type}</p>
              </div>
            </div>

            <button
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#efddd1] bg-white text-[#685b53] transition hover:border-[#cf6e38]/30 hover:bg-[#fff2ea] hover:text-[#cf6e38]"
              onClick={onClose}
              type="button"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto px-5 py-4">
            <div className="grid gap-3 md:grid-cols-2">
              <InfoItem icon={Mail} label="Email" value={ticket.email} />
              <InfoItem icon={Phone} label="Phone" value={ticket.phone} />
              <InfoItem icon={ShoppingBag} label="Order Reference" value={ticket.orderReference} />
              <InfoItem icon={MapPin} label="Joined" value={ticket.joinedDate} />
            </div>

            <div className="rounded-[16px] border border-[#f0e2d8] bg-white px-4 py-4 shadow-[0_10px_28px_rgba(74,41,21,0.05)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">
                Account Snapshot
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[12px] border border-[#f4e5db] bg-[#fffaf6] px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">
                    Total Orders
                  </p>
                  <p className="mt-2 text-[24px] font-extrabold text-[#201712]">{ticket.orderCount}</p>
                </div>
                <div className="rounded-[12px] border border-[#f4e5db] bg-[#fffaf6] px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">
                    Ticket Status
                  </p>
                  <p className="mt-2 text-[16px] font-bold text-[#201712]">{ticket.status}</p>
                </div>
                <div className="rounded-[12px] border border-[#f4e5db] bg-[#fffaf6] px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">
                    User Type
                  </p>
                  <p className="mt-2 text-[16px] font-bold text-[#201712]">{ticket.type}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[16px] border border-[#f0e2d8] bg-white px-4 py-4 shadow-[0_10px_28px_rgba(74,41,21,0.05)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">
                Notes
              </p>
              <p className="mt-2 text-[14px] leading-6 text-[#40342e]">{ticket.notes}</p>
            </div>

            <div className="flex justify-end">
              <button
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-[10px] border border-[#d5ccc5] bg-white px-4 text-[13px] font-semibold text-[#332822] transition hover:bg-[#faf6f2]"
                onClick={onClose}
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
