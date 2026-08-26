function PaginationControls({ currentPage, onPageChange, totalItems, itemsPerPage }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-[#f0e6df] pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[12px] font-medium text-[#7c7068]">
        Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
      </p>

      <div className="flex items-center gap-2">
        <button
          className="inline-flex h-9 items-center justify-center rounded-[10px] border border-[#dfd3ca] bg-white px-3 text-[12px] font-bold text-[#3d312a] transition hover:bg-[#faf6f2] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          type="button"
        >
          Prev
        </button>

        <span className="inline-flex h-9 items-center justify-center rounded-[10px] bg-[#fff4ec] px-3 text-[12px] font-bold text-[#cf6e38]">
          {currentPage} / {totalPages}
        </span>

        <button
          className="inline-flex h-9 items-center justify-center rounded-[10px] border border-[#dfd3ca] bg-white px-3 text-[12px] font-bold text-[#3d312a] transition hover:bg-[#faf6f2] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function SearchResultCard({ item, itemType, onAdd }) {
  const secondaryText =
    itemType === "product"
      ? `${item.vendor?.name || "Unknown vendor"}${item.priceLabel ? ` - ${item.priceLabel}` : ""}`
      : `${item.city || "Unknown city"}${item.deliveryFeeLabel ? ` - ${item.deliveryFeeLabel}` : ""}`;

  return (
    <button
      className="flex w-full cursor-pointer items-center gap-3 rounded-[16px] border border-[#ece2da] bg-[#fffdfa] p-3 text-left transition hover:border-[#d8c6ba] hover:bg-white"
      onClick={() => onAdd(item)}
      type="button"
    >
      <img
        alt={item.name}
        className="h-16 w-16 rounded-[14px] object-cover"
        src={item.imageUrl || item.avatarUrl || "/heroBg.webp"}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-bold text-[#241912]">{item.name}</span>
        <span className="mt-1 block truncate text-[12px] text-[#7d7068]">{secondaryText}</span>
      </span>
      <span className="rounded-full bg-[#1f1712] px-3 py-1.5 text-[11px] font-bold text-white">
        Add
      </span>
    </button>
  );
}

function SelectedItemCard({ item, itemType, onRemove, removeLabel }) {
  return (
    <article className="overflow-hidden rounded-[18px] border border-[#eadfd6] bg-white shadow-[0_16px_35px_rgba(49,30,19,0.05)]">
      <img
        alt={item.name}
        className="h-40 w-full object-cover"
        src={item.imageUrl || item.avatarUrl || "/heroBg.webp"}
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-bold text-[#1f1711]">{item.name}</h3>
            <p className="mt-1 text-[12px] text-[#7e726a]">
              {itemType === "product"
                ? item.vendor?.name || "Unknown vendor"
                : item.city || "Unknown city"}
            </p>
          </div>
          {itemType === "product" ? (
            <span className="rounded-full bg-[#eef6ff] px-2.5 py-1 text-[11px] font-bold text-[#4d82cf]">
              {item.priceLabel || "Product"}
            </span>
          ) : (
            <span className="rounded-full bg-[#fff3ea] px-2.5 py-1 text-[11px] font-bold text-[#cf6e38]">
              {item.rating} star
            </span>
          )}
        </div>

        <p className="mt-3 line-clamp-2 min-h-[38px] text-[12px] leading-5 text-[#7a6d65]">
          {itemType === "product"
            ? item.description || "Popular product picked for homepage promotion."
            : item.deliveryFeeLabel || "Selected for homepage visibility."}
        </p>

        <button
          className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center rounded-[12px] border border-[#ead0c7] bg-[#fff5f1] px-4 text-[12px] font-bold text-[#c65c43] transition hover:bg-[#ffece5]"
          onClick={() => onRemove(item)}
          type="button"
        >
          {removeLabel}
        </button>
      </div>
    </article>
  );
}

export default function CurationCollectionSection({
  title,
  subtitle,
  items,
  itemsPage,
  onItemsPageChange,
  filteredOptions,
  optionsPage,
  onOptionsPageChange,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  onAdd,
  onRemove,
  itemType,
  emptyState,
  removeLabel,
}) {
  const SEARCH_RESULTS_PER_PAGE = 4;
  const SELECTED_ITEMS_PER_PAGE = 6;
  const paginatedOptions = filteredOptions.slice(
    (optionsPage - 1) * SEARCH_RESULTS_PER_PAGE,
    optionsPage * SEARCH_RESULTS_PER_PAGE,
  );
  const paginatedItems = items.slice(
    (itemsPage - 1) * SELECTED_ITEMS_PER_PAGE,
    itemsPage * SELECTED_ITEMS_PER_PAGE,
  );

  return (
    <section className="overflow-hidden rounded-[24px] border border-[#e6dad0] bg-white shadow-[0_20px_55px_rgba(49,30,19,0.06)]">
      <div className="border-b border-[#efe4dc] bg-[linear-gradient(135deg,#fff8f1_0%,#fffdfb_100%)] px-5 py-5">
        <h2 className="text-[21px] font-black tracking-[-0.04em] text-[#1f1712]">{title}</h2>
        <p className="mt-1 text-[13px] leading-6 text-[#72665f]">{subtitle}</p>

        <input
          className="mt-4 h-12 w-full rounded-[14px] border border-[#e4d6cb] bg-white px-4 text-[14px] text-[#221914] outline-none transition placeholder:text-[#a08d82] focus:border-[#ce6938] focus:shadow-[0_0_0_4px_rgba(206,105,56,0.10)]"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          value={searchValue}
        />

        {searchValue.trim() ? (
          <div className="mt-4">
            <div className="grid gap-3 md:grid-cols-2">
            {filteredOptions.length ? (
              paginatedOptions.map((item) => (
                <SearchResultCard
                  item={item}
                  itemType={itemType}
                  key={item.id}
                  onAdd={onAdd}
                />
              ))
            ) : (
              <div className="rounded-[16px] border border-dashed border-[#e6d7cc] bg-[#fffdfa] px-4 py-8 text-center text-[13px] font-medium text-[#7c6f67] md:col-span-2">
                No matching results found for this search.
              </div>
            )}
            </div>

            {filteredOptions.length ? (
              <PaginationControls
                currentPage={optionsPage}
                itemsPerPage={SEARCH_RESULTS_PER_PAGE}
                onPageChange={onOptionsPageChange}
                totalItems={filteredOptions.length}
              />
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="p-5">
        {items.length ? (
          <div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paginatedItems.map((item) => (
              <SelectedItemCard
                item={item}
                itemType={itemType}
                key={item.id}
                onRemove={onRemove}
                removeLabel={removeLabel}
              />
            ))}
            </div>

            <PaginationControls
              currentPage={itemsPage}
              itemsPerPage={SELECTED_ITEMS_PER_PAGE}
              onPageChange={onItemsPageChange}
              totalItems={items.length}
            />
          </div>
        ) : (
          <div className="rounded-[18px] border border-dashed border-[#e5d7ce] bg-[#fffdfa] px-4 py-10 text-center text-[14px] font-semibold text-[#726760]">
            {emptyState}
          </div>
        )}
      </div>
    </section>
  );
}
