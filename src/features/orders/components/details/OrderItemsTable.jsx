export default function OrderItemsTable({ items }) {
  return (
    <article className="w-full overflow-hidden rounded-[14px] border border-[#ddd6cf] bg-white shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
      <header className="border-b border-[#eee4dd] px-5 py-4">
        <h3 className="text-[16px] font-bold text-[#18120f]">Order Items</h3>
      </header>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[650px] border-collapse">
          <thead>
            <tr className="border-b border-[#eee4dd] bg-[#fcfbfa] text-left">
              <th className="px-5 py-3 text-[12px] font-bold text-[#9b8f86]">Item</th>
              <th className="px-5 py-3 text-center text-[12px] font-bold text-[#9b8f86]">Qty</th>
              <th className="px-5 py-3 text-right text-[12px] font-bold text-[#9b8f86]">Unit Price</th>
              <th className="px-5 py-3 text-right text-[12px] font-bold text-[#9b8f86]">Total</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="px-5 py-8 text-center text-[14px] text-[#6f645d]" colSpan={4}>
                  No line items available for this order.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-[#f1e9e2] last:border-b-0">
                  <td className="px-5 py-3.5 align-middle">
                    <div className="flex items-start gap-3">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-11 w-11 rounded-[6px] border border-[#eee4dd] object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-[#f6eee8] text-[10px] font-bold text-[#6f655e]">
                          ITEM
                        </div>
                      )}

                      <div>
                        <p className="text-[14px] font-bold text-[#18120f]">{item.name}</p>
                        {item.notes ? (
                          <p className="mt-0.5 text-[11px] text-[#8c8077]">{item.notes}</p>
                        ) : null}
                        {item.options?.length > 0 ? (
                          <p className="mt-0.5 text-[11px] text-[#8c8077]">
                            Options: {item.options.join(", ")}
                          </p>
                        ) : null}
                        {item.addons.length > 0 ? (
                          <p className="mt-0.5 text-[11px] text-[#8c8077]">
                            Add-ons:{" "}
                            {item.addons
                              .map(
                                (addon) =>
                                  `${addon.name} (${addon.quantity} x ${addon.unitPrice} = ${addon.totalPrice})`,
                              )
                              .join(", ")}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center text-[14px] font-medium text-[#18120f]">
                    {item.quantity}
                  </td>
                  <td className="px-5 py-3.5 text-right text-[14px] font-medium text-[#18120f]">
                    {item.unitPrice}
                  </td>
                  <td className="px-5 py-3.5 text-right text-[14px] font-bold text-[#18120f]">
                    {item.totalPrice}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
}
