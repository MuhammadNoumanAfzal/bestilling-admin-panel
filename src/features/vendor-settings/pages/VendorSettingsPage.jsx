import { useEffect, useMemo, useState } from "react";
import {
  AlarmClockPlus,
  ChefHat,
  LayoutList,
  RefreshCcw,
  ShieldAlert,
  Sparkles,
  Tags,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  deleteFoodTypeRequest,
  deleteOccasionRequest,
  deleteVendorCategoryRequest,
  getVendorSettingsTaxonomyRequest,
  saveAllergenRequest,
  saveFoodTypeRequest,
  saveOccasionRequest,
  saveVendorCategoryRequest,
} from "../api/vendorSettingsApi.js";
import { mapVendorSettingsTaxonomy } from "../api/vendorSettingsMappers.js";

const SECTION_CONFIG = [
  {
    key: "categories",
    singularLabel: "category",
    title: "Vendor Categories",
    subtitle: "Controls the main category picker vendors use when creating menus and add-ons.",
    icon: LayoutList,
    emptyLabel: "No vendor categories yet.",
    addLabel: "Add category",
    save: saveVendorCategoryRequest,
    remove: deleteVendorCategoryRequest,
    canDelete: true,
    color: "from-[#fff2e8] to-[#fffaf6]",
    accent: "bg-[#cf6e38]",
  },
  {
    key: "foodTypes",
    singularLabel: "food type",
    title: "Food Types",
    subtitle: "Shows up in vendor food type multi-selects and browse classification.",
    icon: ChefHat,
    emptyLabel: "No food types yet.",
    addLabel: "Add food type",
    save: saveFoodTypeRequest,
    remove: deleteFoodTypeRequest,
    canDelete: true,
    color: "from-[#eef6ff] to-[#f9fcff]",
    accent: "bg-[#4d86d9]",
  },
  {
    key: "occasions",
    singularLabel: "occasion",
    title: "Occasions",
    subtitle: "Lets vendors map menus to occasions like wedding, meeting, and party.",
    icon: AlarmClockPlus,
    emptyLabel: "No occasions yet.",
    addLabel: "Add occasion",
    save: saveOccasionRequest,
    remove: deleteOccasionRequest,
    canDelete: true,
    color: "from-[#eefbf3] to-[#fbfffd]",
    accent: "bg-[#3a9b63]",
  },
  {
    key: "allergens",
    singularLabel: "allergen",
    title: "Allergens",
    subtitle: "Used in vendor menu item allergen pickers so customers can review included allergens.",
    icon: ShieldAlert,
    emptyLabel: "No allergens yet.",
    addLabel: "Add allergen",
    save: saveAllergenRequest,
    remove: null,
    canDelete: false,
    color: "from-[#fff4f1] to-[#fffdfc]",
    accent: "bg-[#d8645d]",
  },
];

function StatCard({ icon: Icon, label, value, hint, toneClasses }) {
  return (
    <div className="rounded-[20px] border border-[#eadfd6] bg-white p-4 shadow-[0_18px_45px_rgba(49,30,19,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#9a8576]">
            {label}
          </p>
          <p className="mt-2 text-[30px] font-black tracking-[-0.05em] text-[#18120f]">{value}</p>
          <p className="mt-1 text-[12px] leading-5 text-[#786d66]">{hint}</p>
        </div>
        <span
          className={[
            "inline-flex h-12 w-12 items-center justify-center rounded-[16px] text-white",
            toneClasses,
          ].join(" ")}
        >
          <Icon size={18} />
        </span>
      </div>
    </div>
  );
}

function SectionCard({
  section,
  items,
  draftValue,
  savingKey,
  editingItemId,
  editingValue,
  onDraftChange,
  onCreate,
  onStartEdit,
  onEditingValueChange,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}) {
  const Icon = section.icon;
  const isSavingCreate = savingKey === `${section.key}:create`;

  return (
    <section className="overflow-hidden rounded-[24px] border border-[#e6dad0] bg-white shadow-[0_20px_55px_rgba(49,30,19,0.06)]">
      <div className={`bg-gradient-to-br ${section.color} px-5 py-5`}>
        <div className="flex items-start gap-4">
          <span
            className={[
              "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] text-white shadow-[0_12px_30px_rgba(49,30,19,0.14)]",
              section.accent,
            ].join(" ")}
          >
            <Icon size={18} />
          </span>
          <div className="min-w-0">
            <h2 className="text-[19px] font-black tracking-[-0.03em] text-[#201712]">
              {section.title}
            </h2>
            <p className="mt-1 max-w-[640px] text-[13px] leading-6 text-[#6f625b]">
              {section.subtitle}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <input
            className="h-12 flex-1 rounded-[14px] border border-white/70 bg-white/88 px-4 text-[14px] text-[#231913] outline-none transition placeholder:text-[#a28f82] focus:border-[#e8d5c6] focus:bg-white focus:shadow-[0_0_0_4px_rgba(206,105,56,0.10)]"
            onChange={(event) => onDraftChange(section.key, event.target.value)}
            placeholder={`Type a ${section.singularLabel} name`}
            value={draftValue}
          />
          <button
            className="inline-flex h-12 min-w-[156px] cursor-pointer items-center justify-center rounded-[14px] bg-[#1f1712] px-5 text-[13px] font-bold text-white transition hover:bg-[#34251d] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSavingCreate}
            onClick={() => onCreate(section)}
            type="button"
          >
            {isSavingCreate ? "Saving..." : section.addLabel}
          </button>
        </div>
      </div>

      <div className="p-5">
        {items.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((item) => {
              const isEditing = editingItemId === item.id;
              const isSavingEdit = savingKey === `${section.key}:edit:${item.id}`;
              const isDeleting = savingKey === `${section.key}:delete:${item.id}`;

              return (
                <div
                  className="rounded-[18px] border border-[#eee4dd] bg-[#fffdfa] p-4"
                  key={item.id}
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        autoFocus
                        className="h-11 w-full rounded-[12px] border border-[#dfd2c8] bg-white px-3.5 text-[14px] text-[#231913] outline-none transition focus:border-[#ce6938] focus:shadow-[0_0_0_4px_rgba(206,105,56,0.10)]"
                        onChange={(event) => onEditingValueChange(event.target.value)}
                        value={editingValue}
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="inline-flex h-10 cursor-pointer items-center justify-center rounded-[11px] bg-[#d16737] px-4 text-[12px] font-bold text-white transition hover:bg-[#c05c2f] disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={isSavingEdit}
                          onClick={() => onSaveEdit(section, item)}
                          type="button"
                        >
                          {isSavingEdit ? "Updating..." : "Save"}
                        </button>
                        <button
                          className="inline-flex h-10 cursor-pointer items-center justify-center rounded-[11px] border border-[#ddd1c8] bg-white px-4 text-[12px] font-bold text-[#40342d] transition hover:bg-[#faf6f2]"
                          onClick={onCancelEdit}
                          type="button"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-bold text-[#251b15]">{item.name}</p>
                        <p className="mt-1 text-[12px] leading-5 text-[#86786f]">{item.meta}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          className="inline-flex h-9 cursor-pointer items-center justify-center rounded-[10px] border border-[#dfd2c8] bg-white px-3 text-[12px] font-bold text-[#3e332c] transition hover:bg-[#faf6f2]"
                          onClick={() => onStartEdit(section.key, item)}
                          type="button"
                        >
                          Edit
                        </button>
                        {section.canDelete ? (
                          <button
                            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border border-[#f0d6d0] bg-[#fff6f4] text-[#c35d4c] transition hover:bg-[#ffece7] disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={isDeleting}
                            onClick={() => onDelete(section, item)}
                            type="button"
                          >
                            <Trash2 size={14} />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[18px] border border-dashed border-[#e6d8ce] bg-[#fffcfa] px-4 py-8 text-center">
            <p className="text-[14px] font-semibold text-[#6c6058]">{section.emptyLabel}</p>
          </div>
        )}

        {!section.canDelete ? (
          <p className="mt-4 text-[12px] leading-5 text-[#a0715b]">
            Allergens can be added and renamed here. Delete is hidden because the current backend
            API does not expose an allergen delete mutation.
          </p>
        ) : null}
      </div>
    </section>
  );
}

export default function VendorSettingsPage() {
  const [taxonomy, setTaxonomy] = useState({
    categories: [],
    foodTypes: [],
    occasions: [],
    allergens: [],
    dietaryTags: [],
  });
  const [drafts, setDrafts] = useState({
    categories: "",
    foodTypes: "",
    occasions: "",
    allergens: "",
  });
  const [editingState, setEditingState] = useState({
    sectionKey: "",
    itemId: "",
    value: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [savingKey, setSavingKey] = useState("");

  async function loadVendorSettings({ silent = false } = {}) {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const result = await getVendorSettingsTaxonomyRequest();
      setTaxonomy(mapVendorSettingsTaxonomy(result));
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to load vendor settings",
        text: error?.message || "Please refresh and try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadVendorSettings();
  }, []);

  const stats = useMemo(
    () => [
      {
        id: "categories",
        icon: LayoutList,
        label: "Categories",
        value: taxonomy.categories.length,
        hint: "Visible in vendor menu and add-on forms",
        toneClasses: "bg-[#d46f3d]",
      },
      {
        id: "foodTypes",
        icon: ChefHat,
        label: "Food Types",
        value: taxonomy.foodTypes.length,
        hint: "Used for browse and vendor menu classification",
        toneClasses: "bg-[#5b8fe0]",
      },
      {
        id: "occasions",
        icon: AlarmClockPlus,
        label: "Occasions",
        value: taxonomy.occasions.length,
        hint: "Shown in vendor occasion selectors",
        toneClasses: "bg-[#43a26d]",
      },
      {
        id: "allergens",
        icon: ShieldAlert,
        label: "Allergens",
        value: taxonomy.allergens.length,
        hint: "Attached to vendor menu items for customer clarity",
        toneClasses: "bg-[#d8645d]",
      },
    ],
    [taxonomy],
  );

  function updateDraft(sectionKey, value) {
    setDrafts((current) => ({
      ...current,
      [sectionKey]: value,
    }));
  }

  function startEditing(sectionKey, item) {
    setEditingState({
      sectionKey,
      itemId: item.id,
      value: item.name,
    });
  }

  function cancelEditing() {
    setEditingState({
      sectionKey: "",
      itemId: "",
      value: "",
    });
  }

  async function handleCreate(section) {
    const nextValue = String(drafts[section.key] || "").trim();

    if (!nextValue) {
      await Swal.fire({
        icon: "warning",
        title: "Missing value",
        text: `Please enter a name before adding a new ${section.singularLabel}.`,
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    try {
      setSavingKey(`${section.key}:create`);
      await section.save(nextValue);
      updateDraft(section.key, "");
      await loadVendorSettings({ silent: true });
      await Swal.fire({
        icon: "success",
        title: `${section.singularLabel} added`,
        text: `${nextValue} is now available on the vendor side.`,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: `Unable to add ${section.singularLabel}`,
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setSavingKey("");
    }
  }

  async function handleSaveEdit(section, item) {
    const nextValue = String(editingState.value || "").trim();

    if (!nextValue) {
      await Swal.fire({
        icon: "warning",
        title: "Missing value",
        text: "Please enter a name before saving your changes.",
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    try {
      setSavingKey(`${section.key}:edit:${item.id}`);
      await section.save({ id: item.id, name: nextValue });
      cancelEditing();
      await loadVendorSettings({ silent: true });
      await Swal.fire({
        icon: "success",
        title: "Updated",
        text: `${section.singularLabel} updated successfully.`,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to update item",
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setSavingKey("");
    }
  }

  async function handleDelete(section, item) {
    if (!section.remove) {
      return;
    }

    const result = await Swal.fire({
      title: `Delete ${item.name}?`,
      text: `This will remove it from future vendor selections.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d96834",
      cancelButtonColor: "#c6b7aa",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setSavingKey(`${section.key}:delete:${item.id}`);
      await section.remove(item.id);
      if (editingState.itemId === item.id) {
        cancelEditing();
      }
      await loadVendorSettings({ silent: true });
      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: `${item.name} has been removed.`,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to delete item",
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setSavingKey("");
    }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-[#eaded3] bg-[linear-gradient(135deg,#fff6ef_0%,#fffdfa_50%,#f8fbff_100%)] p-6 shadow-[0_24px_60px_rgba(49,30,19,0.06)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[760px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eed7c8] bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#bf6739]">
              <Sparkles size={12} />
              Vendor panel data controls
            </div>
            <h1 className="mt-4 text-[34px] font-black tracking-[-0.05em] text-[#1b140f]">
              Vendor Settings
            </h1>
            <p className="mt-2 text-[15px] leading-7 text-[#6f645d]">
              Manage the shared menu taxonomies vendors see while creating menus and add-ons.
              Changes saved here flow into the vendor panel through the same API-backed selectors.
            </p>
          </div>

          <button
            className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-[#ddd2c8] bg-white px-5 text-[13px] font-bold text-[#3d322b] shadow-[0_12px_24px_rgba(49,30,19,0.04)] transition hover:bg-[#faf6f2] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isRefreshing}
            onClick={() => loadVendorSettings({ silent: true })}
            type="button"
          >
            <RefreshCcw size={15} />
            {isRefreshing ? "Refreshing..." : "Refresh data"}
          </button>
        </div>

        <div className="mt-6 grid gap-3 xl:grid-cols-4">
          {stats.map((item) => (
            <StatCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-[#e6dad0] bg-white p-5 shadow-[0_20px_55px_rgba(49,30,19,0.05)]">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#f4f7fb] text-[#4f82d6]">
            <Tags size={18} />
          </span>
          <div className="min-w-0">
            <h2 className="text-[19px] font-black tracking-[-0.03em] text-[#201712]">
              Dietary Tags In Use
            </h2>
            <p className="mt-1 text-[13px] leading-6 text-[#6f625b]">
              The current backend exposes dietary tags as values stored on menus and add-ons, not
              as a separate CRUD taxonomy. These are the dietary tags already present in vendor
              content.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {taxonomy.dietaryTags.length ? (
            taxonomy.dietaryTags.map((tag) => (
              <span
                className="inline-flex items-center rounded-full border border-[#d8e4f7] bg-[#f3f8ff] px-3 py-1.5 text-[12px] font-semibold text-[#376ab4]"
                key={tag}
              >
                {tag}
              </span>
            ))
          ) : (
            <p className="text-[13px] font-medium text-[#7a6d64]">
              No dietary tags are currently present in saved vendor content.
            </p>
          )}
        </div>
      </section>

      {isLoading ? (
        <div className="grid gap-5">
          {SECTION_CONFIG.map((section) => (
            <div
              className="h-56 animate-pulse rounded-[24px] border border-[#eadfd6] bg-[#f7f2ed]"
              key={section.key}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-5">
          {SECTION_CONFIG.map((section) => (
            <SectionCard
              section={section}
              items={taxonomy[section.key]}
              draftValue={drafts[section.key]}
              savingKey={savingKey}
              editingItemId={editingState.sectionKey === section.key ? editingState.itemId : ""}
              editingValue={editingState.sectionKey === section.key ? editingState.value : ""}
              key={section.key}
              onCancelEdit={cancelEditing}
              onCreate={handleCreate}
              onDelete={handleDelete}
              onDraftChange={updateDraft}
              onEditingValueChange={(value) =>
                setEditingState((current) => ({
                  ...current,
                  value,
                }))
              }
              onSaveEdit={handleSaveEdit}
              onStartEdit={startEditing}
            />
          ))}
        </div>
      )}
    </div>
  );
}
