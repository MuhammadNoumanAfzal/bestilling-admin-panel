function MenuTab({ tab }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-[11px] font-bold",
        tab.active ? "bg-[#d96834] text-white" : "border border-[#e6dad1] bg-white text-[#6f645d]",
      ].join(" ")}
    >
      {tab.label}
    </span>
  );
}

function MenuCard({ menu }) {
  return (
    <article className="overflow-hidden rounded-[14px] border border-[#ddd6cf] bg-white shadow-[0_8px_20px_rgba(53,34,20,0.04)]">
      <div className="relative">
        <img alt={menu.title} className="h-32 w-full object-cover" src={menu.imageUrl} />
        <span className="absolute left-3 top-3 rounded-full bg-[#d96834] px-2 py-0.5 text-[9px] font-bold text-white">
          {menu.status}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold text-[#5f534b]">
          {menu.badge}
        </span>
      </div>
      <div className="space-y-2 p-3.5">
        <div>
          <h3 className="text-[13px] font-bold text-[#18120f]">{menu.title}</h3>
          <p className="mt-1 text-[11px] font-medium text-[#8a7f76]">{menu.category}</p>
        </div>
        <p className="text-[11px] leading-5 text-[#5a4d46]">{menu.description}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[13px] font-extrabold text-[#18120f]">{menu.price}</span>
          <button className="text-[11px] font-bold text-[#8c7f76] transition hover:text-[#d96834]" type="button">
            View
          </button>
        </div>
      </div>
    </article>
  );
}

export default function VendorPublishedMenusSection({ menus, tabs }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <span className="h-5 w-[3px] rounded-full bg-[#d96834]" />
        <h2 className="text-[18px] font-extrabold tracking-tight text-[#18120f]">
          Published Menus
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <MenuTab key={tab.value} tab={tab} />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {menus.map((menu) => (
          <MenuCard key={menu.id} menu={menu} />
        ))}
      </div>
    </section>
  );
}
