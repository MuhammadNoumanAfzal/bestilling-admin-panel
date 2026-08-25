import { ImagePlus } from "lucide-react";

export default function SettingsAvatarUploader({
  avatarUrl,
  initials,
  onClick,
  isUpdating = false,
  isDisabled = false,
  disabledMessage = "",
}) {
  return (
    <div className="flex shrink-0 flex-col items-start gap-2">
      <button
        className="inline-flex h-[84px] w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-[16px] border border-dashed border-[#c7c0b9] bg-[#f7f4f1] text-[#9d948c] transition hover:border-[#d16737] hover:text-[#d16737] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isUpdating || isDisabled}
        onClick={onClick}
        title={isDisabled ? disabledMessage : "Update avatar"}
        type="button"
      >
        {avatarUrl ? (
          <img alt="Administrator avatar" className="h-full w-full object-cover" src={avatarUrl} />
        ) : initials ? (
          <span className="text-[24px] font-bold text-[#d16737]">{initials}</span>
        ) : (
          <ImagePlus size={26} />
        )}
      </button>
      <span className="max-w-[140px] text-[10px] font-medium leading-4 text-[#9f948c]">
        {isUpdating ? "Uploading..." : isDisabled ? disabledMessage : "Update Avatar"}
      </span>
    </div>
  );
}
