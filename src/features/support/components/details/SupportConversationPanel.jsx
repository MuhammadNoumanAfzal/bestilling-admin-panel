function AttachmentChip({ filename }) {
  return (
    <button
      className="inline-flex cursor-pointer items-center rounded-full border border-[#eaded6] bg-[#f6f1ed] px-3 py-1 text-[11px] font-medium text-[#7c6f67] transition hover:border-[#cf6e38]/35 hover:bg-[#fff5ef]"
      type="button"
    >
      {filename}
    </button>
  );
}

function MessageBubble({ message }) {
  const isRight = message.side === "right";

  return (
    <div className={["flex gap-3", isRight ? "justify-end" : "justify-start"].join(" ")}>
      {!isRight ? (
        <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5d8c7] text-[11px] font-bold text-[#bc6431]">
          {message.author
            .split(" ")
            .slice(0, 2)
            .map((part) => part[0])
            .join("")}
        </span>
      ) : null}

      <div className={["max-w-[78%]", isRight ? "items-end" : "items-start", "flex flex-col"].join(" ")}>
        <div className={["mb-1 flex items-center gap-2 text-[11px] text-[#9a8d85]", isRight ? "justify-end" : ""].join(" ")}>
          <span className="font-semibold text-[#7d7068]">{message.author}</span>
          <span>{message.time}</span>
        </div>

        <div
          className={[
            "rounded-[16px] px-4 py-3 text-[13px] leading-6 shadow-[0_8px_18px_rgba(46,26,14,0.05)]",
            isRight ? "bg-[#cb6432] text-white" : "border border-[#ece2da] bg-white text-[#392d27]",
          ].join(" ")}
        >
          {message.message}
        </div>

        {message.attachments?.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.attachments.map((attachment) => (
              <AttachmentChip key={attachment} filename={attachment} />
            ))}
          </div>
        ) : null}
      </div>

      {isRight ? (
        <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffd7c1] text-[11px] font-bold text-[#bc6431]">
          AS
        </span>
      ) : null}
    </div>
  );
}

export default function SupportConversationPanel({ ticket }) {
  return (
    <section className="min-h-[520px] rounded-[16px] border border-[#ddd4cd] bg-white">
      <div className="border-b border-[#ece2da] px-5 py-4">
        <div className="inline-flex rounded-full bg-[#f3f0ed] px-3 py-1 text-[11px] font-medium text-[#8e8178]">
          Ticket Created: {ticket.createdAtExact}
        </div>
      </div>

      <div className="space-y-6 px-5 py-5">
        {ticket.conversation?.length ? (
          ticket.conversation.map((message) => <MessageBubble key={message.id} message={message} />)
        ) : (
          <div className="rounded-[14px] border border-dashed border-[#e2d6ce] bg-[#fbf8f6] px-4 py-10 text-center text-[14px] text-[#8d8077]">
            No conversation messages available for this ticket yet.
          </div>
        )}
      </div>
    </section>
  );
}
