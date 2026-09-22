import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Inbox, Mail, Phone, RefreshCw, Search, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLoadingState from "../../shared/components/AdminLoadingState.jsx";
import {
  getAdminContactInquiriesRequest,
  updateAdminContactInquiryStatusRequest,
} from "../api/contactResponsesApi.js";

const PAGE_SIZE = 10;
function getSupportTicketRouteId(ticketId) {
  const value = `${ticketId ?? ""}`.trim();

  if (/^\d+$/.test(value)) {
    return value;
  }

  const prefixedMatch = value.match(/^(?:tkt|ticket|support)[_-]?(\d+)$/i);
  return prefixedMatch?.[1] || "";
}
const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

function getStatusClasses(status) {
  switch (`${status}`.toLowerCase()) {
    case "resolved":
      return "border-[#cfe8d8] bg-[#f0fbf4] text-[#267446]";
    case "closed":
      return "border-[#d9dde4] bg-[#f5f6f8] text-[#56606c]";
    case "in progress":
      return "border-[#f0dfbd] bg-[#fff8e8] text-[#9a6514]";
    default:
      return "border-[#f3d1c2] bg-[#fff3ec] text-[#bd5425]";
  }
}

function EmptyState({ missingApi }) {
  return (
    <div className="px-5 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff3ec] text-[#cf6e38]">
        <Inbox size={22} />
      </div>
      <h3 className="mt-4 text-[16px] font-extrabold text-[#1f1713]">
        {missingApi ? "Contact response API needed" : "No contact responses found"}
      </h3>
      <p className="mx-auto mt-2 max-w-[620px] text-[13px] font-medium leading-6 text-[#74685f]">
        {missingApi
          ? "Backend endpoint GET /api/contact/inquiries was not found. Confirm the admin contact inquiries API is deployed."
          : "New client contact form submissions will appear here when they match the current filters."}
      </p>
      {missingApi ? (
        <div className="mx-auto mt-5 max-w-[720px] rounded-[12px] border border-[#eadfd7] bg-[#fbf8f5] p-4 text-left text-[12px] font-semibold leading-6 text-[#51453d]">
          Expected fields: id, ticketId, name, email, company, phone, topic, message, status, source, locale, pageUrl, createdAt.
        </div>
      ) : null}
    </div>
  );
}

export default function ContactResponsesPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: PAGE_SIZE, totalItems: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [missingApi, setMissingApi] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearchTerm(searchTerm), 250);
    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter, topicFilter]);

  useEffect(() => {
    let isMounted = true;

    async function loadResponses() {
      setIsLoading(true);
      setLoadError("");
      setMissingApi(false);

      try {
        const result = await getAdminContactInquiriesRequest({
          search: debouncedSearchTerm.trim() || null,
          status: statusFilter || null,
          topic: topicFilter.trim() || null,
          page: currentPage,
          pageSize: PAGE_SIZE,
        });

        if (!isMounted) return;

        setRows(result.items);
        setPageInfo(result.pageInfo);
        setSelectedId((current) => {
          if (result.items.some((item) => item.id === current)) return current;
          return result.items[0]?.id || "";
        });
      } catch (error) {
        if (!isMounted) return;

        setRows([]);
        setSelectedId("");
        setPageInfo({ page: 1, pageSize: PAGE_SIZE, totalItems: 0, totalPages: 1 });
        setMissingApi(Boolean(error?.missingApi));
        setLoadError(error instanceof Error ? error.message : "Unable to load contact form responses.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadResponses();

    return () => {
      isMounted = false;
    };
  }, [currentPage, debouncedSearchTerm, statusFilter, topicFilter]);

  const selectedResponse = useMemo(
    () => rows.find((item) => item.id === selectedId) || rows[0] || null,
    [rows, selectedId],
  );

  const uniqueTopics = useMemo(
    () => [...new Set(rows.map((item) => item.topic).filter(Boolean))].sort((left, right) => left.localeCompare(right)),
    [rows],
  );

  function resetFilters() {
    setSearchTerm("");
    setStatusFilter("");
    setTopicFilter("");
    setCurrentPage(1);
  }

  async function handleStatusUpdate(item, nextStatus) {
    if (!item || !nextStatus || nextStatus === item.rawStatus) {
      return;
    }

    setUpdatingStatusId(item.id);

    try {
      const updatedItem = await updateAdminContactInquiryStatusRequest({
        id: item.id,
        ticketId: item.ticketId,
        status: nextStatus,
      });

      setRows((currentRows) =>
        currentRows.map((row) =>
          row.id === item.id
            ? { ...row, rawStatus: updatedItem.rawStatus, status: updatedItem.status }
            : row,
        ),
      );

      void Swal.fire({
        icon: "success",
        title: "Status updated",
        text: "Contact inquiry status has been updated.",
        timer: 1800,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to update status",
        text: error instanceof Error ? error.message : "Unable to update contact inquiry status.",
      });
    } finally {
      setUpdatingStatusId("");
    }
  }

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-[14px] border border-[#ddd6cf] bg-white p-4 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
          <p className="text-[12px] font-bold text-[#7b6d63]">Total Responses</p>
          <p className="mt-2 text-[28px] font-extrabold text-[#18120f]">{pageInfo.totalItems.toLocaleString()}</p>
        </div>
        <div className="rounded-[14px] border border-[#ddd6cf] bg-white p-4 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
          <p className="text-[12px] font-bold text-[#7b6d63]">Open</p>
          <p className="mt-2 text-[28px] font-extrabold text-[#18120f]">{rows.filter((item) => item.rawStatus === "OPEN").length.toLocaleString()}</p>
        </div>
        <div className="rounded-[14px] border border-[#ddd6cf] bg-white p-4 shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
          <p className="text-[12px] font-bold text-[#7b6d63]">Linked Tickets</p>
          <p className="mt-2 text-[28px] font-extrabold text-[#18120f]">{rows.filter((item) => item.ticketId).length.toLocaleString()}</p>
        </div>
      </section>

      <section className="rounded-[14px] border border-[#ddd6cf] bg-white shadow-[0_6px_16px_rgba(53,34,20,0.05)]">
        <div className="flex flex-col gap-3 border-b border-[#eee4dd] p-4 lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#aa9d93]" size={16} />
            <input
              className="h-10 w-full rounded-[10px] border border-[#d8ccc2] bg-white pl-9 pr-3 text-[13px] font-semibold text-[#2f241d] outline-none transition placeholder:text-[#a99e96] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search name, email, company, topic, or message..."
              type="search"
              value={searchTerm}
            />
          </label>
          <select
            className="h-10 rounded-[10px] border border-[#d8ccc2] bg-white px-3 text-[13px] font-semibold text-[#2f241d] outline-none focus:border-[#cf6e38]"
            onChange={(event) => setStatusFilter(event.target.value)}
            value={statusFilter}
          >
            {statusOptions.map((status) => (
              <option key={status.value || "all"} value={status.value}>{status.label}</option>
            ))}
          </select>
          <select
            className="h-10 rounded-[10px] border border-[#d8ccc2] bg-white px-3 text-[13px] font-semibold text-[#2f241d] outline-none focus:border-[#cf6e38]"
            onChange={(event) => setTopicFilter(event.target.value)}
            value={topicFilter}
          >
            <option value="">All topics</option>
            {uniqueTopics.map((topic) => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
          <button
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-[#f0d8ca] px-3 text-[13px] font-bold text-[#cf6e38] transition hover:bg-[#fff7f2]"
            onClick={resetFilters}
            type="button"
          >
            <RefreshCw size={14} />
            Reset
          </button>
        </div>

        {loadError && !missingApi ? (
          <div className="border-b border-[#eee4dd] px-4 py-3 text-center text-[13px] font-semibold text-[#9f4d33]">{loadError}</div>
        ) : null}

        {isLoading ? (
          <AdminLoadingState columns={5} title="Loading contact responses" description="Retrieving client contact form submissions." />
        ) : rows.length === 0 ? (
          <EmptyState missingApi={missingApi} />
        ) : (
          <div className="grid min-h-[520px] grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.65fr)]">
            <div className="border-b border-[#eee4dd] lg:border-b-0 lg:border-r">
              <div className="divide-y divide-[#f0e6df]">
                {rows.map((item) => {
                  const selected = selectedResponse?.id === item.id;

                  return (
                    <button
                      className={`flex w-full cursor-pointer flex-col gap-2 px-4 py-4 text-left transition ${selected ? "bg-[#fff7f2]" : "hover:bg-[#fbf8f5]"}`}
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      type="button"
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] font-extrabold text-[#1f1713]">{item.name}</span>
                          <span className="mt-1 block truncate text-[12px] font-semibold text-[#7b6d63]">{item.email || "No email"}</span>
                        </span>
                        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${getStatusClasses(item.status)}`}>{item.status}</span>
                      </span>
                      <span className="line-clamp-2 text-[13px] font-medium leading-5 text-[#5f534b]">{item.message}</span>
                      <span className="flex flex-wrap gap-2 text-[11px] font-bold text-[#8b7e75]">
                        <span>{item.topic}</span>
                        <span>{item.createdAtLabel}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between border-t border-[#eee4dd] px-4 py-3 text-[12px] font-bold text-[#6f645d]">
                <span>Showing page {pageInfo.page} of {pageInfo.totalPages}</span>
                <span className="flex items-center gap-2">
                  <button className="rounded-[10px] border border-[#ded4cc] px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50" disabled={!pageInfo.hasPreviousPage} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button">Prev</button>
                  <button className="rounded-[10px] border border-[#ded4cc] px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50" disabled={!pageInfo.hasNextPage} onClick={() => setCurrentPage((page) => page + 1)} type="button">Next</button>
                </span>
              </div>
            </div>

            <aside className="p-5">
              {selectedResponse ? (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-[18px] font-extrabold text-[#18120f]">{selectedResponse.topic}</h3>
                        <p className="mt-1 text-[12px] font-semibold text-[#7b6d63]">{selectedResponse.createdAtLabel}</p>
                      </div>
                      <select
                        className={`h-9 shrink-0 cursor-pointer rounded-full border px-2.5 text-[11px] font-extrabold outline-none disabled:cursor-not-allowed disabled:opacity-60 ${getStatusClasses(selectedResponse.status)}`}
                        disabled={updatingStatusId === selectedResponse.id}
                        onChange={(event) => handleStatusUpdate(selectedResponse, event.target.value)}
                        value={selectedResponse.rawStatus}
                      >
                        {statusOptions.filter((status) => status.value).map((status) => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                      </select>
                    </div>
                    <p className="mt-4 whitespace-pre-wrap text-[14px] font-medium leading-6 text-[#3b3029]">{selectedResponse.message}</p>
                  </div>

                  <div className="rounded-[12px] border border-[#eadfd7] bg-[#fbf8f5] p-4">
                    <h4 className="text-[12px] font-extrabold uppercase text-[#7b6d63]">Sender</h4>
                    <div className="mt-3 space-y-2 text-[13px] font-semibold text-[#2f241d]">
                      <p>{selectedResponse.name}</p>
                      {selectedResponse.company ? <p>{selectedResponse.company}</p> : null}
                      {selectedResponse.email ? <p className="flex items-center gap-2"><Mail size={14} />{selectedResponse.email}</p> : null}
                      {selectedResponse.phone ? <p className="flex items-center gap-2"><Phone size={14} />{selectedResponse.phone}</p> : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {getSupportTicketRouteId(selectedResponse.ticketId) ? (
                      <button
                        className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[10px] bg-[#cf6e38] px-3 text-[13px] font-bold text-white shadow-[0_10px_20px_rgba(207,110,56,0.18)]"
                        onClick={() => navigate(`/support/${encodeURIComponent(getSupportTicketRouteId(selectedResponse.ticketId))}`)}
                        type="button"
                      >
                        <Ticket size={15} />
                        Open Ticket
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}