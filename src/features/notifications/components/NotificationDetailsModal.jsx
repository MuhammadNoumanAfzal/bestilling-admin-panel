import {
  BellRing,
  CheckCheck,
  ExternalLink,
  Image as ImageIcon,
  Mail,
  Paperclip,
  MessageSquareText,
  Smartphone,
  UserRound,
  X,
} from "lucide-react";

const methodMeta = {
  email: {
    icon: Mail,
    label: "Email",
  },
  push: {
    icon: MessageSquareText,
    label: "Push",
  },
  "in-app": {
    icon: BellRing,
    label: "In-App",
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
      <p className="mt-1 break-words text-[13px] font-semibold leading-5 text-[#2a1f19]">{value}</p>
    </div>
  );
}

function DeliveryChip({ active, label }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-semibold",
        active ? "bg-[#fff0e7] text-[#cf6e38]" : "bg-[#f3efec] text-[#8f8178]",
      ].join(" ")}
    >
      <CheckCheck size={13} />
      {label}: {active ? "Yes" : "No"}
    </span>
  );
}

function formatLinkedResource(notification) {
  if (notification.payoutId) {
    return `Payout #${notification.payoutId}`;
  }

  if (notification.orderId) {
    return `Order #${notification.orderId}`;
  }

  if (notification.invoiceId) {
    return `Invoice #${notification.invoiceId}`;
  }

  if (notification.entityType && notification.entityId) {
    return `${notification.entityType} #${notification.entityId}`;
  }

  if (notification.entityType) {
    return notification.entityType;
  }

  return "Not available";
}

function getAttachmentFileNameFromUrl(url) {
  try {
    const parsedUrl = new URL(url);
    const pathnameParts = parsedUrl.pathname.split("/").filter(Boolean);
    return pathnameParts[pathnameParts.length - 1] || "Attachment";
  } catch {
    const pathnameParts = String(url || "").split("/").filter(Boolean);
    return pathnameParts[pathnameParts.length - 1] || "Attachment";
  }
}

function extractAttachmentsFromMessage(message) {
  const attachments = [];
  const cleanedMessage = String(message || "")
    .replace(/(?:^|\n)\s*Attachment:\s*(https?:\/\/\S+)\s*/gi, (fullMatch, url) => {
      attachments.push({
        id: `message-attachment-${attachments.length + 1}-${url}`,
        url,
        fileName: getAttachmentFileNameFromUrl(url),
        isImage: /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(url),
      });
      return "\n";
    })
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return {
    message: cleanedMessage,
    attachments,
  };
}

export default function NotificationDetailsModal({ notification, onClose, onOpenAction }) {
  if (!notification) {
    return null;
  }

  const showSubject = notification.subject && notification.subject !== notification.title;
  const parsedMessage = extractAttachmentsFromMessage(notification.message);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#211713]/48 px-4 py-6 backdrop-blur-[4px]">
      <div className="flex min-h-full items-center justify-center">
        <div className="flex max-h-[calc(100vh-3rem)] w-full max-w-[620px] flex-col overflow-hidden rounded-[24px] border border-[#f2dfd3] bg-[linear-gradient(180deg,#fffdfa_0%,#fff7f2_100%)] shadow-[0_28px_80px_rgba(28,18,12,0.20)]">
          <div className="flex items-start justify-between gap-4 border-b border-[#f1e2d8] px-4 py-4 sm:px-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#cf6e38]">
                Notification Details
              </p>
              <h2 className="mt-2 max-w-[420px] break-words text-[20px] font-bold leading-7 tracking-[-0.03em] text-[#1d1612] sm:text-[22px]">
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

          <div className="space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
            <div className="grid gap-3 md:grid-cols-2">
              <DetailRow label="Audience" value={notification.audience} />
              <DetailRow label="Status" value={notification.statusLabel || notification.status} />
              <DetailRow label="Type" value={notification.typeLabel || notification.type || "Not available"} />
              <DetailRow label="Created At" value={notification.createdAtDisplay || notification.createdAt} />
              <DetailRow label="Read At" value={notification.readAtDisplay || "Not available"} />
              <DetailRow label="Linked Resource" value={formatLinkedResource(notification)} />
            </div>

            <div className="rounded-[16px] border border-[#f0e2d8] bg-white px-4 py-4 shadow-[0_10px_28px_rgba(74,41,21,0.05)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">Delivery Channels</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {notification.channels.map((channel) => (
                  <MethodTag key={channel} method={channel} />
                ))}
              </div>
            </div>

            <div className="rounded-[16px] border border-[#f0e2d8] bg-white px-4 py-4 shadow-[0_10px_28px_rgba(74,41,21,0.05)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">Delivery Preferences</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <DeliveryChip active={notification.sendInApp} label="In-App" />
                <DeliveryChip active={notification.sendEmail} label="Email" />
                <DeliveryChip active={notification.sendPush} label="Push" />
              </div>
            </div>

            {showSubject ? (
              <div className="rounded-[16px] border border-[#f0e2d8] bg-white px-4 py-4 shadow-[0_10px_28px_rgba(74,41,21,0.05)]">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">Subject</p>
                <p className="mt-2 text-[15px] font-bold leading-6 text-[#261b16]">{notification.subject}</p>
              </div>
            ) : null}

            <div className="rounded-[16px] border border-[#f0e2d8] bg-white px-4 py-4 shadow-[0_10px_28px_rgba(74,41,21,0.05)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">Message</p>
              {parsedMessage.message ? (
                <p className="mt-2 break-words text-[14px] leading-6 text-[#40342e]">{parsedMessage.message}</p>
              ) : (
                <p className="mt-2 text-[14px] leading-6 text-[#8c7d74]">No message provided.</p>
              )}

              {parsedMessage.attachments.length ? (
                <div className="mt-4 space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">
                    Attachments
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {parsedMessage.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        className="group flex min-h-[54px] items-center justify-between gap-3 rounded-[14px] border border-[#f0dfd3] bg-[linear-gradient(180deg,#fffaf6_0%,#fff3ea_100%)] px-4 py-3 no-underline transition hover:border-[#cf6e38]/35 hover:bg-[#fff0e5]"
                        href={attachment.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#cf6e38] shadow-[0_6px_16px_rgba(207,110,56,0.12)]">
                            {attachment.isImage ? <ImageIcon size={16} /> : <Paperclip size={16} />}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-[13px] font-bold text-[#2a1f19]">
                              {attachment.isImage ? "Open image" : "Open attachment"}
                            </span>
                            <span className="block truncate text-[12px] text-[#8b7d73]">
                              {attachment.fileName}
                            </span>
                          </span>
                        </span>
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#cf6e38]">
                          View
                          <ExternalLink size={12} />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {notification.note ? (
              <div className="rounded-[16px] border border-[#f0e2d8] bg-white px-4 py-4 shadow-[0_10px_28px_rgba(74,41,21,0.05)]">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">Admin Note</p>
                <p className="mt-2 text-[14px] leading-6 text-[#40342e]">{notification.note}</p>
              </div>
            ) : null}

            {notification.rejectionReason ? (
              <div className="rounded-[16px] border border-[#f2d9d1] bg-[#fff7f4] px-4 py-4 shadow-[0_10px_28px_rgba(74,41,21,0.05)]">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#b56b58]">Rejection Reason</p>
                <p className="mt-2 text-[14px] leading-6 text-[#5f4339]">{notification.rejectionReason}</p>
              </div>
            ) : null}

            {notification.receiptUrl || notification.transferReference || notification.paymentDate ? (
              <div className="grid gap-3 md:grid-cols-2">
                {notification.paymentDate ? (
                  <DetailRow label="Payment Date" value={notification.paymentDate} />
                ) : null}
                {notification.transferReference ? (
                  <DetailRow label="Transfer Reference" value={notification.transferReference} />
                ) : null}
                {notification.paymentStatus ? (
                  <DetailRow label="Payment Status" value={notification.paymentStatus} />
                ) : null}
                {notification.settlementStatus ? (
                  <DetailRow label="Settlement Status" value={notification.settlementStatus} />
                ) : null}
              </div>
            ) : null}

            {notification.receiptUrl ? (
              <div className="rounded-[16px] border border-[#f0e2d8] bg-white px-4 py-4 shadow-[0_10px_28px_rgba(74,41,21,0.05)]">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">Receipt Proof</p>
                <a
                  className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-[12px] bg-[#fff2e9] px-4 py-2.5 text-[13px] font-bold text-[#cf6e38] no-underline transition hover:bg-[#ffe8d9] hover:text-[#bc6030]"
                  href={notification.receiptUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ExternalLink size={15} />
                  Open Uploaded Receipt
                </a>
              </div>
            ) : null}

            <div className="flex items-center gap-3 rounded-[16px] border border-[#f0e2d8] bg-[linear-gradient(90deg,#fff4ec_0%,#fffdfa_100%)] px-4 py-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0e7] text-[#d16737] shadow-[0_6px_18px_rgba(209,103,55,0.18)]">
                <UserRound size={17} />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#aa8f81]">Triggered By</p>
                <p className="text-[13px] font-semibold text-[#2a1f19]">{notification.sentBy}</p>
              </div>
            </div>

            {notification.actionUrl ? (
              <button
                className="inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#cf6e38] px-4 py-3 text-center text-[14px] font-bold text-white transition hover:bg-[#bc6030]"
                onClick={() => onOpenAction?.(notification)}
                type="button"
              >
                <ExternalLink size={16} />
                <span>Open Linked Resource</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
