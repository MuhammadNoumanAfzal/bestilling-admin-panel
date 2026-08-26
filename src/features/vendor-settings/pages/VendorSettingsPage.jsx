import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlarmClockPlus,
  ArrowDown,
  ArrowUp,
  Banknote,
  ChefHat,
  Clock3,
  Globe2,
  Languages,
  LayoutList,
  Leaf,
  RefreshCcw,
  ShieldAlert,
  Sparkles,
  Store,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  deleteBusinessTypeRequest,
  deleteCuisineTypeRequest,
  deleteCurrencyRequest,
  deleteDietaryTagRequest,
  deleteFoodTypeRequest,
  deleteLanguageRequest,
  deleteOccasionRequest,
  deleteTimeZoneRequest,
  deleteVendorCategoryRequest,
  getVendorSettingsTaxonomyRequest,
  saveAllergenRequest,
  saveBusinessTypeRequest,
  saveCuisineTypeRequest,
  saveCurrencyRequest,
  saveDietaryTagRequest,
  saveFoodTypeRequest,
  saveLanguageRequest,
  saveOccasionRequest,
  saveTimeZoneRequest,
  saveVendorCategoryRequest,
} from "../api/vendorSettingsApi.js";
import { mapVendorSettingsTaxonomy } from "../api/vendorSettingsMappers.js";

const SECTION_GROUPS = [
  {
    key: "menuTaxonomies",
    title: "Menu Taxonomies",
    subtitle: "Controls what vendors can pick while creating menus, add-ons, and menu items.",
    sectionKeys: ["categories", "foodTypes", "occasions", "allergens", "dietaryTags"],
  },
  {
    key: "vendorProfileMasterData",
    title: "Vendor Profile Master Data",
    subtitle:
      "Controls the approved options vendors can select for operating information and regional preferences.",
    sectionKeys: ["cuisineTypes", "businessTypes", "languages", "currencies", "timeZones"],
  },
];

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
    deleteKey: "id",
    canDelete: true,
    color: "from-[#fff2e8] to-[#fffaf6]",
    accent: "bg-[#cf6e38]",
    fields: [
      {
        key: "name",
        label: "Category Name",
        placeholder: "Buffet, Desserts, Drinks...",
        required: true,
        type: "text",
      },
    ],
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
    deleteKey: "id",
    canDelete: true,
    color: "from-[#eef6ff] to-[#f9fcff]",
    accent: "bg-[#4d86d9]",
    fields: [
      {
        key: "name",
        label: "Food Type Name",
        placeholder: "Italian, BBQ, Breakfast...",
        required: true,
        type: "text",
      },
    ],
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
    deleteKey: "id",
    canDelete: true,
    color: "from-[#eefbf3] to-[#fbfffd]",
    accent: "bg-[#3a9b63]",
    fields: [
      {
        key: "name",
        label: "Occasion Name",
        placeholder: "Wedding, Conference, Birthday...",
        required: true,
        type: "text",
      },
    ],
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
    deleteKey: "id",
    canDelete: false,
    color: "from-[#fff4f1] to-[#fffdfc]",
    accent: "bg-[#d8645d]",
    fields: [
      {
        key: "name",
        label: "Allergen Name",
        placeholder: "Gluten, Milk, Soy...",
        required: true,
        type: "text",
      },
    ],
  },
  {
    key: "dietaryTags",
    singularLabel: "dietary tag",
    title: "Dietary Tags",
    subtitle: "Controls the dietary tag choices vendors can assign to menus and add-ons.",
    icon: Leaf,
    emptyLabel: "No dietary tags yet.",
    addLabel: "Add dietary tag",
    save: saveDietaryTagRequest,
    remove: deleteDietaryTagRequest,
    deleteKey: "id",
    canDelete: true,
    color: "from-[#eefbf1] to-[#fbfffc]",
    accent: "bg-[#49a56b]",
    fields: [
      {
        key: "name",
        label: "Dietary Tag Name",
        placeholder: "Vegan, Halal, Gluten-Free...",
        required: true,
        type: "text",
      },
      {
        key: "sortOrder",
        label: "Sort Order",
        placeholder: "0",
        required: false,
        type: "number",
      },
      {
        key: "isActive",
        label: "Active",
        required: false,
        type: "checkbox",
      },
    ],
  },
  {
    key: "cuisineTypes",
    singularLabel: "cuisine type",
    title: "Cuisine Types",
    subtitle: "Controls the approved cuisine options in the vendor operating information panel.",
    icon: ChefHat,
    emptyLabel: "No cuisine types yet.",
    addLabel: "Add cuisine type",
    save: saveCuisineTypeRequest,
    remove: deleteCuisineTypeRequest,
    deleteKey: "id",
    canDelete: true,
    color: "from-[#fff5e8] to-[#fffdf7]",
    accent: "bg-[#d78938]",
    fields: [
      {
        key: "name",
        label: "Cuisine Type Name",
        placeholder: "Italian, Asian Fusion, Nordic...",
        required: true,
        type: "text",
      },
      {
        key: "sortOrder",
        label: "Sort Order",
        placeholder: "0",
        required: false,
        type: "number",
      },
      {
        key: "isActive",
        label: "Active",
        required: false,
        type: "checkbox",
      },
    ],
  },
  {
    key: "businessTypes",
    singularLabel: "business type",
    title: "Business Types",
    subtitle: "Controls the approved business type options vendors can choose from.",
    icon: Store,
    emptyLabel: "No business types yet.",
    addLabel: "Add business type",
    save: saveBusinessTypeRequest,
    remove: deleteBusinessTypeRequest,
    deleteKey: "id",
    canDelete: true,
    color: "from-[#eef5ff] to-[#fbfdff]",
    accent: "bg-[#527ec9]",
    fields: [
      {
        key: "name",
        label: "Business Type Name",
        placeholder: "Catering Company, Restaurant, Bakery...",
        required: true,
        type: "text",
      },
      {
        key: "sortOrder",
        label: "Sort Order",
        placeholder: "0",
        required: false,
        type: "number",
      },
      {
        key: "isActive",
        label: "Active",
        required: false,
        type: "checkbox",
      },
    ],
  },
  {
    key: "languages",
    singularLabel: "language",
    title: "Languages",
    subtitle: "Restricted to English and Norwegian to keep vendor-side language handling consistent.",
    icon: Languages,
    emptyLabel: "No supported languages configured yet.",
    addLabel: "Add language",
    save: saveLanguageRequest,
    remove: deleteLanguageRequest,
    deleteKey: "code",
    canDelete: false,
    canCreate: false,
    canEdit: false,
    color: "from-[#eefbf8] to-[#fcfffe]",
    accent: "bg-[#33a08b]",
    fields: [
      {
        key: "code",
        label: "Language Code",
        placeholder: "en, no, ur...",
        required: true,
        type: "text",
      },
      {
        key: "label",
        label: "Language Label",
        placeholder: "English, Norwegian, Urdu...",
        required: true,
        type: "text",
      },
      {
        key: "sortOrder",
        label: "Sort Order",
        placeholder: "0",
        required: false,
        type: "number",
      },
      {
        key: "isActive",
        label: "Active",
        required: false,
        type: "checkbox",
      },
    ],
  },
  {
    key: "currencies",
    singularLabel: "currency",
    title: "Currencies",
    subtitle: "Restricted to NOK so pricing, payouts, and reporting stay operationally consistent.",
    icon: Banknote,
    emptyLabel: "No supported currencies configured yet.",
    addLabel: "Add currency",
    save: saveCurrencyRequest,
    remove: deleteCurrencyRequest,
    deleteKey: "code",
    canDelete: false,
    canCreate: false,
    canEdit: false,
    color: "from-[#fff4ea] to-[#fffdf8]",
    accent: "bg-[#d67d43]",
    fields: [
      {
        key: "code",
        label: "Currency Code",
        placeholder: "NOK, USD, EUR...",
        required: true,
        type: "text",
      },
      {
        key: "label",
        label: "Currency Label",
        placeholder: "Norwegian Krone, US Dollar...",
        required: true,
        type: "text",
      },
      {
        key: "symbol",
        label: "Symbol",
        placeholder: "kr, $, €...",
        required: false,
        type: "text",
      },
      {
        key: "sortOrder",
        label: "Sort Order",
        placeholder: "0",
        required: false,
        type: "number",
      },
      {
        key: "isActive",
        label: "Active",
        required: false,
        type: "checkbox",
      },
    ],
  },
  {
    key: "timeZones",
    singularLabel: "time zone",
    title: "Time Zones",
    subtitle: "Controls the approved delivery and operating time-zone selections for vendors.",
    icon: Clock3,
    emptyLabel: "No time zones yet.",
    addLabel: "Add time zone",
    save: saveTimeZoneRequest,
    remove: deleteTimeZoneRequest,
    deleteKey: "value",
    canDelete: true,
    color: "from-[#f1f5ff] to-[#fbfcff]",
    accent: "bg-[#5b72d6]",
    fields: [
      {
        key: "value",
        label: "Time Zone Value",
        placeholder: "Europe/Oslo, UTC...",
        required: true,
        type: "text",
      },
      {
        key: "label",
        label: "Time Zone Label",
        placeholder: "(GMT+01:00) Europe/Oslo",
        required: true,
        type: "text",
      },
      {
        key: "utcOffset",
        label: "UTC Offset",
        placeholder: "+01:00",
        required: false,
        type: "text",
      },
      {
        key: "sortOrder",
        label: "Sort Order",
        placeholder: "0",
        required: false,
        type: "number",
      },
      {
        key: "isActive",
        label: "Active",
        required: false,
        type: "checkbox",
      },
    ],
  },
];

const SECTION_MAP = SECTION_CONFIG.reduce((accumulator, section) => {
  accumulator[section.key] = section;
  return accumulator;
}, {});

function normalizeString(value) {
  return String(value || "").trim();
}

function createEmptyDraft(section) {
  return section.fields.reduce((accumulator, field) => {
    accumulator[field.key] = field.type === "checkbox" ? true : "";
    return accumulator;
  }, {});
}

function createDraftState() {
  return SECTION_CONFIG.reduce((accumulator, section) => {
    accumulator[section.key] = createEmptyDraft(section);
    return accumulator;
  }, {});
}

function getItemInitialValues(section, item) {
  const raw = item?.raw || {};

  return section.fields.reduce((accumulator, field) => {
    if (field.type === "checkbox") {
      accumulator[field.key] = Boolean(raw[field.key]);
      return accumulator;
    }

    accumulator[field.key] = raw[field.key] == null ? "" : String(raw[field.key]);
    return accumulator;
  }, {});
}

function validateValues(section, values) {
  const missingField = section.fields.find(
    (field) =>
      field.required &&
      field.type !== "checkbox" &&
      !normalizeString(values[field.key]),
  );

  return missingField ? missingField.label : "";
}

function getCreateErrorMessage(section, error) {
  const rawMessage = String(error?.message || "").trim();
  const normalizedMessage = rawMessage.toLowerCase();

  if (
    section.key === "categories" &&
    (
      normalizedMessage.includes("not authorized") ||
      normalizedMessage.includes("not authorised") ||
      normalizedMessage.includes("permission denied")
    )
  ) {
    return "Category creation is being blocked by the backend permission for vendorCategoryMutation. Other taxonomy items can save, but categories need backend access updated for this admin action.";
  }

  return rawMessage || "Please try again.";
}

function buildPayload(section, values, item, options = {}) {
  const payload = {};
  const fallbackSortOrder = Number.isInteger(options?.fallbackSortOrder) ? options.fallbackSortOrder : 0;

  section.fields.forEach((field) => {
    const rawValue = values[field.key];

    if (field.type === "checkbox") {
      payload[field.key] = Boolean(rawValue);
      return;
    }

    if (field.type === "number") {
      const normalized = normalizeString(rawValue);
      if (normalized) {
        payload[field.key] = Number(normalized);
        return;
      }

      if (field.key === "sortOrder") {
        payload[field.key] = fallbackSortOrder;
        return;
      }

      payload[field.key] = null;
      return;
    }

    payload[field.key] = normalizeString(rawValue);
  });

  if (item?.raw?.id) {
    payload.id = item.raw.id;
  }

  return payload;
}

function getNextSortOrder(items = []) {
  const sortOrders = items
    .map((item) => Number(item?.raw?.sortOrder))
    .filter((value) => Number.isInteger(value));

  if (!sortOrders.length) {
    return 0;
  }

  return Math.max(...sortOrders) + 1;
}

function renderFieldInput({ field, value, onChange }) {
  if (field.type === "checkbox") {
    return (
      <label className="flex h-11 items-center gap-3 rounded-[12px] border border-[#dfd2c8] bg-white px-3.5 text-[13px] font-semibold text-[#312721]">
        <input
          checked={Boolean(value)}
          className="h-4 w-4 accent-[#cf6e38]"
          onChange={(event) => onChange(field.key, event.target.checked)}
          type="checkbox"
        />
        <span>{field.label}</span>
      </label>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8d7c70]">
        {field.label}
      </p>
      <input
        className="h-11 w-full rounded-[12px] border border-[#dfd2c8] bg-white px-3.5 text-[14px] text-[#231913] outline-none transition placeholder:text-[#a28f82] focus:border-[#ce6938] focus:shadow-[0_0_0_4px_rgba(206,105,56,0.10)]"
        onChange={(event) => onChange(field.key, event.target.value)}
        placeholder={field.placeholder}
        type={field.type === "number" ? "number" : "text"}
        value={value}
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, onClick, value, hint, toneClasses }) {
  return (
    <button
      className="w-full rounded-[20px] border border-[#eadfd6] bg-white p-4 text-left shadow-[0_18px_45px_rgba(49,30,19,0.05)] transition hover:-translate-y-0.5 hover:border-[#e0cdbf] hover:shadow-[0_22px_50px_rgba(49,30,19,0.08)]"
      onClick={onClick}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#9a8576]">
            {label}
          </p>
          <p className="mt-2 text-[26px] font-black tracking-[-0.05em] text-[#18120f] sm:text-[30px]">{value}</p>
          <p className="mt-1 text-[12px] leading-5 text-[#786d66]">{hint}</p>
        </div>
        <span
          className={[
            "inline-flex h-11 w-11 items-center justify-center rounded-[14px] text-white sm:h-12 sm:w-12 sm:rounded-[16px]",
            toneClasses,
          ].join(" ")}
        >
          <Icon size={18} />
        </span>
      </div>
    </button>
  );
}

function SectionCard({
  section,
  items,
  draftValues,
  savingKey,
  editingState,
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
      <div className={`bg-gradient-to-br ${section.color} px-4 py-4 sm:px-5 sm:py-5`}>
        <div className="flex items-start gap-4">
          <span
            className={[
              "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] text-white shadow-[0_12px_30px_rgba(49,30,19,0.14)] sm:h-12 sm:w-12 sm:rounded-[16px]",
              section.accent,
            ].join(" ")}
          >
            <Icon size={18} />
          </span>
          <div className="min-w-0">
            <h2 className="text-[17px] font-black tracking-[-0.03em] text-[#201712] sm:text-[19px]">
              {section.title}
            </h2>
            <p className="mt-1 max-w-[640px] text-[13px] leading-6 text-[#6f625b]">
              {section.subtitle}
            </p>
          </div>
        </div>

        {section.canCreate !== false ? (
          <>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {section.fields.map((field) => (
                <div className={field.type === "checkbox" ? "sm:self-end" : ""} key={field.key}>
                  {renderFieldInput({
                    field,
                    value: draftValues[field.key],
                    onChange: (fieldKey, value) => onDraftChange(section.key, fieldKey, value),
                  })}
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-stretch sm:justify-end">
              <button
                className="inline-flex h-12 w-full min-w-[156px] cursor-pointer items-center justify-center rounded-[14px] bg-[#1f1712] px-5 text-[13px] font-bold text-white transition hover:bg-[#34251d] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                disabled={isSavingCreate}
                onClick={() => onCreate(section)}
                type="button"
              >
                {isSavingCreate ? "Saving..." : section.addLabel}
              </button>
            </div>
          </>
        ) : (
          <div className="mt-5 rounded-[14px] border border-[#eadfd6] bg-white/80 px-4 py-3 text-[12px] leading-5 text-[#786b63]">
            This list is intentionally locked. Vendors can only use the approved platform options shown below.
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        {items.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((item) => {
              const isEditing =
                editingState.sectionKey === section.key && editingState.itemId === item.id;
              const isSavingEdit = savingKey === `${section.key}:edit:${item.id}`;
              const isDeleting = savingKey === `${section.key}:delete:${item.id}`;

              return (
                <div
                  className="rounded-[18px] border border-[#eee4dd] bg-[#fffdfa] p-4"
                  key={item.id}
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {section.fields.map((field) => (
                          <div key={field.key}>
                            {renderFieldInput({
                              field,
                              value: editingState.values[field.key],
                              onChange: onEditingValueChange,
                            })}
                          </div>
                        ))}
                      </div>
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
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-[15px] font-bold text-[#251b15]">
                            {item.name}
                          </p>
                          {item.raw?.isActive === false ? (
                            <span className="rounded-full border border-[#ead1c5] bg-[#fff1ea] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#bf6b42]">
                              Inactive
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-[12px] leading-5 text-[#86786f]">{item.meta}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 self-stretch sm:self-auto">
                        {section.canEdit !== false ? (
                          <button
                            className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[10px] border border-[#dfd2c8] bg-white px-3 text-[12px] font-bold text-[#3e332c] transition hover:bg-[#faf6f2] sm:flex-none"
                            onClick={() => onStartEdit(section.key, item)}
                            type="button"
                          >
                            Edit
                          </button>
                        ) : (
                          <span className="inline-flex h-9 items-center justify-center rounded-[10px] border border-[#e8ddd5] bg-[#faf7f4] px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#8d7d72]">
                            Locked
                          </span>
                        )}
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
            {section.key === "allergens"
              ? "Allergens can be added and renamed here. Delete is hidden because the current backend API does not expose an allergen delete mutation."
              : "This master data is intentionally locked so only approved platform options stay available to vendors."}
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
    cuisineTypes: [],
    businessTypes: [],
    languages: [],
    currencies: [],
    timeZones: [],
  });
  const [drafts, setDrafts] = useState(createDraftState);
  const [editingState, setEditingState] = useState({
    sectionKey: "",
    itemId: "",
    values: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [savingKey, setSavingKey] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(true);
  const sectionRefs = useRef({});

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
    window.scrollTo({ top: 0, behavior: "auto" });
    loadVendorSettings();
  }, []);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;

      setShowScrollTop(scrollTop > 320);
      setShowScrollDown(scrollTop < maxScrollTop - 320);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const stats = useMemo(
    () => [
      {
        id: "categories",
        icon: LayoutList,
        label: "Categories",
        value: taxonomy.categories.length,
        hint: "Menu and add-on grouping",
        toneClasses: "bg-[#d46f3d]",
      },
      {
        id: "foodTypes",
        icon: ChefHat,
        label: "Food Types",
        value: taxonomy.foodTypes.length,
        hint: "Browse and menu classification",
        toneClasses: "bg-[#5b8fe0]",
      },
      {
        id: "dietaryTags",
        icon: Leaf,
        label: "Dietary Tags",
        value: taxonomy.dietaryTags.length,
        hint: "Menu dietary tag selectors",
        toneClasses: "bg-[#49a56b]",
      },
      {
        id: "cuisineTypes",
        icon: Globe2,
        label: "Cuisine Types",
        value: taxonomy.cuisineTypes.length,
        hint: "Vendor operating info options",
        toneClasses: "bg-[#d78938]",
      },
      {
        id: "languages",
        icon: Languages,
        label: "Languages",
        value: taxonomy.languages.length,
        hint: "Vendor language choices",
        toneClasses: "bg-[#33a08b]",
      },
      {
        id: "currencies",
        icon: Banknote,
        label: "Currencies",
        value: taxonomy.currencies.length,
        hint: "Region and pricing preferences",
        toneClasses: "bg-[#d67d43]",
      },
      {
        id: "timeZones",
        icon: Clock3,
        label: "Time Zones",
        value: taxonomy.timeZones.length,
        hint: "Operating and delivery timing",
        toneClasses: "bg-[#5b72d6]",
      },
      {
        id: "businessTypes",
        icon: Store,
        label: "Business Types",
        value: taxonomy.businessTypes.length,
        hint: "Approved vendor business models",
        toneClasses: "bg-[#527ec9]",
      },
    ],
    [taxonomy],
  );

  function scrollToSection(sectionKey) {
    const target = sectionRefs.current[sectionKey];

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function scrollDown() {
    const orderedSections = SECTION_GROUPS.flatMap((group) => group.sectionKeys)
      .map((sectionKey) => sectionRefs.current[sectionKey])
      .filter(Boolean);

    const nextSection = orderedSections.find((section) => section.getBoundingClientRect().top > 140);

    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    window.scrollBy({
      top: window.innerHeight * 0.9,
      behavior: "smooth",
    });
  }

  function updateDraft(sectionKey, fieldKey, value) {
    setDrafts((current) => ({
      ...current,
      [sectionKey]: {
        ...current[sectionKey],
        [fieldKey]: value,
      },
    }));
  }

  function startEditing(sectionKey, item) {
    const section = SECTION_MAP[sectionKey];

    setEditingState({
      sectionKey,
      itemId: item.id,
      values: getItemInitialValues(section, item),
    });
  }

  function cancelEditing() {
    setEditingState({
      sectionKey: "",
      itemId: "",
      values: {},
    });
  }

  async function handleCreate(section) {
    const values = drafts[section.key];
    const missingField = validateValues(section, values);

    if (missingField) {
      await Swal.fire({
        icon: "warning",
        title: "Missing value",
        text: `Please complete ${missingField} before adding a new ${section.singularLabel}.`,
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    try {
      setSavingKey(`${section.key}:create`);
      await section.save(
        buildPayload(section, values, null, {
          fallbackSortOrder: getNextSortOrder(taxonomy[section.key]),
        }),
      );
      setDrafts((current) => ({
        ...current,
        [section.key]: createEmptyDraft(section),
      }));
      await loadVendorSettings({ silent: true });
      await Swal.fire({
        icon: "success",
        title: `${section.singularLabel} added`,
        text: `${section.title} now includes the new option on the vendor side.`,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: `Unable to add ${section.singularLabel}`,
        text: getCreateErrorMessage(section, error),
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setSavingKey("");
    }
  }

  async function handleSaveEdit(section, item) {
    const values = editingState.values;
    const missingField = validateValues(section, values);

    if (missingField) {
      await Swal.fire({
        icon: "warning",
        title: "Missing value",
        text: `Please complete ${missingField} before saving your changes.`,
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    try {
      setSavingKey(`${section.key}:edit:${item.id}`);
      await section.save(
        buildPayload(section, values, item, {
          fallbackSortOrder: Number.isInteger(item?.raw?.sortOrder) ? item.raw.sortOrder : 0,
        }),
      );
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
      text: "This will remove it from future vendor selections.",
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
      const deleteValue = item?.raw?.[section.deleteKey] || item.id;
      await section.remove(deleteValue);
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
    <div className="space-y-5 overflow-x-hidden">
      <section className="overflow-hidden rounded-[24px] border border-[#eaded3] bg-[linear-gradient(135deg,#fff6ef_0%,#fffdfa_50%,#f8fbff_100%)] p-4 shadow-[0_24px_60px_rgba(49,30,19,0.06)] sm:rounded-[28px] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[820px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eed7c8] bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#bf6739]">
              <Sparkles size={12} />
              Vendor panel data controls
            </div>
            <h1 className="mt-4 text-[28px] font-black tracking-[-0.05em] text-[#1b140f] sm:text-[34px]">
              Vendor Settings Master Data
            </h1>
            <p className="mt-2 text-[15px] leading-7 text-[#6f645d]">
              Manage both vendor menu taxonomies and vendor profile master data from one place.
              Changes saved here flow into the vendor panel through API-backed selectors for menus,
              operating information, and language or region preferences.
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

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <StatCard
              key={item.id}
              {...item}
              onClick={() => scrollToSection(item.id)}
            />
          ))}
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
        SECTION_GROUPS.map((group) => (
          <section
            className="rounded-[22px] border border-[#e7ddd4] bg-[#fffdfb] p-4 shadow-[0_20px_55px_rgba(49,30,19,0.05)] sm:rounded-[26px] sm:p-5"
            key={group.key}
          >
            <div className="mb-4 sm:mb-5">
              <h2 className="text-[20px] font-black tracking-[-0.04em] text-[#1d1510] sm:text-[24px]">
                {group.title}
              </h2>
              <p className="mt-1 text-[14px] leading-6 text-[#72675f]">{group.subtitle}</p>
            </div>

            <div className="grid gap-5">
              {group.sectionKeys.map((sectionKey) => {
                const section = SECTION_MAP[sectionKey];

                return (
                  <div
                    key={section.key}
                    ref={(node) => {
                      sectionRefs.current[section.key] = node;
                    }}
                    className="scroll-mt-24"
                  >
                    <SectionCard
                      section={section}
                      items={taxonomy[section.key]}
                      draftValues={drafts[section.key]}
                      savingKey={savingKey}
                      editingState={editingState}
                      onCancelEdit={cancelEditing}
                      onCreate={handleCreate}
                      onDelete={handleDelete}
                      onDraftChange={updateDraft}
                      onEditingValueChange={(fieldKey, value) =>
                        setEditingState((current) => ({
                          ...current,
                          values: {
                            ...current.values,
                            [fieldKey]: value,
                          },
                        }))
                      }
                      onSaveEdit={handleSaveEdit}
                      onStartEdit={startEditing}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}

      <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-3 sm:bottom-6 sm:right-6">
        {showScrollTop ? (
          <button
            aria-label="Back to top"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#d16737] text-white shadow-[0_18px_36px_rgba(209,103,55,0.28)] transition hover:-translate-y-0.5 hover:bg-[#bd592b] sm:h-12 sm:w-12"
            onClick={scrollToTop}
            type="button"
          >
            <ArrowUp size={18} />
          </button>
        ) : null}

        {showScrollDown ? (
          <button
            aria-label="Scroll down"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#d16737] text-white shadow-[0_18px_36px_rgba(209,103,55,0.28)] transition hover:translate-y-0.5 hover:bg-[#bd592b] sm:h-12 sm:w-12"
            onClick={scrollDown}
            type="button"
          >
            <ArrowDown size={18} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
