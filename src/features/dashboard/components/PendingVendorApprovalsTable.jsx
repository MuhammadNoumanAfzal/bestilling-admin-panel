import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Check, X, ArrowUpRight } from "lucide-react";

const statusClasses = {
  Pending: "bg-[#fff7e7] text-[#c8881b] border border-[#fce9c0]",
  Reviewing: "bg-[#eef5fc] text-[#2e82cf] border border-[#cbe1f8]",
  Approved: "bg-[#edf8f1] text-[#2b9e62] border border-[#cbeed8]",
  Rejected: "bg-[#fff2f1] text-[#d83f3f] border border-[#fcd5d5]",
};

export default function PendingVendorApprovalsTable({ approvals, onUpdateStatus }) {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);

  useEffect(() => {
    setSelectedIds((current) =>
      current.filter((id) => approvals.some((approval) => approval.id === id))
    );
    setActiveMenuId((current) =>
      approvals.some((approval) => approval.id === current) ? current : null
    );
  }, [approvals]);

  // Toggle master checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(approvals.map((app) => app.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Toggle single checkbox
  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleActionClick = (id, newStatus) => {
    onUpdateStatus(id, newStatus);
    setActiveMenuId(null);
  };

  return (
    <section className="rounded-[14px] border border-[#ddd6cf] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <header className="mb-4 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-[18px] font-bold text-[#18120f]">Pending Vendor Approvals</h2>
          <p className="text-[13px] leading-6 text-[#6f645d]">
            Review and manage new vendor applications.
          </p>
        </div>
        <button
          onClick={() => navigate("/vendors")}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-[8px] border border-[#e6dad1] bg-white px-3.5 py-2 text-[13px] font-bold text-[#4d423b] transition hover:bg-[#faf5f1] hover:text-[#cf6e38]"
          type="button"
        >
          <span>View All Applications</span>
          <ArrowUpRight size={13} />
        </button>
      </header>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="border-b border-[#eee4dd] bg-[#fcfbfa] text-left">
              <th className="w-12 px-3 py-4 text-center">
                <input
                  type="checkbox"
                  checked={
                    approvals.length > 0 &&
                    selectedIds.length === approvals.length
                  }
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-[#d8ccc2] text-[#d96834] focus:ring-[#cf6e38] cursor-pointer"
                />
              </th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">
                Vendor Name
              </th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">
                Type
              </th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">
                Location
              </th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">
                Submitted
              </th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">
                Status
              </th>
              <th className="w-24 px-3 py-4 text-right text-[13px] font-bold text-[#9b8f86]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {approvals.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-10 text-center text-[14px] font-medium text-[#6f645d]"
                >
                  No vendor applications match the selected filter.
                </td>
              </tr>
            ) : null}

            {approvals.map((app) => {
              const isSelected = selectedIds.includes(app.id);
              const isMenuOpen = activeMenuId === app.id;

              return (
                <tr
                  key={app.id}
                  className={`border-b border-[#f1e9e2] last:border-b-0 transition hover:bg-[#faf9f8] ${
                    isSelected ? "bg-[#fffcf8]" : ""
                  }`}
                >
                  <td className="px-3 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRow(app.id)}
                      className="h-4 w-4 rounded border-[#d8ccc2] text-[#d96834] focus:ring-[#cf6e38] cursor-pointer"
                    />
                  </td>
                  <td className="px-3 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      {app.avatarUrl ? (
                        <img
                          src={app.avatarUrl}
                          alt={app.vendorName}
                          className="h-9 w-9 rounded-full object-cover border border-[#eee4dd]"
                        />
                      ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f6eee8] text-[10px] font-bold text-[#2f241d]">
                          {app.avatar}
                        </div>
                      )}
                      <span className="text-[15px] font-bold text-[#18120f]">
                        {app.vendorName}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-4 align-middle text-[15px] font-medium text-[#18120f]">
                    {app.type}
                  </td>
                  <td className="px-3 py-4 align-middle text-[15px] font-medium text-[#18120f]">
                    {app.location}
                  </td>
                  <td className="px-3 py-4 align-middle text-[15px] font-medium text-[#18120f]">
                    {app.submitted}
                  </td>
                  <td className="px-3 py-4 align-middle">
                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold leading-none ${
                        statusClasses[app.status] || statusClasses.Pending
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="relative px-3 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Inline quick actions if pending/reviewing */}
                      {(app.status === "Pending" || app.status === "Reviewing") && (
                        <>
                          <button
                            onClick={() => handleActionClick(app.id, "Approved")}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#edf8f1] text-[#2b9e62] transition hover:bg-[#2b9e62] hover:text-white cursor-pointer"
                            title="Approve Vendor"
                            type="button"
                          >
                            <Check size={14} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => handleActionClick(app.id, "Rejected")}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#fff2f1] text-[#d83f3f] transition hover:bg-[#d83f3f] hover:text-white cursor-pointer"
                            title="Reject Vendor"
                            type="button"
                          >
                            <X size={14} strokeWidth={2.5} />
                          </button>
                        </>
                      )}

                      {/* General actions dropdown toggle */}
                      <button
                        onClick={() =>
                          setActiveMenuId((prev) => (prev === app.id ? null : app.id))
                        }
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#6f655e] transition hover:bg-[#f1e9e2] hover:text-[#1f1711] cursor-pointer"
                        type="button"
                      >
                        <MoreVertical size={14} />
                      </button>
                    </div>

                    {/* Popover Actions Menu */}
                    {isMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-20"
                          onClick={() => setActiveMenuId(null)}
                        />
                        <div className="absolute right-3 top-10 z-30 w-44 rounded-[10px] border border-[#d8ccc2] bg-white py-1.5 shadow-[0_8px_24px_rgba(53,34,20,0.12)]">
                          <button
                            onClick={() => handleActionClick(app.id, "Pending")}
                            className="flex w-full items-center px-4 py-2 text-left text-[12px] font-semibold text-[#6f655e] transition hover:bg-[#faf5f1] hover:text-[#cf6e38] cursor-pointer"
                            type="button"
                          >
                            Set to Pending
                          </button>
                          <button
                            onClick={() => handleActionClick(app.id, "Reviewing")}
                            className="flex w-full items-center px-4 py-2 text-left text-[12px] font-semibold text-[#6f655e] transition hover:bg-[#faf5f1] hover:text-[#cf6e38] cursor-pointer"
                            type="button"
                          >
                            Set to Reviewing
                          </button>
                          <button
                            onClick={() => handleActionClick(app.id, "Approved")}
                            className="flex w-full items-center px-4 py-2 text-left text-[12px] font-semibold text-[#2b9e62] transition hover:bg-[#edf8f1] cursor-pointer"
                            type="button"
                          >
                            Approve Vendor
                          </button>
                          <button
                            onClick={() => handleActionClick(app.id, "Rejected")}
                            className="flex w-full items-center px-4 py-2 text-left text-[12px] font-semibold text-[#d83f3f] transition hover:bg-[#fff2f1] cursor-pointer"
                            type="button"
                          >
                            Reject Vendor
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
