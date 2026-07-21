import { Mail, MapPin, Phone, UserRound } from "lucide-react";

function InfoRow({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2.5 text-[13px] text-[#18120f]">
      <Icon className="text-[#786c65]" size={14} />
      <span>{children}</span>
    </div>
  );
}

export default function SupportCustomerProfileCard({ onViewProfile, ticket }) {
  return (
    <section className="overflow-hidden rounded-[18px] border border-[#eadcd3] bg-white shadow-[0_10px_24px_rgba(55,31,13,0.05)]">
      <div className="bg-[linear-gradient(135deg,#fff8f2_0%,#fff2ea_55%,#fff7fb_100%)] px-4 py-3.5">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/80 bg-[#ffe4d4] shadow-[0_8px_16px_rgba(207,110,56,0.15)]">
            {ticket.avatarUrl ? (
              <img alt={ticket.user} className="h-full w-full object-cover" src={ticket.avatarUrl} />
            ) : (
              <span className="inline-flex h-full w-full items-center justify-center text-[14px] font-bold text-[#c86735]">
                {ticket.avatarInitials}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[17px] font-bold text-[#18120f]">{ticket.user}</p>
            <p className="text-[14px] font-medium text-[#8d8077]">{ticket.type}</p>
            <div className="mt-1.5 inline-flex rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-bold text-[#cf6e38]">
              Active requester
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 px-4 py-3.5">
        <InfoRow icon={Mail}>{ticket.email}</InfoRow>
        <InfoRow icon={Phone}>{ticket.phone}</InfoRow>
        <InfoRow icon={UserRound}>Total Orders: {ticket.orderCount}</InfoRow>
        <InfoRow icon={MapPin}>Joined: {ticket.joinedDate}</InfoRow>
      </div>

      <button
        className="mx-4 mb-4 inline-flex h-9 w-[calc(100%-2rem)] cursor-pointer items-center justify-center rounded-[10px] border border-[#ddd2ca] bg-[#faf6f2] text-[13px] font-bold text-[#18120f] transition hover:border-[#cf6e38]/35 hover:bg-[#fff5ef]"
        onClick={onViewProfile}
        type="button"
      >
        View Customer Profile
      </button>
    </section>
  );
}
