import { useMemo } from "react";
import { LifeBuoy, AlertCircle, CheckCircle, ArrowUpRight, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TICKET_STATUS = {
  Resolved: "bg-[#e8f8ef] text-[#1f8c52] rounded-[6px] px-2.5 py-0.5 text-[11px] font-extrabold tracking-wide uppercase border border-[#cce4d6] shadow-sm",
  Open: "bg-[#fffbeb] text-[#b45309] rounded-[6px] px-2.5 py-0.5 text-[11px] font-extrabold tracking-wide uppercase border border-[#fef3c7] shadow-sm",
};

export default function CustomerSupportInteractionsCard({ ticketsData = [] }) {
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const total = ticketsData.length;
    const open = ticketsData.filter((t) => t.status === "Open").length;
    const resolved = ticketsData.filter((t) => t.status === "Resolved").length;

    return [
      { label: "Total Tickets", value: total, icon: HelpCircle, color: "text-[#d96834]", bg: "bg-[#fff0e7]" },
      { label: "Open Tickets", value: open, icon: AlertCircle, color: "text-[#b45309]", bg: "bg-[#fffbeb]" },
      { label: "Resolved", value: resolved, icon: CheckCircle, color: "text-[#1f8c52]", bg: "bg-[#e8f8ef]" },
    ];
  }, [ticketsData]);

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 px-1">
        <span className="h-5 w-[3px] bg-[#d96834] rounded-full" />
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-[8px] bg-[#fff0e7] text-[#d96834] shadow-sm">
          <LifeBuoy size={13} strokeWidth={2.5} />
        </span>
        <h3 className="text-[18px] font-extrabold tracking-tight text-[#18120f]">
          Support Interactions
        </h3>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-[14px] border border-[#ddd6cf] bg-white px-3 py-3.5 shadow-[0_4px_16px_rgba(53,34,20,0.02)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#cf6e38]/15 hover:shadow-md sm:gap-4 sm:px-5 sm:py-4"
            >
              <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] shadow-sm ${s.bg} ${s.color}`}>
                <Icon size={18} strokeWidth={2.5} />
              </span>
              <div className="min-w-0">
                <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9a8f86]">
                  {s.label}
                </span>
                <span className="mt-1 block text-[16px] font-extrabold leading-none tracking-tight text-[#18120f] sm:text-[19px]">
                  {s.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tickets Table Card */}
      <div className="overflow-hidden rounded-[16px] border border-[#ddd6cf] bg-white shadow-[0_8px_24px_rgba(53,34,20,0.04)] transition-all duration-300 hover:border-[#cf6e38]/10">
        <div className="space-y-3 p-3 sm:hidden">
          {ticketsData.map((t) => (
            <article
              key={t.id}
              className="rounded-[14px] border border-[#eee4dd] bg-[#fcfbfa] p-4 shadow-[0_4px_16px_rgba(53,34,20,0.03)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[14px] font-extrabold text-[#cf6432]">{t.id}</p>
                  <p className="mt-1 text-[14px] font-bold leading-5 text-[#18120f]">{t.subject}</p>
                </div>
                <span className={TICKET_STATUS[t.status] || "bg-[#f0ebe6] text-[#6f655e] rounded-[4px] px-2 py-0.5"}>
                  {t.status}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-[12px] font-medium text-[#7a6e66]">{t.createdDate}</p>
                <button
                  onClick={() => navigate(`/support/${t.id.replace("#", "")}`)}
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center rounded-[8px] border border-[#e0d5cc] bg-white px-3 py-2 text-[12px] font-bold text-[#cf6e38] shadow-sm transition hover:border-[#cf6e38] hover:bg-[#fff6f0] outline-none active:scale-95"
                >
                  View
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[500px] border-collapse text-[14px]">
            <thead>
              <tr className="bg-[#faf8f6] text-left border-b border-[#eee4dd]">
                {[
                  { label: "Ticket ID", width: "20%" },
                  { label: "Subject", width: "50%" },
                  { label: "Status", width: "15%" },
                  { label: "Created Date", width: "15%" },
                  { label: "Action", width: "8%", align: "text-center" },
                ].map((th, i) => (
                  <th
                    key={i}
                    style={{ width: th.width }}
                    className={`px-5.5 py-4 text-[12px] font-extrabold uppercase tracking-wider text-[#9b8f86] ${
                      th.align || ""
                    }`}
                  >
                    {th.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ticketsData.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-[#f3ece6] last:border-0 transition-colors duration-200 hover:bg-[#faf8f6]"
                >
                  <td className="px-5.5 py-3.5 font-bold text-[#cf6432]">{t.id}</td>
                  <td className="px-5.5 py-3.5 font-bold text-[#18120f]">{t.subject}</td>
                  <td className="px-5.5 py-3.5">
                    <span className={TICKET_STATUS[t.status] || "bg-[#f0ebe6] text-[#6f655e] rounded-[4px] px-2 py-0.5"}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5.5 py-3.5 text-[13px] text-[#7a6e66]">{t.createdDate}</td>
                  <td className="px-5.5 py-3.5 text-center">
                    <button
                      onClick={() => navigate(`/support/${t.id.replace("#", "")}`)}
                      type="button"
                      className="inline-flex cursor-pointer items-center justify-center h-8.5 w-8.5 rounded-[8px] border border-[#e0d5cc] bg-white text-[#cf6e38] transition hover:border-[#cf6e38] hover:bg-[#fff6f0] outline-none active:scale-95 shadow-sm"
                      title="View Ticket details"
                    >
                      <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
