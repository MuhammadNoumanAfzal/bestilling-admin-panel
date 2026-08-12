import { useEffect, useMemo, useState } from "react";
import { RefreshCcw, Sparkles, Star, Store, UtensilsCrossed } from "lucide-react";
import Swal from "sweetalert2";
import {
  getAdminHomeCurationPageRequest,
  updateProductHomeCurationRequest,
  updateVendorHomeCurationRequest,
} from "../api/homeCurationApi.js";
import { mapHomeCurationPage } from "../api/homeCurationMappers.js";
import CurationCollectionSection from "../components/CurationCollectionSection.jsx";
import HomeCurationStatCard from "../components/HomeCurationStatCard.jsx";

const initialCollections = {
  popularVendors: [],
  featuredVendors: [],
  popularProducts: [],
};

const initialOptions = {
  vendors: [],
  products: [],
};

const initialSearch = {
  popularVendors: "",
  featuredVendors: "",
  popularProducts: "",
};

function matchesSearch(item, searchValue, kind) {
  const normalized = `${searchValue || ""}`.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  const fields =
    kind === "product"
      ? [item.name, item.description, item.vendor?.name]
      : [item.name, item.city];

  return fields.some((value) => `${value || ""}`.toLowerCase().includes(normalized));
}

function upsertById(items, nextItem) {
  const exists = items.some((item) => item.id === nextItem.id);
  return exists ? items.map((item) => (item.id === nextItem.id ? nextItem : item)) : [nextItem, ...items];
}

function isActiveProduct(item) {
  return `${item?.menuStatus || ""}`.trim().toLowerCase() === "active";
}

export default function HomeCurationPage() {
  const [collections, setCollections] = useState(initialCollections);
  const [options, setOptions] = useState(initialOptions);
  const [searchState, setSearchState] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [busyKey, setBusyKey] = useState("");

  async function loadPage({ silent = false } = {}) {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await getAdminHomeCurationPageRequest();
      const mapped = mapHomeCurationPage(response);
      setCollections(mapped.curated);
      setOptions(mapped.options);
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to load home curation",
        text:
          error?.message ||
          "Please connect the backend home-curation APIs and refresh this page again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadPage();
  }, []);

  const stats = useMemo(
    () => [
      {
        id: "popular-vendors",
        label: "Popular Vendors",
        value: collections.popularVendors.length,
        hint: "Shown in the client home page popular vendor section.",
        icon: Store,
        toneClass: "bg-[#d26e3c]",
      },
      {
        id: "featured-vendors",
        label: "Featured Vendors",
        value: collections.featuredVendors.length,
        hint: "Highlighted in the featured vendor row on the client.",
        icon: Star,
        toneClass: "bg-[#4e84d3]",
      },
      {
        id: "popular-products",
        label: "Popular Products",
        value: collections.popularProducts.length,
        hint: "Promoted products that appear on the client homepage.",
        icon: UtensilsCrossed,
        toneClass: "bg-[#3e9d69]",
      },
    ],
    [collections],
  );

  const filteredPopularVendorOptions = useMemo(() => {
    const selectedIds = new Set(collections.popularVendors.map((item) => item.id));
    return options.vendors
      .filter((item) => !selectedIds.has(item.id))
      .filter((item) => matchesSearch(item, searchState.popularVendors, "vendor"))
      .slice(0, 8);
  }, [collections.popularVendors, options.vendors, searchState.popularVendors]);

  const filteredFeaturedVendorOptions = useMemo(() => {
    const selectedIds = new Set(collections.featuredVendors.map((item) => item.id));
    return options.vendors
      .filter((item) => !selectedIds.has(item.id))
      .filter((item) => matchesSearch(item, searchState.featuredVendors, "vendor"))
      .slice(0, 8);
  }, [collections.featuredVendors, options.vendors, searchState.featuredVendors]);

  const filteredPopularProductOptions = useMemo(() => {
    const selectedIds = new Set(collections.popularProducts.map((item) => item.id));
    return options.products
      .filter(isActiveProduct)
      .filter((item) => !selectedIds.has(item.id))
      .filter((item) => matchesSearch(item, searchState.popularProducts, "product"))
      .slice(0, 8);
  }, [collections.popularProducts, options.products, searchState.popularProducts]);

  async function handleAddPopularVendor(item) {
    try {
      setBusyKey(`popular-vendor:add:${item.id}`);
      await updateVendorHomeCurationRequest(item.id, {
        isPopular: true,
        isFeatured: item.isFeatured,
      });
      setCollections((current) => ({
        ...current,
        popularVendors: upsertById(current.popularVendors, {
          ...item,
          isPopular: true,
        }),
      }));
      setOptions((current) => ({
        ...current,
        vendors: current.vendors.map((vendor) =>
          vendor.id === item.id ? { ...vendor, isPopular: true } : vendor,
        ),
      }));
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to mark vendor as popular",
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setBusyKey("");
    }
  }

  async function handleRemovePopularVendor(item) {
    try {
      setBusyKey(`popular-vendor:remove:${item.id}`);
      await updateVendorHomeCurationRequest(item.id, {
        isPopular: false,
        isFeatured: item.isFeatured,
      });
      setCollections((current) => ({
        ...current,
        popularVendors: current.popularVendors.filter((vendor) => vendor.id !== item.id),
      }));
      setOptions((current) => ({
        ...current,
        vendors: current.vendors.map((vendor) =>
          vendor.id === item.id ? { ...vendor, isPopular: false } : vendor,
        ),
      }));
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to remove popular vendor",
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setBusyKey("");
    }
  }

  async function handleAddFeaturedVendor(item) {
    try {
      setBusyKey(`featured-vendor:add:${item.id}`);
      await updateVendorHomeCurationRequest(item.id, {
        isPopular: item.isPopular,
        isFeatured: true,
      });
      setCollections((current) => ({
        ...current,
        featuredVendors: upsertById(current.featuredVendors, {
          ...item,
          isFeatured: true,
        }),
      }));
      setOptions((current) => ({
        ...current,
        vendors: current.vendors.map((vendor) =>
          vendor.id === item.id ? { ...vendor, isFeatured: true } : vendor,
        ),
      }));
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to mark vendor as featured",
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setBusyKey("");
    }
  }

  async function handleRemoveFeaturedVendor(item) {
    try {
      setBusyKey(`featured-vendor:remove:${item.id}`);
      await updateVendorHomeCurationRequest(item.id, {
        isPopular: item.isPopular,
        isFeatured: false,
      });
      setCollections((current) => ({
        ...current,
        featuredVendors: current.featuredVendors.filter((vendor) => vendor.id !== item.id),
      }));
      setOptions((current) => ({
        ...current,
        vendors: current.vendors.map((vendor) =>
          vendor.id === item.id ? { ...vendor, isFeatured: false } : vendor,
        ),
      }));
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to remove featured vendor",
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setBusyKey("");
    }
  }

  async function handleAddPopularProduct(item) {
    try {
      setBusyKey(`popular-product:add:${item.id}`);
      await updateProductHomeCurationRequest(item.id, { isPopular: true });
      setCollections((current) => ({
        ...current,
        popularProducts: upsertById(current.popularProducts, {
          ...item,
          isPopular: true,
        }),
      }));
      setOptions((current) => ({
        ...current,
        products: current.products.map((product) =>
          product.id === item.id ? { ...product, isPopular: true } : product,
        ),
      }));
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to mark product as popular",
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setBusyKey("");
    }
  }

  async function handleRemovePopularProduct(item) {
    try {
      setBusyKey(`popular-product:remove:${item.id}`);
      await updateProductHomeCurationRequest(item.id, { isPopular: false });
      setCollections((current) => ({
        ...current,
        popularProducts: current.popularProducts.filter((product) => product.id !== item.id),
      }));
      setOptions((current) => ({
        ...current,
        products: current.products.map((product) =>
          product.id === item.id ? { ...product, isPopular: false } : product,
        ),
      }));
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to remove popular product",
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setBusyKey("");
    }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-[#eaded3] bg-[linear-gradient(135deg,#fff6ef_0%,#fffdfa_50%,#f8fbff_100%)] p-6 shadow-[0_24px_60px_rgba(49,30,19,0.06)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[760px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eed7c8] bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#bf6739]">
              <Sparkles size={12} />
              Client homepage curation
            </div>
            <h1 className="mt-4 text-[34px] font-black tracking-[-0.05em] text-[#1b140f]">
              Home Curation
            </h1>
            <p className="mt-2 text-[15px] leading-7 text-[#6f645d]">
              Curate the homepage shelves the client app already renders for popular vendors,
              featured vendors, and popular products.
            </p>
          </div>

          <button
            className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-[#ddd2c8] bg-white px-5 text-[13px] font-bold text-[#3d322b] shadow-[0_12px_24px_rgba(49,30,19,0.04)] transition hover:bg-[#faf6f2] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isRefreshing}
            onClick={() => loadPage({ silent: true })}
            type="button"
          >
            <RefreshCcw size={15} />
            {isRefreshing ? "Refreshing..." : "Refresh data"}
          </button>
        </div>

        <div className="mt-6 grid gap-3 xl:grid-cols-3">
          {stats.map((item) => (
            <HomeCurationStatCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      {isLoading ? (
        <div className="grid gap-5">
          {[1, 2, 3].map((item) => (
            <div
              className="h-72 animate-pulse rounded-[24px] border border-[#eadfd6] bg-[#f7f2ed]"
              key={item}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-5">
          <CurationCollectionSection
            emptyState="No vendors are currently marked as popular."
            filteredOptions={filteredPopularVendorOptions}
            itemType="vendor"
            items={collections.popularVendors}
            onAdd={handleAddPopularVendor}
            onRemove={handleRemovePopularVendor}
            onSearchChange={(value) =>
              setSearchState((current) => ({ ...current, popularVendors: value }))
            }
            removeLabel={busyKey ? "Update flag" : "Remove Popular"}
            searchPlaceholder="Search vendors to add into Popular Vendors"
            searchValue={searchState.popularVendors}
            subtitle="These vendors feed the Popular Vendors row on the client homepage."
            title="Popular Vendors"
          />

          <CurationCollectionSection
            emptyState="No vendors are currently marked as featured."
            filteredOptions={filteredFeaturedVendorOptions}
            itemType="vendor"
            items={collections.featuredVendors}
            onAdd={handleAddFeaturedVendor}
            onRemove={handleRemoveFeaturedVendor}
            onSearchChange={(value) =>
              setSearchState((current) => ({ ...current, featuredVendors: value }))
            }
            removeLabel={busyKey ? "Update flag" : "Remove Featured"}
            searchPlaceholder="Search vendors to add into Featured Vendors"
            searchValue={searchState.featuredVendors}
            subtitle="These vendors feed the Featured Vendors row on the client homepage."
            title="Featured Vendors"
          />

          <CurationCollectionSection
            emptyState="No products are currently marked as popular."
            filteredOptions={filteredPopularProductOptions}
            itemType="product"
            items={collections.popularProducts}
            onAdd={handleAddPopularProduct}
            onRemove={handleRemovePopularProduct}
            onSearchChange={(value) =>
              setSearchState((current) => ({ ...current, popularProducts: value }))
            }
            removeLabel={busyKey ? "Update flag" : "Remove Popular"}
            searchPlaceholder="Search products to add into Popular Products"
            searchValue={searchState.popularProducts}
            subtitle="These products feed the Popular Products row on the client homepage."
            title="Popular Products"
          />
        </div>
      )}
    </div>
  );
}
