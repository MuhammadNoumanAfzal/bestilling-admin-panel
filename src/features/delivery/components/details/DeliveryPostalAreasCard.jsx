import { Search, SlidersHorizontal, SquarePen, Trash2, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DeliveryStatusPill from "./DeliveryStatusPill.jsx";
import DeliveryPostalCodeModal from "./DeliveryPostalCodeModal.jsx";

const statusFilterOptions = ["All", "Active", "Inactive"];

const initialFormState = {
  id: "",
  postalCode: "",
  areaName: "",
  status: "Active",
  vendors: "",
};

function PostalCodeTableAction({ children, tone = "default", onClick }) {
  const toneClasses =
    tone === "danger"
      ? "text-[#d15b42] hover:bg-[#fff4f1]"
      : "text-[#8d8077] hover:bg-[#f7f1ed] hover:text-[#cf6e38]";

  return (
    <button
      className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] transition ${toneClasses}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export default function DeliveryPostalAreasCard({ area }) {
  const [rows, setRows] = useState(area.postalAreas ?? []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    setRows(area.postalAreas ?? []);
    setSearchTerm("");
    setStatusFilter("All");
    setModalOpen(false);
    setModalMode("create");
    setForm(initialFormState);
  }, [area.id, area.postalAreas]);

  const filteredRows = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !normalizedTerm ||
        row.postalCode.toLowerCase().includes(normalizedTerm) ||
        row.areaName.toLowerCase().includes(normalizedTerm) ||
        String(row.vendors).includes(normalizedTerm);

      const matchesStatus = statusFilter === "All" || row.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rows, searchTerm, statusFilter]);

  function updateFormField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setForm(initialFormState);
    setModalMode("create");
  }

  function handleOpenCreate() {
    resetForm();
    setModalMode("create");
    setModalOpen(true);
  }

  function handleOpenEdit(row) {
    setForm({
      id: row.id,
      postalCode: row.postalCode,
      areaName: row.areaName,
      status: row.status,
      vendors: String(row.vendors),
    });
    setModalMode("edit");
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    resetForm();
  }

  function handleSubmit() {
    const trimmedPostalCode = form.postalCode.trim();
    const trimmedAreaName = form.areaName.trim();

    if (!trimmedPostalCode || !trimmedAreaName) {
      return;
    }

    const nextRow = {
      id: form.id || `postal-${Date.now()}`,
      postalCode: trimmedPostalCode,
      areaName: trimmedAreaName,
      status: form.status,
      vendors: Number(form.vendors || 0),
    };

    if (modalMode === "edit") {
      setRows((current) => current.map((row) => (row.id === form.id ? nextRow : row)));
    } else {
      setRows((current) => [nextRow, ...current]);
    }

    handleCloseModal();
  }

  function handleDelete(id) {
    const confirmed = window.confirm("Remove this postal code from the delivery area?");

    if (!confirmed) {
      return;
    }

    setRows((current) => current.filter((row) => row.id !== id));
  }

  return (
    <>
      <section className="overflow-hidden rounded-[18px] border border-[#ddd4cd] bg-white shadow-[0_10px_24px_rgba(55,31,13,0.05)]">
        <div className="flex flex-col gap-4 border-b border-[#eee4dd] px-5 py-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-[28px] font-bold tracking-[-0.03em] text-[#18120f]">Postal Codes</h2>
              <p className="mt-2 text-[16px] leading-7 text-[#6f645d]">
                Manage the zones available inside this delivery area with the same coverage structure used across the
                admin panel.
              </p>
            </div>

            <button
              className="inline-flex h-11 cursor-pointer items-center justify-center rounded-[10px] bg-[#cf6e38] px-4 text-[14px] font-semibold text-white transition hover:bg-[#bc6030]"
              onClick={handleOpenCreate}
              type="button"
            >
              Add Code
            </button>
          </div>

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
              <label className="relative w-full max-w-[390px]">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#b4a7a0]"
                  size={15}
                />
                <input
                  className="h-11 w-full rounded-[12px] border border-[#2f241d] bg-[#f8f5f2] pl-12 pr-4 text-[15px] font-medium leading-none text-[#18120f] outline-none transition placeholder:text-[15px] placeholder:font-medium placeholder:text-[#aa9f96] focus:border-[#cf6e38] focus:bg-white focus:shadow-[0_0_0_3px_rgba(206,105,56,0.12)]"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search postal code, area name, or vendor count"
                  value={searchTerm}
                />
              </label>

              <div className="flex flex-wrap items-center gap-2">
                {statusFilterOptions.map((option) => (
                  <button
                    key={option}
                    className={[
                      "inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[12px] border px-4 text-[14px] font-semibold transition",
                      statusFilter === option
                        ? "border-[#cf6e38] bg-[#cf6e38] text-white"
                        : "border-[#e4d8d0] bg-white text-[#4a3d36] hover:border-[#cf6e38]/40 hover:bg-[#fff8f3]",
                    ].join(" ")}
                    onClick={() => setStatusFilter(option)}
                    type="button"
                  >
                    {option === "All" && <SlidersHorizontal size={15} />}
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[14px] font-medium text-[#7c7068]">
              {filteredRows.length} of {rows.length} postal zones visible
            </p>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-[760px] w-full border-collapse">
            <thead className="border-b border-[#eee4dd] bg-[#fcfbfa]">
              <tr className="text-left">
                <th className="px-4 py-4 text-[13px] font-bold text-[#9b8f86]">Postal Code</th>
                <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Area Name</th>
                <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Status</th>
                <th className="px-3 py-4 text-[13px] font-bold text-[#9b8f86]">Vendors</th>
                <th className="px-4 py-4 text-right text-[13px] font-bold text-[#9b8f86]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.length === 0 ? (
                <tr className="border-t border-[#f1e9e2]">
                  <td className="px-4 py-10 text-center text-[15px] font-medium text-[#6f645d]" colSpan={5}>
                    No postal codes match the current search or filter.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.id} className="border-t border-[#f1e9e2] transition hover:bg-[#fffdfa]">
                    <td className="px-4 py-4 text-[15px] font-medium text-[#18120f]">{row.postalCode}</td>
                    <td className="px-3 py-4 text-[15px] font-medium text-[#18120f]">{row.areaName}</td>
                    <td className="px-3 py-4">
                      <DeliveryStatusPill status={row.status} />
                    </td>
                    <td className="px-3 py-4 text-[15px] font-medium text-[#18120f]">
                      <span className="inline-flex items-center gap-2">
                        <UsersRound size={16} className="text-[#cf6e38]" />
                        <span>{row.vendors}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <PostalCodeTableAction onClick={() => handleOpenEdit(row)}>
                          <SquarePen size={15} />
                        </PostalCodeTableAction>
                        <PostalCodeTableAction onClick={() => handleDelete(row.id)} tone="danger">
                          <Trash2 size={15} />
                        </PostalCodeTableAction>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <DeliveryPostalCodeModal
        form={form}
        isOpen={modalOpen}
        isSubmitting={false}
        mode={modalMode}
        onChange={updateFormField}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}
