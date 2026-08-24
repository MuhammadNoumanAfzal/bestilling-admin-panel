import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  approveVendorPayoutProfileRequest,
  requestVendorPayoutProfileChangesRequest,
} from "../../payouts/api/paymentsApi.js";
import {
  deactivateVendorRequest,
  deleteVendorRequest,
  getAdminVendorDetailRequest,
  getAdminVendorMenuDetailRequest,
  getVendorDocumentAccessRequest,
  updateVendorStatusRequest,
} from "../api/vendorsApi.js";
import VendorBusinessOverviewSection from "../components/details/VendorBusinessOverviewSection.jsx";
import VendorDangerZoneSection from "../components/details/VendorDangerZoneSection.jsx";
import VendorDetailHeader from "../components/details/VendorDetailHeader.jsx";
import VendorDetailStatCard from "../components/details/VendorDetailStatCard.jsx";
import VendorFinancialPerformanceSection from "../components/details/VendorFinancialPerformanceSection.jsx";
import VendorPublishedMenusSection from "../components/details/VendorPublishedMenusSection.jsx";
import VendorPayoutProfileSection from "../components/details/VendorPayoutProfileSection.jsx";
import VendorRecentOrdersSection from "../components/details/VendorRecentOrdersSection.jsx";
import VendorReviewsSection from "../components/details/VendorReviewsSection.jsx";
import VendorVerificationSection from "../components/details/VendorVerificationSection.jsx";

function LoadingState() {
  return (
    <div className="mx-auto max-w-6xl space-y-5 px-0 sm:space-y-6">
      <div className="h-44 animate-pulse rounded-[18px] border border-[#ddd6cf] bg-white" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-[16px] border border-[#ddd6cf] bg-white" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-[16px] border border-[#ddd6cf] bg-white" />
    </div>
  );
}

export default function VendorDetailPage() {
  const { vendorId } = useParams();
  const [activeSection, setActiveSection] = useState("overview");
  const [vendor, setVendor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSuspending, setIsSuspending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApprovingPayoutProfile, setIsApprovingPayoutProfile] = useState(false);
  const [isRequestingPayoutProfileChanges, setIsRequestingPayoutProfileChanges] = useState(false);
  const sectionRefs = useRef({});

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "menus", label: "Menus" },
    { id: "orders", label: "Orders" },
    { id: "earnings", label: "Earnings" },
    { id: "payout-profile", label: "Bank Profile" },
    { id: "reviews", label: "Reviews" },
    { id: "documents", label: "Documents" },
    { id: "admin-actions", label: "Admin Actions" },
  ];

  useEffect(() => {
    let isMounted = true;

    async function loadVendor() {
      setIsLoading(true);
      setLoadError("");

      try {
        const detail = await getAdminVendorDetailRequest(decodeURIComponent(vendorId || ""));

        if (isMounted) {
          setVendor(detail);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : "Unable to load this vendor.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadVendor();

    return () => {
      isMounted = false;
    };
  }, [vendorId]);

  function handleSectionChange(sectionId) {
    setActiveSection(sectionId);
    sectionRefs.current[sectionId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handlePreviewDocument(document) {
    try {
      const access = await getVendorDocumentAccessRequest(document.id);
      window.open(access.previewUrl || access.downloadUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to preview document",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    }
  }

  async function handleDownloadDocument(document) {
    try {
      const access = await getVendorDocumentAccessRequest(document.id);
      window.open(access.downloadUrl || access.previewUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to download document",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    }
  }

  async function handleViewMenu(menu) {
    return getAdminVendorMenuDetailRequest(menu.id);
  }

  async function handleSuspendVendor() {
    if (!vendor) {
      return;
    }

    const isReactivating = vendor.status === "Suspended" || vendor.status === "Deactivated";

    const result = await Swal.fire({
      title: isReactivating ? "Reactivate vendor?" : "Suspend vendor?",
      text: isReactivating
        ? `Restore ${vendor.name} to active marketplace status?`
        : `${vendor.name} will be hidden from listings and stop receiving new orders.`,
      input: "text",
      inputLabel: "Reason",
      inputPlaceholder: isReactivating ? "Issue resolved" : "Compliance issue",
      showCancelButton: true,
      confirmButtonText: isReactivating ? "Reactivate vendor" : "Suspend vendor",
      cancelButtonText: "Cancel",
      confirmButtonColor: isReactivating ? "#2b9e62" : "#d83f3f",
      cancelButtonColor: "#c8b9aa",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setIsSuspending(true);
      const response = isReactivating
        ? await updateVendorStatusRequest(vendor.id, "ACTIVE", result.value || "")
        : await deactivateVendorRequest(vendor.id, result.value || "");
      setVendor((current) =>
        current
          ? {
              ...current,
              status: response.status,
              rawStatus: response.rawStatus,
            }
          : current,
      );

      await Swal.fire({
        icon: "success",
        title: isReactivating ? "Vendor reactivated" : "Vendor suspended",
        text: response.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: isReactivating ? "Unable to reactivate vendor" : "Unable to suspend vendor",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsSuspending(false);
    }
  }

  async function handleDeactivateVendor() {
    if (!vendor) {
      return;
    }

    const result = await Swal.fire({
      title: "Deactivate vendor?",
      text: `This will deactivate ${vendor.name} while preserving historical records.`,
      input: "text",
      inputLabel: "Reason",
      inputPlaceholder: "Optional reason",
      showCancelButton: true,
      confirmButtonText: "Deactivate vendor",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d83f3f",
      cancelButtonColor: "#c8b9aa",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await deactivateVendorRequest(vendor.id, result.value || "");
      setVendor((current) =>
        current
          ? {
              ...current,
              status: response.status,
              rawStatus: response.rawStatus,
            }
          : current,
      );

      await Swal.fire({
        icon: "success",
        title: "Vendor deactivated",
        text: response.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to deactivate vendor",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleDeleteVendor() {
    if (!vendor) {
      return;
    }

    const result = await Swal.fire({
      title: "Delete vendor permanently?",
      text: `This will permanently remove ${vendor.name}. This cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: "Delete permanently",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d83f3f",
      cancelButtonColor: "#c8b9aa",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await deleteVendorRequest(vendor.id);
      await Swal.fire({
        icon: "success",
        title: "Vendor deleted",
        text: response.message,
        confirmButtonColor: "#cf6e38",
      });
      window.location.assign("/vendors");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to delete vendor",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleApprovePayoutProfile() {
    if (!vendor?.id || vendor?.payoutProfile?.bankDetailsVerified) {
      return;
    }

    const result = await Swal.fire({
      title: "Approve bank details",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <div>
            <label for="vendor-payout-approve-note" style="display:block;margin-bottom:6px;font-size:13px;font-weight:600;">Verification note</label>
            <textarea id="vendor-payout-approve-note" class="swal2-textarea" placeholder="Bank details verified and matched with company records." style="margin:0;width:100%;min-height:110px;"></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Approve bank details",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#cf6e38",
      cancelButtonColor: "#c8b9aa",
      preConfirm: () => ({
        verificationNote:
          document.getElementById("vendor-payout-approve-note")?.value?.trim() || "",
      }),
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setIsApprovingPayoutProfile(true);
      const response = await approveVendorPayoutProfileRequest(vendor.id, result.value || {});
      setVendor((current) =>
        current
          ? {
              ...current,
              payoutProfile: {
                ...current.payoutProfile,
                ...response.payoutProfile,
              },
            }
          : current,
      );

      await Swal.fire({
        icon: "success",
        title: "Bank details approved",
        text: response.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to approve bank details",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsApprovingPayoutProfile(false);
    }
  }

  async function handleRequestPayoutProfileChanges() {
    if (!vendor?.id) {
      return;
    }

    const result = await Swal.fire({
      title: "Request bank detail changes",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <div>
            <label for="vendor-payout-change-reason" style="display:block;margin-bottom:6px;font-size:13px;font-weight:600;">Reason</label>
            <textarea id="vendor-payout-change-reason" class="swal2-textarea" placeholder="Explain what the vendor needs to correct before payout can be verified." style="margin:0;width:100%;min-height:120px;"></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Request changes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#cf6e38",
      cancelButtonColor: "#c8b9aa",
      preConfirm: () => {
        const reason =
          document.getElementById("vendor-payout-change-reason")?.value?.trim() || "";

        if (!reason) {
          Swal.showValidationMessage("Please add a reason for the requested changes.");
          return null;
        }

        return { reason };
      },
    });

    if (!result.isConfirmed || !result.value?.reason) {
      return;
    }

    try {
      setIsRequestingPayoutProfileChanges(true);
      const response = await requestVendorPayoutProfileChangesRequest(vendor.id, result.value);
      setVendor((current) =>
        current
          ? {
              ...current,
              payoutProfile: {
                ...current.payoutProfile,
                ...response.payoutProfile,
              },
            }
          : current,
      );

      await Swal.fire({
        icon: "success",
        title: "Changes requested",
        text: response.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to request changes",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsRequestingPayoutProfileChanges(false);
    }
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (!vendor) {
    return (
      <div className="rounded-[16px] border border-[#efd7cc] bg-white px-5 py-10 text-center text-[15px] font-medium text-[#9f4d33]">
        {loadError || "Unable to load this vendor."}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 px-0 sm:space-y-6">
      {loadError ? (
        <div className="rounded-[16px] border border-[#efd7cc] bg-white px-5 py-8 text-center text-[15px] font-medium text-[#9f4d33]">
          {loadError}
        </div>
      ) : null}

      <VendorDetailHeader
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        sections={sections}
        vendor={vendor}
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {vendor.summaryStats.map((stat) => (
          <VendorDetailStatCard key={stat.id || stat.label} {...stat} />
        ))}
      </section>

      <div ref={(node) => { sectionRefs.current.overview = node; }} className="scroll-mt-6">
        <VendorBusinessOverviewSection overview={vendor.overview} />
      </div>

      <div ref={(node) => { sectionRefs.current.menus = node; }} className="scroll-mt-6">
        <VendorPublishedMenusSection menus={vendor.publishedMenus} onViewMenu={handleViewMenu} tabs={vendor.menuTabs} />
      </div>

      <div ref={(node) => { sectionRefs.current.orders = node; }} className="scroll-mt-6">
        <VendorRecentOrdersSection orders={vendor.recentOrders} />
      </div>

      <div ref={(node) => { sectionRefs.current.earnings = node; }} className="scroll-mt-6">
        <VendorFinancialPerformanceSection financial={vendor.financial} />
      </div>

      <div ref={(node) => { sectionRefs.current["payout-profile"] = node; }} className="scroll-mt-6">
        <VendorPayoutProfileSection
          isApproving={isApprovingPayoutProfile}
          isRequestingChanges={isRequestingPayoutProfileChanges}
          onApprove={handleApprovePayoutProfile}
          onRequestChanges={handleRequestPayoutProfileChanges}
          vendor={vendor}
        />
      </div>

      <div ref={(node) => { sectionRefs.current.reviews = node; }} className="scroll-mt-6">
        <VendorReviewsSection summary={vendor.reviewsSummary} />
      </div>

      <div ref={(node) => { sectionRefs.current.documents = node; }} className="scroll-mt-6">
        <VendorVerificationSection
          documents={vendor.documents}
          onDownload={handleDownloadDocument}
          onPreview={handlePreviewDocument}
        />
      </div>

      <div ref={(node) => { sectionRefs.current["admin-actions"] = node; }} className="scroll-mt-6">
        <VendorDangerZoneSection
          dangerZone={vendor.dangerZone}
          deleteLabel="Deactivate Vendor"
          isDeleting={isDeleting}
          isSuspending={isSuspending}
          onDelete={handleDeactivateVendor}
          onSuspend={handleSuspendVendor}
          suspendLabel={vendor.status === "Suspended" || vendor.status === "Deactivated" ? "Reactivate Account" : "Suspend Account"}
          vendorName={vendor.name}
        />
      </div>
    </div>
  );
}
