export default function CreateNotificationSectionCard({ title, subtitle, children }) {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#d8d0ca] bg-white shadow-[0_10px_28px_rgba(53,34,20,0.06)]">
      <header className="border-b border-[#e9e1db] px-5 py-4">
        <h2 className="text-[20px] font-bold tracking-[-0.02em] text-[#2a1f18]">{title}</h2>
        {subtitle ? <p className="mt-1.5 text-[13px] leading-6 text-[#8d8077]">{subtitle}</p> : null}
      </header>
      <div className="px-5 py-5">{children}</div>
    </section>
  );
}
