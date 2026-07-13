import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

function VendorAvatar({ label, src }) {
  return (
    <button
      className="inline-flex h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-full transition hover:scale-[1.03]"
      type="button"
    >
      {src ? (
        <img alt={label} className="h-full w-full object-cover" src={src} />
      ) : (
        <span className="inline-flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#3b3028_0%,#9d6d3d_100%)] text-[10px] font-bold text-white">
          {label}
        </span>
      )}
    </button>
  );
}

export default function VendorCommissionCard({ onAdd, onDelete, onEdit, rows }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return rows.filter((row) => {
      if (!normalized) {
        return true;
      }

      return (
        row.vendor.toLowerCase().includes(normalized) ||
        row.area.toLowerCase().includes(normalized) ||
        row.currentCommission.toLowerCase().includes(normalized)
      );
    });
  }, [rows, searchTerm]);

  return (
    <section className="overflow-hidden rounded-[16px] border border-[#d8ccc2] bg-white shadow-[0_10px_22px_rgba(56,33,17,0.04)]">
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[22px] font-bold text-[#221914]">Vendor Commission</h2>
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ffd7c1] px-1 text-[10px] font-bold text-[#cf6e38]">
            {rows.length}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 pb-3">
        <label className="relative w-full max-w-[240px]">
          <input
            className="h-10 w-full rounded-full border border-[#ebe2db] bg-[#f6f4f2] pl-9 pr-3 text-[14px] font-medium text-[#2a1f19] outline-none transition placeholder:text-[#b3aaa2] focus:border-[#cf6e38] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search vendor or area..."
            type="search"
            value={searchTerm}
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#b2a9a1]">
            <Search size={14} />
          </span>
        </label>

        <button
          className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-[8px] border border-[#ddd2ca] bg-white px-3 text-[12px] font-semibold text-[#2f241d] transition hover:border-[#cf6e38]/35 hover:bg-[#fff9f5]"
          onClick={onAdd}
          type="button"
        >
          <Plus size={13} />
          <span>Assign Vendor Commission</span>
        </button>
      </div>

      <div className="border-t border-[#eee4dd]">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-[#fcfbfa]">
            <tr className="text-left">
              <th className="px-4 py-4 text-[13px] font-bold text-[#9b8f86]">Vendor</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Area</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Current Commission</th>
              <th className="px-4 py-4 text-right text-[13px] font-bold text-[#9b8f86]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr className="border-t border-[#f1e9e2]">
                <td className="px-4 py-10 text-center text-[15px] font-medium text-[#6f645d]" colSpan={4}>
                  No vendor commissions match the current search.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr key={row.id} className="border-t border-[#f1e9e2]">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <VendorAvatar label={row.avatar} src={row.avatarUrl} />
                      <span className="truncate text-[15px] font-bold text-[#18120f]">{row.vendor}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-[15px] font-medium text-[#18120f]">{row.area}</td>
                  <td className="px-3 py-4 text-[15px] font-semibold text-[#18120f]">{row.currentCommission}</td>
                  <td className="px-3 py-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        className="inline-flex cursor-pointer items-center justify-center rounded-[8px] p-1.5 text-[#cf6e38] transition hover:bg-[#fff4ec]"
                        onClick={() => onEdit(row)}
                        type="button"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="inline-flex cursor-pointer items-center justify-center rounded-[8px] p-1.5 text-[#d15b42] transition hover:bg-[#fff4f1]"
                        onClick={() => onDelete(row)}
                        type="button"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
