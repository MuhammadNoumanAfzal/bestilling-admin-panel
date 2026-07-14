import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";

const statusClasses = {
  Active: "bg-[#2b9e62] text-white",
  Blocked: "bg-[#d83f3f] text-white",
};

function PersonCell({ name, src, email, avatar }) {
  return (
    <div className="flex items-center gap-2.5">
      {src ? (
        <img
          alt={name}
          className="h-9 w-9 shrink-0 rounded-full object-cover border border-[#eee4dd]"
          src={src}
        />
      ) : (
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f6eee8] text-[10px] font-bold text-[#2f241d]">
          {avatar}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-[14px] font-bold leading-5 text-[#18120f]">{name}</p>
        <p className="truncate text-[11px] text-[#5a4d46]">{email}</p>
      </div>
    </div>
  );
}

export default function CustomersTable({
  currentPage,
  onPageChange,
  pageSize,
  rows,
  totalItems,
}) {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(rows.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const buildPaginationItems = () => {
    const items = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      if (currentPage <= 3) {
        items.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        items.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        items.push(1, "...", currentPage, "...", totalPages);
      }
    }
    return items;
  };

  const paginationItems = buildPaginationItems();

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#d9cdc4] bg-white shadow-[0_10px_22px_rgba(56,33,17,0.04)] m-4">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead className="border-b border-[#eee4dd] bg-[#fcfbfa]">
            <tr className="text-left">
              <th className="w-10 px-2 py-4 text-center">
                <input
                  type="checkbox"
                  checked={rows.length > 0 && selectedIds.length === rows.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-[#d8ccc2] text-[#d96834] focus:ring-[#cf6e38] cursor-pointer"
                />
              </th>
              <th className="px-2 py-4 text-[13px] font-bold text-[#9b8f86] w-32">Customer ID</th>
              <th className="px-2 py-4 text-[13px] font-bold text-[#9b8f86] w-52">Customer</th>
              <th className="px-2 py-4 text-[13px] font-bold text-[#9b8f86]">Phone</th>
              <th className="px-2 py-4 text-[13px] font-bold text-[#9b8f86]">City</th>
              <th className="px-2 py-4 text-[13px] font-bold text-[#9b8f86] text-center">Total Orders</th>
              <th className="px-2 py-4 text-[13px] font-bold text-[#9b8f86]">Amount</th>
              <th className="px-2 py-4 text-[13px] font-bold text-[#9b8f86]">Status</th>
              <th className="w-16 px-2 py-4 text-center text-[13px] font-bold text-[#9b8f86]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-[15px] font-medium text-[#6f645d]" colSpan={9}>
                  No customers match the current filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const isSelected = selectedIds.includes(row.id);
                const isMenuOpen = activeMenuId === row.id;

                return (
                  <tr
                    key={row.id}
                    className={`border-b border-[#f1e9e2] last:border-b-0 transition hover:bg-[#faf9f8] ${
                      isSelected ? "bg-[#fffcf8]" : ""
                    }`}
                  >
                    <td className="px-2 py-4 text-center align-middle">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(row.id)}
                        className="h-4 w-4 rounded border-[#d8ccc2] text-[#d96834] focus:ring-[#cf6e38] cursor-pointer"
                      />
                    </td>
                    <td className="px-2 py-4 text-[15px] font-bold text-[#18120f] align-middle">
                      <button
                        onClick={() => navigate(`/customers/${encodeURIComponent(row.id.replace("#", ""))}`)}
                        className="text-[#d96834] hover:underline cursor-pointer font-bold outline-none text-left"
                      >
                        {row.id}
                      </button>
                    </td>
                    <td className="px-2 py-4 align-middle">
                      <PersonCell
                        avatar={row.avatar}
                        name={row.name}
                        src={row.avatarUrl}
                        email={row.email}
                      />
                    </td>
                    <td className="px-2 py-4 text-[15px] text-[#5a4d46] align-middle">
                      {row.phone}
                    </td>
                    <td className="px-2 py-4 text-[15px] text-[#5a4d46] align-middle">
                      {row.city}
                    </td>
                    <td className="px-2 py-4 text-[15px] text-[#18120f] font-semibold align-middle text-center">
                      {row.totalOrders}
                    </td>
                    <td className="px-2 py-4 text-[15px] font-bold text-[#18120f] align-middle">
                      {row.amount}
                    </td>
                    <td className="px-2 py-4 align-middle">
                      <span
                        className={`inline-flex min-w-[76px] justify-center rounded-full px-2.5 py-1 text-[11px] font-bold leading-none ${
                          statusClasses[row.status] || "bg-[#fcfbfa] text-[#6f655e]"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="relative px-2 py-4 text-center align-middle">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === row.id ? null : row.id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#6f655e] transition hover:bg-[#f1e9e2] hover:text-[#1f1711] cursor-pointer"
                        type="button"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {isMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setActiveMenuId(null)} />
                          <div className="absolute right-4 top-10 z-30 w-36 rounded-[8px] border border-[#d8ccc2] bg-white py-1 shadow-[0_6px_16px_rgba(53,34,20,0.1)] text-left">
                            <button
                              onClick={() => {
                                navigate(`/customers/${encodeURIComponent(row.id.replace("#", ""))}`);
                                setActiveMenuId(null);
                              }}
                              className="block w-full px-3 py-1.5 text-[12px] font-semibold text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38] cursor-pointer"
                              type="button"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                alert(`Toggle active/blocked for ${row.name}`);
                                setActiveMenuId(null);
                              }}
                              className="block w-full px-3 py-1.5 text-[12px] font-semibold text-[#6f655e] hover:bg-[#faf5f1] hover:text-[#cf6e38] cursor-pointer"
                              type="button"
                            >
                              Toggle Status
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center border-t border-[#eee4dd] px-4 py-3 bg-[#fcfbfa]">
        <button
          onClick={() => alert("Viewing all customer lists")}
          className="inline-flex cursor-pointer items-center justify-center text-[13px] font-bold text-[#cf6e38] transition hover:underline outline-none"
          type="button"
        >
          View all
        </button>
      </div>

      {/* Pagination controls */}
      <footer className="flex flex-col items-center justify-between gap-4 border-t border-[#eee4dd] bg-[#fcfbfa] px-6 py-4 sm:flex-row">
        <p className="text-[13px] font-semibold text-[#6f645d]">
          Showing {start} - {end} of {totalItems} Customers
        </p>

        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#d8ccc2] bg-white text-[#4d423b] transition hover:bg-[#faf5f1] disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
            type="button"
          >
            <ChevronLeft size={14} />
          </button>

          {paginationItems.map((item, idx) => {
            const isCurrent = item === currentPage;
            if (item === "...") {
              return (
                <span key={idx} className="px-1 text-[13px] text-[#9b8f86]">
                  ...
                </span>
              );
            }
            return (
              <button
                key={idx}
                onClick={() => onPageChange(item)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[13px] font-bold transition cursor-pointer ${
                  isCurrent
                    ? "bg-[#d96834] text-white"
                    : "border border-[#d8ccc2] bg-white text-[#4d423b] hover:bg-[#faf5f1]"
                }`}
                type="button"
              >
                {item}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#d8ccc2] bg-white text-[#4d423b] transition hover:bg-[#faf5f1] disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
            type="button"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </footer>
    </div>
  );
}
