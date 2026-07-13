import { Pencil, Plus, Search, Trash2 } from "lucide-react";

function OrderShareBadge({ value }) {
  return (
    <span className="inline-flex rounded-full bg-[#e9fff0] px-2.5 py-1 text-[10px] font-bold text-[#219653]">{value}</span>
  );
}

export default function AreaCommissionCard({ rows }) {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#d8ccc2] bg-white shadow-[0_10px_22px_rgba(56,33,17,0.04)]">
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[18px] font-bold text-[#221914]">Area Commission</h2>
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ffd7c1] px-1 text-[10px] font-bold text-[#cf6e38]">
            {rows.length}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 pb-3">
        <label className="relative w-full max-w-[220px]">
          <input
            className="h-9 w-full rounded-full border border-[#ebe2db] bg-[#f6f4f2] pl-8 pr-3 text-[12px] text-[#2a1f19] outline-none transition placeholder:text-[#b3aaa2] focus:border-[#cf6e38] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
            placeholder="Search to enter ID, customer or vendor..."
            type="search"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b2a9a1]">
            <Search size={12} />
          </span>
        </label>

        <button
          className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-[8px] border border-[#ddd2ca] bg-white px-3 text-[11px] font-bold text-[#2f241d] transition hover:border-[#cf6e38]/35 hover:bg-[#fff9f5]"
          type="button"
        >
          <Plus size={12} />
          <span>Add Area Commission</span>
        </button>
      </div>

      <div className="border-t border-[#eee4dd]">
        <table className="w-full border-collapse">
          <thead className="bg-[#fcfbfa]">
            <tr className="text-left">
              <th className="px-4 py-3 text-[11px] font-bold text-[#9b8f86]">Area</th>
              <th className="px-3 py-3 text-[11px] font-bold text-[#9b8f86]">Commission Rate</th>
              <th className="px-3 py-3 text-[11px] font-bold text-[#9b8f86]">Active Vendors</th>
              <th className="px-3 py-3 text-[11px] font-bold text-[#9b8f86]">Order Share</th>
              <th className="px-4 py-3 text-right text-[11px] font-bold text-[#9b8f86]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-[#f1e9e2]">
                <td className="px-4 py-3 text-[12px] font-semibold text-[#2a1e17]">{row.area}</td>
                <td className="px-3 py-3 text-[12px] font-bold text-[#2a1e17]">{row.commissionRate}</td>
                <td className="px-3 py-3 text-[12px] font-medium text-[#584c45]">{row.activeVendors}</td>
                <td className="px-3 py-3">
                  <OrderShareBadge value={row.orderShare} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      className="inline-flex cursor-pointer items-center justify-center rounded-[8px] p-1.5 text-[#cf6e38] transition hover:bg-[#fff4ec]"
                      type="button"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      className="inline-flex cursor-pointer items-center justify-center rounded-[8px] p-1.5 text-[#d15b42] transition hover:bg-[#fff4f1]"
                      type="button"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
