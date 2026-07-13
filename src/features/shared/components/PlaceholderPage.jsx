export default function PlaceholderPage({ title }) {
  return (
    <section className="rounded-[14px] border border-[#ddd6cf] bg-white px-4 py-4 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <p className="type-para text-[#2f241d]">This is {title.toLowerCase()}.</p>
    </section>
  );
}
