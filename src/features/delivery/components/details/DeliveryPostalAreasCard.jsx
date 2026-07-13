import { Pencil, Trash2 } from "lucide-react";
import DeliveryStatusPill from "./DeliveryStatusPill.jsx";

export default function DeliveryPostalAreasCard({ area }) {
  return (
    <section className="rounded-[18px] border border-[#ddd4cd] bg-white shadow-[0_10px_24px_rgba(55,31,13,0.05)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#eee4dd] px-4 py-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#231913]">Postal Codes</h2>
          <p className="mt-1 text-[12px] leading-5 text-[#8d8077]">Manage the zones available inside this delivery area.</p>
        </div>
        <button
          className="inline-flex h-9 cursor-pointer items-center justify-center rounded-[8px] bg-[#cf6e38] px-3.5 text-[12px] font-bold text-white transition hover:bg-[#bc6030]"
          type="button"
        >
          Add Code
        </button>
      </div>

      <div className="overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-[#fcfbfa]">
            <tr className="text-left">
              <th className="px-4 py-3 text-[11px] font-bold text-[#9b8f86]">Postal Code</th>
              <th className="px-3 py-3 text-[11px] font-bold text-[#9b8f86]">Area Name</th>
              <th className="px-3 py-3 text-[11px] font-bold text-[#9b8f86]">Status</th>
              <th className="px-3 py-3 text-[11px] font-bold text-[#9b8f86]">Vendors</th>
              <th className="px-4 py-3 text-right text-[11px] font-bold text-[#9b8f86]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {area.postalAreas.length ? (
              area.postalAreas.map((row) => (
                <tr key={row.id} className="border-t border-[#f1e9e2]">
                  <td className="px-4 py-3 text-[12px] font-semibold text-[#2a1e17]">{row.postalCode}</td>
                  <td className="px-3 py-3 text-[12px] text-[#584c45]">{row.areaName}</td>
                  <td className="px-3 py-3">
                    <DeliveryStatusPill status={row.status} />
                  </td>
                  <td className="px-3 py-3 text-[12px] text-[#584c45]">{row.vendors}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        className="inline-flex cursor-pointer items-center justify-center rounded-[8px] p-1.5 text-[#cf6e38] transition hover:bg-[#fff4ec]"
                        type="button"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        className="inline-flex cursor-pointer items-center justify-center rounded-[8px] p-1.5 text-[#d15b42] transition hover:bg-[#fff4f1]"
                        type="button"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-[#f1e9e2]">
                <td className="px-4 py-8 text-center text-[13px] text-[#8d8077]" colSpan={5}>
                  No postal codes configured for this area yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
