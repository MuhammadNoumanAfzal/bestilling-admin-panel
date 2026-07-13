export default function QuickActionButton({ label, description, onClick }) {
  return (
    <button
      className="flex min-h-[72px] w-full flex-col items-start justify-center rounded-[10px] border border-[#ddd6cf] bg-[#faf8f6] px-4 py-4 text-left transition hover:border-[#d96834] hover:bg-white"
      onClick={onClick}
      type="button"
    >
      <span className="text-[14px] font-bold text-[#1e1712]">{label}</span>
      <span className="mt-1 text-[12px] leading-5 text-[#6f655e]">{description}</span>
    </button>
  );
}
