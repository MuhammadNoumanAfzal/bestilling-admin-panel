import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function MenuPreviewModal({ errorMessage, isLoading, menu, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const titleId = useId();
  const open = Boolean(menu || isLoading || errorMessage);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previousFocus?.isConnected) previousFocus.focus?.();
    };
  }, [open]);

  if (!open) return null;
  const image = menu?.primaryImageUrl || menu?.imageUrl;
  const tags = [...new Set([...(menu?.dietaryTags || []), ...(menu?.foodTypes || [])])];

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); closeRef.current(); }}
      onClick={(event) => { if (event.target === event.currentTarget) closeRef.current(); }}
      className="m-auto w-[calc(100%-2rem)] max-w-[560px] max-h-[88dvh] overflow-hidden rounded-[22px] border border-[#e7d9ce] bg-[#fffdfb] p-0 text-[#241a14] shadow-[0_24px_80px_rgba(35,21,12,0.3)] backdrop:bg-[#21150f]/55 backdrop:backdrop-blur-sm"
    >
      <div className="flex max-h-[88dvh] flex-col" onClick={(event) => event.stopPropagation()}>
        <header className="flex shrink-0 items-center justify-between border-b border-[#eee3db] px-5 py-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#957968]">Menu preview</span>
          <button autoFocus type="button" onClick={onClose} aria-label="Close menu preview" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5ece5] text-[#685449] hover:bg-[#ecd9ca] focus-visible:outline-2 focus-visible:outline-[#d46a37]">
            <X size={17} />
          </button>
        </header>
        <div className="min-h-0 overflow-y-auto overscroll-contain">
          {image && <img src={image} alt={menu?.title || "Menu"} className="h-36 w-full object-cover sm:h-44" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
          <div className="space-y-4 p-5">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#8a7162]">
                {menu?.category && <span>{menu.category}</span>}
                {menu?.status && <span className="rounded-full border border-[#e9d9cc] bg-[#faf1e9] px-2 py-0.5">{menu.status}</span>}
              </div>
              <h2 id={titleId} className="break-words text-[23px] font-extrabold leading-tight tracking-tight">{menu?.title || "Menu details"}</h2>
            </div>
            {isLoading ? <p role="status" className="py-6 text-center text-sm text-[#8a7162]">Loading menu details...</p> : errorMessage ? <p role="alert" className="rounded-xl bg-[#fff0eb] p-3 text-sm text-[#a1452d]">{errorMessage}</p> : <>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#efdaca] bg-[#fff3e9] px-4 py-3">
                <div><p className="text-[22px] font-extrabold text-[#b95729]">{menu?.price}</p>{menu?.pricingType && <p className="text-xs text-[#8a7162]">{menu.pricingType}</p>}</div>
                {Number(menu?.minimumGuests) > 0 && <p className="text-xs font-semibold text-[#685449]">Minimum {menu.minimumGuests} guests</p>}
              </div>
              {menu?.description && <p className="text-[13px] leading-6 text-[#6b5a4f]">{menu.description}</p>}
              {tags.length > 0 && <div className="flex flex-wrap gap-1.5">{tags.map((tag) => <span key={tag} className="rounded-md bg-[#f3eee8] px-2 py-1 text-[11px] text-[#776052]">{tag}</span>)}</div>}
              {menu?.ingredients?.length > 0 && <p className="text-xs leading-5 text-[#6b5a4f]"><strong>Ingredients: </strong>{menu.ingredients.join(", ")}</p>}
              {menu?.contains && <p className="text-xs leading-5 text-[#6b5a4f]"><strong>Contains: </strong>{menu.contains}</p>}
              {menu?.menuItems?.length > 0 && <section className="border-t border-[#eee3db] pt-4">
                <h3 className="mb-3 text-sm font-bold">Included items <span className="ml-1 font-normal text-[#998476]">({menu.menuItems.length})</span></h3>
                <div className="divide-y divide-[#eee3db]">{menu.menuItems.map((item, index) => <article key={item.id || index} className="flex gap-3 py-3 first:pt-0">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.title} loading="lazy" className="h-14 w-14 shrink-0 rounded-lg object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
                  <div className="min-w-0"><h4 className="text-[13px] font-bold">{item.title}</h4>{item.description && <p className="mt-1 text-xs leading-5 text-[#796659]">{item.description}</p>}{item.allergens?.length > 0 && <p className="mt-1.5 text-[11px] text-[#a35734]"><strong>Allergens: </strong>{item.allergens.join(", ")}</p>}</div>
                </article>)}</div>
              </section>}
              {menu?.optionalAddOns?.length > 0 && <section className="border-t border-[#eee3db] pt-4"><h3 className="mb-2 text-sm font-bold">Optional extras</h3>{menu.optionalAddOns.map((addOn, index) => <div key={addOn.id || index} className="py-2 text-xs"><p className="font-semibold">{addOn.name}</p>{addOn.options?.length > 0 && <p className="mt-1 leading-5 text-[#796659]">{addOn.options.map((option) => `${option.name}${option.price ? ` (${option.price})` : ""}`).join(", ")}</p>}</div>)}</section>}
            </>}
          </div>
        </div>
      </div>
    </dialog>, document.body,
  );
}
