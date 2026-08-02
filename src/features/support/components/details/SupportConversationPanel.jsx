import { MessageSquareReply, Paperclip, SendHorizonal, Shield, X } from "lucide-react";
import { formatReadableDate } from "../../supportUtils.js";

function DraftAttachmentChip({ filename, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#eaded6] bg-[#f6f1ed] px-3 py-1 text-[11px] font-medium text-[#7c6f67]">
      <span>{filename}</span>
      <button className="inline-flex cursor-pointer text-[#9f7b66] transition hover:text-[#cf6e38]" onClick={onRemove} type="button">
        <X size={12} />
      </button>
    </span>
  );
}

function MessageBubble({ message, requesterAvatarUrl }) {
  const isRight = message.side === "admin";
  const isInternal = message.author?.role?.toLowerCase().includes("admin") && message.side === "admin";

  return (
    <div className={["flex gap-3", isRight ? "justify-end" : "justify-start"].join(" ")}>
      {!isRight ? (
        <div className="mt-1 h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#f5d8c7]">
          {requesterAvatarUrl ? (
            <img alt={message.author.fullName} className="h-full w-full object-cover" src={requesterAvatarUrl} />
          ) : (
            <span className="inline-flex h-full w-full items-center justify-center text-[11px] font-bold text-[#bc6431]">
              {message.author.fullName
                .split(" ")
                .slice(0, 2)
                .map((part) => part[0])
                .join("")}
            </span>
          )}
        </div>
      ) : null}

      <div className={["max-w-[78%]", isRight ? "items-end" : "items-start", "flex flex-col"].join(" ")}>
        <div className={["mb-1 flex items-center gap-2 text-[12px] text-[#9a8d85]", isRight ? "justify-end" : ""].join(" ")}>
          <span className="font-semibold text-[#7d7068]">{message.author.fullName}</span>
          <span>{formatReadableDate(message.createdAt)}</span>
          {isInternal ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fff2e9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#cf6e38]">
              <Shield size={10} />
              Internal
            </span>
          ) : null}
        </div>

        <div
          className={[
            "rounded-[16px] px-4 py-3 text-[14px] leading-7 shadow-[0_8px_18px_rgba(46,26,14,0.05)]",
            isRight ? "bg-[#cb6432] text-white" : "border border-[#ece2da] bg-white text-[#392d27]",
          ].join(" ")}
        >
          {message.message}
        </div>

        {message.attachments?.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.attachments.map((attachment) => (
              <a
                key={attachment.id}
                className="inline-flex cursor-pointer items-center rounded-full border border-[#eaded6] bg-[#f6f1ed] px-3 py-1 text-[11px] font-medium text-[#7c6f67] transition hover:border-[#cf6e38]/35 hover:bg-[#fff5ef]"
                href={attachment.url}
                rel="noreferrer"
                target="_blank"
              >
                {attachment.fileName}
              </a>
            ))}
          </div>
        ) : null}
      </div>

      {isRight ? (
        <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffd7c1] text-[11px] font-bold text-[#bc6431]">
          AD
        </span>
      ) : null}
    </div>
  );
}

export default function SupportConversationPanel({
  attachments,
  draftReply,
  internalNote,
  isSending,
  onAttachmentChange,
  onDraftReplyChange,
  onInternalNoteChange,
  onRemoveAttachment,
  onSendReply,
  ticket,
}) {
  return (
    <section className="overflow-hidden rounded-[18px] border border-[#ddd4cd] bg-white shadow-[0_12px_28px_rgba(56,33,17,0.05)]">
      <div className="border-b border-[#ece2da] bg-[linear-gradient(180deg,#fff8f3_0%,#ffffff_100%)] px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full bg-[#f3f0ed] px-3 py-1 text-[11px] font-medium text-[#8e8178]">
            Ticket Created: {formatReadableDate(ticket.createdAt)}
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#fff0e7] px-3 py-1 text-[11px] font-bold text-[#cf6e38]">
            <MessageSquareReply size={13} />
            Conversation Thread
          </div>
        </div>
      </div>

      <div className="space-y-6 px-5 py-5">
        {ticket.conversation?.length ? (
          ticket.conversation.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              requesterAvatarUrl={ticket.requester?.avatarUrl}
            />
          ))
        ) : (
          <div className="rounded-[14px] border border-dashed border-[#e2d6ce] bg-[#fbf8f6] px-4 py-10 text-center text-[15px] text-[#8d8077]">
            No conversation messages available for this ticket yet.
          </div>
        )}
      </div>

      <div className="border-t border-[#ece2da] bg-[#fcfaf8] px-5 py-5">
        <div className="rounded-[16px] border border-[#eadfd7] bg-white p-4 shadow-[0_8px_18px_rgba(46,26,14,0.04)]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[16px] font-bold text-[#241913]">Reply to ticket</p>
              <p className="text-[14px] leading-6 text-[#8b7e76]">
                {internalNote ? "This note stays visible to staff only." : "Send a clear update to the requester."}
              </p>
            </div>
            <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-[10px] border border-[#eadfd7] bg-[#faf6f2] px-3 text-[12px] font-bold text-[#6d6058] transition hover:border-[#cf6e38]/35 hover:bg-[#fff5ef]">
              <Paperclip size={14} />
              Attach
              <input className="hidden" multiple onChange={onAttachmentChange} type="file" />
            </label>
          </div>

          {attachments.length ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <DraftAttachmentChip
                  key={`${file.name}-${index}`}
                  filename={file.name}
                  onRemove={() => onRemoveAttachment(index)}
                />
              ))}
            </div>
          ) : null}

          <textarea
            className="min-h-[128px] w-full resize-none rounded-[14px] border border-[#ddd4cd] bg-[#fbfaf9] px-4 py-3 text-[15px] leading-8 text-[#2f241d] outline-none transition placeholder:text-[#b4a79f] focus:border-[#cf6e38] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
            onChange={(event) => onDraftReplyChange(event.target.value)}
            placeholder={internalNote ? "Write an internal note for the admin team..." : "Write your reply to the customer or vendor here..."}
            value={draftReply}
          />

          <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#6f645d]">
            <input
              checked={internalNote}
              className="h-4 w-4 cursor-pointer rounded border-[#d9ccc3] text-[#cf6e38] focus:ring-[#cf6e38]"
              onChange={(event) => onInternalNoteChange(event.target.checked)}
              type="checkbox"
            />
            Save as internal note
          </label>

          <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
            <button
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-[10px] border border-[#ddd2ca] bg-white px-4 text-[13px] font-bold text-[#2f241d] transition hover:bg-[#faf6f2]"
              onClick={() => {
                onDraftReplyChange("");
                onInternalNoteChange(false);
              }}
              type="button"
            >
              Clear
            </button>
            <button
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[10px] bg-[#cf6e38] px-4 text-[13px] font-bold text-white shadow-[0_10px_24px_rgba(207,110,56,0.18)] transition hover:bg-[#bc6030]"
              onClick={onSendReply}
              type="button"
            >
              <SendHorizonal size={14} />
              {isSending ? "Sending..." : internalNote ? "Save Note" : "Send Reply"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
