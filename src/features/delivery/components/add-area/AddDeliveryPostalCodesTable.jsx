import { Pencil, Plus, Trash2, UsersRound } from "lucide-react";

export default function AddDeliveryPostalCodesTable({ rows, onAdd, onDelete, onEdit }) {
  return (
    <div className="rounded-[12px] border border-[#e6ddd6] bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-[#eee4dd] px-4 py-2.5">
        <p className="text-[12px] font-bold text-[#6f645d]">Postal Area Coverage</p>
        <button
          className="inline-flex h-7.5 cursor-pointer items-center justify-center gap-1.5 rounded-[8px] bg-[#cf6e38] px-3 text-[12px] font-bold text-white transition hover:bg-[#bc6030]"
          onClick={onAdd}
          type="button"
        >
          <Plus size={12} />
          <span>Add Code</span>
        </button>
      </div>

      <div className="overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-[#fcfbfa]">
            <tr className="text-left">
              <th className="px-4 py-2.5 text-[11px] font-bold text-[#9b8f86]">Postal Code</th>
              <th className="px-3 py-2.5 text-[11px] font-bold text-[#9b8f86]">Area Name</th>
              <th className="px-3 py-2.5 text-[11px] font-bold text-[#9b8f86]">Status</th>
              <th className="px-3 py-2.5 text-[11px] font-bold text-[#9b8f86]">Vendors</th>
              <th className="px-4 py-2.5 text-right text-[11px] font-bold text-[#9b8f86]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-[#f1e9e2]">
                <td className="px-4 py-2.5 text-[12px] font-semibold text-[#2a1e17]">{row.postalCode}</td>
                <td className="px-3 py-2.5 text-[12px] text-[#2a1e17]">{row.areaName}</td>
                <td className="px-3 py-2.5">
                  <span className="inline-flex rounded-full bg-[#e9fff0] px-2.5 py-1 text-[10px] font-bold text-[#219653]">
                    {row.status}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-[12px] text-[#2a1e17]">
                  <span className="inline-flex items-center gap-1.5">
                    <UsersRound className="text-[#8d8077]" size={13} />
                    <span>{row.vendors}</span>
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    className="inline-flex cursor-pointer items-center justify-center rounded-[8px] p-1.5 text-[#8d8077] transition hover:bg-[#f7f1ed] hover:text-[#cf6e38]"
                    onClick={() => onEdit(row)}
                    type="button"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    className="inline-flex cursor-pointer items-center justify-center rounded-[8px] p-1.5 text-[#d15b42] transition hover:bg-[#fff4f1]"
                    onClick={() => onDelete(row.id)}
                    type="button"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
