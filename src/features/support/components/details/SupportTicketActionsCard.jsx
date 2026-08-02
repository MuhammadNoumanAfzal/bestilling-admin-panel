import { LoaderCircle } from "lucide-react";
import { formatPriorityLabel, formatStatusLabel } from "../../supportUtils.js";

function ActionButton({ children, disabled = false, onClick, tone = "default" }) {
  const className =
    tone === "danger"
      ? "border-[#f0b8ab] bg-white text-[#d15b42] hover:bg-[#fff4f1]"
      : tone === "active"
        ? "border-transparent bg-[#cf6e38] text-white hover:bg-[#bc6030]"
        : "border-[#ddd2ca] bg-[#faf6f2] text-[#18120f] hover:border-[#cf6e38]/35 hover:bg-[#fff5ef]";

  return (
    <button
      className={`inline-flex h-10 w-full items-center justify-center rounded-[10px] border text-[12px] font-bold transition ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export default function SupportTicketActionsCard({
  assigneeName,
  canAssignToMe,
  isAssigning,
  isUpdatingPriority,
  isUpdatingStatus,
  onAssignToMe,
  onChangePriority,
  onCloseTicket,
  onReopen,
  onResolve,
  onSetInProgress,
  onUnassign,
  priority,
  priorityOptions,
  status,
}) {
  const priorityChoices = priorityOptions?.length
    ? priorityOptions
    : [
        { value: "LOW", label: "Low" },
        { value: "MEDIUM", label: "Medium" },
        { value: "HIGH", label: "High" },
        { value: "URGENT", label: "Urgent" },
      ];

  return (
    <section className="rounded-[18px] border border-[#eadcd3] bg-white p-3.5 shadow-[0_8px_20px_rgba(55,31,13,0.05)]">
      <div className="mb-3 rounded-[14px] bg-[linear-gradient(135deg,#fff7f2_0%,#fff4ec_50%,#fffdfa_100%)] px-4 py-3.5">
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#9b8f86]">Quick Actions</p>
        <p className="mt-1.5 text-[14px] leading-6 text-[#746861]">
          Keep the ticket moving by updating ownership, priority, and status without leaving the thread.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9b8f86]">Current State</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex rounded-full bg-[#fff1e6] px-3 py-1 text-[11px] font-bold text-[#cf6e38]">
              {formatStatusLabel(status)}
            </span>
            <span className="inline-flex rounded-full bg-[#f3f0ed] px-3 py-1 text-[11px] font-bold text-[#6f645d]">
              {formatPriorityLabel(priority)}
            </span>
          </div>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9b8f86]">Priority</span>
          <select
            className="h-10 cursor-pointer rounded-[10px] border border-[#ddd2ca] bg-white px-3 text-[13px] font-semibold text-[#2f241d] outline-none transition focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
            disabled={isUpdatingPriority}
            onChange={(event) => onChangePriority(event.target.value)}
            value={priority}
          >
            {priorityChoices.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-[14px] border border-[#efe2d8] bg-[#fcf8f5] px-3 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9b8f86]">Assignment</p>
          <p className="mt-2 text-[13px] font-semibold text-[#2f241d]">{assigneeName || "Unassigned"}</p>
          <div className="mt-3 grid gap-2">
            {canAssignToMe ? (
              <ActionButton disabled={isAssigning} onClick={onAssignToMe}>
                {isAssigning ? <LoaderCircle className="animate-spin" size={14} /> : "Assign To Me"}
              </ActionButton>
            ) : null}
            <ActionButton disabled={isAssigning || !assigneeName} onClick={onUnassign}>
              {isAssigning ? <LoaderCircle className="animate-spin" size={14} /> : "Remove Assignment"}
            </ActionButton>
          </div>
        </div>

        <div className="space-y-2">
          <ActionButton disabled={isUpdatingStatus || status === "IN_PROGRESS"} onClick={onSetInProgress} tone={status === "IN_PROGRESS" ? "active" : "default"}>
            {isUpdatingStatus ? <LoaderCircle className="animate-spin" size={14} /> : "Mark In Progress"}
          </ActionButton>
          <ActionButton disabled={isUpdatingStatus || status === "RESOLVED"} onClick={onResolve} tone={status === "RESOLVED" ? "active" : "default"}>
            {isUpdatingStatus ? <LoaderCircle className="animate-spin" size={14} /> : "Resolve Ticket"}
          </ActionButton>
          <ActionButton disabled={isUpdatingStatus || status === "CLOSED"} onClick={onCloseTicket} tone="danger">
            {isUpdatingStatus ? <LoaderCircle className="animate-spin" size={14} /> : "Close Ticket"}
          </ActionButton>
          <ActionButton disabled={isUpdatingStatus || status === "OPEN"} onClick={onReopen}>
            {isUpdatingStatus ? <LoaderCircle className="animate-spin" size={14} /> : "Reopen Ticket"}
          </ActionButton>
        </div>
      </div>
    </section>
  );
}
