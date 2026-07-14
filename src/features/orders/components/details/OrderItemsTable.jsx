const orderItemsData = [
  {
    name: "Premium Wedding Package",
    desc: "3 course Meal",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=120&q=80",
    quantity: "1 Package",
    unitPrice: "NOK 18,000",
    totalPrice: "NOK 18,000",
  },
  {
    name: "Beef Tenderloin",
    desc: "Main Course Meal",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=120&q=80",
    quantity: "120",
    unitPrice: "NOK 120",
    totalPrice: "NOK 14,400",
  },
  {
    name: "Chocolate Mousse",
    desc: "Dessert Choice",
    image: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=120&q=80",
    quantity: "120",
    unitPrice: "NOK 45",
    totalPrice: "NOK 5,400",
  },
  {
    name: "Sauces",
    desc: "Assorted Condiments",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=120&q=80",
    quantity: "120",
    unitPrice: "NOK 45",
    totalPrice: "NOK 5,400",
  },
  {
    name: "Dessert",
    desc: "Extra sweet plates",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=120&q=80",
    quantity: "90",
    unitPrice: "NOK 30",
    totalPrice: "NOK 90",
  },
];

export default function OrderItemsTable() {
  return (
    <article className="overflow-hidden rounded-[14px] border border-[#ddd6cf] bg-white shadow-[0_6px_16px_rgba(53,34,20,0.05)] w-full">
      <header className="px-5 py-4 border-b border-[#eee4dd]">
        <h3 className="text-[16px] font-bold text-[#18120f]">Order Items</h3>
      </header>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[650px] border-collapse">
          <thead>
            <tr className="border-b border-[#eee4dd] bg-[#fcfbfa] text-left">
              <th className="px-5 py-3 text-[12px] font-bold text-[#9b8f86]">Items</th>
              <th className="px-5 py-3 text-[12px] font-bold text-[#9b8f86] text-center">Quantity</th>
              <th className="px-5 py-3 text-[12px] font-bold text-[#9b8f86] text-right">Unit Price</th>
              <th className="px-5 py-3 text-[12px] font-bold text-[#9b8f86] text-right">Total Price</th>
            </tr>
          </thead>

          <tbody>
            {orderItemsData.map((item, idx) => (
              <tr key={idx} className="border-b border-[#f1e9e2] last:border-b-0">
                <td className="px-5 py-3.5 align-middle">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-11 w-11 rounded-[6px] object-cover border border-[#eee4dd]"
                    />
                    <div>
                      <p className="text-[14px] font-bold text-[#18120f]">{item.name}</p>
                      <p className="text-[11px] text-[#8c8077]">{item.desc}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 align-middle text-center text-[14px] font-medium text-[#18120f]">
                  {item.quantity}
                </td>
                <td className="px-5 py-3.5 align-middle text-right text-[14px] font-medium text-[#18120f]">
                  {item.unitPrice}
                </td>
                <td className="px-5 py-3.5 align-middle text-right text-[14px] font-bold text-[#18120f]">
                  {item.totalPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
