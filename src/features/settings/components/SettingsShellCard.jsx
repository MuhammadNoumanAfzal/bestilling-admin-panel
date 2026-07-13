export default function SettingsShellCard({ children, className = "" }) {
  return (
    <section
      className={[
        "rounded-[18px] border border-[#ece3db] bg-white p-5 shadow-[0_10px_26px_rgba(57,33,17,0.06)]",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}
