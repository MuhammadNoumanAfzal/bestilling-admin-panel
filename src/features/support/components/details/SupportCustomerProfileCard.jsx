import { Mail, MapPin, Phone, UserRound } from "lucide-react";

function InfoRow({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 text-[12px] text-[#786c65]">
      <Icon size={13} />
      <span>{children}</span>
    </div>
  );
}

export default function SupportCustomerProfileCard({ ticket }) {
  return (
    <section className="rounded-[16px] border border-[#ddd4cd] bg-white p-4 shadow-[0_8px_20px_rgba(55,31,13,0.05)]">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ffe4d4] text-[13px] font-bold text-[#c86735]">
          {ticket.avatarInitials}
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-[#2a1e17]">{ticket.user}</p>
          <p className="text-[12px] text-[#8d8077]">{ticket.type}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        <InfoRow icon={Mail}>{ticket.email}</InfoRow>
        <InfoRow icon={Phone}>{ticket.phone}</InfoRow>
        <InfoRow icon={UserRound}>Total Orders: {ticket.orderCount}</InfoRow>
        <InfoRow icon={MapPin}>Joined: {ticket.joinedDate}</InfoRow>
      </div>

      <button
        className="mt-4 inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-[10px] border border-[#ddd2ca] bg-[#faf6f2] text-[12px] font-bold text-[#2f241d] transition hover:border-[#cf6e38]/35 hover:bg-[#fff5ef]"
        type="button"
      >
        View Customer Profile
      </button>
    </section>
  );
}
