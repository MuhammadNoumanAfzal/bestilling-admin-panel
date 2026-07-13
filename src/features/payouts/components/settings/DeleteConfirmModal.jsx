import { AlertTriangle, Trash2, X } from "lucide-react";

export default function DeleteConfirmModal({ description, isOpen, onClose, onConfirm, title }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211713]/50 px-4 py-4 backdrop-blur-[4px]">
      <div className="w-full max-w-[460px] rounded-[24px] border border-[#ecdccf] bg-[linear-gradient(180deg,#fffdfa_0%,#fff7f1_100%)] shadow-[0_30px_80px_rgba(28,18,12,0.22)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#f1e2d8] px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#fff1e7] text-[#d15b42]">
              <AlertTriangle size={18} />
            </span>
            <div>
              <h2 className="text-[22px] font-bold tracking-[-0.03em] text-[#18120f]">{title}</h2>
              <p className="mt-1 text-[14px] leading-6 text-[#6f645d]">{description}</p>
            </div>
          </div>

          <button
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#efddd1] bg-white text-[#685b53] transition hover:border-[#cf6e38]/30 hover:bg-[#fff2ea] hover:text-[#cf6e38]"
            onClick={onClose}
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2.5 px-5 py-4">
          <button
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-[10px] border border-[#d5ccc5] bg-white px-4 text-[13px] font-semibold text-[#332822] transition hover:bg-[#faf6f2]"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#d15b42] px-4 text-[13px] font-semibold text-white transition hover:bg-[#bb4630]"
            onClick={onConfirm}
            type="button"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
