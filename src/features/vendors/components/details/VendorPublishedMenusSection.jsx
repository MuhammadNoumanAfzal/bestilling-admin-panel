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

function MenuCard({ menu, onView }) {
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
          <button
            className="text-[12px] font-bold text-[#8c7f76] transition hover:text-[#d96834]"
            onClick={() => onView(menu)}
            type="button"
          >
            View
          </button>
        </div>
      </div>
    </article>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="rounded-[18px] border border-[#efe4da] bg-[#fcfaf8] px-4 py-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#a19184]">{label}</p>
      <p className="mt-2 break-words text-[14px] font-semibold leading-6 text-[#241a14]">{value}</p>
    </div>
  );
}

function MenuPreviewModal({ errorMessage, isLoading, menu, onClose }) {
  if (!menu && !isLoading && !errorMessage) {
    return null;
  }

  const summaryDetails = [
    { label: "Menu ID", value: menu?.id || "Not provided" },
    { label: "Category", value: menu?.category || "Not provided" },
    { label: "Status", value: menu?.status || "Not provided" },
    { label: "Pricing Type", value: menu?.pricingType || "Not provided" },
    { label: "Base Price", value: menu?.price || "Not provided" },
    { label: "Tax Percent", value: menu?.taxPercent || "Not provided" },
    { label: "Minimum Guests", value: menu?.minimumGuests || "Not provided" },
    { label: "Lead Time Hours", value: menu?.minLeadTimeHours || "Not provided" },
    { label: "Lead Time Days", value: menu?.minLeadTimeDays || "Not provided" },
    { label: "Menu Type", value: menu?.menuType || "Not provided" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#170f0a]/50 px-4 py-6" onClick={onClose} role="presentation">
      <div
        aria-modal="true"
        className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[28px] bg-[#fffdfb] shadow-[0_30px_80px_rgba(45,28,16,0.2)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="max-h-[92vh] overflow-y-auto">
          <div className="border-b border-[#efe5dd] bg-[#f4eee8]">
            {menu?.primaryImageUrl ? (
              <img alt={menu.title} className="h-64 w-full object-cover sm:h-80 lg:h-[340px]" src={menu.primaryImageUrl} />
            ) : (
              <div className="flex h-64 items-center justify-center bg-[#f6f1ec] text-[14px] font-medium text-[#8b7d73] sm:h-80 lg:h-[340px]">
                No image available
              </div>
            )}
          </div>

          <div className="space-y-6 px-5 py-5 sm:px-7 sm:py-6 lg:px-8 lg:py-7">
            <div className="flex flex-col gap-4 border-b border-[#f1e7de] pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="rounded-full bg-[#d96834] px-2.5 py-1 text-[10px] font-bold text-white">
                    {menu?.status || "Loading"}
                  </span>
                  {menu?.badge ? (
                    <span className="rounded-full bg-[#f6eee8] px-2.5 py-1 text-[10px] font-bold text-[#6b5d54]">
                      {menu.badge}
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-3 text-[26px] font-extrabold tracking-[-0.04em] text-[#18120f] sm:text-[32px]">
                  {menu?.title || "Loading menu details"}
                </h3>
                <p className="mt-2 text-[14px] font-medium text-[#8a7f76]">{menu?.category || "Uncategorized"}</p>
              </div>
              <button
                aria-label="Close menu preview"
                className="self-start rounded-full border border-[#eadfd4] bg-white px-4 py-2 text-[12px] font-bold text-[#6f645d] transition hover:bg-[#faf4ee] hover:text-[#cf6e38]"
                onClick={onClose}
                type="button"
              >
                Close
              </button>
            </div>

            {isLoading ? (
              <div className="rounded-[22px] border border-[#eadfd4] bg-[#fcfaf8] px-4 py-12 text-center text-[14px] font-medium text-[#7b6d63]">
                Loading full menu details...
              </div>
            ) : errorMessage ? (
              <div className="rounded-[22px] border border-[#efd7cc] bg-white px-5 py-6 text-[14px] font-medium text-[#9f4d33]">
                {errorMessage}
              </div>
            ) : (
              <>
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
                  <section className="rounded-[24px] border border-[#efe4da] bg-white px-5 py-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a8d83]">Description</p>
                    <p className="mt-3 text-[14px] leading-7 text-[#5a4d46]">
                      {menu?.description || "No description available for this menu."}
                    </p>
                  </section>

                  <section className="rounded-[24px] border border-[#eadfd4] bg-[linear-gradient(180deg,#fff7f1_0%,#fcfaf8_100%)] px-5 py-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a8d83]">Menu Price</p>
                    <p className="mt-3 text-[30px] font-extrabold tracking-[-0.04em] text-[#18120f]">
                      {menu?.price || "Not provided"}
                    </p>
                    <div className="mt-5 grid gap-3">
                      <DetailRow label="Minimum Guests" value={menu?.minimumGuests || "Not provided"} />
                      <DetailRow label="Pricing Type" value={menu?.pricingType || "Not provided"} />
                    </div>
                  </section>
                </div>

                <section className="space-y-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9a8d83]">Menu Summary</p>
                    <h4 className="mt-2 text-[22px] font-extrabold tracking-[-0.03em] text-[#18120f]">Core Details</h4>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {summaryDetails.map((detail) => (
                      <DetailRow key={detail.label} label={detail.label} value={detail.value} />
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9a8d83]">Configuration</p>
                    <h4 className="mt-2 text-[22px] font-extrabold tracking-[-0.03em] text-[#18120f]">Tags And Availability</h4>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <DetailRow label="Food Types" value={menu?.foodTypes?.length ? menu.foodTypes.join(", ") : "Not provided"} />
                    <DetailRow label="Occasions" value={menu?.occasions?.length ? menu.occasions.join(", ") : "Not provided"} />
                    <DetailRow label="Dietary Tags" value={menu?.dietaryTags?.length ? menu.dietaryTags.join(", ") : "Not provided"} />
                    <DetailRow label="Contains" value={menu?.contains || "Not provided"} />
                    <DetailRow label="Available Days" value={menu?.availableDays?.length ? menu.availableDays.join(", ") : "Not provided"} />
                    <DetailRow
                      label="Availability Window"
                      value={
                        menu?.isAvailabilityWindowEnabled
                          ? `${menu.availableFrom || "?"} to ${menu.availableUntil || "?"}`
                          : "Disabled"
                      }
                    />
                    <DetailRow label="Blackout Dates" value={menu?.blackoutDates?.length ? menu.blackoutDates.join(", ") : "None"} />
                    <DetailRow
                      label="Single Staff Adjustable"
                      value={menu?.isAdjustableForSingleStaff ? "Yes" : "No"}
                    />
                  </div>
                </section>

                <section className="space-y-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9a8d83]">Composition</p>
                    <h4 className="mt-2 text-[22px] font-extrabold tracking-[-0.03em] text-[#18120f]">Ingredients</h4>
                  </div>
                  <div className="rounded-[24px] border border-[#eadfd4] bg-white px-5 py-5">
                    <p className="text-[14px] leading-7 text-[#241a14]">
                      {menu?.ingredients?.length ? menu.ingredients.join(", ") : "No ingredients provided."}
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9a8d83]">Included Items</p>
                    <h4 className="mt-2 text-[22px] font-extrabold tracking-[-0.03em] text-[#18120f]">Menu Items</h4>
                  </div>
                  <div className="space-y-4">
                    {menu?.menuItems?.length ? (
                      menu.menuItems.map((item, index) => (
                        <div
                          key={item.id || `${item.title}-${index}`}
                          className="rounded-[24px] border border-[#eadfd4] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(45,28,16,0.04)]"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-3">
                                <p className="text-[18px] font-bold tracking-[-0.02em] text-[#18120f]">{item.title}</p>
                                <span className="rounded-full bg-[#f6eee8] px-2.5 py-1 text-[10px] font-bold text-[#6b5d54]">
                                  Item {item.order || index + 1}
                                </span>
                              </div>
                              <p className="mt-3 text-[13px] leading-6 text-[#5a4d46]">
                                {item.description || "No item description provided."}
                              </p>
                            </div>
                            {item.imageUrl ? (
                              <img
                                alt={item.title}
                                className="h-28 w-full rounded-[18px] object-cover lg:h-24 lg:w-32"
                                src={item.imageUrl}
                              />
                            ) : null}
                          </div>

                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <DetailRow label="Allergens" value={item.allergens?.length ? item.allergens.join(", ") : "None"} />
                            <DetailRow label="Image URL" value={item.imageUrl || "Not provided"} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[24px] border border-[#eadfd4] bg-white px-5 py-5 text-[14px] text-[#5a4d46]">
                        No menu items provided.
                      </div>
                    )}
                  </div>
                </section>

                <section className="space-y-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9a8d83]">Extras</p>
                    <h4 className="mt-2 text-[22px] font-extrabold tracking-[-0.03em] text-[#18120f]">Optional Add-Ons</h4>
                  </div>
                  <div className="space-y-4">
                    {menu?.optionalAddOns?.length ? (
                      menu.optionalAddOns.map((addOn) => (
                        <div
                          key={addOn.id || addOn.name}
                          className="rounded-[24px] border border-[#eadfd4] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(45,28,16,0.04)]"
                        >
                          <p className="text-[17px] font-bold tracking-[-0.02em] text-[#18120f]">{addOn.name}</p>
                          <p className="mt-3 text-[14px] leading-7 text-[#5a4d46]">
                            {addOn.options?.length
                              ? addOn.options.map((option) => `${option.name}${option.price ? ` (${option.price})` : ""}`).join(", ")
                              : "No add-on options provided."}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[24px] border border-[#eadfd4] bg-white px-5 py-5 text-[14px] text-[#5a4d46]">
                        No optional add-ons provided.
                      </div>
                    )}
                  </div>
                </section>

                {menu?.galleryImages?.length ? (
                  <section className="space-y-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9a8d83]">Media</p>
                      <h4 className="mt-2 text-[22px] font-extrabold tracking-[-0.03em] text-[#18120f]">Gallery Images</h4>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {menu.galleryImages.map((image, index) => (
                        <div
                          key={image.id || index}
                          className="overflow-hidden rounded-[22px] border border-[#eadfd4] bg-white shadow-[0_10px_24px_rgba(45,28,16,0.04)]"
                        >
                          <img alt={`${menu.title} gallery ${index + 1}`} className="h-40 w-full object-cover" src={image.fileUrl} />
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VendorPublishedMenusSection({ menus, onViewMenu, tabs }) {
  const [activeTab, setActiveTab] = useState(() => tabs.find((tab) => tab.active)?.value || tabs[0]?.value || "all");
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedMenuDetail, setSelectedMenuDetail] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");

  const filteredMenus = useMemo(() => {
    if (activeTab === "active") {
      return menus.filter((menu) => menu.status === "Active");
    }

    if (activeTab === "draft") {
      return menus.filter((menu) => menu.status === "Draft");
    }

    return menus;
  }, [activeTab, menus]);

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
            <MenuCard key={menu.id} menu={menu} onView={handleViewMenu} />
          ))}
        </div>
      </section>

      <MenuPreviewModal
        errorMessage={detailError}
        isLoading={isLoadingDetail}
        menu={selectedMenuDetail || selectedMenu}
        onClose={handleCloseModal}
      />
    </>
  );
}
