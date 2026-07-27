import { useMemo, useState } from "react";

function MenuTab({ tab, isActive, onClick }) {
  return (
    <button
      className={[
        "inline-flex rounded-full px-3.5 py-1.5 text-[12px] font-bold transition",
        isActive ? "bg-[#d96834] text-white" : "border border-[#e6dad1] bg-white text-[#6f645d] hover:bg-[#fff4ec] hover:text-[#cf6e38]",
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      {tab.label}
    </button>
  );
}

function MenuCard({ menu }) {
  return (
    <article className="overflow-hidden rounded-[14px] border border-[#ddd6cf] bg-white shadow-[0_8px_20px_rgba(53,34,20,0.04)]">
      <div className="relative">
        <img alt={menu.title} className="h-36 w-full object-cover" src={menu.imageUrl} />
        <span className="absolute left-3 top-3 rounded-full bg-[#d96834] px-2.5 py-1 text-[10px] font-bold text-white">
          {menu.status}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#5f534b]">
          {menu.badge}
        </span>
      </div>
      <div className="space-y-2.5 p-4">
        <div>
          <h3 className="text-[16px] font-bold text-[#18120f]">{menu.title}</h3>
          <p className="mt-1 text-[12px] font-medium text-[#8a7f76]">{menu.category}</p>
        </div>
        <p className="text-[13px] leading-6 text-[#5a4d46]">{menu.description}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[15px] font-extrabold text-[#18120f]">{menu.price}</span>
          <button className="text-[12px] font-bold text-[#8c7f76] transition hover:text-[#d96834]" type="button">
            View
          </button>
        </div>
      </div>
    </article>
  );
}

export default function VendorPublishedMenusSection({ menus, tabs }) {
  const [activeTab, setActiveTab] = useState(() => tabs.find((tab) => tab.active)?.value || tabs[0]?.value || "all");

  const filteredMenus = useMemo(() => {
    if (activeTab === "active") {
      return menus.filter((menu) => menu.status === "Active");
    }

    if (activeTab === "draft") {
      return menus.filter((menu) => menu.status === "Draft");
    }

    return menus;
  }, [activeTab, menus]);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <span className="h-6 w-[4px] rounded-full bg-[#d96834]" />
        <h2 className="text-[22px] font-extrabold tracking-tight text-[#18120f]">
          Published Menus
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <MenuTab
            key={tab.value}
            isActive={activeTab === tab.value}
            onClick={() => setActiveTab(tab.value)}
            tab={tab}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filteredMenus.map((menu) => (
          <MenuCard key={menu.id} menu={menu} />
        ))}
      </div>
    </section>
  );
}
