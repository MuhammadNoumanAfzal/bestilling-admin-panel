import { ImagePlus } from "lucide-react";

export default function SettingsAvatarUploader() {
  return (
    <div className="flex shrink-0 flex-col items-start gap-2">
      <button
        className="inline-flex h-[72px] w-[72px] cursor-pointer items-center justify-center rounded-[12px] border border-dashed border-[#c7c0b9] bg-[#f7f4f1] text-[#9d948c] transition hover:border-[#d16737] hover:text-[#d16737]"
        type="button"
      >
        <ImagePlus size={24} />
      </button>
      <span className="text-[10px] font-medium text-[#9f948c]">Upload Avatar</span>
    </div>
  );
}
