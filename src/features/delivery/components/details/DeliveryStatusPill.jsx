const statusClasses = {
  Active: "bg-[#e9fff0] text-[#219653]",
  Inactive: "bg-[#f1eeeb] text-[#7d7068]",
  Limited: "bg-[#fff1e7] text-[#cf6e38]",
};

export default function DeliveryStatusPill({ status }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold leading-none",
        statusClasses[status] || statusClasses.Active,
      ].join(" ")}
    >
      {status}
    </span>
  );
}
