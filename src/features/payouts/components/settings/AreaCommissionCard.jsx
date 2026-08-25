import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

function OrderShareBadge({ value }) {
  return (
    <span className="inline-flex rounded-full bg-[#e9fff0] px-2.5 py-1 text-[10px] font-bold text-[#219653]">{value}</span>
  );
}

function MobileAreaCommissionCard({ row, onDelete, onEdit }) {
  return (
    <article className="rounded-[16px] border border-[#eadfd6] bg-[linear-gradient(180deg,#fffdfa_0%,#fff8f2_100%)] p-4 shadow-[0_10px_20px_rgba(56,33,17,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-[#18120f]">{row.area}</p>
          <p className="mt-1 text-[12px] text-[#7d7068]">{row.activeVendors} active vendors</p>
        </div>
        <OrderShareBadge value={row.orderShare} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b8f86]">Commission</p>
          <p className="mt-1 text-[14px] font-semibold text-[#18120f]">{row.commissionRate}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b8f86]">Order Share</p>
          <p className="mt-1 text-[14px] font-semibold text-[#18120f]">{row.orderShare}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-[#dfd2ca] bg-white px-3 text-[12px] font-bold text-[#3a2f28] transition hover:bg-[#faf6f2]"
          onClick={() => onEdit(row)}
          type="button"
        >
          <Pencil size={14} />
          Edit
        </button>
        <button
          className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-[#f0d6d0] bg-[#fff6f4] text-[#d15b42] transition hover:bg-[#fff0ec]"
          onClick={() => onDelete(row)}
          type="button"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </article>
  );
}

export default function AreaCommissionCard({ onAdd, onDelete, onEdit, rows }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return rows.filter((row) => {
      if (!normalized) {
        return true;
      }

      return (
        row.area.toLowerCase().includes(normalized) ||
        row.commissionRate.toLowerCase().includes(normalized) ||
        row.orderShare.toLowerCase().includes(normalized)
      );
    });
  }, [rows, searchTerm]);

  return (
    <section className="overflow-hidden rounded-[16px] border border-[#d8ccc2] bg-white shadow-[0_10px_22px_rgba(56,33,17,0.04)]">
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[20px] font-bold text-[#221914] sm:text-[22px]">Area Commission</h2>
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ffd7c1] px-1 text-[10px] font-bold text-[#cf6e38]">
            {rows.length}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative w-full sm:max-w-[240px]">
          <input
            className="h-10 w-full rounded-full border border-[#ebe2db] bg-[#f6f4f2] pl-9 pr-3 text-[14px] font-medium text-[#2a1f19] outline-none transition placeholder:text-[#b3aaa2] focus:border-[#cf6e38] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search area or commission..."
            type="search"
            value={searchTerm}
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#b2a9a1]">
            <Search size={14} />
          </span>
        </label>

        <button
          className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-[#ddd2ca] bg-white px-3 text-[12px] font-semibold text-[#2f241d] transition hover:border-[#cf6e38]/35 hover:bg-[#fff9f5] sm:h-9 sm:w-auto sm:rounded-[8px]"
          onClick={onAdd}
          type="button"
        >
          <Plus size={13} />
          <span>Add Area Commission</span>
        </button>
      </div>

      <div className="space-y-3 border-t border-[#eee4dd] p-3 md:hidden">
        {filteredRows.length === 0 ? (
          <div className="rounded-[14px] border border-dashed border-[#e2d7cf] bg-[#fcfaf8] px-4 py-10 text-center text-[15px] font-medium text-[#6f645d]">
            No area commissions match the current search.
          </div>
        ) : (
          filteredRows.map((row) => (
            <MobileAreaCommissionCard
              key={row.id}
              row={row}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>

      <div className="hidden border-t border-[#eee4dd] md:block">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-[#fcfbfa]">
            <tr className="text-left">
              <th className="px-4 py-4 text-[13px] font-bold text-[#9b8f86]">Area</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Commission Rate</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Active Vendors</th>
              <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Order Share</th>
              <th className="px-4 py-4 text-right text-[13px] font-bold text-[#9b8f86]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr className="border-t border-[#f1e9e2]">
                <td className="px-4 py-10 text-center text-[15px] font-medium text-[#6f645d]" colSpan={5}>
                  No area commissions match the current search.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr key={row.id} className="border-t border-[#f1e9e2]">
                  <td className="px-4 py-4 text-[15px] font-bold text-[#18120f]">{row.area}</td>
                  <td className="px-3 py-4 text-[15px] font-semibold text-[#18120f]">{row.commissionRate}</td>
                  <td className="px-3 py-4 text-[15px] font-medium text-[#18120f]">{row.activeVendors}</td>
                  <td className="px-3 py-4">
                    <OrderShareBadge value={row.orderShare} />
                  </td>
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
