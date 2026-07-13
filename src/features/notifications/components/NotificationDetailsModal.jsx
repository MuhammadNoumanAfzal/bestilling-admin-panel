import { Mail, MessageSquareText, Smartphone, UserRound, X } from "lucide-react";

const methodMeta = {
  email: {
    icon: Mail,
    label: "Email",
  },
  push: {
    icon: MessageSquareText,
    label: "Push",
  },
  sms: {
    icon: Smartphone,
    label: "SMS",
  },
};

function MethodTag({ method }) {
  const meta = methodMeta[method];

  if (!meta) {
    return null;
  }

  const Icon = meta.icon;

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#ffd9c7] bg-[linear-gradient(180deg,#fff7f2_0%,#fff0e7_100%)] px-3 py-1.5 text-[12px] font-semibold text-[#b85f30]">
      <Icon size={14} />
      {meta.label}
    </span>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="rounded-[14px] border border-[#f0e2d8] bg-[linear-gradient(180deg,#fffdfa_0%,#faf5f0_100%)] px-4 py-3 shadow-[0_6px_18px_rgba(69,38,19,0.04)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">{label}</p>
      <p className="mt-1 text-[13px] font-semibold leading-5 text-[#2a1f19]">{value}</p>
    </div>
  );
}

export default function NotificationDetailsModal({ notification, onClose }) {
  if (!notification) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211713]/48 px-4 py-6 backdrop-blur-[4px]">
      <div className="w-full max-w-[560px] overflow-hidden rounded-[24px] border border-[#f2dfd3] bg-[linear-gradient(180deg,#fffdfa_0%,#fff7f2_100%)] shadow-[0_28px_80px_rgba(28,18,12,0.20)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#f1e2d8] px-5 py-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#cf6e38]">Notification Details</p>
            <h2 className="mt-2 max-w-[360px] text-[22px] font-bold leading-7 tracking-[-0.03em] text-[#1d1612]">
              {notification.title}
            </h2>
          </div>

          <button
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#efddd1] bg-white text-[#685b53] transition hover:border-[#cf6e38]/30 hover:bg-[#fff2ea] hover:text-[#cf6e38]"
            onClick={onClose}
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="grid gap-3 md:grid-cols-2">
            <DetailRow label="Audience" value={notification.audience} />
            <DetailRow label="Status" value={notification.status} />
            <DetailRow label="Scheduled Time" value={notification.scheduledAt} />
            <DetailRow label="Created At" value={notification.createdAt} />
          </div>

          <div className="rounded-[16px] border border-[#f0e2d8] bg-white px-4 py-4 shadow-[0_10px_28px_rgba(74,41,21,0.05)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">Methods</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {notification.channels.map((channel) => (
                <MethodTag key={channel} method={channel} />
              ))}
            </div>
          </div>

          <div className="rounded-[16px] border border-[#f0e2d8] bg-white px-4 py-4 shadow-[0_10px_28px_rgba(74,41,21,0.05)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">Subject</p>
            <p className="mt-2 text-[15px] font-bold leading-6 text-[#261b16]">{notification.subject}</p>
          </div>

          <div className="rounded-[16px] border border-[#f0e2d8] bg-white px-4 py-4 shadow-[0_10px_28px_rgba(74,41,21,0.05)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">Message</p>
            <p className="mt-2 text-[14px] leading-6 text-[#40342e]">{notification.message}</p>
          </div>

          <div className="flex items-center gap-3 rounded-[16px] border border-[#f0e2d8] bg-[linear-gradient(90deg,#fff4ec_0%,#fffdfa_100%)] px-4 py-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0e7] text-[#d16737] shadow-[0_6px_18px_rgba(209,103,55,0.18)]">
              <UserRound size={17} />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">Created By</p>
              <p className="text-[13px] font-semibold text-[#2a1f19]">{notification.sentBy}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
