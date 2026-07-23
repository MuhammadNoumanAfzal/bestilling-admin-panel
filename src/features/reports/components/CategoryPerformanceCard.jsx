import ReportsSectionCard from "./ReportsSectionCard.jsx";

function buildDonutGradient(categories) {
  let runningTotal = 0;
  const stops = categories.map((item) => {
    const start = runningTotal;
    runningTotal += item.value;
    return `${item.color} ${start}% ${runningTotal}%`;
  });

  return `conic-gradient(${stops.join(", ")})`;
}

export default function CategoryPerformanceCard({ categories }) {
  const donutBackground = buildDonutGradient(categories);
  const [primaryCategory, ...secondaryCategories] = categories;

  return (
    <ReportsSectionCard className="h-full p-6">
      <div className="flex h-full flex-col space-y-4">
        <div>
          <h2 className="text-[18px] font-extrabold tracking-[-0.04em] text-[#18120f] sm:text-[20px]">
            Category Performance
          </h2>
          <p className="text-[12px] font-medium text-[#8a7d74]">Market share by event type</p>
        </div>

        <div className="flex justify-center py-2">
          <div
            className="relative h-[200px] w-[200px] rounded-full"
            style={{ background: donutBackground }}
          >
            <div className="absolute inset-[42px] rounded-full bg-white" />
          </div>
        </div>

        <div className="mt-auto space-y-1">
          <p className="text-[14px] font-medium text-[#1f1711]">Main Revenue Source:</p>
          <p
            className="text-[18px] font-bold leading-7"
            style={{ color: primaryCategory?.color || "#ff8a1f" }}
          >
            {primaryCategory ? `${primaryCategory.label} (${primaryCategory.value}%)` : ""}
          </p>

          <p className="pt-1 text-[14px] font-medium text-[#1f1711]">Others:</p>
          <div className="space-y-1">
            {secondaryCategories.map((category) => (
              <p
                key={category.id}
                className="text-[16px] font-bold leading-8"
                style={{ color: category.color }}
              >
                {category.label} ({category.value}%)
              </p>
            ))}
          </div>
        </div>
      </div>
    </ReportsSectionCard>
  );
}
