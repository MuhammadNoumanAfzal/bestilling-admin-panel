export default function CreateNotificationActionBar({ onCancel, onSaveDraft, onSend, disableSend = false }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
      <button
        className="inline-flex h-11 cursor-pointer items-center justify-center rounded-[10px] border border-[#d5ccc5] bg-white px-5 text-[14px] font-bold text-[#332822] transition hover:bg-[#faf6f2]"
        onClick={onCancel}
        type="button"
      >
        Cancel
      </button>
      <button
        className="inline-flex h-11 cursor-pointer items-center justify-center rounded-[10px] border border-[#d5ccc5] bg-white px-5 text-[14px] font-bold text-[#332822] transition hover:bg-[#faf6f2]"
        onClick={onSaveDraft}
        type="button"
      >
        Save as Draft
      </button>
      <button
        className={[
          "inline-flex h-11 items-center justify-center rounded-[10px] px-5 text-[14px] font-bold text-white shadow-[0_10px_24px_rgba(207,110,56,0.18)] transition",
          disableSend
            ? "cursor-not-allowed bg-[#e3b59b] shadow-none"
            : "cursor-pointer bg-[#cf6e38] hover:bg-[#bc6030]",
        ].join(" ")}
        disabled={disableSend}
        onClick={onSend}
        type="button"
      >
        Send Notification
      </button>
    </div>
  );
}
