import { vt, useVendorLanguage } from "../../utils/vendorTranslation.js";
import { useMemo, useState } from "react";
import MenuPreviewModal from "./MenuPreviewModal.jsx";
export { MenuPreviewModal };

const STATUS_TABS = [
  { label: "All", value: "all", active: true },
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

function normalizeText(value) {
  return `${value ?? ""}`.trim().toLowerCase();
}

function isAddOnMenu(menu) {
  const searchableValues = [
    menu?.type,
    menu?.productType,
    menu?.menuType,
    menu?.badge,
    menu?.category,
    menu?.title,
    menu?.description,
  ];
  const haystack = searchableValues.map(normalizeText).join(" ");

  return /\b(add[-_ ]?on|addon|extra|tillegg)\b/.test(haystack);
}

function buildTabs(items) {
  return STATUS_TABS.map((tab) => {
    const count = tab.value === "all"
      ? items.length
      : items.filter((item) => normalizeText(item.status) === tab.value).length;

    return {
      ...tab,
      label: `${tab.label} (${count})`,
      count,
    };
  });
}

function filterByTab(items, activeTab) {
  if (activeTab === "all") {
    return items;
  }

  return items.filter((item) => normalizeText(item.status) === activeTab);
}

function MenuTab({ tab, isActive, onClick }) {
  useVendorLanguage();
  return (
    <button
      className={[
        "inline-flex rounded-full px-3.5 py-1.5 text-[12px] font-bold transition",
        isActive ? "bg-[#d96834] text-white" : "border border-[#e6dad1] bg-white text-[#6f645d] hover:bg-[#fff4ec] hover:text-[#cf6e38]",
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      {vt(tab.label)}
    </button>
  );
}

function MenuCard({ menu, onView }) {
  useVendorLanguage();
  return (
    <article className="overflow-hidden rounded-[14px] border border-[#ddd6cf] bg-white shadow-[0_8px_20px_rgba(53,34,20,0.04)]">
      <div className="relative">
        <img alt={menu.title} className="h-36 w-full object-cover" src={menu.imageUrl} />
        <span className="absolute left-3 top-3 rounded-full bg-[#d96834] px-2.5 py-1 text-[10px] font-bold text-white">
          {vt(menu.status)}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#5f534b]">
          {vt(menu.badge)}
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
          <button
            className="text-[12px] font-bold text-[#8c7f76] transition hover:text-[#d96834]"
            onClick={() => onView(menu)}
            type="button"
          >{vt("View")}</button>
        </div>
      </div>
    </article>
  );
}

function MenuCollectionSection({ title, items, activeTab, onTabChange, onView }) {
  useVendorLanguage();
  const tabs = useMemo(() => buildTabs(items), [items]);
  const filteredItems = useMemo(() => filterByTab(items, activeTab), [activeTab, items]);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <span className="h-6 w-[4px] rounded-full bg-[#d96834]" />
        <h2 className="text-[22px] font-extrabold tracking-tight text-[#18120f]">{vt(title)}</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <MenuTab
            key={tab.value}
            isActive={activeTab === tab.value}
            onClick={() => onTabChange(tab.value)}
            tab={tab}
          />
        ))}
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filteredItems.map((menu) => (
            <MenuCard key={menu.id} menu={menu} onView={onView} />
          ))}
        </div>
      ) : (
        <div className="rounded-[14px] border border-dashed border-[#e6dad1] bg-white px-4 py-8 text-center text-[13px] font-semibold text-[#8a7f76]">
          {vt("No items found.")}
        </div>
      )}
    </section>
  );
}

export default function VendorPublishedMenusSection({ menus, onViewMenu }) {
  useVendorLanguage();
  const [activeMenuTab, setActiveMenuTab] = useState("all");
  const [activeAddOnTab, setActiveAddOnTab] = useState("all");
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedMenuDetail, setSelectedMenuDetail] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");

  const { addOns, publishedMenus } = useMemo(() => {
    const sourceMenus = Array.isArray(menus) ? menus : [];

    return {
      addOns: sourceMenus.filter(isAddOnMenu),
      publishedMenus: sourceMenus.filter((menu) => !isAddOnMenu(menu)),
    };
  }, [menus]);

  async function handleViewMenu(menu) {
    setSelectedMenu(menu);
    setSelectedMenuDetail(null);
    setDetailError("");
    setIsLoadingDetail(true);

    try {
      const detail = await onViewMenu(menu);
      setSelectedMenuDetail(detail);
    } catch (error) {
      setDetailError(error instanceof Error ? error.message : "Unable to load full menu details.");
    } finally {
      setIsLoadingDetail(false);
    }
  }

  function handleCloseModal() {
    setSelectedMenu(null);
    setSelectedMenuDetail(null);
    setDetailError("");
    setIsLoadingDetail(false);
  }

  return (
    <>
      <div className="space-y-8">
        <MenuCollectionSection
          activeTab={activeMenuTab}
          items={publishedMenus}
          onTabChange={setActiveMenuTab}
          onView={handleViewMenu}
          title="Published Menus"
        />

        <MenuCollectionSection
          activeTab={activeAddOnTab}
          items={addOns}
          onTabChange={setActiveAddOnTab}
          onView={handleViewMenu}
          title="Add-ons"
        />
      </div>

      <MenuPreviewModal
        errorMessage={detailError}
        isLoading={isLoadingDetail}
        menu={selectedMenuDetail || selectedMenu}
        onClose={handleCloseModal}
      />
    </>
  );
}
