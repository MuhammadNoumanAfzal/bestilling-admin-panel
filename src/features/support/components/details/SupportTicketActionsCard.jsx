export default function SupportTicketActionsCard() {
  return (
    <section className="rounded-[16px] border border-[#ddd4cd] bg-white p-4 shadow-[0_8px_20px_rgba(55,31,13,0.05)]">
      <div className="space-y-2">
        <button
          className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-[10px] border border-[#ddd2ca] bg-[#faf6f2] text-[12px] font-bold text-[#2f241d] transition hover:border-[#cf6e38]/35 hover:bg-[#fff5ef]"
          type="button"
        >
          Resolve Ticket
        </button>
        <button
          className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-[10px] border border-[#f0b8ab] bg-white text-[12px] font-bold text-[#d15b42] transition hover:bg-[#fff4f1]"
          type="button"
        >
          Close Ticket
        </button>
      </div>
    </section>
  );
}
