function SkeletonLine({ className = "" }) {
  return <div className={`animate-pulse rounded-full bg-[#f2e7de] ${className}`.trim()} />;
}

function SkeletonCard() {
  return (
    <div className="rounded-[18px] border border-[#efe4db] bg-[linear-gradient(180deg,#fffdfa_0%,#fff7f1_100%)] p-4 shadow-[0_10px_26px_rgba(63,39,22,0.05)]">
      <SkeletonLine className="h-3.5 w-24" />
      <SkeletonLine className="mt-4 h-8 w-28 rounded-[12px]" />
      <SkeletonLine className="mt-4 h-3 w-36" />
      <SkeletonLine className="mt-2 h-3 w-24" />
    </div>
  );
}

function SkeletonRow({ columns = 6 }) {
  return (
    <div
      className="grid gap-3 border-b border-[#f2e7de] px-5 py-4"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <div key={index}>
          <SkeletonLine className={`h-3.5 ${index % 3 === 0 ? "w-24" : index % 3 === 1 ? "w-32" : "w-20"}`} />
          <SkeletonLine className={`mt-2 h-3 ${index % 2 === 0 ? "w-16" : "w-24"}`} />
        </div>
      ))}
    </div>
  );
}

export default function AdminLoadingState({
  title = "Loading data",
  description = "Fetching the latest records and preparing the table view.",
  rows = 5,
  columns = 6,
  cards = 0,
  showTable = true,
  className = "",
}) {
  return (
    <div className={`overflow-hidden ${className}`.trim()}>
      {cards > 0 ? (
        <div className="grid gap-3 border-b border-[#efe2d8] bg-[#fffaf6] p-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: cards }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : null}

      <div className="relative bg-[radial-gradient(circle_at_top,rgba(233,122,63,0.10),transparent_46%),linear-gradient(180deg,#fffdfa_0%,#ffffff_100%)] px-5 py-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(229,131,72,0.45),transparent)]" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <span className="inline-flex w-fit items-center rounded-full border border-[#f1d7c8] bg-[#fff3ea] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#cc6d39]">
              Syncing data
            </span>
            <div>
              <h3 className="text-[20px] font-extrabold text-[#211711]">{title}</h3>
              <p className="mt-1 max-w-[520px] text-[14px] leading-6 text-[#7d6f65]">{description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#f1ddd0] bg-white/90 px-3 py-2 shadow-[0_6px_20px_rgba(58,35,21,0.06)]">
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#de7b44] opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#cf6e38]" />
            </span>
            <span className="text-[12px] font-semibold text-[#6e6158]">Updating live results</span>
          </div>
        </div>
      </div>

      {showTable ? (
        <div className="bg-white">
          <div
            className="grid gap-3 border-b border-[#efe2d8] px-5 py-3"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, index) => (
              <SkeletonLine
                key={index}
                className={`h-3.5 ${index === columns - 1 ? "w-12" : index % 3 === 0 ? "w-20" : "w-24"}`}
              />
            ))}
          </div>

          <div>
            {Array.from({ length: rows }).map((_, index) => (
              <SkeletonRow key={index} columns={columns} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
